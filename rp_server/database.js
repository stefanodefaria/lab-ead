/**
 * Created by Stéfano on 04/04/2015.
 */
var Datastore = require('nedb');

function loadDB(cb) {
    dbPath = './res/profiles.nedb';

    var db = new Datastore({ filename: dbPath });

    db.loadDatabase(function (err) {    // Callback is optional
        cb(err, db)
    });
}

module.exports.getDBInstance = loadDB;



/**
 * SOMENTE PARA TESTES
 */

function populateDB_test(db){


    var user1 =  {_id: "user1@test.com", password: "12345", admin: false};
    var user2 =  {_id: "user2@test.com", password: "12345", admin: false};
    var user3 =  {_id: "user3@test.com", password: "12345", admin: false};
    var admin =  {_id: "admin@test.com", password: "12345", admin: true};

    items = [user1, user2, user3, user4, admin];

    for (var i=0; i<items.length; i++)
    {
        db.insert(items[i], function (err, newDoc) {   // Callback is optional
            // newDoc is the newly inserted document, including its _id
            // newDoc has no key called notToBeSaved since its value was
        });
    }
}

function queryDB_test(db) {
    db.find({_id: ''}, function (err, docs) {
        for (var i = 0; i < docs.length; i++)
            console.log(docs[i])
    });
}

function updateDB_test(db)
{
    // Replace a document by another
    db.update({ planet: 'Jup' }, {}, {}, function (err, numReplaced) {
        if(err)
            console.log(err.message)

        // numReplaced = 1
        // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
        // Note that the _id is kept unchanged, and the document has been replaced
        // (the 'system' and inhabited fields are not here anymore)
    });

    queryDB_test(db)
}