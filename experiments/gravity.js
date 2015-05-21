var expName = "Verificação da aceleração da gravidade";
var expInfo = require('fs').readFileSync('./res/gravity.txt', 'utf8').toString();
var expReportInfo = [
    {fieldName:"Tempo 1", hint:"Em segundos"},
    {fieldName:"Distância 1", hint:"Em metros"},
    {fieldName:"Tempo 2", hint:"Em segundos"},
    {fieldName:"Distância 2", hint:"Em metros"},
    {fieldName:"Tempo 3", hint:"Em segundos"},
    {fieldName:"Distância 3", hint:"Em metros"},
    {fieldName:"Tempo 4", hint:"Em segundos"},
    {fieldName:"Distância 4", hint:"Em metros"}
];

function execute(){
    console.log("EXECUTOUUUUUU GRAVIDADEEEE");
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.execute = execute;