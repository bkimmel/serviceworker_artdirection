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

navigator.serviceWorker.register('/lifecyclescience.js')
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
        
        //reg.active && reg.active.postMessage('port', [mc.out]);
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
                  //normally (arguments[0].active === navigator.serviceWorker.controller) == true
                  //against spec, Chrome classifies it as 'waiting' instead of 'active' (probly better)
            //"activated"
              //it is now controlling the page
        //Infuriating: Why can the API not deliver both the SW object and its registration?
        
        //confirmed: changed SW code and sw.reg() did not put new code in lifecycle.
          //even after, did a navigator.serviceWorker.getRegistration().then(function(r){ debugger; }) -- no joy
          //but then it randomly put it in later...asynchronously for sure?
          //OK - enough for now.
        debugger;
    });