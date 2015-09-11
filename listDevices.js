var serialModule = require('serialport');

serialModule.list(function (err, ports) {

    if(err || !ports){
        console.warn('No devices found');
        return;
    }

    for(var i=0; i<ports.length; i++){
        console.log('------------------------- DEVICE ' + i +' -----------------------------');
        for(var key in ports[i]){
            console.log(key + ': ' + ports[i][key])
        }
        console.log('----------------------------------------------------------------');
    }
});