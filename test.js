var logger = require('./testLogger').createLog('arduinoResponse'),
    serialDevice = require('./serialDevice');

var arduinoID = 'usb-Arduino__www.arduino.cc__0043_952333532313512101D1-if00',
    callsCount = 0, totalCalls = 100,
    arduino;

function callArduino(){
    if(callsCount < totalCalls){
        callsCount++;
        var start = Date.now();

        arduino.deviceIsAvailable(function(){
            logger.log((Date.now() - start).toString() + '\n'); // Coleta tempo de resposta
            callArduino(arduino);
        });
    }
    else{ console.log("Teste finalizado"); }
}

serialDevice.startDevice(arduinoID, {}, function(_, device){
    console.log("Arduino inicializado. Iniciando teste...");
    arduino = device;
    arduino.deviceIsAvailable(callArduino);
});