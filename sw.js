// Mi rutina v3: modo seguro. Usa internet siempre que hay; sin conexión, la copia guardada.
const CACHE='mi-rutina-v3';
const SHELL=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).catch(()=>caches.match('index.html').then(h=>h||caches.match('./')).then(h=>h||new Response('Sin conexión',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}}))));
    return; }
  e.respondWith(fetch(r).then(res=>{ if(res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp));} return res; }).catch(()=>caches.match(r).then(h=>h||Response.error())));
});
