/**
 * Created by Stéfano on 03/04/2015.
 */
var uuid = require('uuid');
var utils = require('./utils');
var defs = require('./definitions');
var database = require('./database');

//this array keeps track of which users are online.
//it will store objects like:
//[clientToken: (uui token), lastConnectionTime: (date format)}
var onlineTable = [];

// 10 minutes connection timeout (in seconds)
//var connectionTimeOut = 10*60;
var connectionTimeOut = 10;

//starts routine, runs every 'interval'
removeTimedOutClientsTask();

/**
 * This function will AUTHENTICATE client's session/credentials.
 * 1- If client is not logged in, it will validate 'email' and 'password'
 * 2- If client has logged in, it will validate 'email' and 'token' with the OnlineTable array
 * @param clientInfo - Email, password and uuid token
 * @param cb - callback
 */
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

        }else if(onlineTable.contains(clientInfo.email)) //checks if 'email' is in 'onlineTable' array (user has logged in)
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
        //add defs.returnCode.BAD_DATA
        //add defs.returnCode.SERVER_ERROR

        if(err.type && err.type ==='JSON_PARSE')
        {
            ret_obj = {message: defs.returnMessage.BAD_DATA}
        }
        else
        {
            ret_obj = {message: defs.returnMessage.SERVER_ERROR}
        }

        console.log('Client XX failed to connect. %s: %s ',err.name,  err.message);
        cb(err, ret_obj);
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

/**
 * Logs in clients, calling 'authenticateClient' function
 * @param clientInfo - username and password
 * @param cb - callback
 */
function login(clientInfo, cb){
    clientInfo.login = true;
    authenticateClient(clientInfo, function(err, retObj){
        if(err){
            cb(err);
            return;
        }
        else{
            cb(null, retObj);
            return;
        }
    });
}

/**
 * Removes clients that timed out from 'onlineTable' array
 * Should execute every (connectionTimeOut + timeMargin) seconds
 * Its purpose is to clean memory
 */
function removeTimedOutClientsTask(){
    var timeMargin = connectionTimeOut * 1; //100% margin before changing 'timed out' to 'not logged in'
    var interval = (connectionTimeOut + timeMargin) * 1000; //convert to milliseconds
    setInterval(function(){
        var currentTime = utils.currentTimeInSeconds();
        var count =0;
        for(entry in onlineTable){
            if(onlineTable.hasOwnProperty(entry) && onlineTable[entry].hasOwnProperty(lastConnectionTime)
                && onlineTable[entry].lastConnectionTime + timeMargin < currentTime){
                delete onlineTable[entry];
                count++;
            }
        }
        if(count>0){
            console.log("Removed %d timed out clients from memory", count);
        }

    }, interval);
}

/**
 * Checks weather an object is index of an element in array
 * @param obj - candidate of index
 * @returns {boolean}
 */
onlineTable.contains = function(obj){
    if(onlineTable[obj]){
        return true;
    }
    return false;
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
