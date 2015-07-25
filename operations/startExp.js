/**
 * Created by stefa on 18/07/2015.
 */

var session = require('./../sessionManager');
var defs = require('./../definitions');
var exp = require('./../experimentManager');

var reqData = ['email', 'token', 'expID'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);
    var expIsAvailable = exp.experimentIsAvailable(clientInfo.expID);

    if (authMsg === defs.returnMessage.SUCCESS && expIsAvailable) {
        retObj.message = exp.startExperiment(clientInfo.expID);

        if (retObj.message === defs.returnMessage.SUCCESS) {
            console.log('Client %s <%s> performed startExp successfully', clientInfo.address, clientInfo.email);

        }
        else {
            console.log('Client %s <%s> failed to perform startExp: %s', clientInfo.address, clientInfo.email, retObj.message);
        }
    }
    else {
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform startExp: %s', clientInfo.address, clientInfo.email, retObj.message);
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
