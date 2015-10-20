self.addEventListener('install', function(e){
   console.log('Lifecycle: install.4');
   e.waitUntil(new Promise(function(res,rej){
    console.log('Lifecycle: install paused..awaiting message from client...');
    self.addEventListener('message', function(e){
       if(e.data.cmd == 'init'){
           //connect handlers to port
           console.log('init received...');
           e.data.d.onmessage = porthandler;
           //handshake bck to client

           //resolve to kick sw past install
           console.log('skipping wait...');
           if(self.registration.active){
               e.data.d.postMessage('SW Activated');
           }
           else {
               self.addEventListener('activate', function(){
                 e.data.d.postMessage('SW Activated');
               });
               self.skipWaiting();  
               res();
           } 
       }
    });
   }).then(function(v){
        console.log('finished intall');   
   })); 
});



self.addEventListener('fetch', function(e){
    //debugger;
});

function porthandler(e) {

}
