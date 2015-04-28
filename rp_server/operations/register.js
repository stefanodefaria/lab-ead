/**
 * Created by stefano on 27/04/15.
 */

var database = require('./../database');
var defs = require('./../definitions');

var reqData = ['email', 'password', 'name'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    database.registerUser(clientInfo, defs.profileType.STUDENT, function (retObj) {

        if (retObj.message == defs.returnMessage.SUCCESS) {
            console.log('Client %s <%s> registered successfully', clientInfo.address, clientInfo.email);
        }
        else {
            console.log('Client %s <%s> failed to register: %s', clientInfo.address, clientInfo.email, retObj.message);
        }

        cb(retObj);
    })
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
