/**
 * Created by Stéfano on 03/04/2015.
 */

/**
 * SOMENTE PARA EFEITOS DE TESTE
 */

var http = require('http');

//-------------------------
//   LOGIN SETUP
//-------------------------
var login_data = JSON.stringify({
   email: 'user1@test.com',
   password: '12345'
});

var login_options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    path: '/login'
};

//-------------------------
//   HTTP REQUEST
//-------------------------
var req = http.request(login_options, function(res) {

    var message = '';

    res.on("data", function(chunk) {
        message+=chunk.toString();
    });

    res.on('end', function(){
       console.log('message: '+message)
    });
});

req.on('error', function(e) {
    console.log("Got error: " + e.message);
});

req.write(login_data);
req.end();