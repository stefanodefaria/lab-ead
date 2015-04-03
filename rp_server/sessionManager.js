/**
 * Created by Stéfano on 03/04/2015.
 */
var uuid = require('node-uuid');
var utils = require('./utils');

/**
 * RETURN CODES:
 * 1- Sucess
 * 2- Bad Credentials
 * 3- Session timed out
 * 4- Bad token
 * 5- Bad operation
 */
var returnCode = {SUCCESS: 1, BAD_CREDENTIALS: 2, SESSION_TIMED_OUT: 3, BAD_TOKEN: 4, BAD_OPERATION: 5};

//this array keeps track of which users are online.
//it will store objects like:
//[clientToken: (uui token), lastConnectionTime: (date format)}
var onlineTable = [];

// 30 minutes connection timeout (in seconds)
var connectionTimeOut = 30*60;


//--------------------------------------------------------------------------------------------
// This function will validate client's properties.
// 1- If client is not currently online, it will validate 'email' and 'password'
// 2- If client is already online, it will validate 'email' and 'token' with the OnlineTable array
//
// User is online --> is in OnlineTable array
function authenticateClient(email, password, token)
{
    //if client wants to log in
    if(password && !token)
    {
        if(validateCredentials(email, password))
        {
            //get current time
            currentTime = utils.currentTimeInSeconds();

            //creates uuid token
            //this is used to verify client session
            clientToken = uuid.v4();

            //inserts client into onlineTable
            onlineTable[email] = {clientToken: clientToken, lastConnectionTime: currentTime};

            return {code: returnCode.SUCCESS , clientToken: clientToken};
        }
        else
        {
            return {code: returnCode.BAD_CREDENTIALS};
        }
    }
    //if client is already logged in
    else if(token && !password && (onlineTable.indexOf(email) !== undefined)) //checks if 'email' is in 'onlineTable' array
    {
        clientEntry = onlineTable[email];

        //checks for valid token and timeout
        tokenIsValid = clientEntry.clientToken == token;
        timedOut = clientEntry.lastConnectionTime + connectionTimeOut < utils.currentTimeInSeconds();

        if(tokenIsValid && !timedOut )
        {
            onlineTable[email].lastConnectionTime = utils.currentTimeInSeconds();
            return {code: returnCode.SUCCESS};
        }
        else if (!tokenIsValid)
        {
            return {code: returnCode.BAD_TOKEN}; //bad token
        }
        else if(timedOut)
        {
            return {code: returnCode.SESSION_TIMED_OUT}
        }
    }
    else
    {
        return {code: returnCode.BAD_OPERATION};
    }
}

function validateCredentials(email, password)
{
    //TODO
    //check if email and password are registered in database
    return true;
}

module.exports.authenticateClient = authenticateClient;
module.exports.returnCode = returnCode;
module.exports.connectionTimeOut = connectionTimeOut;

/**
 * PARA EFEITO DE TESTES
 */
//obj = authenticateClient("test@test.com", "12345", null);
//res = authenticateClient("test@test.com", null, obj.clientToken);
//console.log(res)
