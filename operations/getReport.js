/**
 * Created by Cinthya on 19/08/2015.
 */

var session = require('./../sessionManager');
var defs = require('./../definitions');


var reqData = ['email', 'token'];
var resData = {message: ''};

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;