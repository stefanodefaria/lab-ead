/**
 * Created by stefano on 17/08/15.
 */
var serialModule = require("serialport");

const messageByte = {
    AVAILABLE: '0',
    BUSY: '1',
    END: '2',
    START: '3',
    REQUEST_STATUS: '4',
    RESET: '5',
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
            serialPort.write(messageByte.REQUEST_STATUS, function(err){
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
    var curCallback,
        finishCallback;

    serialPort.on('data', function (data){
        var msg = String.fromCharCode(data.readInt8(0));

        if(msg === messageByte.END && finishCallback){
            return finishCallback(null, msg);
        }
        curCallback(null, msg);
    });

    function writeToDevice(msgByte, cb){
        curCallback = cb;
        serialPort.write(msgByte, function(err){
            if(err){
                return cb(err);
            }
        });
    }

    return{
        requestStatus: function(cb){
            writeToDevice(messageByte.REQUEST_STATUS, cb);
        },
        start: function(resCB, finishCB){
            finishCallback = finishCB;
            writeToDevice(messageByte.START, resCB);
        },
        reset: function(cb){
            finishCallback = null;
            writeToDevice(messageByte.RESET, cb);
        },
        getSerialPort: function(){
            return serialPort;
        }
    }
}

function translateMessageByte(msgByte){
    for(var key in messageByte){
        if(messageByte.hasOwnProperty(key) && messageByte[key] === String.fromCharCode(msgByte)){
            return key;
        }
    }
}

module.exports.startDevice = startDevice;
module.exports.messageByte = messageByte;
module.exports.translateMessageByte = translateMessageByte;

/**
 * SOMENTE PARA TESTES
 */
// function test(){
//   var arduinoID = 'usb-Arduino__www.arduino.cc__0043_85231363236351D0A131-if00';
//
//   startDevice(arduinoID, 5000, function(err, device){
//     if(err)
//       console.error(err.stack);
//
//     device.requestStatus(function(err, msg){
//       if(msg===messageByte.AVAILABLE){
//         device.start(function(err, msg){
//           console.log("start "+ msg)
//         }, function(err, msg){
//           console.log("end " + msg);
//         })
//       }
//     })
//   });
// }
//
// test();