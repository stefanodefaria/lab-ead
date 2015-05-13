/**
 * Created by stefano on 27/04/15.
 */
var session = require('./../sessionManager');
var defs = require('./../definitions');


var reqData = ['email', 'token'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);

    if (authMsg == defs.returnMessage.SUCCESS) {
        console.log('Client %s <%s> logged out successfully', clientInfo.address, clientInfo.email);
        session.logout(clientInfo.email);
        retObj.message = defs.returnMessage.SUCCESS;
    }
    else {
        console.log('Client %s <%s> failed to logged out: %s', clientInfo.address, clientInfo.email, authMsg.message);
        retObj.message = authMsg;
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
