/**
 * Created by Stéfano on 03/04/2015.
 */

function clientAddress(req){
    return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
        ||  req.connection.socket.remoteAddress).split(':')[3];
}

function currentTimeInSeconds()
{
    return  Math.floor(Date.now() / 1000);
}

module.exports.clientAddress = clientAddress;
module.exports.currentTimeInSeconds = currentTimeInSeconds;