console.log('pagecode test...');

var mc = new MessageChannel();

mc.port1.onmessage = function(m){
    console.log('Message From SW: ', m);
}

navigator.serviceWorker.getRegistration()
    .then(function(reg){
        if(!reg) {
            console.log('!reg...');
            return navigator.serviceWorker.register('/serviceworker.js');
        }
        //debugger;
        console.log('reg...');
        return new Promise(function(res, rej){
            reg.update().then(function(){
                //debugger;
                console.log('getRegistration...');
                res(navigator.serviceWorker.getRegistration());
            });
        });
    })
    .then(function(swreg){
        if(swreg.installing){
            console.log('swreg.installing');
            return new Promise(function(res,rej){
                navigator.serviceWorker.oncontrollerchange = function(){
                    console.log('controller change fired');
                    res( navigator.serviceWorker.ready );
                }
                //kick it out of install
                console.log('sending init');
                swreg.installing.postMessage({cmd: 'init', d: mc.port2}, [mc.port2]);
            });
        }
        console.log('swreg.ready');
        return navigator.serviceWorker.ready;
    })
    .then(function(readyreg){
        console.log('ready reg');
    })
    .catch(function(){
        console.log('sw registration error');
    })