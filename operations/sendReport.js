/**
 * Created by stefano on 24/07/15.
 */
var session = require('./../sessionManager');
var defs = require('./../definitions');
var expMng = require('./../experimentManager');
var db = require('./../database');
var util = require('./../utils');

var reqData = ['email', 'token', 'expID', 'report'];
var resData = {message: ''};

function execute(clientInfo, cb) {
    var retObj = {};
    var authMsg = session.authenticateClient(clientInfo);

    if (authMsg === defs.returnMessage.SUCCESS) {
        if(validateReport(clientInfo.expID, clientInfo.report)){

            db.insertReport(clientInfo.email, clientInfo.expID, clientInfo.report, function(msg){
                retObj.message = msg;
                if(msg === defs.returnMessage.SUCCESS) {
                    console.log('Client %s <%s> performed sendReport successfully', clientInfo.address, clientInfo.email);
                }
                else {
                    console.log('Client %s <%s> failed to perform sendReport', clientInfo.address, clientInfo.email);
                }
                return cb(retObj);
            });
        }
        else {
            retObj.message = defs.returnMessage.BAD_DATA;
            console.log('Client %s <%s> failed to perform sendReport: %s', clientInfo.address, clientInfo.email, retObj.message);
            return cb(retObj);
        }
    }
    else {
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform sendReport: %s', clientInfo.address, clientInfo.email, retObj.message);
        return cb(retObj);
    }

}

function validateReport(expID, report){

    try{
        var reportInfo = expMng.getCompleteExpInfo(expID).expReportInfo;

        if(!reportInfo) {
            return false;
        }

        var expFieldNames = [];
        var reportFieldNames = [];

        for(var i=0; i<reportInfo.length; i++){
            expFieldNames.push(report[i].fieldName);
        }
        for(i=0; i<report.length; i++){
            reportFieldNames.push(report[i].fieldName);
        }

        var intersection = expFieldNames.filter(function(n){ return reportFieldNames.indexOf(n) != -1; });

        if(intersection.length !== expFieldNames.length){ // caso report nao contem todos os campos que deveria ter
            return false;
        }

        for(i=0; i<report.length; i++){
            if(!report[i].value) { // caso algum campo 'value' seja null, ou undefined, ou string vazia
                return false;
            }
        }

        return true;
    }
    catch(err){
        return false;
    }
}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;
