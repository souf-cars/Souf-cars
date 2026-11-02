var V="souf-v1",A=["./","index.html","manifest.json","hero.webp","icon-192.png","icon-512.png","apple-touch-icon.png"],X=["cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(A)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request,u=new URL(r.url);
 if(r.method!="GET")return;
 var same=u.origin==location.origin;if(!same&&X.indexOf(u.hostname)<0)return; /* supabase يمرّ مباشرة */
 if(r.mode=="navigate"){e.respondWith(fetch(r).then(function(n){var c=n.clone();caches.open(V).then(function(h){h.put("index.html",c)});return n}).catch(function(){return caches.match("index.html")}));return}
 e.respondWith(caches.match(r).then(function(c){var f=fetch(r).then(function(n){if(n&&(n.ok||n.type=="opaque")){var k=n.clone();caches.open(V).then(function(h){h.put(r,k)})}return n}).catch(function(){return c});return c||f}))});
