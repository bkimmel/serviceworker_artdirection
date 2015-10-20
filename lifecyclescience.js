self.addEventListener('activate', function(e){
    console.log('waiting 4');
    e.waitUntil(new Promise(function(res,rej){
        self.addEventListener('message', function(e){
            res();
        });
    }));
});