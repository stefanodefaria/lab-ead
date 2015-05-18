/**
 * Created by St�fano on 07/04/2015.
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



x.contains = function(obj){
    return x[obj] ? true : false;
};