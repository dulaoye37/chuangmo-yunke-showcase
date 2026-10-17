import{O as B,a1 as T,g as b,w as A,A as P,al as D,am as G,aa as U,a as J,an as _,C as K,W as m,V as Q,r as Z,o as X,P as y,u as H,G as Y}from"./index-Viw7KwaO.js";/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=e=>e==="";/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=(...e)=>e.filter((t,o,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===o).join(" ").trim();/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,n)=>n?n.toUpperCase():o.toLowerCase());/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=e=>{const t=q(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var C={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=Symbol("lucide-icons");function ne(){return B(te,{})}/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=({name:e,iconNode:t,"icon-node":o,absoluteStrokeWidth:n,"absolute-stroke-width":i,strokeWidth:r,"stroke-width":s,size:l,color:p,...f},{slots:u})=>{const{size:c,color:a,strokeWidth:h=2,absoluteStrokeWidth:v=!1,class:g=""}=ne(),S=b(()=>{const w=R(n)||R(i)||n===!0||i===!0||v===!0,d=r||s||h||C["stroke-width"];return w?Number(d)*24/Number(l??c??C.width):d});return T("svg",{...C,...f,width:l??c??C.width,height:l??c??C.height,stroke:p??a??C.stroke,"stroke-width":S.value,class:F("lucide",g,...e?[`lucide-${V(ee(e))}-icon`,`lucide-${V(e)}`]:["lucide-icon"])},[...(t??o??[]).map(w=>T(...w)),...u.default?[u.default()]:[]])};/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=(e,t)=>(o,{slots:n,attrs:i})=>T(oe,{...i,...o,iconNode:t,name:e},n.default?{default:n.default}:void 0);/**
 * @license @lucide/vue v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],Ce=ie("pause",re);function $(e,t){return U()?(K(e,t),!0):!1}function xe(e){let t=!1,o;const n=_(!0);return(...i)=>(t||(o=n.run(()=>e(...i)),t=!0),o)}const I=new WeakMap,se=(...e)=>{var t;const o=e[0],n=(t=P())===null||t===void 0?void 0:t.proxy,i=n??U();if(i==null&&!D())throw new Error("injectLocal must be called in setup");return i&&I.has(i)&&o in I.get(i)?I.get(i)[o]:B(...e)},E=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const ue=e=>typeof e<"u",ce=e=>e!=null,ae=Object.prototype.toString,le=e=>ae.call(e)==="[object Object]",j=()=>{},Ae=de();function de(){var e,t,o;return E&&!!(!((e=window)===null||e===void 0||(e=e.navigator)===null||e===void 0)&&e.userAgent)&&(/iP(?:ad|hone|od)/.test(window.navigator.userAgent)||((t=window)===null||t===void 0||(t=t.navigator)===null||t===void 0?void 0:t.maxTouchPoints)>2&&/iPad|Macintosh/.test((o=window)===null||o===void 0?void 0:o.navigator.userAgent))}function z(e){return e.endsWith("rem")?Number.parseFloat(e)*16:Number.parseFloat(e)}function M(e){return Array.isArray(e)?e:[e]}function fe(e){return P()}function Oe(e){if(!E)return e;let t=0,o,n;const i=()=>{t-=1,n&&t<=0&&(n.stop(),o=void 0,n=void 0)};return(...r)=>(t+=1,n||(n=_(!0),o=n.run(()=>e(...r))),$(i),o)}function We(e,t=1e4){return G((o,n)=>{let i=m(e),r;const s=()=>setTimeout(()=>{i=m(e),n()},m(t));return $(()=>{clearTimeout(r)}),{get(){return o(),i},set(l){i=l,n(),clearTimeout(r),r=s()}}})}function ke(e,t){fe()&&J(e,t)}function ve(e,t,o){return A(e,t,{...o,immediate:!0})}const O=E?window:void 0,pe=E?window.document:void 0;function x(e){var t;const o=m(e);return(t=o==null?void 0:o.$el)!==null&&t!==void 0?t:o}function L(...e){const t=(n,i,r,s)=>(n.addEventListener(i,r,s),()=>n.removeEventListener(i,r,s)),o=b(()=>{const n=M(m(e[0])).filter(i=>i!=null);return n.every(i=>typeof i!="string")?n:void 0});return ve(()=>{var n,i;return[(n=(i=o.value)===null||i===void 0?void 0:i.map(r=>x(r)))!==null&&n!==void 0?n:[O].filter(r=>r!=null),M(m(o.value?e[1]:e[0])),M(H(o.value?e[2]:e[1])),m(o.value?e[3]:e[2])]},([n,i,r,s],l,p)=>{if(!(n!=null&&n.length)||!(i!=null&&i.length)||!(r!=null&&r.length))return;const f=le(s)?{...s}:s,u=n.flatMap(c=>i.flatMap(a=>r.map(h=>t(c,a,h,f))));p(()=>{u.forEach(c=>c())})},{flush:"post"})}function he(){const e=y(!1),t=P();return t&&X(()=>{e.value=!0},t),e}function N(e){const t=he();return b(()=>(t.value,!!e()))}function me(e){return typeof e=="function"?e:typeof e=="string"?t=>t.key===e:Array.isArray(e)?t=>e.includes(t.key):()=>!0}function Me(...e){let t,o,n={};e.length===3?(t=e[0],o=e[1],n=e[2]):e.length===2?typeof e[1]=="object"?(t=!0,o=e[0],n=e[1]):(t=e[0],o=e[1]):(t=!0,o=e[0]);const{target:i=O,eventName:r="keydown",passive:s=!1,dedupe:l=!1}=n,p=me(t);return L(i,r,u=>{u.repeat&&m(l)||p(u)&&o(u)},s)}const we=Symbol("vueuse-ssr-width");function be(){const e=D()?se(we,null):null;return typeof e=="number"?e:void 0}function ye(e,t={}){const{window:o=O,ssrWidth:n=be()}=t,i=N(()=>o&&"matchMedia"in o&&typeof o.matchMedia=="function"),r=y(typeof n=="number"),s=y(),l=y(!1),p=f=>{l.value=f.matches};return Q(()=>{if(r.value){r.value=!i.value;const f=m(e).split(",");l.value=f.some(u=>{const c=u.includes("not all"),a=u.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/),h=u.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);let v=!!(a||h);return a&&v&&(v=n>=z(a[1])),h&&v&&(v=n<=z(h[1])),c?!v:v});return}i.value&&(s.value=o.matchMedia(m(e)),l.value=s.value.matches)}),L(s,"change",p,{passive:!0}),b(()=>l.value)}function ge(e){return JSON.parse(JSON.stringify(e))}function Pe(e={}){const{document:t=pe}=e;if(!t)return y("visible");const o=y(t.visibilityState);return L(t,"visibilitychange",()=>{o.value=t.visibilityState},{passive:!0}),o}function $e(e,t,o={}){const{window:n=O,...i}=o;let r;const s=N(()=>n&&"ResizeObserver"in n),l=()=>{r&&(r.disconnect(),r=void 0)},p=A(b(()=>{const u=m(e);return Array.isArray(u)?u.map(c=>x(c)):[x(u)]}),u=>{if(l(),s.value&&n){r=new ResizeObserver(t);for(const c of u)c&&r.observe(c,i)}},{immediate:!0,flush:"post"}),f=()=>{l(),p()};return $(f),{isSupported:s,stop:f}}function Ee(e,t,o={}){const{root:n,rootMargin:i,threshold:r=0,window:s=O,immediate:l=!0}=o,p=N(()=>s&&"IntersectionObserver"in s),f=b(()=>M(m(e)).map(x).filter(ce));let u=j;const c=y(l),a=p.value?A(()=>[f.value,x(n),m(i),c.value],([v,g,S])=>{if(u(),!c.value||!v.length)return;const w=new IntersectionObserver(t,{root:x(g),rootMargin:S,threshold:r});v.forEach(d=>d&&w.observe(d)),u=()=>{w.disconnect(),u=j}},{immediate:l,flush:"post"}):j,h=()=>{u(),a(),c.value=!1};return $(h),{isSupported:p,isActive:c,pause(){u(),c.value=!1},resume(){c.value=!0},stop:h}}function Ie(e){const t=ye("(prefers-reduced-motion: reduce)",e);return b(()=>t.value?"reduce":"no-preference")}function je(e,t,o,n={}){var i,r;const{clone:s=!1,passive:l=!1,eventName:p,deep:f=!1,defaultValue:u,shouldEmit:c}=n,a=P(),h=o||(a==null?void 0:a.emit)||(a==null||(i=a.$emit)===null||i===void 0?void 0:i.bind(a))||(a==null||(r=a.proxy)===null||r===void 0||(r=r.$emit)===null||r===void 0?void 0:r.bind(a==null?void 0:a.proxy));let v=p;t||(t="modelValue"),v=v||`update:${t.toString()}`;const g=d=>s?typeof s=="function"?s(d):ge(d):d,S=()=>ue(e[t])?g(e[t]):u,w=d=>{c?c(d)&&h(v,d):h(v,d)};if(l){const d=Z(S());let W=!1;return A(()=>e[t],k=>{W||(W=!0,d.value=g(k),Y(()=>W=!1))}),A(d,k=>{!W&&(k!==e[t]||f)&&w(k)},{deep:f}),d}else return b({get(){return S()},set(d){w(d)}})}export{Ce as P,Ie as a,Pe as b,ie as c,ye as d,Oe as e,Ae as f,L as g,x as h,E as i,O as j,xe as k,he as l,je as m,$e as n,Me as o,We as r,ke as t,Ee as u};
