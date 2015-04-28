/**
 * Created by stefano on 27/04/15.
 */
var session = require('./../sessionManager');
var defs = require('./../definitions');

var reqData = ['email', 'token'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    retObj.message = session.authenticateClient(clientInfo);

    if (retObj.message == defs.returnMessage.SUCCESS) {
        console.log('Client %s <%s> performed operation successfully', clientInfo.address, clientInfo.email);
        //todo
        //make operation here
    }
    else {
        console.log('Client %s <%s> failed to perform operation: %s', clientInfo.address, clientInfo.email, retObj.message);
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
