/**
 * Created by Stéfano on 07/04/2015.
 */

var array = [];
array.teste1 = 1;
array['teste2'] = {teste: 123};
array['teste3'] = 1;

for (var key in array) {
    delete(array[key])
}
for (var key in array) {
    if (array.hasOwnProperty(key)) {
        console.log (key + " -> " + array[key]);
       // delete array[key]
    }
}
console.log(array['teste2'])