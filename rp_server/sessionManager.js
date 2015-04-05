/**
 * Created by Stéfano on 03/04/2015.
 */
var uuid = require('uuid');
var utils = require('./utils');
var db;

//Gets single ton DB instance
require('./database').getDBInstance(function(err, instance){

    if(err)
    {
        console.log(e.message)
    }
    db = instance
});

/**
 * RETURN CODES:
 * 1- Sucess: Validation successful
 * 2- Bad Credentials: Wrong email or password
 * 3- Session timed out: last request was more than 'connectionTimeOut' ago
 * 4- Bad token: User provided different token (probably another client trying to operate with someone else's email)
 * 5- Bad operation
 */
var returnMessage = {SUCCESS: 'SUCCESS', BAD_CREDENTIALS: 'BAD_CREDENTIALS', SESSION_TIMED_OUT: 'SESSION_TIMED_OUT',
    BAD_TOKEN: 'BAD_TOKEN', BAD_OPERATION: 'BAD_OPERATION', CLIENT_NOT_LOGGED_IN: 'CLIENT_NOT_LOGGED_IN',
    BAD_DATA: 'BAD_DATA', SERVER_ERROR: 'SERVER_ERROR'};

//this array keeps track of which users are online.
//it will store objects like:
//[clientToken: (uui token), lastConnectionTime: (date format)}
var onlineTable = [];

// 30 minutes connection timeout (in seconds)
var connectionTimeOut = 30*60;


//--------------------------------------------------------------------------------------------
// This function will validate client's properties.
// 1- If client is not logged in, it will validate 'email' and 'password'
// 2- If client has logged in, it will validate 'email' and 'token' with the OnlineTable array
// req_data -->object {login: TRUE/false, message: data received from client}
// User is online --> is in OnlineTable array
function authenticateClient(req_data, cb)
{
    //object that will be returned to callback
    var ret_obj;
    try
    {
        //var address = utils.clientAddress(req);
        var clientInfo;
        try
        {
            clientInfo = JSON.parse(req_data.message)
        }
        catch (err)
        {
            throw {type: 'JSON_PARSE', message: err.message};
        }

        //if client wants to log in
        if(req_data.login)
        {
            if (clientInfo.email === undefined || clientInfo.password === undefined)
            {
                throw {type:'JSON_PARSE', message: 'Error on parsing credentials'}
            }
            //assync DB validation
            validateCredentials(clientInfo.email, clientInfo.password, function(err, validated){
                if(err)
                {
                    cb(err);
                    return;
                }

                if(validated)
                {
                    //get current time
                    currentTime = utils.currentTimeInSeconds();

                    //creates uuid token
                    //this is used to verify client sessionMngr
                    clientToken = uuid.v4();

                    //inserts client into onlineTable
                    //TODO - Discuss about this:
                    //if same client connects again, overrides previous entry (only 1 device connected at a time)
                    onlineTable[clientInfo.email] = {clientToken: clientToken, lastConnectionTime: currentTime};

                    ret_obj = {message: returnMessage.SUCCESS , clientToken: clientToken};
                }
                else
                {
                    ret_obj = {message: returnMessage.BAD_CREDENTIALS};
                }
                cb(null, ret_obj);
                return; //exits function
            })

        }else if(onlineTable.indexOf(clientInfo.email) !== undefined) //checks if 'email' is in 'onlineTable' array (user has logged in)
        {
            clientEntry = onlineTable[clientInfo.email];

            //checks for valid token and timeout
            tokenIsValid = clientEntry.clientToken == clientInfo.token;
            timedOut = clientEntry.lastConnectionTime + connectionTimeOut < utils.currentTimeInSeconds();

            if(tokenIsValid && !timedOut )
            {
                onlineTable[clientInfo.email].lastConnectionTime = utils.currentTimeInSeconds();

                ret_obj = {message: returnMessage.SUCCESS};
            }
            else if (!tokenIsValid)
            {
                ret_obj = {message: returnMessage.BAD_TOKEN};
            }
            else if(timedOut)
            {
                ret_obj = {message: returnMessage.SESSION_TIMED_OUT};
            }
            cb(null,ret_obj);
        }
        else
        {
            ret_obj = {message: returnMessage.CLIENT_NOT_LOGGED_IN};
            cb(null,ret_obj);
        }
    }
    catch (err)
    {
        //TODO
        //add returnMessage.BAD_DATA
        //add returnMessage.SERVER_ERROR

        if(err.type && err.type ==='JSON_PARSE')
        {
            ret_obj = {message: returnMessage.BAD_DATA}
        }
        else
        {
            ret_obj = {message: returnMessage.SERVER_ERROR}
        }

        console.log('Client XX failed to connect: ', err.message);
        cb(null, ret_obj);
    }
}

/**
 * Validates email, password, and returns to async callback
 * @param email
 * @param password
 * @param cb
 */
function validateCredentials(email, password, cb)
{
    db.find({_id: email, password: password}, function (err, docs) {
        if(err)
        {
            cb(err);
            return;
        }

        if (docs)
        {
            cb(null, true)
        }
        else
        {
            cb(null, false)
        }
    });
}




module.exports.authenticateClient = authenticateClient;
module.exports.returnCode = returnMessage;
module.exports.connectionTimeOut = connectionTimeOut;

/**
 * PARA EFEITO DE TESTES
 */
//obj = authenticateClient("test@test.com", "12345", null);
//res = authenticateClient("test@test.com", null, obj.clientToken);
//console.log(res)
