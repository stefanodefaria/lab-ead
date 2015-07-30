/**
 * Created by stefano on 27/04/15.
 */

var database = require('./../database');
var defs = require('./../definitions');

var reqData = ['email', 'password', 'name'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    var hashedPassword = crypto.createHash('sha1').update(clientInfo.password).digest('hex');
    database.registerUser(clientInfo.email, hashedPassword, clientInfo.name, defs.profileType.STUDENT, function (retMsg) {

        if (retMsg == defs.returnMessage.SUCCESS) {
            console.log('Client %s <%s> registered successfully', clientInfo.address, clientInfo.email);
        }
        else {
            console.log('Client %s <%s> failed to register: %s', clientInfo.address, clientInfo.email, retObj.message);
        }
        retObj.message = retMsg;
        cb(retObj);
    })
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
