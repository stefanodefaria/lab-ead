/**
 * Created by stefano on 27/04/15.
 */

var session = require('./../sessionManager');
var defs = require('./../definitions');
var db = require('./../database');
var crypto = require('crypto');

var reqData = ['email', 'token', 'newPassword', 'newName'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);
    var newHashedPassword, newName;

    if(clientInfo.containsProp('newPassword')){
        newHashedPassword = crypto.createHash('sha1').update(clientInfo.newPassword).digest('hex');
    }
    if(clientInfo.containsProp('newName')){
        newName = clientInfo.newName;
    }

    if (authMsg == defs.returnMessage.SUCCESS) {

        db.updateUser(clientInfo.email, newHashedPassword, newName, defs.profileType.STUDENT, function(retMsg){

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
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to update info: %s', clientInfo.address, clientInfo.email, retObj.message);
    }

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
