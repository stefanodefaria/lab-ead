/**
 * Created by stefano on 27/04/15.
 */
var session = require('./../sessionManager');


var reqData = ['email', 'token'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    retObj.message = session.logout(clientInfo);

    cb(retObj);
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
