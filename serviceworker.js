self.addEventListener('install', function(event) {
  //skip waiting allows the SW to skip the phase where it is installed but not active.
  //doing this triggers a controllerchange event on the client-side container
  console.log('installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('message', function(e){
    if(e.data == 'port') {
        e.ports[0].postMessage('v36');
        e.ports[0].onmessage = function handleportmessage(ev){
            e.ports[0].postMessage('port message recvd');
            //if the right things are in there:
            if(ev.data.dpi == 'high') {
                e.ports[0].postMessage('high dpi');
                //upgrade the fetch handler to serve the enhanced exp
                self.removeEventListener('fetch', defaultfetchhandler);
                //make sure it only fetches once
                self.removeEventListener('fetch', upgradefetchhandler);
                self.addEventListener('fetch', upgradefetchhandler);
            }
        }
    }
});

self.addEventListener('fetch', defaultfetchhandler);

function defaultfetchhandler(e) {
    e.respondWith(fetch(e.request));
}
function upgradefetchhandler(e) {
    //debugger;
    //because the port it was insitialised with may belong to a callstack that was discharged on reload, etc.
    e.respondWith(fetch(e.request.url.match(/\.txt/i) ? 'enhanced.txt' : e.request));
}

// self.addEventListener('activate', function(event) {
//   //clients.claim is just to "expand the scope" of the SW
//   event.waitUntil(self.clients.claim());
// });