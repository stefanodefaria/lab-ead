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

        //this call will either return a 'returnMessage' or a Object that hold client info
        var validation = validateRequest(req, req_data);

        //will return 'undefined' in case of bad_operation
        var retObj = defs.operationReturnData[utils.extractOperation(req)];

        if(validation.message != defs.returnMessage.SUCCESS)
        {
            console.log("Invalid request from %s: %s.", utils.clientAddress(req), validation.message);
            if(validation.message == defs.returnMessage.BAD_OPERATION){
                //since retObj was 'undefined', create a new one
                retObj = {message: validation.message};
            }
            res.end(JSON.stringify(retObj));
            return;
        }

        //At this point, request has been validated
        var clientInfo = validation.clientInfo;

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

            retObj.message = session.authenticateClient(clientInfo);

            if(retObj.message == defs.returnMessage.SUCCESS){
                console.log('Client %s <%s> performed operation successfully', clientInfo.address, clientInfo.email);
                //todo
                //make operation here
            }
            else{
                console.log('Client %s <%s> failed to perform operation: %s', clientInfo.address, clientInfo.email, retObj.message);
            }

            res.end(JSON.stringify(retObj));
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
    });

}).listen(port);

console.log('Example app listening at %d',port);

/**
 * Validates client request
 * 1- validates operation (i.e. http path)
 * 2- validates request data (corrupt, not json)
 * 3- validates request data properties
 * If any validation fails,
 * Otherwise, it returns an object with client info
 */
function validateRequest(req, data){
    var validation_obj = {message: undefined, clientInfo: {address: utils.clientAddress(req) }};

    var operation = utils.extractOperation(req); //removes slash
    var parsedObj;

    //VALIDATES OPERATION (i.e. http path)
    if(!defs.operationRequiredData.containsProp(operation)){
        validation_obj.message = defs.returnMessage.BAD_OPERATION;
        return validation_obj;
    }

    //CHECKS DATA INTEGRITY
    try{
        parsedObj = JSON.parse(data);
    }
    catch (err){ //JSON.parse only throws SyntaxError (probably data received is corrupt or not a JSON)
        validation_obj.message = defs.returnMessage.BAD_DATA;
        return validation_obj;
    }

    //CHECK DATA PROPERTIES
    var properties = defs.operationRequiredData[operation];
    for (var i=0; i< properties.length; i++) {
        if (!parsedObj.hasOwnProperty(properties[i])) {
            validation_obj.message = defs.returnMessage.MISSING_DATA;
            return validation_obj;
        }
    }

    parsedObj.address = utils.clientAddress(req);

    validation_obj.message = defs.returnMessage.SUCCESS;
    validation_obj.clientInfo = parsedObj;
    return validation_obj;
}