/**
 * Created by stefano on 29/08/15.
 */

var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var utils = require('./utils');
var defs = require('./definitions');

var baseOutputPath = './camera_output',
    videoFileName = 'output.mp4',
    snapshotDirPath = 'snapshots',
    snapshotFileName = 'out',
    snapshotFileExtension = '.jpg';

if(!fs.existsSync(baseOutputPath)){
    fs.mkdir(baseOutputPath);
}


/**
 *
 * @param opts - opts.cameraPath is mandatory
 * @returns {{startRecording: Function, getStatus: Function, getSnapshot: Function, getVideo: Function, flushSnapshots: Function}}
 */
function expRecorder(opts){

    if(!opts || !opts.cameraPath){
        var err = new Error('Missing options' + ((opts && !opts.cameraPath)? ': cameraPath' : ''));
        err.type = 'RecorderError';
        throw err;
    }

    var path = opts.path || 'default_path',
        recTime = opts.recTime || 5,
        cameraPath = opts.cameraPath,
        fps = opts.fps || 30,
        bitRate = opts.bitRate || 1000,
        snapshotFrequency = opts.snapshotFrequency || 3; //hertz;

    var outputDirPath = baseOutputPath + '/' + path + '/';

    var error = null,
        started = false,
        finished = false;

    utils.deleteFolderRecursive(outputDirPath);
    fs.mkdir(outputDirPath);
    fs.mkdir(outputDirPath + snapshotDirPath);

    return {
        startRecording: function(callback){

            ffmpeg(cameraPath)
                .inputOptions(['-t ' + recTime])
                .output(outputDirPath + '/' + videoFileName)
                .videoCodec('libx264')
                .size('640x480')
                .outputOption('-x264opts bitrate=' + bitRate)
                .output(outputDirPath + '/' + snapshotDirPath + '/' +snapshotFileName + '%d' + snapshotFileExtension)
                .size('640x480')
                .outputOptions([
                    '-vf fps=' + snapshotFrequency
                ])
                .on('start', function(cmd) {
                    console.log('Executing: ', cmd);

                    // waits for possible error during startup
                    setTimeout(function(){
                        if(!finished){ // could be finished in case of error before this timeout
                            started = true;
                            console.log('Started recording with ' + cameraPath);
                            console.log('Output files will be saved on ' + outputDirPath);
                            callback(null, defs.returnMessage.SUCCESS);
                        }
                    },500);

                })
                .on('error', function(err) {
                    console.log('ERROR recording with ' + cameraPath);
                    error = err;
                    finished = true;
                    if(!started){
                        return callback(err);
                    }
                    utils.catchErr(err);
                })
                .on('end', function() {
                    console.log('Finished recording with ' + cameraPath);
                    finished = true;
                })
                .run();
        },
        getStatus: function(){
            return {finished: finished, error: error};
        },
        getSnapshot: function(count, cb){
            var snapshotPath = outputDirPath + snapshotDirPath + '/' + snapshotFileName + count + snapshotFileExtension;
            console.log("path: ", snapshotPath);
            if(started){
                fs.exists(snapshotPath, function(exists){
                    if(exists){
                        return cb(fs.createReadStream(snapshotPath))
                    }
                    else{
                        return cb(null);
                    }
                })
            }
        },
        getVideo: function(cb){

            if(!finished || error){
                return cb(null);
            }

            fs.exists(outputDirPath + videoFileName, function(exists){
                if(!exists){
                    return cb(null);
                }

                return cb(fs.createReadStream(outputDirPath + videoFileName));
            })
        },
        flushSnapshots: function(){

            utils.deleteFolderRecursive(outputDirPath + snapshotDirPath);
        }
    }
}


/**
 * SOMENTE PARA TESTES
 * @type {{path: string, recTime: number, fps: number, bitRate: number, snapshotFrequency: number}}
 */

//var recOpts = {
//    path: 'test@test.com_gravity',
//    recTime: 2,
//    cameraPath: '/dev/video0',
//    fps: 30,
//    bitRate: 1000,
//    snapshotFrequency: 3
//};
//
//var recorder = expRecorder(recOpts);
//
//recorder.startRecording(console.log);
//
//var intervalID = setInterval(function(){
//    if(recorder.getStatus().finished){
//        clearInterval(intervalID);
//
//        recorder.flushSnapshots();
//        //recorder.getVideo();
//        return;
//    }
//
//    //recorder.getSnapshot(1, function(stream){
//    //    console.log(stream)
//    //});
//
//
//    console.log("waiting...");
//}, 1000);



