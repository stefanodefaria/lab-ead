/** Created by Stéfano on 03/04/2015. **/
var http = require('http');
var login = require('./login');
var port = 8080;

http.createServer(function (req, res) {

    if(req.url == '/login')
    {
        login(req, res)
    }

}).listen(port);

console.log('Example app listening at %d',port);