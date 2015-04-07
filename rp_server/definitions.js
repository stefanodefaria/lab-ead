/**
 * Created by Stéfano on 06/04/2015.
 */

//TODO
    //change these 'codes' into nicely readable text
const returnMessage = {
    SUCCESS: 'SUCCESS',
    BAD_CREDENTIALS: 'BAD_CREDENTIALS',
    SESSION_TIMED_OUT: 'SESSION_TIMED_OUT',
    BAD_TOKEN: 'BAD_TOKEN',
    BAD_OPERATION: 'BAD_OPERATION',
    CLIENT_NOT_LOGGED_IN: 'CLIENT_NOT_LOGGED_IN',
    BAD_DATA: 'BAD_DATA',
    SERVER_ERROR: 'SERVER_ERROR',
    EMAIL_NOT_UNIQUE: 'EMAIL_NOT_UNIQUE',
    MISSING_DATA: 'MISSING_DATA'
};

const profileType = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
};

//TODO
//create 'errorCode', and move some 'returnMessages' items to 'errorCode'.

module.exports.returnMessage = returnMessage;
module.exports.profileType = profileType;