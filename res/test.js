/**
 * Created by stefano on 22/05/15.
 */
var child_process = require('child_process');
var fs = require('fs');

var child = child_process.spawn('python', ['rasp_arduino.py', '-write', '1']);//,['rasp_arduino.py']);
var ended = false;

child.stdout.on('data', function(data){
    console.log(data.toString());
});

child.stdout.on('end', function(){
    console.log("child terminous")
    ended = true;
});

setTimeout(function() {
        var child = child_process.spawn('python', ['rasp_arduino.py', '-write', '2']);//,['rasp_arduino.py']);
        var ended = false;

        child.stdout.on('data', function(data){
            console.log(data.toString());
        });

        child.stdout.on('end', function(){
            console.log("child terminous")
            ended = true;
        });
    },
    2000);
