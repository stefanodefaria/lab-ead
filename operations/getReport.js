/**
 * Created by Cinthya on 19/08/2015.
 */

var session = require('./../sessionManager');
var defs = require('./../definitions');
var database = require('./../database');
var utils = require('./../utils');

var reqData = ['email', 'token'];
var resData = {message: '', reports:''};

function execute(clientInfo, cb){
    var authMsg=session.authenticateClient(clientInfo);
    var retObj={};

    if(authMsg== defs.returnMessage.SUCCESS)
    {
        database.getReport(clientInfo.email,function(err,reports) {

            if (err) {
                utils.catchErr(err);
                retObj.message = defs.returnMessage.SERVER_ERROR;
                console.log('Client %s <%s> failed to perform getExpList: %s', clientInfo.address, clientInfo.email, retObj.message);
                return cb(retObj);
            }


            retObj.message = defs.returnMessage.SUCCESS;
            retObj.reports = reports;
            return cb(retObj);

        })
    }else{
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform getExpList: %s', clientInfo.address, clientInfo.email, retObj.message);
        return cb(retObj);
    }

}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;