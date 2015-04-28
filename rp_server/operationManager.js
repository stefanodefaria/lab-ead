/**
 * Created by stefano on 27/04/15.
 */

// TODO
// generate opsList dynamically
const opsList = [
    'login',
    'logout',
    'register',
    'updateInfo',
    'testOp'
];

//fields: {execute: function, reqData: array of keys, resData: empty retObj}
var operations = [];

initialize();

function initialize() {

    for (var i = 0; i < opsList.length; i++) {
        var key = opsList[i];
        var mdl = require('./operations/' + key);
        operations[key] = {execute: mdl.execute, reqData: mdl.reqData, resData: mdl.resData};
    }
}

function processRequest(path, clientInfo, cb) {
    operations[path].execute(clientInfo, cb);
}


module.exports.operations = operations;
module.exports.processRequest = processRequest;