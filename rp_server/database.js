/**
 * Created by Stéfano on 04/04/2015.
 */
var Datastore = require('nedb');
var defs = require('./definitions');
var utils = require('./utils');

var dbPath = './res/profiles.nedb';

/**
 * THIS IS A SINGLETON PATTERN
 * It adds another layer of abstraction on top of 'nedb'.
 * This will prevent errors on handling the data that is written to and read from this database.
 * */

/**
 * Loads database ONCE. Ignores if it's already loaded.
 */
function loadDB() {
    if(!this.db)
    {
        this.db = new Datastore({ filename: dbPath });
        this.db.loadDatabase(function(err){
            if(err)
            {
                console.log("Error loading database. " + err.name + ": " + err.message);
            }
            else{
                console.log("Database loaded successfully");
            }
        });
    }
}

/**
 * Queries database
 * WARNING: this function DOES NOT handle errors
 * @param opts - query details
 * @param cb - callback(err, docs)
 */
function find(opts, cb){
    this.db.find(opts,cb);
}

/**
 *  ASYNC - Inserts a new user into database
 * @param entry - user info: {email, password, name}
 * @param accType - Teacher, student or Admin
 * @param cb - callback({message: "return message"})
 */
function registerUser(entry, accType, cb){
    var database = this.db;
    var ret_obj = {message: "none"};

    database.find({_id: entry.email}, function (err, docs){
        if(err){
            //internal db.find() error
            ret_obj.message = utils.catchErr(err);

            //since registration is async, callback must be called now
            cb(ret_obj);
            //return;
        }
        else if (docs.length>0){//if email is already registered
            ret_obj.message = defs.returnMessage.EMAIL_NOT_UNIQUE;

            //since registration is async, callback must be called now
            cb(ret_obj);
            //return;
        }
        else//if not, registers email
        {
            var newEntry = {_id: entry.email, password: entry.password, name: entry.name, type: accType};

            database.insert(newEntry, function(err, newDoc){
                if(err){
                    //internal db.insert() error
                    ret_obj.message = utils.catchErr(err);
                }
                else{
                    ret_obj.message = defs.returnMessage.SUCCESS;
                }
                cb(ret_obj);
                //return;
            });

            //cb will be called within database.insert callback
        }
    });
}

module.exports.loadDB = loadDB;
module.exports.find = find;
module.exports.registerUser = registerUser;


/**
 * SOMENTE PARA TESTES


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
function updateDB_test(db){
    // Replace a document by another
    db.update({ planet: 'Jup' }, {}, {}, function (err, numReplaced) {
        if(err)
            console.log(err.message);

        // numReplaced = 1
        // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
        // Note that the _id is kept unchanged, and the document has been replaced
        // (the 'system' and inhabited fields are not here anymore)
    });

    queryDB_test(db)
}

 */