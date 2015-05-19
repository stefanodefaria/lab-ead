var expName = "Verificação da aceleração da gravidade";

var expInfo = "\tNesta Prática nós iremos utilizar dois métodos diferentes para calcular a " +
    "aceleração da gravidade medindo a aceleracao de um corpo que cai em queda livre." +
    "\n\tNós dizemos que um objeto realiza movimento de queda livre quando a única " +
    "força que atua nela é a força gravitacional da Terra. Nenhuma outra força pode " +
    "atuar; em particular, a resistência de ar deve ser ou ausente ou tão pequena que " +
    "pode ser ignorada. Quando o objeto em queda livre está perto da superfície da terra, " +
    "a força gravitacional que atua sobre ele é quase constante. Em conseqüência, um " +
    "objeto em queda livre acelera para baixo a uma taxa constante. Esta é aceleração a " +
    "aceleração da gravidade.";

var expReportInfo = {
    fieldNames:["Tempo 1", "Distância 1", "Tempo 2", "Distância 2",
        "Tempo 3", "Distância 3", "Tempo 4", "Distância 4"],
    hints:["Em segundos", "Em metros", "Em segundos", "Em metros",
        "Em segundos", "Em metros", "Em segundos", "Em metros"]
};

function execute(){
    console.log("EXECUTOUUUUUU GRAVIDADEEEE");
}

module.exports.expReportInfo = expReportInfo;
module.exports.expInfo = expInfo;
module.exports.expName = expName;
module.exports.execute = execute;