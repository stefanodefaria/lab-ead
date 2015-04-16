/**
 * Created by Stéfano on 06/04/2015.
 */

const returnCode = {
    SUCCESS: 'SUCCESS',                             //Operation successful
    BAD_CREDENTIALS: 'BAD_CREDENTIALS',             //Incorrect email or password
    SESSION_TIMED_OUT: 'SESSION_TIMED_OUT',         //It's passed more than 'timeout' since last request
    //BAD_TOKEN: 'BAD_TOKEN',                         //Incorrect client uuid token
    BAD_OPERATION: 'BAD_OPERATION',                 //Invalid operation (ie path)
    //CLIENT_NOT_LOGGED_IN: 'CLIENT_NOT_LOGGED_IN',   //Client not logged in trying to perform operation
    BAD_DATA: 'BAD_DATA',                           //Corrupt data provided by client
    SERVER_ERROR: 'SERVER_ERROR',                   //Internal unexpected server error
    EMAIL_NOT_UNIQUE: 'EMAIL_NOT_UNIQUE',           //Email already used, when trying to register
    MISSING_DATA: 'MISSING_DATA'                    //Missing parameter data (ie email, password, username)
};

const profileType = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
};

module.exports.returnMessage = returnCode;
module.exports.profileType = profileType;