/**
 * Created by Stéfano on 03/04/2015.
 */

var utils = require('./utils');
var session = require('./sessionManager');

function login(req, res){
    //gets client IP address (3rd position after string split)

    var address = utils.clientAddress(req);

    console.log('Client %s attempt to connect', address);

    var req_data = '';

    req.on('data', function(data){
        req_data+=data.toString();
    });

    req.on('end', function(){
        parseError = true;

        try
        {
            var obj = JSON.parse(req_data);
            if (obj.email === undefined || obj.password === undefined)
            {
               throw {message: "Parse Error: no 'email' or 'password' property"}
            }
            parseError = false;

            var ret = session.authenticateClient(obj.email, obj.password, null);

            if(ret.code === session.returnCode.SUCCESS)
            {
                res.end(JSON.stringify({message: "Login successful", token: ret.clientToken, connectionTimeOut: session.connectionTimeOut}));
                console.log('Client %s connected successfully', address);
            }
            if(ret.code === session.returnCode.BAD_CREDENTIALS)
            {
                res.end(JSON.stringify({message: "Error: Bad credentials"}));
                console.log('Client %s failed to connect (Bad credentials)', address);
            }
        }
        catch (err)
        {
            if(parseError) //Catches JSON.parse() error
            {
                res.end(JSON.stringify({message: "Bad data"}));
                console.log('Client %s failed to connect (Bad data)', address);
            }
            else
            {
                console.log(err.message);
                res.end(JSON.stringify({message: "Internal server error"}));
                console.log('Client %s failed to connect (Internal server error)', address);
            }
        }
    });
}

module.exports = login;