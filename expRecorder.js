/**
 * Created by stefano on 29/08/15.
 */

var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var utils = require('./utils');
var defs = require('./definitions');

var startupDelay = 500; //ms, delay to wait for possible error during startup

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
        recTimeOption = (opts.recTime)? '-t ' + opts.recTime: null,
        cameraPath = opts.cameraPath,
        fps = opts.fps || 30,
        bitRate = opts.bitRate || 1000,
        snapshotFrequency = opts.snapshotFrequency || 3; //hertz;

    var outputDirPath = baseOutputPath + '/' + path;

    var error = null,
        started = false,
        finished = false;

    var ffmpegProcess;
    var onEndCallback;

    utils.deleteFolderRecursive(outputDirPath);
    fs.mkdir(outputDirPath);
    fs.mkdir(outputDirPath + '/' + snapshotDirPath);

    return {
        startRecording: function(callback){

            ffmpegProcess =  ffmpeg(cameraPath);

            if(recTimeOption){
                ffmpegProcess.inputOption(recTimeOption);
            }

            ffmpegProcess.output(outputDirPath + '/' + videoFileName)
                .videoCodec('libx264')
                .size('640x480')
                .outputOption('-x264opts bitrate=' + bitRate)
                .output(outputDirPath + '/' + snapshotDirPath + '/' +snapshotFileName + '%d' + snapshotFileExtension)
                .size('640x480')
                .outputOptions([
                    '-vf fps=' + snapshotFrequency
                ]);

                ffmpegProcess.on('start', onStart)
                .on('error', onError)
                .on('end', onEnd)
                .run();

            function onStart(cmd){
                console.log('Executing: ', cmd);

                // delay to wait for possible error during startup
                setTimeout(function(){
                    if(!finished){ // could be finished in case of error before this timeout
                        started = true;
                        console.log('Started recording with ' + cameraPath, ' - Output files will be saved on ' + outputDirPath);
                        callback(null);
                    }
                }, startupDelay);
            }

            function onError(err){
                console.log('ERROR recording with ' + cameraPath);
                error = err;
                finished = true;

                if(!started){ //could be called before actually started
                    return callback(err);
                }
                utils.catchErr(err);
            }

            function onEnd(){
                console.log('Finished recording with ' + cameraPath);
                finished = true;
                if(onEndCallback){
                    onEndCallback();
                }
            }
        },
        stopRecording: function(){
            ffmpegProcess.on('progress', function(progress){
                console.log("Stopping recording at " + progress.timemark);
                ffmpegProcess.ffmpegProc.stdin.write('q');
                //ffmpegProcess..kill('SIGTERM'); //sends termination signal
            })
        },
        onEnd: function(cb){
            onEndCallback = cb;
        },
        getStatus: function(){
            return {finished: finished, error: error};
        },
        /**
         * @param count (snapshot index, starting from 1)
         * @param cb(file readStream)
         */
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
        /**
         * @param cb(file readStream)
         */
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
            utils.deleteFolderRecursive(outputDirPath + '/' + snapshotDirPath);
        }
    }
}

module.exports = expRecorder;

/**
 * SOMENTE PARA TESTES
 * @type {{path: string, recTime: number, fps: number, bitRate: number, snapshotFrequency: number}}
 */

//var recOpts = {
//    path: 'test@test.com_gravity',
//    cameraPath: '/dev/video0',
//    fps: 30,
//    bitRate: 1000,
//    snapshotFrequency: 3
//};
//
//var recorder = expRecorder(recOpts);
//
//recorder.startRecording(function(err, msg){
//    console.log(msg);
//    var intervalID = setInterval(function(){
//        console.log(recorder.getStatus().finished);
//        if(recorder.getStatus().finished){
//            clearInterval(intervalID);
//
//            recorder.flushSnapshots();
//            //recorder.getVideo();
//            return;
//        }
//
//        recorder.stopRecording();
//
//        //recorder.getSnapshot(1, function(stream){
//        //    console.log(stream)
//        //});
//
//
//    }, 333);
//});
//
