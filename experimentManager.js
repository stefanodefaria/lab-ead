/**
 * Created by stefano on 19/05/15.
 */
var defs = require("./definitions");
var utils = require("./utils");

const expIndex = [
    "gravity",
    "arduino"
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

        var recorder = experiments[key].getRecorder();
        if(recorder){

            availability.available = availability.available && recorder.getStatus().finished;
            if(!recorder.getStatus().finished){
                availability.message = defs.deviceStatus.IN_PROGRESS;
            }
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
    else if(!availability.available){ //unknown state / uninitialized
        return cb(defs.returnMessage.SERVER_ERROR);
    }
    else if(availability.message === defs.deviceStatus.FINISHED){ //resets starts exp
        exp.reset(function(err){
            if(err){
                utils.catchErr(err);
                return cb(defs.returnMessage.SERVER_ERROR);
            }

            exp.execute(email, executionCallback);
            exp.user = email; //sets exp user
        })
    }
    else if(availability.message === defs.deviceStatus.UNSTARTED){ //starts exp
        exp.execute(email, executionCallback);
        exp.user = email; //sets exp user
    }


    function executionCallback(err){
        if(err){
            utils.catchErr(err);
            exp.user = null; //resets exp user
            return cb(defs.returnMessage.SERVER_ERROR);
        }

        return cb(defs.returnMessage.SUCCESS)
    }
}

/**
 * @param key - experiment key (gravity, friction, etc...)
 * @param snapshotCount - image index for 'fake streaming'
 * @param cb (message, snapshotCount, base64File)
 *                 snapshotCount>0 and base64File not null: display given image and query again
 *                 snapshotCount>0 and base64File null:     display previous downloaded image and query again
 *                 snapshotCount=-1:                        display video and query again
 */
function getExpStatus(email, key, snapshotCount, cb){

    var availability = expAvailability(key),
        exp = experiments[key],
        recorder = exp.getRecorder();

    if(!experiments[key] || experiments[key].user != email){
        return cb(null, defs.returnMessage.BAD_DATA);
    }

    if(availability.message === defs.returnMessage.BAD_DATA || availability.message === defs.deviceStatus.UNKNOWN){ //bad exp key
        return cb(null, defs.returnMessage.BAD_DATA);
    }
            //finished executing and recording experiment
    else if(availability.message === defs.deviceStatus.FINISHED && recorder.getStatus().finished === true){
        process.nextTick(function(){
            recorder.flushSnapshots();
        });
        recorder.getVideo(function(err, data){
            if(!data){
                if(err){
                    utils.catchErr(err);
                }

                exp.user = null; //resets exp user
                return cb(defs.returnMessage.SERVER_ERROR);
            }

            var base64EncodedData = data.toString('base64');

            return cb(defs.returnMessage.SUCCESS, -1, base64EncodedData);
        });
    }
            //still executing or recording experiment
    else if(availability.message === defs.deviceStatus.IN_PROGRESS || recorder.getStatus().finished === false){

        recorder.getNextSnapshot(snapshotCount, function(err, data){
            if(err){
                utils.catchErr(err);
                return cb(defs.returnMessage.SERVER_ERROR);
            }

            if(data){ //new snapshot is available, snapshotCount updated
                var base64EncodedData = data.toString('base64');

                return cb(defs.returnMessage.SUCCESS, snapshotCount +1, base64EncodedData);
            }
            else{ //new snapshot not yet captured.
                return cb(defs.returnMessage.SUCCESS, snapshotCount);
            }
        });

    }
    else if(!availability.available || (availability.available && !recorder)){ //unknown state / uninitialized  / recorder missing
        return cb(defs.returnMessage.SERVER_ERROR);
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
module.exports.getExpStatus = getExpStatus;

/*
 SOMENTE PARA TESTES
 */

//setTimeout(function () {
//    startExperiment('test@test.com', 'friction', function(){});
//}, 2000);
//
//setTimeout(function(){
//    getExpStatus('friction', 1, function(msg, count, encodedFile){
//        console.log('msg: ' + msg)
//        console.log('idx: ' + count)
//        console.log('file: ' + encodedFile)
//    })
//}, 5000)
//
//setTimeout(function(){
//    getExpStatus('friction', 1, function(msg, count, encodedFile){
//        console.log('msg: ' + msg)
//        console.log('count: ' + count)
//        //console.log('file: ' + encodedFile)
//    })
//}, 12000)