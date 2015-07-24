/**
 * Created by St�fano on 03/04/2015.
 */

/**
 * SOMENTE PARA EFEITOS DE TESTE
 */

var http = require('http');
var async = require('async');


var globalToken;
var globalExpIDsArray;
var globalExpNamesArray;
var globalSelectedExpID;

var operations = [login, getExpList, startExp, sendReport];

async.series(operations,  function(){
    console.log("All operations are finished.");
});


/**
 * HTTP REQUEST
 */
function httpRequest(req_options, req_data, callback){
    var req = http.request(req_options, function(res) {

        var message = '';

        res.on("data", function(chunk) {
            message+=chunk.toString();
        });

        res.on('end', function(){
            callback(JSON.parse(message));
        });
    });

    req.on('error', function(e) {
        console.log("Got error: " + e.message);
    });

    req.write(req_data);
    req.end();
}


/**
 * Operations functions
 */
function login(cb){
    var login_options = {
        host: 'localhost',
        port: 8080,
        method: 'POST',
        path: '/login'
    };
    var login_data = JSON.stringify({
        email: 'student1@test.com',
        password: '12345'
    });

    console.log("Login...");
    httpRequest(login_options, login_data, function(msg){
        console.log(msg);
        globalToken = msg.token;
        cb();
    });
}

function register(cb){
    var register_options = {
        host: 'localhost',
        port: 8080,
        method: 'POST',
        path: '/register'
    };
    var register_data = JSON.stringify({
        email: 'student9@test.com',
        password: '12345',
        name: 'Student 4'
    });

    console.log("Register...");
    httpRequest(register_options, register_data, function(msg){
        console.log(msg);
        cb();
    });


}

function getExpList(cb){
    var getExpList_options = {
        host: 'localhost',
        port: 8080,
        method: 'POST',
        path: '/getExpList'
    };
    var getExpList_data = JSON.stringify({
        email: 'student1@test.com',
        token: globalToken
    });
    console.log("Get Experiments List...");
    httpRequest(getExpList_options, getExpList_data, function(msg){
        console.log(msg);
        globalExpIDsArray = msg.experiencesKeys;
        globalExpNamesArray = msg.experiencesNames;
        globalSelectedExpID = globalExpIDsArray[0];
        cb();
    });
}

function startExp(cb){
    var startExp_options = {
        host: 'localhost',
        port: 8080,
        method: 'POST',
        path: '/startExp'
    };
    var startExp_data = JSON.stringify({
        email: 'student1@test.com',
        token: globalToken,
        expID: globalSelectedExpID
    });

    console.log("Starting exp...");
    httpRequest(startExp_options, startExp_data, function(msg){
        console.log(msg);
        globalExpIDsArray = msg.experiencesKeys;
        globalExpNamesArray = msg.experiencesNames;
        cb();
    });
}

function sendReport(cb){
    var sendReport_options = {
        host: 'localhost',
        port: 8080,
        method: 'POST',
        path: '/sendReport'
    };
    var sendReport_data = JSON.stringify({
        email: 'student1@test.com',
        token: globalToken,
        expID: 'gravity',
        report: [
            {fieldName:"Tempo 1", value:"1"},
            {fieldName:"Distância 1", value:"2"},
            {fieldName:"Tempo 2", value:"3"},
            {fieldName:"Distância 2", value:"4"},
            {fieldName:"Tempo 3", value:"5"},
            {fieldName:"Distância 3", value:"6"},
            {fieldName:"Tempo 4", value:"7"},
            {fieldName:"Distância 4", value:"8"}
        ]
    });

    console.log("Sending report...");
    httpRequest(sendReport_options, sendReport_data, function(msg){
        console.log(msg);
        cb();
    });
}