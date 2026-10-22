// Mi rutina: funciona sin conexión y carga siempre la última versión
const CACHE='mi-rutina-v2';
const SHELL=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>fetch(u,{cache:'no-store'}).then(r=>c.put(u,r)).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const url=new URL(r.url);
  if(r.mode==='navigate'||(url.origin===location.origin&&url.pathname.endsWith('.html'))){
    e.respondWith(fetch(r.url,{cache:'no-store'}).then(res=>{const cp=res.clone(); caches.open(CACHE).then(c=>c.put('index.html',cp)); return res;}).catch(()=>caches.match('index.html')));
    return; }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp));} return res; })));
});
