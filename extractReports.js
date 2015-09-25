/**
 * Created by stefano on 25/09/15.
 */

var sqlite = require('sqlite3'),
    utils = require('./utils'),
    fs = require('fs');


var outputPath = process.argv[2],
    db = new sqlite.Database('./res/test.db'),
    reports = []; //all reports, sorted by exp_id


if(!pathIsValid(outputPath))
    return;

loadReports(function(err){
    if(err){
        return console.error(err);
    }
    createDirectories();
    createFiles();
});


//Checks if output path is valid
function pathIsValid(path){
    try{
        if(!fs.statSync(outputPath).isDirectory()){
            throw new Error(outputPath + ' is not a directory.')
        }
    }
    catch(err){
        console.error(err.message)
        return false;
    }
    return true;
}

//Loads all reports from database
function loadReports(cb){
    var query = 'select NAME, TIMESTAMP, REPORT, EXP_ID ' +
                'from PROFILES, REPORTS ' +
                'where PROFILES.EMAIL = REPORTS.EMAIL ' +
                'order by EXP_ID';

    db.all(query,arguments, function(err, rows){

        if(err) {
            return cb(err);
        }

        for(var i=0; i<rows.length; i++){
            var report = {expID: rows[i].EXP_ID, studentName: rows[i].NAME, report: JSON.parse(rows[i].REPORT) , timestamp:rows[i].TIMESTAMP};
            reports.push(report);
        }

        return cb();
    });
}

//Creates one directory for each exp id
function createDirectories(){

    for(var i=0; i<reports.length; i++) {

        var dirPath = outputPath + '/' + reports[i].expID;

        if(fs.existsSync(dirPath)) {
            continue;
        }

        fs.mkdirSync(dirPath);
    }
}

//Creates one file per student per experiment
function createFiles(){
    for(var i = 0; i < reports.length; i++) {
        var filePath = outputPath + '/' + reports[i].expID + '/' + reports[i].studentName + '.txt';

        fs.writeFileSync(filePath, generateReportString(reports[i]));

    }
}

//Creates report content
function generateReportString(reportObj){
    var header = 'Student Name: ' + reportObj.studentName + '\n' +
                'Date: ' + reportObj.timestamp + '\n\n';
    var lines = '';

    for(var i=0; i<reportObj.report.length; i++){
        lines += reportObj.report[i].fieldName + ' \t' + reportObj.report[i].value + '\n';
    }

    return header + lines;
}