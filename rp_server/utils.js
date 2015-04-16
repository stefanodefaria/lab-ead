/**
 * Created by Stéfano on 03/04/2015.
 */

/**
 * Client address parser
 * @param req - used to get address value
 * @returns  string - string with clients ip
 */
function clientAddress(req){
    return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
        ||  req.connection.socket.remoteAddress).split(':')[3];
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
    if(err.type && err.message){
        console.log("ERROR - Caught " + err.type + " exception: " + err.message);
    }
    else{
        console.log("ERROR - Caught unknown exception.");
    }
    return defs.returnMessage.SERVER_ERROR;
}

module.exports.clientAddress = clientAddress;
module.exports.currentTimeInSeconds = currentTimeInSeconds;
module.exports.catchErr = catchErr;