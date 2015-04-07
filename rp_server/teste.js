/**
 * Created by Stéfano on 06/04/2015.
 */
utils = require('./utils');

var myObject = {
    prop1: '1',
    prop2: '2',
    prop3: 3
}

for (var prop in myObject)
{

    console.log(prop +" " + myObject[prop]);
}