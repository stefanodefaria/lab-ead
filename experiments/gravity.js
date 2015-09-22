var defs = require("../definitions");
var expName = "Verificação da aceleração da gravidade";
var expInfo = require('fs').readFileSync('./res/gravity.txt', 'utf8').toString();
var expReportInfo = [
    {fieldName:"Tempo 1:", hint:"Em segundos"},
    {fieldName:"Distância 1:", hint:"Em metros"},
    {fieldName:"Tempo 2:", hint:"Em segundos"},
    {fieldName:"Distância 2:", hint:"Em metros"},
    {fieldName:"Tempo 3:", hint:"Em segundos"},
    {fieldName:"Distância 3:", hint:"Em metros"},
    {fieldName:"Tempo 4:", hint:"Em segundos"},
    {fieldName:"Distância 4:", hint:"Em metros"}
];

var expRecorder = require("../expRecorder");
var recorder;
const recOpts = {
    path: '',
    cameraPath: './res/gravitySample.mp4',
    fps: 30,
    bitRate: 1000,
    size: '281x500',
    recTime: null,
    snapshotFrequency: 3
};

var status = defs.deviceStatus.UNSTARTED;

function execute(email, cb){

    if(status === defs.deviceStatus.IN_PROGRESS || status === defs.deviceStatus.UNKNOWN || status === defs.deviceStatus.UNINITIALIZED){
        return cb(new Error("Device not available: " + status));
    }

    status = defs.deviceStatus.IN_PROGRESS;

    recOpts.path = email + '_' + 'gravity';
    recorder = expRecorder(recOpts);

    recorder.onEnd(function(){ //clears snapshot directory when recording is finished
        try{
            recorder.flushSnapshots();
        }
        catch(err){
            utils.catchErr(err);
        }
        status = defs.deviceStatus.FINISHED;
    });

    recorder.startRecording(function(err){ //starts recording before experiment started
        if(err){
            utils.catchErr(err2);
            return cb(defs.returnMessage.SERVER_ERROR);
        }

        return cb();
    });

    console.log("EXECUTOUUUUUU GRAVIDADEEEE");
    status = defs.deviceStatus.FINISHED;
    return cb(null, defs.returnMessage.SUCCESS);
}

//dummy
function getRecorder(){
    return recorder;
}


function getStatus(){
   return status;
}

/**
 * @param cb(err, msg)
 */
function reset(cb){
    status = defs.deviceStatus.UNSTARTED;
    return cb();
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.getRecorder = getRecorder;
module.exports.execute = execute;
module.exports.getStatus = getStatus;
module.exports.reset = reset;