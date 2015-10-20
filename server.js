var connect = require('connect')
var createStatic = require('connect-static');
var http = require('http');

var app = connect();

createStatic({dir:__dirname}, function(err, middleware) {
  if (err) throw err;
  app.use('/', middleware);
  http.createServer(app).listen(3000);
});


