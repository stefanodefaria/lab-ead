/** Created by St�fano on 03/04/2015. **/
var http = require("http");
var defs = require('./definitions');
var utils = require('./utils');
var ops = require('./operationManager');

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

        //this call will either return a 'returnMessage' or a Object that hold client info
        var validation = validateRequest(req, req_data);

        // if validation FAILS
        if(validation.message != defs.returnMessage.SUCCESS)
        {
            console.log("Invalid request from %s: %s.", utils.clientAddress(req), validation.message);

            var retObj = {message: validation.message};
            res.end(JSON.stringify(retObj));
            return;
        }


        //At this point, request has been validated
        var clientInfo = validation.clientInfo;

        //redirects to operation based on url path
        var op = utils.extractOperation(req);
        ops.processRequest(op, clientInfo, function (retObj) {
            res.end(JSON.stringify(retObj));
        });

    });

}).listen(port);


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
    if (!ops.operations.containsProp(operation)) {
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
    var properties = ops.operations[operation].reqData;
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

console.log('Example app listening at %d', port);
