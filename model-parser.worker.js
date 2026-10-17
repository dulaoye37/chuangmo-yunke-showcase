/**
 * GLB/STL/OBJ Model Parser — Web Worker
 * 
 * Runs heavy file parsing off the main thread to prevent UI freeze.
 * Posts { result } back on success, { error } on failure.
 */

// ── Helpers ──────────────────────────────────────────

function calculateVolume(vertices, triangles) {
  let vol = 0;
  for (const [i0, i1, i2] of triangles) {
    const v0 = vertices[i0], v1 = vertices[i1], v2 = vertices[i2];
    vol += v0[0] * (v1[1] * v2[2] - v2[1] * v1[2])
         + v0[1] * (v1[2] * v2[0] - v2[2] * v1[0])
         + v0[2] * (v1[0] * v2[1] - v2[0] * v1[1]);
  }
  return { volume: vol / 6 / 1000 }; // cm³
}

function calculateBoundingBox(vertices) {
  let min = [Infinity, Infinity, Infinity],
      max = [-Infinity, -Infinity, -Infinity];
  // Sample vertices if there are too many (>500k)
  const step = vertices.length > 500000 ? Math.ceil(vertices.length / 500000) : 1;
  for (let i = 0; i < vertices.length; i += step) {
    const v = vertices[i];
    for (let j = 0; j < 3; j++) {
      if (v[j] < min[j]) min[j] = v[j];
      if (v[j] > max[j]) max[j] = v[j];
    }
  }
  return { min, max };
}

function makeResult(vertices, triangles, format) {
  const vol = calculateVolume(vertices, triangles);
  const bb = calculateBoundingBox(vertices);
  const dims = {
    x: Math.abs(bb.max[0] - bb.min[0]),
    y: Math.abs(bb.max[1] - bb.min[1]),
    z: Math.abs(bb.max[2] - bb.min[2]),
  };
  return {
    volume_cm3: Math.round(Math.abs(vol.volume) * 100) / 100,
    weight_g: Math.round(Math.abs(vol.volume) * 1.24 * 100) / 100,
    dimensions: {
      x: Math.round(dims.x / 10),
      y: Math.round(dims.y / 10),
      z: Math.round(dims.z / 10),
    },
    boundingBox: bb,
    triangleCount: triangles.length,
    vertexCount: vertices.length,
    format,
    error: null,
  };
}

// ── STL Binary ───────────────────────────────────────

function parseBinarySTL(arr, triangleCount) {
  const vertices = [];
  const triangles = [];
  const maxTris = Math.min(triangleCount, 2000000); // Safety cap
  for (let i = 0; i < maxTris; i++) {
    const offset = 84 + i * 50;
    const readV = (o) => {
      let val = arr[o] + arr[o+1] * 256 + arr[o+2] * 65536 + arr[o+3] * 16777216;
      return val < 8388608 ? val : val - 16777216;
    };
    const v0 = [readV(offset+12), readV(offset+13), readV(offset+14)];
    const v1 = [readV(offset+24), readV(offset+25), readV(offset+26)];
    const v2 = [readV(offset+36), readV(offset+37), readV(offset+38)];
    const idx = vertices.length;
    vertices.push(v0, v1, v2);
    triangles.push([idx, idx+1, idx+2]);
  }
  return makeResult(vertices, triangles, 'stl_binary');
}

// ── GLB Parser ───────────────────────────────────────

function parseGLB(arr, view) {
  try {
    if (arr.length < 20) return { error: 'GLB文件太小，无效格式' };
    
    const magic = view.getUint32(0, true);
    if (magic !== 0x46546c67) return { error: '非GLB文件：文件头魔数不匹配' };
    
    const version = view.getUint32(4, true);
    if (version !== 2) return { error: `GLB版本${version}不支持` };
    
    const totalLength = view.getUint32(8, true);
    const jsonLen = view.getUint32(12, true);
    const jsonType = view.getUint32(16, true);
    if (jsonType !== 0x4e4f534a) return { error: 'GLB JSON块类型无效' };

    // Bounds check for JSON chunk
    if (20 + jsonLen > arr.length) return { error: 'GLB JSON块超出文件范围，文件可能已损坏' };

    const jsonBytes = arr.slice(20, 20 + jsonLen);
    const jsonText = new TextDecoder().decode(jsonBytes);
    let gltf;
    try {
      gltf = JSON.parse(jsonText);
    } catch(e) {
      return { error: 'GLB JSON解析失败: ' + e.message };
    }

    let binBuffer = null;
    const binOffset = 20 + jsonLen;
    if (binOffset + 8 <= totalLength) {
      const binLen = view.getUint32(binOffset, true);
      const binType = view.getUint32(binOffset + 4, true);
      if (binType === 0x004e4942 && binLen > 0) {
        if (binOffset + 8 + binLen <= arr.length) {
          binBuffer = arr.slice(binOffset + 8, binOffset + 8 + binLen);
        }
      }
    }

    if (!gltf.meshes || gltf.meshes.length === 0) {
      return { error: 'GLB文件中未找到网格数据' };
    }

    const allVertices = [];
    const allTriangles = [];
    const MAX_VERTICES = 5000000; // Safety cap: 5M vertices

    for (const mesh of gltf.meshes) {
      for (const primitive of mesh.primitives) {
        if (!primitive.attributes?.POSITION) continue;
        const posAccIdx = primitive.attributes.POSITION;
        if (!gltf.accessors || posAccIdx >= gltf.accessors.length) continue;
        const posAcc = gltf.accessors[posAccIdx];
        if (!posAcc) continue;

        const positions = readAccessor(gltf, posAcc, binBuffer);
        if (!positions || positions.length === 0) continue;

        // Safety check: vertex count
        const vertCount = Math.min(posAcc.count, MAX_VERTICES - allVertices.length);
        if (vertCount <= 0) continue;
        
        const startIdx = allVertices.length;
        for (let i = 0; i < vertCount; i++) {
          allVertices.push([
            positions[i * 3] || 0,
            positions[i * 3 + 1] || 0,
            positions[i * 3 + 2] || 0,
          ]);
        }

        if (primitive.indices != null && primitive.indices < gltf.accessors.length) {
          const idxAcc = gltf.accessors[primitive.indices];
          if (idxAcc) {
            const indices = readAccessor(gltf, idxAcc, binBuffer, true);
            if (indices?.length > 0) {
              const maxIdx = Math.min(indices.length, 3000000); // Safety cap: 3M indices
              for (let i = 0; i < maxIdx; i += 3) {
                if (i + 2 < indices.length) {
                  const i0 = startIdx + indices[i];
                  const i1 = startIdx + indices[i + 1];
                  const i2 = startIdx + indices[i + 2];
                  // Bounds check
                  if (i0 < allVertices.length && i1 < allVertices.length && i2 < allVertices.length) {
                    allTriangles.push([i0, i1, i2]);
                  }
                }
              }
            }
          }
        } else {
          const maxTris = Math.min(vertCount, 1000000); // Safety cap
          for (let i = 0; i < maxTris - 2; i += 3) {
            allTriangles.push([startIdx + i, startIdx + i + 1, startIdx + i + 2]);
          }
        }
      }
    }

    if (allVertices.length === 0) return { error: 'GLB未提取到顶点数据' };
    return makeResult(allVertices, allTriangles, 'glb');
  } catch (e) {
    return { error: 'GLB解析失败: ' + (e.message || '未知错误') };
  }
}

function readAccessor(gltf, accessor, binBuffer, isIndex) {
  try {
    if (accessor.bufferView == null) return null;
    if (!gltf.bufferViews || accessor.bufferView >= gltf.bufferViews.length) return null;
    const bv = gltf.bufferViews[accessor.bufferView];
    if (!bv || !binBuffer) return null;

    const offset = (accessor.byteOffset || 0) + (bv.byteOffset || 0);
    const count = accessor.count;
    const comps = isIndex ? 1 : (accessor.type === 'VEC3' ? 3 : accessor.type === 'VEC2' ? 2 : 1);
    const total = count * comps;
    const ct = accessor.componentType;
    
    const bytesPerElement = ct === 5126 ? 4 : ct === 5125 ? 4 : ct === 5123 ? 2 : ct === 5122 ? 2 : ct === 5121 ? 1 : 4;
    const byteLength = total * bytesPerElement;
    
    // Bounds check: ensure we don't read past the bin buffer
    if (offset < 0 || offset + byteLength > binBuffer.length) {
      return null;
    }
    
    const result = new Float32Array(total);

    if (ct === 5126) {
      result.set(new Float32Array(binBuffer.buffer, binBuffer.byteOffset + offset, total));
    } else if (ct === 5123) {
      const s = new Uint16Array(binBuffer.buffer, binBuffer.byteOffset + offset, total);
      for (let i = 0; i < s.length; i++) result[i] = s[i];
    } else if (ct === 5125) {
      const s = new Uint32Array(binBuffer.buffer, binBuffer.byteOffset + offset, total);
      for (let i = 0; i < s.length; i++) result[i] = s[i];
    } else if (ct === 5122) {
      const s = new Int16Array(binBuffer.buffer, binBuffer.byteOffset + offset, total);
      for (let i = 0; i < s.length; i++) result[i] = s[i];
    } else if (ct === 5121) {
      const s = new Uint8Array(binBuffer.buffer, binBuffer.byteOffset + offset, total);
      for (let i = 0; i < s.length; i++) result[i] = s[i];
    } else {
      return null;
    }
    return result;
  } catch (e) {
    return null;
  }
}

// ── OBJ Parser ───────────────────────────────────────

function parseOBJ(text) {
  const vertices = [];
  const triangles = [];
  for (const line of text.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v' && parts.length >= 4) {
      vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
    }
    if (parts[0] === 'f') {
      const indices = [];
      for (let i = 1; i < parts.length; i++) {
        const idx = parseInt(parts[i].split('/')[0]) - 1;
        if (idx >= 0) indices.push(idx);
      }
      if (indices.length === 3) triangles.push(indices);
      else if (indices.length === 4) {
        triangles.push([indices[0], indices[1], indices[2]]);
        triangles.push([indices[0], indices[2], indices[3]]);
      }
    }
  }
  if (vertices.length === 0) return { error: '未在OBJ中找到顶点数据' };
  return makeResult(vertices, triangles, 'obj');
}

// ── ASCII STL ────────────────────────────────────────

function parseAsciiSTL(text) {
  const vertices = [];
  const triangles = [];
  let currentVerts = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('vertex')) {
      const parts = t.split(/\s+/);
      if (parts.length >= 4) {
        currentVerts.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
        if (currentVerts.length === 3) {
          const idx = vertices.length;
          vertices.push(...currentVerts);
          triangles.push([idx, idx+1, idx+2]);
          currentVerts = [];
        }
      }
    }
    if (t.startsWith('endsolid')) break;
  }
  if (vertices.length === 0) return { error: '未在ASCII STL中找到顶点数据' };
  return makeResult(vertices, triangles, 'stl_ascii');
}

// ── Main Message Handler ─────────────────────────────

self.onmessage = async function(e) {
  const { fileData, fileName } = e.data;
  try {
    const buffer = new Uint8Array(fileData).buffer;
    const arr = new Uint8Array(buffer);
    const view = new DataView(buffer);
    const ext = fileName.split('.').pop().toLowerCase();

    let result;
    if (ext === 'stl') {
      if (buffer.byteLength < 84) {
        result = { error: 'STL文件太小，无效格式' };
      } else {
        const triangleCount = view.getUint32(80, true);
        const expectedSize = 84 + triangleCount * 50;
        const isBinary = Math.abs(buffer.byteLength - expectedSize) < 50 || triangleCount > 0;
        result = isBinary ? parseBinarySTL(arr, triangleCount) : parseAsciiSTL(new TextDecoder().decode(arr));
      }
    } else if (ext === 'obj') {
      result = parseOBJ(new TextDecoder().decode(arr));
    } else if (ext === 'glb') {
      // Post progress before heavy parse
      self.postMessage({ progress: 'parsing' });
      result = parseGLB(arr, view);
    } else {
      result = { error: `不支持的文件格式: .${ext}` };
    }

    // Post progress before heavy computation
    if (!result.error) {
      self.postMessage({ progress: 'computing' });
    }

    self.postMessage({ result });
  } catch (err) {
    self.postMessage({ error: '文件解析失败: ' + err.message });
  }
};
