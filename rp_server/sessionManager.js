/**
 * Created by Stéfano on 03/04/2015.
 */
var uuid = require('uuid');
var utils = require('./utils');
var defs = require('./definitions');
var database = require('./database');

//Loads singleton DB instance
database.loadDB();

/**
 * RETURN CODES:
 * 1- Sucess: Validation successful
 * 2- Bad Credentials: Wrong email or password
 * 3- Session timed out: last request was more than 'connectionTimeOut' ago
 * 4- Bad token: User provided different token (probably another client trying to operate with someone else's email)
 * 5- Bad operation
 */

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
function authenticateClient(clientInfo, cb)
{
    //object that will be returned to callback
    var ret_obj;
    try
    {
        //if client wants to log in
        if(clientInfo.login)
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
                    var currentTime = utils.currentTimeInSeconds();

                    //creates uuid token
                    //this is used to verify client sessionMngr
                    var clientToken = uuid.v4();

                    //inserts client into onlineTable
                    //TODO - Discuss about this:
                    //if same client connects again, overrides previous entry (only 1 device connected at a time)
                    onlineTable[clientInfo.email] = {clientToken: clientToken, lastConnectionTime: currentTime};

                    ret_obj = {message: defs.returnMessage.SUCCESS , clientToken: clientToken};
                }
                else
                {
                    ret_obj = {message: defs.returnMessage.BAD_CREDENTIALS};
                }
                cb(null, ret_obj);
                return; //exits function
            })

        }else if(onlineTable.indexOf(clientInfo.email) !== undefined) //checks if 'email' is in 'onlineTable' array (user has logged in)
        {
            var clientEntry = onlineTable[clientInfo.email];

            //checks for valid token and timeout
            var tokenIsValid = clientEntry.clientToken == clientInfo.token;
            var timedOut = clientEntry.lastConnectionTime + connectionTimeOut < utils.currentTimeInSeconds();

            if(tokenIsValid && !timedOut )
            {
                onlineTable[clientInfo.email].lastConnectionTime = utils.currentTimeInSeconds();

                ret_obj = {message: defs.returnMessage.SUCCESS};
            }
            else if (!tokenIsValid)
            {
                ret_obj = {message: defs.returnMessage.BAD_TOKEN};
            }
            else if(timedOut)
            {
                ret_obj = {message: defs.returnMessage.SESSION_TIMED_OUT};
            }
            cb(null,ret_obj);
        }
        else
        {
            ret_obj = {message: defs.returnMessage.CLIENT_NOT_LOGGED_IN};
            cb(null,ret_obj);
        }
    }
    catch (err)
    {
        //TODO
        //add defs.returnMessage.BAD_DATA
        //add defs.returnMessage.SERVER_ERROR

        if(err.type && err.type ==='JSON_PARSE')
        {
            ret_obj = {message: defs.returnMessage.BAD_DATA}
        }
        else
        {
            ret_obj = {message: defs.returnMessage.SERVER_ERROR}
        }

        console.log('Client XX failed to connect. %s: %s ',err.name,  err.message);
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
    database.find({_id: email, password: password}, function (err, docs) {
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

function login(clientInfo, cb){
    clientInfo.login = true;
    authenticateClient(clientInfo, function(err, retObj){
        if(err)
        {
            cb(err);
            return;
        }
        else
        {
            cb(null, retObj);
            return;
        }
    });
}

module.exports.login = login;
module.exports.authenticateClient = authenticateClient;
module.exports.connectionTimeOut = connectionTimeOut;

/**
 * PARA EFEITO DE TESTES
 */
//obj = authenticateClient("test@test.com", "12345", null);
//res = authenticateClient("test@test.com", null, obj.clientToken);
//console.log(res)
