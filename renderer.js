var test = setInterval(sendToPython, 10000);
var { PythonShell } = require('python-shell');
const lottie = require('./lottie');

var byStudent = document.getElementById("ByStudent");
var byGroup = document.getElementById("ByGroup");
byStudent.style.display = "none";
byGroup.style.display = "none";

lottie.loadAnimation({
    container: document.getElementById("lottie"), // the dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'json/robot-hello.json' // the path to the animation json
});

var global_control = -2;

function sendToPython() {
    if (global_control == -2) {
        anim = document.getElementById("lottie");
        anim.style.display = "none";
        global_control++;
    }

    let options = {
        mode: 'json',
    };

    PythonShell.run('python/which_view.py', options, function(err, states){
        if (err) throw err;
        for(let i=0; i<states[0].names.length;i++){
            if(states[0].states[i]){
                if(states[0].names[i] == 'Vista Individual'){
                    // console.log(states[0].names[i]);
                    byStudent.style.display = "flex";
                    byGroup.style.display = "none";
                    individualView();
                } else if (states[0].names[i] == 'Vista Grupal'){
                    // console.log(states[0].names[i]);
                    byStudent.style.display = "none";
                    byGroup.style.display = "flex";
                    groupView();
                }
            }
        }
    });
}

function individualView(){
    let options = {
        mode: 'json',
    };
    let results1 = [];
    PythonShell.run('python/ind_view.py', options, function (err, results) {
        if (err) throw err;
        let i = 0, j = 0, k = 0;
        let times = Math.ceil(results[0].names.length / 12);
        for (i = 0; i < times; i++) {
            results1[i] = JSON.parse('{"names":[], "scores":[]}');
            for (k = 0; k < 12; k++) {
                results1[i].names[k] = results[0].names[j];
                results1[i].scores[k] = results[0].scores[j];
                j++;
                if (j == results[0].names.length) {
                    break;
                }
            }
        }
        showGUI(results1, times);
    });
}

function showGUI(results1, times) {
    if (global_control == times - 1) {
        global_control = -1;
    }
    global_control += 1;
    let results = results1[global_control];
    let col_cloud_1 = document.getElementById("cloud_1");
    let col_cloud_2 = document.getElementById("cloud_2");

    let output = "";
    let i = 0, j = 0;

    col_cloud_1.innerHTML = output;
    col_cloud_2.innerHTML = output;

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
            output += '<span class="ml-5"></span>';
            output += '<img class="mb-1 ml-5" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            for (j = 0; j < results.scores[i]; j++) {
                output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
            }
        }
        output += '</div>'
        if (results.names.length < 5) {
            if (i == results.names.length - 1) {
                col_cloud_1.innerHTML = output;
                output = "";
            }
        } else {
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

function groupView(){
    let options = {
        mode: 'json',
    };
    PythonShell.run('python/group_view.py', options, function (err, mean) {
        if (err) throw err;
    });
    showGUIGroup(4);
}

function showGUIGroup(mean){
    birdLeft1 = document.getElementById("left-1");
    birdLeft2 = document.getElementById("left-2");
    birdLeft3 = document.getElementById("left-3");
    birdLeft4 = document.getElementById("left-4");
    birdRight1 = document.getElementById("right-1");
    birdRight2 = document.getElementById("right-2");
    birdRight3 = document.getElementById("right-3");
    birdRight4 = document.getElementById("right-4");
    birdLeft1.style.opacity = "0.5";
    birdLeft2.style.opacity = "0.5";
    birdLeft3.style.opacity = "0.5";
    birdLeft4.style.opacity = "0.5";
    birdRight1.style.opacity = "0.5";
    birdRight2.style.opacity = "0.5";
    birdRight3.style.opacity = "0.5";
    birdRight4.style.opacity = "0.5";

    if(mean>=1)
    birdRight1.style.opacity = "1";
    if(mean>2)
        birdLeft1.style.opacity = "1";
    if(mean>=3)
        birdRight2.style.opacity = "1";
    if(mean>=4)
        birdLeft2.style.opacity = "1";
    if(mean>=5)
        birdRight3.style.opacity = "1";
    if(mean>=6)
        birdLeft3.style.opacity = "1";
    if(mean>=7)
        birdRight4.style.opacity = "1";
    if(mean>=8)
        birdLeft4.style.opacity = "1";
}