/**
 * Created by St�fano on 04/04/2015.
 */
var crypto = require('crypto');
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
    var retMsg;


    database.find({_id: entry.email}, function (err, docs){
        if(err){
            //internal db.find() error
            retMsg = utils.catchErr(err);

            //since registration is async, callback must be called now
            return cb(retMsg);
        }

        if (docs.length>0){//if email is already registered
            retMsg = defs.returnMessage.EMAIL_NOT_UNIQUE;

            //since registration is async, callback must be called now
            return cb(retMsg);
        }
        else//if not, registers email
        {
            var hashedPassword = crypto.createHash('sha1').update(entry.password).digest('hex');
            var newEntry = {_id: entry.email, password: hashedPassword, name: entry.name, type: accType};

            database.insert(newEntry, function(err, newDoc){
                if(err){
                    //internal db.insert() error
                    retMsg = utils.catchErr(err);
                }
                else{
                    retMsg = defs.returnMessage.SUCCESS;
                }
                return cb(retMsg);
            });
        }
    });
}

/**
 *  ASYNC - Updates user info
 * @param email - user email: 'example@123.com'
 * @param entry - user info: {email, newEmail, new password, new name}
 * @param cb - callback('message')
 */
function updateUser(email, entry, cb){
    //TODO
    //VERIFICAR ESSA FUNCAO
    var retMsg;

    db.update({ _id: email }, entry, function (err, numUpdated) {
        if(err){
            //internal db.update() error
            retMsg = utils.catchErr(err);

            //since update is async, callback must be called now
            cb(retMsg);
            //return;
        }
        else if (numUpdated!=1){//if updated ONE entry
            retMsg = defs.returnMessage.SUCCESS;

            //since registration is async, callback must be called now
            cb(retMsg);
        }
        else// then something is really wrong
        {
            console.log('ERROOOOOOOOOO');
        }
    });
}

/**
 *  ASYNC - Insert user exp report
 * @param email - user email: 'example@123.com'
 * @param expID - exp id: 'gravity'
 * @param report - exp report: [{fieldName: "tempo", value: "2"}, {fieldName: "massa", value: "0.5"}]
 * @param cb - callback('message')
 */
function insertReport(email, expID, report, cb){
    var reportID = "reports." + expID;

    var entry = {$set: {}}; //usado para adicionar um valor a uma entrada já existente
    entry.$set[reportID] = report;

    this.db.update({ _id: email }, entry, {multi: false, upsert: true }, function (err, numUpdated) {
        if(err){
            //internal db.update() error

            return cb(utils.catchErr(err));
        }
        else{
            return cb(defs.returnMessage.SUCCESS);
        }
    });
}


module.exports.insertReport = insertReport;
module.exports.loadDB = loadDB;
module.exports.find = find;
module.exports.registerUser = registerUser;
module.exports.updateUser = updateUser;



/**
 * SOMENTE PARA TESTES

 loadDB();

 db.update({_id: 'teacher@test.com'}, {_id: 'teacher123@test.com'}, function(err, num){
    if(err)
        console.log(err)
    console.log('num: '+ num)
})


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