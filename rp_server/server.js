/** Created by Stéfano on 03/04/2015. **/
var http = require("http");
var database = require('./database');
var session = require('./sessionManager');
var defs = require('./definitions');
var utils = require('./utils');

var port = 8080;

//Starts DB to be used in this module
database.loadDB();

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

        //Parses message
        var clientInfo;
        try{
            clientInfo = JSON.parse(req_data);
            clientInfo.address = utils.clientAddress(req);
        }
        catch (err){ //JSON.parse only throws SyntaxError (probably data received is corrupt or not a JSON)
            console.log("Received BAD_DATA request from %s.", utils.clientAddress(req));
            var retObj = {message: defs.returnMessage.BAD_DATA};
            res.end(JSON.stringify(retObj));
            return;
        }

        //redirects to given path
        if(req.url == '/login') {
            session.login(clientInfo, function (retObj) {

                if(retObj.message == defs.returnMessage.SUCCESS){
                    console.log('Client %s <%s> logged in successfully', clientInfo.address, clientInfo.email);
                }
                else{
                    console.log('Client %s <%s> failed to login: %s', clientInfo.address, clientInfo.email, retObj.message);
                }

                res.end(JSON.stringify(retObj));
            });
        }
        else if(req.url == '/testOp'){  //client needs to be logged in to call this operation
                session.authenticateClient(clientInfo, function(retObj){

                    if(retObj.message == defs.returnMessage.SUCCESS){
                        console.log('Client %s <%s> performed operation successfully', clientInfo.address, clientInfo.email);
                        //todo
                        //make operation here
                    }
                    else{
                        console.log('Client %s <%s> failed to perform operation: %s', clientInfo.address, clientInfo.email, retObj.message);
                    }

                    res.end(JSON.stringify(retObj));
                });
        }
        else if(req.url == '/register'){
            database.registerUser(clientInfo, defs.profileType.STUDENT,function(retObj){

                if(retObj.message == defs.returnMessage.SUCCESS){
                    console.log('Client %s <%s> registered successfully', clientInfo.address, clientInfo.email);
                }
                else{
                    console.log('Client %s <%s> failed to register: %s', clientInfo.address, clientInfo.email, retObj.message);
                }

                res.end(JSON.stringify(retObj));
            })
        }
        else{
            res.end(JSON.stringify(defs.returnMessage.BAD_OPERATION))
        }
    });

}).listen(port);

//function logError(err, address){
//    var message = "Error handling request from <" + clientInfo.address+ ">. " + err.name + ": " + err.message;
//    console.log(message);
//}


console.log('Example app listening at %d',port);