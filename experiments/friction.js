var defs = require("../definitions");
var expName = "Cálculo do Atrito";
var expInfo = require('fs').readFileSync('./res/friction.txt', 'utf8').toString();
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
//var expInfo = "Não implementado";


function execute(){
    console.log("EXECUTO ATRITO");
    return defs.returnMessage.SUCCESS;
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.execute = execute;