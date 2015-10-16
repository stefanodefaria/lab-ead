/**
 * Created by stefano on 27/04/15.
 */
var session = require('./../sessionManager');
var defs = require('./../definitions');
var exp = require('./../experimentManager');

var reqData = ['email', 'token', 'expID', 'snapshotCount'];
var resData = {message: '', snapshotCount: -1, data:''};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);

    if (authMsg != defs.returnMessage.SUCCESS) {

        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform getExpStatus: %s', clientInfo.address, clientInfo.email, retObj.message);
        return cb(retObj);
    }


    console.log('Client %s <%s> attempted to perform getExpStatus...', clientInfo.address, clientInfo.email);
    exp.getExpStatus(clientInfo.email, clientInfo.expID, clientInfo.snapshotCount, function(msg, count, encodedFile){

        retObj.message = msg;
        retObj.snapshotCount = count;
        retObj.data = encodedFile;

        if(retObj.message === defs.returnMessage.SUCCESS){
            console.log('Client %s <%s> performed getExpStatus successfully', clientInfo.address, clientInfo.email);
        }
        else{
            console.log('Client %s <%s> failed to perform getExpStatus: %s', clientInfo.address, clientInfo.email, retObj.message);
        }

        return cb(retObj);
    });
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
