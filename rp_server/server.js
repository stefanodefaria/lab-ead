/** Created by Stéfano on 03/04/2015. **/
var http = require('http');
var database = require('./database');
var session = require('./sessionManager');
var defs = require('./definitions');
var utils = require('./utils');

var port = 8080;

//TODO
//create httpS server instead
http.createServer(function (req, res) {

    var req_data;

    //gets POST message from client
    req.on('data', function(data){
        if(req_data){
            req_data+=data.toString();
        }
        else{
            req_data=data.toString();
        }
    });

    req.on('end', function() {
        //adds 'address' property into req_data
        var address = utils.clientAddress(req);

        //Parses message
        var clientInfo;
        try{
            clientInfo = JSON.parse(req_data);
        }
        catch (err){
            var retObj = {message: defs.returnMessage.BAD_DATA};
            res.end(JSON.stringify(retObj));
            return;
        }

        //redirects to given path
        if(req.url == '/login') {
            session.login(clientInfo, function (err, retObj) {
                if (err) {
                    console.log('Error logging in client %s: %s', address, err.message);
                }
                else {
                    console.log('Client %s logged in successfully.', address);
                }
                res.end(JSON.stringify(retObj));
            });
        }
        else if(req.url == '/testOp'){  //client needs to be logged in to call this operation
                session.authenticateClient(clientInfo, function(err, retObj){
                    if(err)
                    {
                        console.log('Error with client %s: %s', address, err.message);
                    }
                    else
                    {
                        //todo
                        //make operation here
                        if(retObj.message == defs.returnMessage.SUCCESS)
                            console.log('Client %s authenticated successfully', address);
                    }
                    res.end(JSON.stringify(retObj));
                });
        }
        else if(req.url == '/register'){
            database.registerUser(clientInfo, defs.profileType.STUDENT,function(err){
                var retObj;
                if(err)
                {
                    retObj = {message: err.message};
                    res.end(JSON.stringify(retObj));
                }
                else{
                    retObj = {message: defs.returnMessage.SUCCESS};
                    res.end(JSON.stringify(retObj));
                }
            })
        }
        else{
            res.end(JSON.stringify(defs.returnMessage.BAD_OPERATION))
        }
    });

}).listen(port);

console.log('Example app listening at %d',port);