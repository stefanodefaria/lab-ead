/**
 * Created by stefano on 27/04/15.
 */
var session = require('./../sessionManager');
var defs = require('./../definitions');
var exp = require('./../experimentManager');

var reqData = ['email', 'token', 'expKey'];
var resData = {message: '', completeExpInfo:{}};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);

    if (authMsg == defs.returnMessage.SUCCESS) {
        retObj.message = defs.returnMessage.SUCCESS;
        console.log('Client %s <%s> performed getExpInfo successfully', clientInfo.address, clientInfo.email);
        retObj.completeExpInfo = exp.getCompleteExpInfo(clientInfo.expKey);
    }
    else {
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform getExpInfo: %s', clientInfo.address, clientInfo.email, retObj.message);
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
