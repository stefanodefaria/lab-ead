/** Created by Stéfano on 03/04/2015. **/
var http = require('http');
//var login = require('./login');
var session = require('./sessionManager');
var utils = require('./utils');
var port = 8080;

//TODO
//create httpS server instead
http.createServer(function (req, res) {

    var req_data = {login: null, message:''};

    //gets POST message from client
    req.on('data', function(data){
        req_data.message+=data.toString();
    });

    req.on('end', function() {
        //adds 'address' property into req_data
        var address = utils.clientAddress(req);

        //redirects to given path
        switch(req.url) {
            case '/login':
                req_data.login = true;
                session.authenticateClient(req_data, function(err, retObj){
                    if(err)
                    {
                        console.log('Error with client %s: %s', address, err.message);
                    }
                    else
                    {
                        console.log('Client %s connected successfully', address);
                    }
                    res.end(JSON.stringify(retObj));
                });
                break;
            case '/testOp':
                req_data.login = false;
                session.authenticateClient(req_data, function(err, retObj){
                    if(err)
                    {
                        console.log('Error with client %s: %s', address, err.message);
                    }
                    else
                    {
                        //todo
                        //make operation here
                        console.log('Client %s authenticated successfully', address);
                    }
                    res.end(JSON.stringify(retObj));
                });
                break;
            default:
                res.end(JSON.stringify(session.returnCode.BAD_OPERATION))
        }
    });

}).listen(port);

console.log('Example app listening at %d',port);