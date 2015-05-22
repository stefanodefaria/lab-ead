/**
 * Created by stefano on 22/05/15.
 */
var child_process = require('child_process');

child_process.spawn('python', ['rasp_arduino.py', '-write', '1']);

setTimeout(function() {

    child_process.spawn('python', ['rasp_arduino.py', '-write', '2']);

    setTimeout(function() {
        child_process.spawn('python', ['rasp_arduino.py', '-write', '3']);
    }, 2000);

}, 2000);
