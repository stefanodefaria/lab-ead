/**
 * Created by stefano on 27/04/15.
 */
var session = require('./../sessionManager');
var defs = require('./../definitions');
var exp = require('./../experimentManager');

var reqData = ['email', 'token'];
var resData = {message: '', experiencesKeys:[], experiencesNames:[]};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);

    if (authMsg == defs.returnMessage.SUCCESS) {
        retObj.message = defs.returnMessage.SUCCESS;
        console.log('Client %s <%s> performed getExpList successfully', clientInfo.address, clientInfo.email);
        var expList = exp.getExpList();
	    retObj.experiencesKeys = expList[0];
        retObj.experiencesNames = expList[1];
    }
    else {
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform getExpList: %s', clientInfo.address, clientInfo.email, retObj.message);
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
