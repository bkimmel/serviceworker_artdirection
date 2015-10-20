self.addEventListener('message', function(e){
       if(e.data.cmd == 'init'){
           //connect handlers to port
           console.log('init received...');
           e.data.d.onmessage = porthandler;
           
           if(self.registration.active){
               console.log('reg active...');
               //handshake bck to client
               e.data.d.postMessage('SW Activated');
           }
           else {
               console.log('skipping wait...');
               activehandler = function(){
                //handshake bck to client
                e.data.d.postMessage('SW Activated');
               };
               //resolve to kick sw past install
               self.skipWaiting();  
               res();
           } 
       }
       else if (e.data.cmd == 'promote') {
           
       }
});
self.addEventListener('install', function(e){
   console.log('Lifecycle: install.9');
   e.waitUntil(new Promise(function(res,rej){
    console.log('Lifecycle: install paused..awaiting message from client...');
    
   }).then(function(v){
        console.log('finished intall');   
   })); 
});
self.addEventListener('activate', activehandler);
self.addEventListener('fetch', fetchhandler);

var activehandler = function(){
 
};

var fetchhandler = function(fetch_event) {
    //normal fetch - do nothing
}

function porthandler(e) {
    console.log('port message received...');
    if(e.data.dpr && e.data.dpr >= 2){
        console.log('Switching to hi-res jpg');
        fetchhandler = function(fetch_event){
            if(fetch_event.request.url.match(/\.jpg/)){
                console.log('FETCH HI JPEG');
                debugger;
            }
        }
    }
}
