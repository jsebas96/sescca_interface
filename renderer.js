var test = setInterval(sendToPython, 10000);
var global_control = -1;
// function hello(){
//     var d = new Date();
//     document.getElementById("demo").innerHTML = d.toLocaleTimeString();
// };
function sendToPython() {
    var { PythonShell } = require('python-shell');

    let options = {
        mode: 'json',
        //args: [input.value]
    };
    var results1 = [];//JSON.parse('{"names":[], "scores":[]}');

    PythonShell.run('python/test.py', options, function (err, results) {
        if (err) throw err;
        var i = 0, j=0, k=0;
        var times = Math.ceil(results[0].names.length/12);
        for (i = 0; i < times; i++) {
            results1[i] = JSON.parse('{"names":[], "scores":[]}');
            for(k=0; k<12;k++){
                results1[i].names[k] = results[0].names[j];
                results1[i].scores[k] = results[0].scores[j];
                j++;
                if(j==results[0].names.length){
                    break;
                }
            }
        }
        showGUI(results1, times);
    });
}
function showGUI(results1, times) {
    if(global_control == times-1){
        global_control = -1;
    }
    global_control +=1;
    var results = results1[global_control];
    console.log(global_control);
    var col_cloud_1 = document.getElementById("cloud_1");
    var col_cloud_2 = document.getElementById("cloud_2");

    var output = "";
    var i=0, j=0;

    col_cloud_1.innerHTML = output;
    col_cloud_2.innerHTML = output;

    // let names = ['Jon', 'Tyrion', 'Daenerys', 'Juan Sebastián', 'Sara Bibiana', 'Mario Fernando', 'Sandra Lucía', 'Juan José'];
    // let scores = [3, 4, 5, 2, 1, 2, 3, 4];

    for (i = 0; i < results.names.length; i++) {
        output += '<div class="cloud">'
        if (i % 2 != 0) {
            output += '<img class="mb-1 ml-5" src="images/nube.png" alt="cloud" width="200" height="75">';
            output += '<span class="text ml-5">' + results.names[i] + '</span>';
            output += '<img class="mb-1 ml-5" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            for (j = 0; j < results.scores[i]; j++) {
                output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            }
        } else {
            output += '<img class="mb-1" src="images/nube.png" alt="cloud" width="200" height="75">';
            output += '<span class="text">' + results.names[i] + '</span>';
            output += '<img class="mb-1 ml-5" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            for (j = 0; j < results.scores[i]; j++) {
                output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            }
        }
        output += '</div>'
        if(results.names.length < 5){
            if(i == results.names.length-1){
                col_cloud_1.innerHTML = output;
                output = "";
            }
        }else{
            if (i == 5) {
                col_cloud_1.innerHTML = output;
                output = "";
            } else if (i == 11 || i == results.names.length - 1) {
                col_cloud_2.innerHTML = output;
                output = "";
            }
        }
    }
}