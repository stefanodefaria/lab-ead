var defs = require("../definitions"),
    serialDevice = require('../serialDevice');

var expName = "Cálculo do Atrito";
var expInfo = require('fs').readFileSync('./res/friction.txt', 'utf8').toString();
var expReportInfo = [
    {fieldName:"Qtd piscadas:", hint:"LED amarelo"},
    {fieldName:"Tempo de uma piscada:", hint:"LED amarelo"},
    {fieldName:"Qtd piscadas:", hint:"LED vermelho"},
    {fieldName:"Tempo de uma piscada:", hint:"LED vermelho"}
];

var deviceInfo = {
    serialID: 'usb-Arduino__www.arduino.cc__0043_85231363236351D0A131-if00',
    pollingCycle: 500,      //ms
    firstPoll: 8000,        //ms
    pollingTimeout: 12000   //ms
};

var device;

function execute(cb){

    function startCallback(err){
        if(err){
            return cb(err);
        }
        device.expStatus = defs.deviceStatus.IN_PROGRESS
    }

    function endCallback(err){
        if(err){
            return cb(err);
        }
        device.expStatus = defs.deviceStatus.FINISHED;

        //CLEARS DEVICE OBJECT after pollingTimeout milliseconds
        setTimeout(function(){
            device = null;
        }, deviceInfo.pollingTimeout);
    }

    serialDevice.startDevice(deviceInfo.serialID, 5000, function(err, dev){
        if(err){
            return cb(err);
        }

        device = dev;

        device.expStatus = defs.deviceStatus.UNSTARTED;

        // checks if device is available
        device.requestStatus(function(err, msg){
            if(msg===serialDevice.messageByte.AVAILABLE){
                device.start(startCallback, endCallback);
                cb(null, defs.returnMessage.SUCCESS);
            }
            else{
                cb(null, defs.returnMessage.DEVICE_BUSY);
            }
        })
    });
}

function pollStatus(cb){

    if(!device){
        return cb(defs.deviceStatus.UNSTARTED);
    }

    device.requestStatus(function(err, msg){

        if(err){
            return cb(err);
        }

        else if(msg === serialDevice.messageByte.AVAILABLE){
            if(device.expStatus === defs.deviceStatus.FINISHED){
                device = null; //CLEARS DEVICE OBJECT
                return cb(null, defs.deviceStatus.FINISHED);
            }
            if(device.expStatus === defs.deviceStatus.UNSTARTED){
                return cb(null, defs.deviceStatus.UNSTARTED);
            }
        }

        else if(msg === serialDevice.messageByte.BUSY){
            if(device.expStatus === defs.deviceStatus.IN_PROGRESS){
                return cb(null, defs.deviceStatus.IN_PROGRESS);
            }
        }

        else{
            return cb(defs.deviceStatus.UNKNOWN);
        }
    });
}


module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.execute = execute;