var V="souf-v2",A=["./","index.html","privacy.html","manifest.json","hero.webp","icon-192.png","icon-512.png","apple-touch-icon.png"],X=["cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com"];
/* كل ملف يتحمّل لوحدو: إذا ناقص ملف، التثبيت ما يفشلش */
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(A.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request,u=new URL(r.url);
 if(r.method!="GET")return;
 var same=u.origin==location.origin;if(!same&&X.indexOf(u.hostname)<0)return; /* supabase يمرّ مباشرة */
 if(r.mode=="navigate"){
  var home=/\/$|\/index\.html$/.test(u.pathname),key=home?"index.html":r;
  e.respondWith(fetch(r).then(function(n){if(n&&n.ok){var c=n.clone();caches.open(V).then(function(h){h.put(key,c)})}return n}).catch(function(){return caches.match(key,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html")})}));return}
 e.respondWith(caches.match(r).then(function(c){var f=fetch(r).then(function(n){if(n&&(n.ok||n.type=="opaque")){var k=n.clone();caches.open(V).then(function(h){h.put(r,k)})}return n}).catch(function(){return c});return c||f}))});
