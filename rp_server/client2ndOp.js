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
    token: 'bba91f9a-664e-40d2-a936-01e17b7911ba'
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