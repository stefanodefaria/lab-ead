/**
 * Created by stefano on 17/08/15.
 */
var serialModule = require("serialport");
var defs = require('./definitions');

const commandByte = {
    START: '3',
    REQUEST_STATUS: '4',
    RESET: '5'
};

const returnByte = {
    AVAILABLE: '0',
    BUSY: '1',
    END: '2',
    SUCCESS: '6',
    UNKNOWN_COMMAND: '7'
};

/** Params:
 * deviceID: Unique device identification
 * opts: Options object defaults = {baudRate: 9600, initTimeoutMillis: 5000};
 */
function startDevice(deviceID, opts, cb){

    var defaultOpts = {
        baudRate: 9600,
        initTimeoutMillis: 5000
    };

    var baudRate = opts.baudRate || defaultOpts.baudRate,
        initTimeout = opts.initTimeoutMillis || defaultOpts.initTimeoutMillis,
        devicePort,
        serialPort;

    serialModule.list(function (err, ports) {

        if(err){
            return cb(err);
        }

        if(!ports){
            return cb(new Error('No devices found'));
        }

        devicePort = ports.filter(function(port){ return port.pnpId === deviceID; })[0];

        if(!devicePort){
            return cb(new Error('Device \'' + deviceID + '\' not found.'));
        }

        serialPort = new serialModule.SerialPort(devicePort.comName, { baudrate: baudRate}, false);
        serialPort.open(function(err){

            if(err){
                return cb(err);
            }

            waitForDevice(serialPort, initTimeout, function(success){
                if(!success){
                    cb(new Error("Failed to initialize device "+ deviceID));
                }
                return cb(null, deviceObj(serialPort));
            });
        });
    });
}

function waitForDevice(serialPort, initTimeout, cb){
    var count=0,
        stepTime = 50,
        intervalID;

    function intervalCallback(){
        if(count < initTimeout/stepTime){
            serialPort.write(commandByte.REQUEST_STATUS, function(err){
                if(err){
                    clearInterval(intervalID);
                    serialPort.removeListener('data', dataCallback);
                    return cb(false);
                }
            });
        }
        else{
            clearInterval(intervalID);
            return cb(false);
        }
        count++;
    }

    function dataCallback(){
        if(intervalID){
            clearInterval(intervalID);
        }
        serialPort.removeListener('data', dataCallback);
        return cb(true);
    }

    intervalID = setInterval(intervalCallback, stepTime);
    serialPort.on('data', dataCallback);
}

function deviceObj(serialPort) {
    var curCallback;
    var curState = defs.deviceStatus.UNSTARTED;

    serialPort.on('data', function (data){
        var msg = String.fromCharCode(data.readInt8(0));

        if(msg === returnByte.END){
            curState = defs.deviceStatus.FINISHED;
            return;
        }
        curCallback(null, msg);
    });

    function writeToDevice(msgByte, cb){
        curCallback = cb;
        serialPort.write(msgByte, function(err, msg){
            if(err){
                return cb(err);
            }
        });
    }

    return{
        deviceIsAvailable: function(cb){ //for checking if routine can be started

            writeToDevice(commandByte.REQUEST_STATUS, function(err, msg){
                if(err){
                    return cb(err);
                }

                if(msg === returnByte.AVAILABLE){
                    return cb(null, true);
                }
                else if(msg === returnByte.BUSY){
                    return cb(null, false);
                }
                else{
                    var error = new Error("Error checking serial device availability: unknown response");
                    error.type = 'SerialDeviceError';
                    cb(error);
                }
            });
        },
        start: function(cb){
            writeToDevice(commandByte.START, function(err){
                if(err){
                    return cb(err);
                }
                curState = defs.deviceStatus.IN_PROGRESS;
                cb(null, defs.returnMessage.SUCCESS);
            });
        },
        reset: function(cb){
            writeToDevice(commandByte.RESET, function(err){
                if(err){
                    return cb(err);
                }
                curState = defs.deviceStatus.UNSTARTED;
                cb(null, defs.returnMessage.SUCCESS);
            });
        },
        getStatus: function(){ //for checking if routine has started / ended
            return curState;
        },
        getSerialPort: function(){
            return serialPort;
        }
    }
}

//NOT USED ANYMORE
//function translateMessageByte(msgByte){
//    for(var key in returnByte){
//        if(returnByte.hasOwnProperty(key) && returnByte[key] === String.fromCharCode(msgByte)){
//            return key;
//        }
//    }
//}

module.exports.startDevice = startDevice;

/**
 * SOMENTE PARA TESTES
 */
 //function test(){
 //  var arduinoID = 'usb-Arduino__www.arduino.cc__0043_85231363236351D0A131-if00';
 //
 //  startDevice(arduinoID, 5000, function(err, device){
 //    if(err)
 //      console.error(err.stack);
 //
 //    device.deviceIsAvailable(function(err, available){
 //      if(available){
 //        device.start(function(err, msg){
 //          console.log("start "+ msg)
 //        }, function(err, msg){
 //          console.log("end " + msg);
 //        })
 //      }
 //    })
 //  });
 //}
 //
 //test();