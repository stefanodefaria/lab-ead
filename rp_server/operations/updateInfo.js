/**
 * Created by stefano on 27/04/15.
 */

var reqData = ['email', 'token', 'newEmail', 'newPassword', 'newName'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    session.login(clientInfo, function (retObj) {

        if (retObj.message == defs.returnMessage.SUCCESS) {
            console.log('Client %s <%s> logged in successfully', clientInfo.address, clientInfo.email);
        }
        else {
            console.log('Client %s <%s> failed to login: %s', clientInfo.address, clientInfo.email, retObj.message);
        }

        cb(JSON.stringify(retObj));
    });
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
