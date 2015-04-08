/**
 * Created by Stéfano on 03/04/2015.
 */

/**
 * SOMENTE PARA EFEITOS DE TESTE
 */

var http = require('http');

/**
 * LOGIN SETUP
 */
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

/**
 * REGISTER SETUP
 */
var register_options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    path: '/register'
};
var register_data = JSON.stringify({
    email: 'registration@test.com',
    password: '12345',
    name: 'Student One'
});

/**
 * TEST OPERATION SETUP
 */
var test_options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    path: '/testOp'
};

var test_data = JSON.stringify({
    email: 'student1@test.com',
    token: '73202950-8c99-428f-861d-9628d58e935c'
});

/**
 * HTTP REQUEST
 */
function httpRequest(req_options, req_data){
    var req = http.request(req_options, function(res) {

        var message = '';

        res.on("data", function(chunk) {
            message+=chunk.toString();
        });

        res.on('end', function(){
            console.log('message: '+ message);
        });
    });

    req.on('error', function(e) {
        console.log("Got error: " + e.message);
    });

    req.write(req_data);
    req.end();
}

httpRequest(login_options, login_data);
//httpRequest(test_options, test_data);
//httpRequest(register_options, register_data);