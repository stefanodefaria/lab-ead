/**
 * Created by St�fano on 03/04/2015.
 */
var uuid = require('uuid');
var utils = require('./utils');
var defs = require('./definitions');
var database = require('./database');

//Starts DB to be used in this module
database.loadDB();

//this array keeps track of which users are online.
//it will store objects like:
//[clientToken: (uui token), lastConnectionTime: (date format)}
var onlineTable = [];

// 10 minutes connection timeout (in seconds)
var connectionTimeOut = 10*60;

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
    var ret_obj = {message: "none"};
    try{
        //if no username or token were provided
        if (clientInfo.email === undefined || clientInfo.token === undefined){
            ret_obj.message = defs.returnMessage.MISSING_DATA;
        }
        else if(onlineTable.contains(clientInfo.email)){ //checks if 'email' is in 'onlineTable' array (user has logged in)

            //gets client entry from online table and validates token and timeout
            var clientEntry = onlineTable[clientInfo.email];
            var tokenIsValid = clientEntry.token == clientInfo.token;
            var timedOut = (clientEntry.lastConnectionTime + connectionTimeOut) < utils.currentTimeInSeconds();

            if (!tokenIsValid){//invalid token
                //ret_obj.message=defs.returnMessage.BAD_TOKEN;
                ret_obj.message=defs.returnMessage.BAD_CREDENTIALS;
            }
            else if(timedOut){//session timed out
                ret_obj.message=defs.returnMessage.SESSION_TIMED_OUT;
            }
            else{//successfully authenticated
                onlineTable[clientInfo.email].lastConnectionTime = utils.currentTimeInSeconds();
                ret_obj.message=defs.returnMessage.SUCCESS;
            }
        }
        else{//client has not logged in
            //ret_obj.message=refs.returnMessage.CLIENT_NOT_LOGGED_IN;
            ret_obj.message=defs.returnMessage.BAD_CREDENTIALS;
        }
    }
    catch (err){
        ret_obj.message = utils.catchErr(err);
    }
    //FUNCTION MUST ALWAYS GET HERE, SINCE IT'S NOT ASYNC
    cb(ret_obj);
    //return;
}

/**
 * Validates email, password, and returns to async callback
 * @param email
 * @param password
 * @param cb
 */
function validateCredentials(email, password, cb){
    database.find({_id: email, password: password}, function (err, docs) {
        if(err){
            cb(err);
            return;
        }

        if (docs.length == 1){ //if found 1 match
            cb(null, true)
        }
        else{
            cb(null, false)
        }
    });
}

/**
 * Logs in clients, calling 'authenticateClient' function
 * WARNING: authentication is made asynchronously
 * @param clientInfo - username and password
 * @param cb - callback
 */
function login(clientInfo, cb){
    //Define an 'empty' return object
    var ret_obj = {message:"", token: "", timeout: -1};

    try{
        //if no username or password were provided
        if (clientInfo.email === undefined || clientInfo.password === undefined){
            ret_obj.message = defs.returnMessage.MISSING_DATA;
            //since validation is async, callback must be called now
            cb(ret_obj);
            //return;
        }
        else{
            //ASYNC DB validation
            validateCredentials(clientInfo.email, clientInfo.password, function(err, validated){
                if(err){
                    //error will be caught (this is inside a try-catch block)
                    throw err;
                }
                else if(validated){//if password matches email
                    //get current time
                    var currentTime = utils.currentTimeInSeconds();

                    //creates uuid token
                    //this is used to verify client session
                    var token = uuid.v4();

                    //inserts client into onlineTable
                    //TODO - Discuss about this:
                    //if same client connects again, overrides previous entry ??
                    //the way it's implemented, only 1 device can connected at a time
                    onlineTable[clientInfo.email] = {token: token, lastConnectionTime: currentTime};

                    //fill return object with success values
                    ret_obj.message = defs.returnMessage.SUCCESS;
                    ret_obj.timeout = connectionTimeOut;
                    ret_obj.token = token;
                }
                else{
                    //password does not match email,
                    //or email is not registered
                    ret_obj.message = defs.returnMessage.BAD_CREDENTIALS;
                }
                cb(ret_obj);
                //return;
            })
        }
    }
    catch(err){

        console.log("Client %s failed to connect.", clientInfo.address);
        ret_obj.message = utils.catchErr(err);
        cb(ret_obj);
        //return;
    }
}

/**
 * Removes clients that timed out from 'onlineTable' array
 * Should execute every (connectionTimeOut + timeMargin) seconds
 * Its purpose is to clean memory
 */
function removeTimedOutClientsTask(){
    var marginCoefficient = 1;
    var timeMargin = connectionTimeOut * marginCoefficient; //100% margin before changing 'timed out' to 'not logged in'
    var interval = (connectionTimeOut + timeMargin) * 1000; //convert to milliseconds
    setInterval(function(){
        var currentTime = utils.currentTimeInSeconds();
        var count =0;
        for(var entry in onlineTable){
            if(onlineTable[entry].lastConnectionTime && onlineTable[entry].lastConnectionTime + timeMargin < currentTime){
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
 * Checks weather an object is index of an element in onlineTable array
 * @param obj - candidate of index
 * @returns {boolean}
 */
onlineTable.contains = function(obj){
    return onlineTable[obj] ? true : false;
};

module.exports.login = login;
module.exports.authenticateClient = authenticateClient;
module.exports.connectionTimeOut = connectionTimeOut;

/**
 * PARA EFEITO DE TESTES
 */
//obj = authenticateClient("test@test.com", "12345", null);
//res = authenticateClient("test@test.com", null, obj.token);
//console.log(res)
