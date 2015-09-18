/**
 * Created by Cinthya on 19/08/2015.
 */

var session = require('./../sessionManager');
var defs = require('./../definitions');
var database = require('./../database');
var utils = require('./../utils');
var expManager = require('./../experimentManager');
var fs = require('fs');
var recorder = require('./../expRecorder');

var reqData = ['email', 'token'];
var resData = {message: '', reports:''};

function execute(clientInfo, cb){
    var authMsg=session.authenticateClient(clientInfo);
    var retObj={};

    if(authMsg== defs.returnMessage.SUCCESS)
    {
        database.getReport(clientInfo.email,function(err,reports) {

            if (err) {
                utils.catchErr(err);
                retObj.message = defs.returnMessage.SERVER_ERROR;
                console.log('Client %s <%s> failed to perform getExpList: %s', clientInfo.address, clientInfo.email, retObj.message);
                return cb(retObj);
            }

            retObj.reports = reports;

            //Adds expName and encoded video file to each report
            var expList = expManager.getExpList();

            for(var i=0; i<reports.length; i++) {

                (function(i){
                    //adds exp name
                    var idx = expList[0].indexOf(reports[i].expID);
                    if (idx != -1) {
                        retObj.reports[i].expName = expList[1][idx];
                    }

                    //adds video file
                    var outputDirPath = recorder.baseOutputPath + '/' + clientInfo.email + '_' + reports[i].expID;

                    fs.exists(outputDirPath + '/' + recorder.videoFileName, function (exists) {

                        if (!exists) {
                            return exit(i);
                        }

                        fs.readFile(outputDirPath + '/' + recorder.videoFileName, function (err, data) {
                            if (err) {
                                utils.catchErr(err);
                                return exit(i);
                            }
                            return exit(i, data);
                        });
                    })
                }(i));
            }

            var exitedVideoReads = 0;

            function exit(i, encodedVideo){
                exitedVideoReads++;
                retObj.message = defs.returnMessage.SUCCESS;
                if(encodedVideo){
                    retObj.reports[i].encodedVideo = encodedVideo.toString('base64');
                }
                if(exitedVideoReads === retObj.reports.length){
                    return cb(retObj);
                }
            }
        });
    }else{
        retObj.message = authMsg;
        console.log('Client %s <%s> failed to perform getExpList: %s', clientInfo.address, clientInfo.email, retObj.message);
        return cb(retObj);
    }

}

module.exports.reqData = reqData;
module.exports.resData = resData;
module.exports.execute = execute;