/**
 * Created by stefano on 19/05/15.
 */
var defs = require("./definitions");

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

function experimentIsAvailable(key){
    return (experiments[key]!== undefined);
}

function startExperiment(key) {
    if (experimentIsAvailable(key)){
        return experiments[key].execute();
    }
    return defs.returnMessage.BAD_DATA;
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