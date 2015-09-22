var defs = require("../definitions"),
    serialDevice = require('../serialDevice'),
    utils = require('../utils'),
    expRecorder = require("../expRecorder");

var expName = "Cálculo do Atrito";
var expInfo = require('fs').readFileSync('./res/friction.txt', 'utf8').toString();
var expReportInfo = [
    {fieldName:"Qtd piscadas:", hint:"LED amarelo"},
    {fieldName:"Tempo total piscando:", hint:"LED amarelo"},
    {fieldName:"Qtd piscadas:", hint:"LED vermelho"},
    {fieldName:"Tempo total piscando:", hint:"LED vermelho"}
];

const deviceID = utils.getOSType()=== defs.osType.LINUX ?
        'usb-Arduino__www.arduino.cc__0043_85231363236351D0A131-if00': 'USB\\VID_2341&PID_0043\\85231363236351D0A131',
    startRecordingDelay = 500; //milliseconds - delay between start recording and start exp execution

const recOpts = {
    path: '',
    cameraPath: utils.getOSType()=== defs.osType.LINUX ? '/dev/video0' : 'video=Integrated Webcam',
    fps: 30,
    bitRate: 1000,
    size: '800x480',
    recTime: null,
    snapshotFrequency: 3
};

var device,
    recorder = null;

initalizeDevice();

/**
 * @param email
 * @param cb(err, recorder)
 */
function execute(email, cb){

    recOpts.path = email + '_' + 'friction';

    var deviceStatus = getStatus();

    switch(deviceStatus){
        case defs.deviceStatus.UNINITIALIZED:
            return cb(new Error("Device " + deviceID + " has not been initialized"));
            break;

        case defs.deviceStatus.IN_PROGRESS:
            var errorBusy = new Error(defs.returnMessage.DEVICE_BUSY);
            errorBusy.type = 'SerialDeviceBusy';
            return cb(errorBusy);
            break;

        case defs.deviceStatus.FINISHED:
            reset(function(err){
                if(err){
                    return cb(err);
                }
                checkAvailabilityAndStart(cb);
            });
            break;

        case defs.deviceStatus.UNSTARTED:
            checkAvailabilityAndStart(cb);
            break;

        default:
            var errorUnkownState = new Error('Device state could not be determined');
            errorUnkownState.type = 'SerialDeviceError';
            return cb(errorUnkownState);
    }
}

/**
 * @param cb(err, recorder)
 */
function checkAvailabilityAndStart(cb){
    device.deviceIsAvailable(function(err, available){
        if(err){
            return cb(err);
        }

        if(!available){
            var errorBusy = new Error(defs.returnMessage.DEVICE_BUSY);
            errorBusy.type = 'SerialDeviceBusy';
            return cb(errorBusy);
        }

        //attaches a recorder to exp object
        recorder = expRecorder(recOpts);

        device.onEnd(function(){ //stops recording when experiment is finished
            recorder.stopRecording();
        });

        recorder.onEnd(function(){ //clears snapshot directory when recording is finished
            try{
                recorder.flushSnapshots();
            }
            catch(err){
                utils.catchErr(err);
            }
        });

        recorder.startRecording(function(err2){ //starts recording before experiment started
            if(err2){
                utils.catchErr(err2);
                return cb(defs.returnMessage.SERVER_ERROR);
            }

            setTimeout(function(){ //starts exp after some delay after starting recording

                device.start(function(err3){
                    if(err3){
                        return cb(err3);
                    }

                    return cb();
                });

            }, startRecordingDelay);
        });
    });
}


function initalizeDevice(){
    serialDevice.startDevice(deviceID, {}, function(err, dev){ //starts device using default options
        if(err){
            utils.catchErr(err);
            return;
        }

        console.log("Device " + deviceID + " has been successfully initialized");
        device = dev;
    });
}


function getStatus(){
    if(!device){
        return defs.deviceStatus.UNINITIALIZED;
    }

    return device.getStatus();
}

function getRecorder(){
    return recorder;
}

/**
 * @param cb(err)
 */
function reset(cb){
    device.reset(cb);
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.getRecorder = getRecorder;
module.exports.execute = execute;
module.exports.getStatus = getStatus;
module.exports.reset = reset;


/*
 * SOMENTE PARA TESTES
 */

//setTimeout(function () {
//    console.log('before executing: ', getStatus());
//    execute("test@test.com", function(err, msg){
//        console.log('execution: ', msg);
//        execute("test@test.com", console.log);
//        setTimeout(function(){console.log('during execution: ', getStatus())}, 5000);
//        setTimeout(function(){
//            console.log('after execution: ', getStatus());
//
//            reset(function(err, msg){
//                console.log('reset: ', msg);
//                console.log('after reset> ', getStatus());
//
//                execute("test@test.com", function(err, msg){
//                    console.log('execution: ', msg);
//                    setTimeout(function(){console.log('during execution: ', getStatus())}, 5000);
//
//                    setTimeout(function(){
//                        console.log('after execution: ', getStatus());
//                        reset(console.log)}, 10000)
//                });
//            });
//        }, 10000);
//    });
//}, 4000);
