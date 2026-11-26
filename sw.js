const C='pescaderia-v5';
const PRE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./logo-campospacific.png',
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>fetch(u,{mode:u.startsWith('http')?'no-cors':'same-origin'}).then(r=>{if(r&&(r.ok||r.type==='opaque'))return c.put(u,r)}).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(/\/version\.json$/.test(u.pathname))return;
 const ok=u.origin===location.origin||/^(cdnjs\.cloudflare\.com|www\.gstatic\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname);
 if(!ok)return;
 // Red primero (versión más nueva). Si no hay señal o la señal es muy mala (más de 4 s), usa la copia guardada.
 e.respondWith(new Promise(resolve=>{let done=false;const fromCache=()=>caches.match(e.request,{ignoreSearch:u.origin===location.origin}).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):null));
  const t=setTimeout(()=>{fromCache().then(r=>{if(r&&!done){done=true;resolve(r)}})},4000);
  fetch(e.request).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}if(!done){done=true;clearTimeout(t);resolve(res)}}).catch(()=>{fromCache().then(r=>{if(!done){done=true;clearTimeout(t);resolve(r||new Response('Sin conexión',{status:503}))}})})}))});
