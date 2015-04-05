/**
 * Created by Stéfano on 05/04/2015.
 */
/**
 * SOMENTE PARA EFEITOS DE TESTE
 */

var http = require('http');

//-------------------------
//   TEST SETUP
//-------------------------
var test_options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    path: '/testOp'
};

var testData = JSON.stringify({
    email: 'user1@test.com',
    token: '7c00504b-edff-47e8-8f6c-d00f6e9ce769'
});

var req = http.request(test_options, function (res) {
    var message = '';

    res.on("data", function (chunk) {
        message += chunk.toString();
    });

    res.on('end', function () {
        console.log(message);
    });

});

req.on('error', function(e) {
    console.log("Got error: " + e.message);
});

req.write(testData);
req.end();