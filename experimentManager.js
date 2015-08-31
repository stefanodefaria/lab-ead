/**
 * Created by stefano on 19/05/15.
 */
var defs = require("./definitions");
var utils = require("./utils");
var expRecorder = require("./expRecorder");

const startRecordingDelay = 500; //milliseconds - delay between start recording and start exp execution

const expIndex = [
    "gravity",
    "friction"
];

var experiments = [];

initialize();

function initialize() {

    for (var i = 0; i < expIndex.length; i++) {
        var key = expIndex[i];
        experiments[key] = require('./experiments/' + key);
    }
}

/**
 * @param key - exp Key (friction, gravity)
 * @returns {{available: boolean, message: string}}
 */
function expAvailability(key){
    var availability = {available: false, message: ''};

    if(experiments[key]=== undefined){
        availability.message = defs.returnMessage.BAD_DATA;
    }
    else{

        availability.message = experiments[key].getStatus();

        if(availability.message === defs.deviceStatus.UNSTARTED || availability.message === defs.deviceStatus.FINISHED){
            availability.available = true;
        }
    }

    return availability;
}

function startExperiment(email, key, cb) {

    var availability = expAvailability(key),
        exp = experiments[key];

    if(!availability.available && availability.message === defs.deviceStatus.IN_PROGRESS){ //device busy
        return cb(defs.returnMessage.DEVICE_BUSY);
    }
    else if(!availability.available && availability.message === defs.returnMessage.BAD_DATA){ //bad exp key
        return cb(defs.returnMessage.BAD_DATA);
    }
    else if(!availability){ //unknown state / uninitialized
        return cb(defs.returnMessage.SERVER_ERROR);
    }
    else if(availability.message === defs.deviceStatus.FINISHED){
        exp.reset(function(err){
            if(err){
                utils.catchErr(err);
                return cb(defs.returnMessage.SERVER_ERROR);
            }

            startExpAndRecord();
        })
    }
    else if(availability.message === defs.deviceStatus.UNSTARTED){
        startExpAndRecord();
    }

    function startExpAndRecord(){
        var recOpts = {
            path: email + '_' + key,
            cameraPath: exp.cameraPath,
            fps: 30,
            bitRate: 1000,
            snapshotFrequency: 3
        };

        var recorder = expRecorder(recOpts);

        recorder.onEnd(function(){
            try{
                recorder.flushSnapshots();
            }
            catch(err){
                utils.catchErr(err);
            }
        });

        recorder.startRecording(function(err){
            if(err){
                utils.catchErr(err);
                return cb(defs.returnMessage.SERVER_ERROR);
            }

            exp.onEnd(function(){
                recorder.stopRecording();
            });

            setTimeout(function(){ //starts exp after some delay after starting recording
                exp.execute(function(err2){
                    if(err){
                        utils.catchErr(err2);
                        return cb(defs.returnMessage.SERVER_ERROR);
                    }

                    return cb(defs.returnMessage.SUCCESS);
                });
            }, startRecordingDelay);
        });
    }
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
module.exports.experimentIsAvailable = expAvailability;

/*
 SOMENTE PARA TESTES
 */

//setTimeout(function () {
//    startExperiment('test@test', 'friction', console.log);
//}, 2000);