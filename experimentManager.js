/**
 * Created by stefano on 19/05/15.
 */
var defs = require("./definitions");
var utils = require("./utils");

const expIndex = [
    "gravity",
    "friction"
];

var experiments = [];

initialize();

function initialize() {

    for (var i = 0; i < expIndex.length; i++) {
        var key = expIndex[i];
        var mdl = require('./experiments/' + key);
        experiments[key] = {execute: mdl.execute, expName: mdl.expName,
            expInfo: mdl.expInfo, expReportInfo: mdl.expReportInfo};
    }
}

function experimentIsAvailable(key, cb){
    if(experiments[key]!== undefined){
        return cb(defs.returnMessage.SUCCESS);
    }
    return cb(defs.returnMessage.BAD_DATA);
}

function startExperiment(key, cb) {

    experimentIsAvailable(key, function(msg){
        if (msg !== defs.returnMessage.SUCCESS){
            return cb(defs.returnMessage.BAD_DATA);
        }
        else{
            experiments[key].execute(function(err, msg2){
                if(err){
                    utils.catchErr(err);
                    return cb(defs.returnMessage.SERVER_ERROR)
                }
                return cb(msg2);
            });
        }
    });
}

function getCompleteExpInfo(key){
    return {
        expName: experiments[key].expName,
        expInfo: experiments[key].expInfo,
        expReportInfo: experiments[key].expReportInfo
    };
}

function getExpList(){
    var expNames = [];
    var expKeys = [];

    for (var i = 0; i < expIndex.length; i++) {
        var key = expIndex[i];
        expNames.push(experiments[key].expName);
        expKeys.push(expIndex[i]);
    }

    return [expKeys, expNames];
}

module.exports.startExperiment = startExperiment;
module.exports.getCompleteExpInfo = getCompleteExpInfo;
module.exports.getExpList = getExpList;
module.exports.experimentIsAvailable = experimentIsAvailable;