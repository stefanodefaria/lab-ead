/**
 * Created by stefano on 27/04/15.
 */

var session = require('./../sessionManager');
var defs = require('./../definitions');
var db = require('./../database');

var reqData = ['email', 'token', 'newEmail', 'newPassword', 'newName'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);
    var updtEntry = {};

    if(clientInfo.containsProp('newEmail')){
        updtEntry['newEmail'] = clientInfo.newEmail;
    }
    if(clientInfo.containsProp('newPassword')){
        updtEntry['newPassword'] = clientInfo.newPassword;
    }
    if(clientInfo.containsProp('newEmail')){
        updtEntry['newName'] = clientInfo.newName;
    }

    if (authMsg == defs.returnMessage.SUCCESS) {
        console.log('Client %s <%s> updated its info successfully', clientInfo.address, clientInfo.email);
        db.updateUser(clientInfo.email, updtEntry, function(retMsg){

            if (retMsg == defs.returnMessage.SUCCESS) {
                console.log('Client %s <%s> updated info successfully', clientInfo.address, clientInfo.email);
            }
            else {
                console.log('Client %s <%s> failed to update info: %s', clientInfo.address, clientInfo.email, retObj.message);
            }
            retObj.message = retMsg;
            cb(retObj);
        })
    }
    else {
        console.log('Client %s <%s> failed to update info: %s', clientInfo.address, clientInfo.email, retObj.message);
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
