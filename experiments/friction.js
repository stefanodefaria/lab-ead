var defs = require("../definitions"),
    serialDevice = require('../serialDevice'),
    utils = require('../utils');

var expName = "Cálculo do Atrito";
var expInfo = require('fs').readFileSync('./res/friction.txt', 'utf8').toString();
var expReportInfo = [
    {fieldName:"Qtd piscadas:", hint:"LED amarelo"},
    {fieldName:"Tempo de uma piscada:", hint:"LED amarelo"},
    {fieldName:"Qtd piscadas:", hint:"LED vermelho"},
    {fieldName:"Tempo de uma piscada:", hint:"LED vermelho"}
];

var deviceID = 'usb-Arduino__www.arduino.cc__0043_85231363236351D0A131-if00';
var device;

initalizeDevice();

function execute(cb){

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
                checkAvailabilityAndStart();
            });
            break;

        case defs.deviceStatus.UNSTARTED:
            checkAvailabilityAndStart();
            break;

        default:
            var errorUnkownState = new Error('Device state could not be determined');
            errorUnkownState.type = 'SerialDeviceError';
            cb(errorUnkownState);
    }

    function checkAvailabilityAndStart(){
        device.deviceIsAvailable(function(err2, available){
            if(err2){
                return cb(err2);
            }

            if(!available){
                return cb(null, defs.returnMessage.DEVICE_BUSY);
            }

            device.start(function(err3, msg){
                if(err3){
                    return cb(err3);
                }

                return cb(null, msg);
            });
        })
    }

}

function initalizeDevice(){
    serialDevice.startDevice(deviceID, 5000, function(err, dev){
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

function reset(cb){
    device.reset(cb);
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.execute = execute;
module.exports.getStatus = getStatus;
module.exports.reset = reset;


/*
 * SOMENTE PARA TESTES
 */

//setTimeout(function () {
//    console.log('before executing: ', getStatus());
//    execute(function(err, msg){
//        console.log('execution: ', msg);
//        execute(console.log);
//        setTimeout(function(){console.log('during execution: ', getStatus())}, 5000);
//        setTimeout(function(){
//            console.log('after execution: ', getStatus());
//
//            reset(function(err, msg){
//                console.log('reset: ', msg);
//                console.log('after reset> ', getStatus());
//
//                execute(function(err, msg){
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
