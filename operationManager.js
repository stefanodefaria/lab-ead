/**
 * Created by stefano on 27/04/15.
 */


const opsIndex = [
    'login',
    'logout',
    'register',
    'updateInfo',
    'testOp',
    'logout',
    'getExpList'
];

//fields: {execute: function, reqData: array of keys, resData: empty retObj}
var operations = [];

initialize();

function initialize() {

    for (var i = 0; i < opsIndex.length; i++) {
        var key = opsIndex[i];
        var mdl = require('./operations/' + key);
        operations[key] = {execute: mdl.execute, reqData: mdl.reqData, resData: mdl.resData};
    }
}

function processRequest(path, clientInfo, cb) {

    process.nextTick(function(){
        operations[path].execute(clientInfo, cb);
    });
}


module.exports.operations = operations;
module.exports.processRequest = processRequest;
