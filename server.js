#!/usr/bin/nodejs
var port = 8081;

var connect = require('connect');
var connectRoute = require('connect-route');
var fs = require('fs');
var http = require('http');
var app = connect();
var server = http.createServer(app);

app.use(connect.logger('dev'));

app.use(connectRoute(function(router) {
    router.get('mocha.js', function(req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        var stream = fs.createReadStream(__dirname + '/node_modules/mocha/mocha.js', { flags: "r" });
        stream.pipe(res);
    });
    router.get('mocha.css', function(req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        var stream = fs.createReadStream(__dirname + '/node_modules/mocha/mocha.css', { flags: "r" });
        stream.pipe(res);
    });
    // Add some artificial delay when testing mini-module.
    router.get('mini-module/test/test_module_1.js', function(req, res, next) {
        setTimeout(function() {
            console.log("handler for test_module_1.js");
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            var stream = fs.createReadStream(__dirname + '/mini-module/test/test_module_1.js', { flags: "r" });
            stream.pipe(res);
        }, 1000);
    });
    // Add some artificial delay when testing mini-module.
    router.get('mini-module/test/test_module_2.js', function(req, res, next) {
        setTimeout(function() {
            console.log("handler for test_module_2.js");
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            var stream = fs.createReadStream(__dirname + '/mini-module/test/test_module_2.js', { flags: "r" });
            stream.pipe(res);
        }, 1000);
    });
}));

app.use(connect.static(__dirname, {maxAge: 1}));
console.log("Serving files from this folder, access: http://localhost:" + port);
server.listen(port);
