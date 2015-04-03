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
            parseError = false;

            var ret = session.authenticateClient(obj.email, obj.password, null);

            if(ret.code === session.returnCode.SUCCESS)
            {
                res.end(JSON.stringify({message: "Login successful", token: ret.clientToken, connectionTimeOut: session.connectionTimeOut}));
            }
            if(ret.code === session.returnCode.BAD_CREDENTIALS)
            {
                res.end(JSON.stringify({message: "Error: Bad credentials"}));
            }
        }
        catch (err)
        {
            if(parseError) //Catches JSON.parse() error
            {
                res.end(JSON.stringify({message: "Bad data"}));
            }
            else
            {
                res.end(JSON.stringify({message: "Internal server error"}));
            }
            console.log(err.message);
        }
    });
}

module.exports = login;