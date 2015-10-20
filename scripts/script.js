console.log('pagecode test...');

function Messenger(){
    var mc = new MessageChannel();
    var i = 0;
    function _post(m, trn){
        mc.port1.postMessage.apply(mc.port1, arguments);
    }
    function _addmessagelistener(f) {
        mc.port1.addEventListener('message', f);
        //debugger;
        !i++ && mc.port1.start();
    }
    function _clear(f) {
         mc.port1.removeEventListener('message', f);
    }
    return {
        listen: _addmessagelistener,
        out: mc.port2,
        post: _post,
        clear: _clear
    }
}

var mc = new Messenger();
function messagelistener(m){

    console.log('Message From SW: ', m.data);
    //mc.post({dpr: 2});
}
mc.listen(messagelistener);

//controller change will fire when the active worker changes: see below "King of the Hill" to see when that happens
navigator.serviceWorker.oncontrollerchange = function(e){
    //this won't actually fire unless there is a code change on the SW
    //debugger;
    mc.clear(messagelistener);
    navigator.serviceWorker.getRegistration().then(function(reg){
        //debugger;
        mc = new Messenger();
        mc.listen(messagelistener);
        reg.active && reg.active.postMessage('port', [mc.out]);
    })
}

//Problem: How do you know you are messaging the worker that will be controlling your page?
//Solution: Message the nav.sw on client claim?

navigator.serviceWorker.register('/serviceworker.js')
    .then(function(reg){
        //debugger;
        //code changed SWs will queue up under reg.waiting...
        //reg.active is "King of the Hill" until:
          //All client pages controlled by the SW are unloaded (confirm by navving away and checking v number)
          //skipWaiting is used in the SW scope and the page is reloaded
          //Asynchronously if an activating worker claims() this as a client and it wasn't already controlled
          //reg.unregister() ?

        //It does not matter how many times you "reload the page", the active SW keeps its spot
        //until one of those things happens
        
        reg.active && reg.active.postMessage('port', [mc.out]);
        //If 'skipWaiting' is used, the update is still handled asynchronously - so this
        //message will reach the 'old' SW instead of the one that did skipWaiting

        //General lifecycle notes:
          //For any ServiceWorker object:
            //"installing"
              //can be extended with install(e.waitUntil)
            //"installed"
              //also known as "waiting" in the registration set
            //"activating"
              //can be extended with activate(e.waitUntil)
              //it is now considered an "active worker"
              //however, it is not "controlling" the page yet
                //science: see if nav.sw.controller != getReg().active
            //"activated"
              //it is now controlling the page
    })














// navigator.serviceWorker.getRegistration()
//     .then(function(reg){
//         if(!reg) {
//             console.log('!reg...');
//             return navigator.serviceWorker.register('/serviceworker.js');
//         }
//         //debugger;
//         console.log('reg...');
//         return Promise.resolve(reg);
// //         return new Promise(function(res, rej){
// //             reg.update().then(function(){
// //                 //debugger;
// //                 console.log('getRegistration...');
// //                 res(navigator.serviceWorker.getRegistration());
// //             });
// //         });
//     })
//     .then(function(swreg){
//         //debugger;
//         if(swreg.installing){
//             console.log('swreg.installing');
//             return new Promise(function(res,rej){
// //                 navigator.serviceWorker.oncontrollerchange = function(){
// //                     console.log('controller change fired');
// //                     res( navigator.serviceWorker.ready );
// //                 }
//                 //kick it out of install
//                 console.log('sending init');
//                 swreg.installing.postMessage({cmd: 'init', d: mc.port2}, [mc.port2]);
//                 res(navigator.serviceWorker.ready);
//             });
//         }
//         console.log('swreg.ready');
//         return navigator.serviceWorker.ready;
//     })
//     .then(function(readyreg){
//         console.log('ready reg');
//     })
//     .catch(function(){
//         console.log('sw registration error');
//     })