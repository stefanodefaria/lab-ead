/**
 * Created by stefano on 29/07/15.
 */
var sqlite = require('sqlite3');
var defs = require('./definitions');
var utils = require('./utils');

var db;
var initialized = false;

function initialize(cb){
    if(initialized)
        return cb(defs.returnMessage.SUCCESS);

    db = new sqlite.Database('./res/test.db', function(err){
        
        if(err) {
            utils.catchErr(err);
            return cb(defs.returnMessage.SERVER_ERROR);
        }

        var queryProfiles = "create table if not exists PROFILES (" +
            "EMAIL varchar(200) primary key," +
            "SHA1_PASSWORD char(40) not null," +
            "NAME varchar(200) not null," +
            "ACC_TYPE varchar(20)" +
            ")";

        var queryReports = "create table if not exists REPORTS (" +
            "EMAIL varchar(200)," +
            "EXP_ID varchar(20) not null," +
            "REPORT text," +
            "TIMESTAMP datetime," +
            "primary key (EMAIL, EXP_ID)" +
            "foreign key (EMAIL) references PROFILES(EMAIL)" +
            ")";

        db.run(queryProfiles, function(err){
            if(err) {
                utils.catchErr(err);
                return cb(defs.returnMessage.SERVER_ERROR);
            }
            db.run(queryReports, function(err){
                if(err) {
                    utils.catchErr(err);
                    return cb(defs.returnMessage.SERVER_ERROR);
                }
                initialized = true;
                cb(defs.returnMessage.SUCCESS);
            });
        });

    });

}

function registerUser(email, sha1Password, name, accType, cb) {
    var query = "insert into PROFILES VALUES ($email, $sha1Password, $name, $accType)";
    var arguments = {$email: email, $sha1Password: sha1Password, $name: name, $accType: accType};

    db.run(query, arguments, function(err){
        if(err && err.message.indexOf("UNIQUE")>-1) {
            return cb(defs.returnMessage.EMAIL_NOT_UNIQUE);
        } else if(err) {
            utils.catchErr(err);
            return cb(defs.returnMessage.SERVER_ERROR);
        }
        cb(defs.returnMessage.SUCCESS);
    });
}

function findUser(email, cb){
    var query = "select EMAIL, SHA1_PASSWORD, NAME, ACC_TYPE from PROFILES where email = $email";
    var arguments = {$email: email};

    db.get(query, arguments, function(err, row) {
        if(err) {
            utils.catchErr(err);
            return cb(defs.returnMessage.SERVER_ERROR);
        }
        var user = (row)? {email: row.EMAIL, password: row.SHA1_PASSWORD, name: row.NAME, accType: row.ACC_TYPE} : null;

        cb(defs.returnMessage.SUCCESS, user);
    });
}

function updateUser(email, sha1Password, name, accType, cb) {
    if(!email || (!sha1Password && !name && ! accType)) {
        return cb(defs.returnMessage.MISSING_DATA);
    }

    // builds query and arguments based on given parameters
    var query = "update PROFILES set ";
    var arguments = {$email: email};
    if(sha1Password) {
        query += "SHA1_PASSWORD = $sha1Password";
        arguments.$sha1Password = sha1Password;
    }
    if(name) {
        if(sha1Password)
            query += ", ";
        query += "NAME = $name ";
        arguments.$name = name;
    }
    if(accType){
        if(sha1Password || name) {
            query += ", ";
        }
        query += "ACC_TYPE = $accType ";
        arguments.$accType = accType;
    }
    query += "where EMAIL = $email";

    db.run(query, arguments, function(err){
        if(err) {
            utils.catchErr(err);
            return cb(defs.returnMessage.SERVER_ERROR);
        }

        if(!this.changes){
            return cb(defs.returnMessage.BAD_CREDENTIALS);
        }
        cb(defs.returnMessage.SUCCESS);
    });
}

function addReport(email, expID, report, cb){
    var query = "insert or replace into REPORTS values ($email, $expID, $report, CURRENT_TIMESTAMP)";
    var arguments = {$email: email, $expID: expID, $report: JSON.stringify(report)};

    db.run(query, arguments, function(err){
        if(err) {
            utils.catchErr(err);
            return cb(defs.returnMessage.SERVER_ERROR);
        }
        cb(defs.returnMessage.SUCCESS);
    });
}

function getReport(email,cb){
    var query = "select EXP_ID, REPORT, TIMESTAMP from REPORTS where EMAIL = $email";
    var arguments ={$email:email};

    var reports = [];

    db.all(query,arguments, function(err, rows){

        if(err) {
            return cb(err);
        }

        for(var i=0; i<rows.length; i++){
            reports.push( {expID: rows[i].EXP_ID, report: JSON.parse(rows[i].REPORT) , timestamp:rows[i].TIMESTAMP});
        }

        cb(null, reports);
    });
}

module.exports.insertReport = addReport;
module.exports.loadDB = initialize;
module.exports.find = findUser;
module.exports.registerUser = registerUser;
module.exports.updateUser = updateUser;
module.exports.getReport=getReport;

/*setTimeout(function(){

    getReport('test2@test.com',function(err,report){

        if(err){
            console.error(err.stack);
            return;
        }
        console.log(report);
        console.log("ola");

    })


},2000);*/