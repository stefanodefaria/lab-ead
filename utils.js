/**
 * Created by St�fano on 03/04/2015.
 */

var defs = require('./definitions');

/**
 * Client address parser
 * @param req - used to get address value
 * @returns  string - string with clients ip
 */
function clientAddress(req){
    try{
        return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
        ||  req.connection.socket.remoteAddress).split(':')[3];
    }
    catch (err){
        return 'undefinedAddress';
    }
}

/**
 * Get current time in seconds
 * @returns number - current time in seconds
 */
function currentTimeInSeconds()
{
    return  Math.floor(Date.now() / 1000);
}

/**
 * Error/exception handler.
 * Logs error to console.
 * @param err - error caught
 * @returns string - string defining error type that caused exception
 */
function catchErr(err){
    //if error has a defined error type and message
    var errType = err.type || err.code || 'unknown';

    console.error("----------------------------------------------");
    console.error("ERROR - Caught " + errType + " exception");
    console.error(err.stack);
    console.error("----------------------------------------------");
    return defs.returnMessage.SERVER_ERROR;
}

/**
 * Parses operation from path
 * @param req - http request object
 * @returns string - operation
 */
function extractOperation(req){
    return req.url.replace('/','');
}

/**
 * Adds function 'containsProp' to Object class
 * returns true if object contains given property
 * otherwise returns false
 */
Object.prototype.containsProp = function(idx) {
    return this[idx] ? true : false;
};

// TODO
// create 'clone object' function

module.exports.clientAddress = clientAddress;
module.exports.currentTimeInSeconds = currentTimeInSeconds;
module.exports.catchErr = catchErr;
module.exports.extractOperation = extractOperation;