/**
 * Created by Stéfano on 07/04/2015.
 */
var defs = require('./definitions');

var login_data = {
    email: 'student1@test.com',
    password: '12345',
    name: 'name'
};

function verify(operation, data){

    if(!defs.operationRequiredData.containsProp(operation)){
        return defs.returnMessage.BAD_OPERATION;
    }

    var parameters = defs.operationRequiredData[operation];
    for (var i=0; i< parameters.length; i++) {
        if (!data.hasOwnProperty(parameters[i])) {
            return false;
        }
    }
    return true;
}



console.log(verify('alksjd', login_data));

//
//var array = [];
//array['1'] = 0;
//
//console.log(array.containsProp('1'));