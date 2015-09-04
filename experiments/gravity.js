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


var status = defs.deviceStatus.UNSTARTED;

function execute(email, cb){
    console.log("EXECUTOUUUUUU GRAVIDADEEEE");
    status = defs.deviceStatus.FINISHED;
    return cb(null, defs.returnMessage.SUCCESS);
}

//dummy
function getRecorder(){
    return {
        getVideo: function(cb){
            require('fs').readFile('./res/gravitySample.mp4', function(err, data){
                if(err){
                    return cb(err);
                }
                return cb(null, data);
            });
        },
        getStatus: function(){
            return {finished: true, error: null};
        }
    };
}


function getStatus(){
   return status;
}

/**
 * @param cb(err, msg)
 */
function reset(cb){
    status = defs.deviceStatus.UNSTARTED;
    return cb(null);
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.getRecorder = getRecorder;
module.exports.execute = execute;
module.exports.getStatus = getStatus;
module.exports.reset = reset;