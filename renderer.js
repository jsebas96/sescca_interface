var test = setInterval(sendToPython, 15000);
var { PythonShell } = require('python-shell');
const lottie = require('./lottie');

var view = false;

var byStudent = document.getElementById("ByStudent");
var byGroup = document.getElementById("ByGroup");
byStudent.style.display = "none";
byGroup.style.display = "none";

var sunGroup = document.getElementById("sunGroup");
sunGroup.style.width = "150px";
sunGroup.style.height = "150px";
var meansArray = [];
var k = 0, callLights, callLightsReverse;

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

    PythonShell.run('/home/pi/sescca/sescca_interface/python/which_view.py', options, function (err, states) {
        if (err) throw err;
        view = false;
        for (let i = 0; i < states[0].names.length; i++) {
            // console.log(states[0].states[i]);
            if (states[0].states[i]) {
                if (states[0].names[i] == 'Vista Individual') {
                    // console.log(states[0].names[i]);
                    view = true;
                    byStudent.style.display = "flex";
                    byGroup.style.display = "none";
                    individualView(states[0].sections[i]);
                } else if (states[0].names[i] == 'Vista Grupal') {
                    // console.log(states[0].names[i]);
                    view = true;
                    byStudent.style.display = "none";
                    byGroup.style.display = "flex";
                    groupView(states[0].sections[i]);
                }
            }
        }
        if (view == false) {
            byStudent.style.display = "none";
            byGroup.style.display = "none";
        }
    });
}

function individualView(section_id) {
    let options = {
        mode: 'json',
        args: [section_id]
    };
    let results1 = [];
    PythonShell.run('/home/pi/sescca/sescca_interface/python/ind_view.py', options, function (err, results) {
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
    if (global_control >= times - 1) {
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
            output += '<span class="text ml-2">' + results.names[i] + '</span>';
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
            for (j = 1; j <= Math.ceil(results.scores[i] / 20); j++) {
                if (j == Math.ceil(results.scores[i] / 20) && results.scores[i] % 20 != 0) {
                    output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40" ';
                    output += 'style="opacity:' + (results.scores[i] % 20) * 0.05 + ';"></img>';
                    // console.log((results.scores[i] % 5) * 0.2);
                } else {
                    output += '<img class="mb-1" src="images/sol-con-cara.png" alt="sun" width="40" height="40"></img>';
                }
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

function groupView(section_id) {
    let options = {
        mode: 'json',
        args: [section_id]
    };
    let result1 = [];
    PythonShell.run('/home/pi/sescca/sescca_interface/python/group_view.py', options, function (err, result) {
        if (err) throw err;
        let i = 0, j = 0;
        let times_group = result[0].means.length;
        for (i = 0; i < times_group; i++) {
            result1[i] = JSON.parse('{"names":[], "means":[]}');
            result1[i].names = result[0].names[i];
            result1[i].means = result[0].means[i];
        }
        if (meansArray.length != result[0].means.length) {
            while (meansArray.length != result[0].means.length) {
                if (result[0].means.length > meansArray.length) {
                    meansArray.push(0);
                } else if (result[0].means.length < meansArray.length) {
                    meansArray.pop();
                }
            }
            for (j = 0; j < meansArray.length; j++) {
                meansArray[j] = result[0].means[j];
            }
        }
        showGUIGroup(result1, times_group);
    });
}

function showGUIGroup(result1, times_group) {
    if (global_control >= times_group - 1) {
        global_control = -1;
    }
    global_control += 1;
    let result = result1[global_control];
    let cloud_group = document.getElementById("cloud_group");
    cloud_group.innerHTML = result.names;

    ballLeft1 = document.getElementById("left-1");
    ballLeft2 = document.getElementById("left-2");
    ballLeft3 = document.getElementById("left-3");
    ballLeft4 = document.getElementById("left-4");
    ballRight1 = document.getElementById("right-1");
    ballRight2 = document.getElementById("right-2");
    ballRight3 = document.getElementById("right-3");
    ballRight4 = document.getElementById("right-4");

    balls = [ballLeft1, ballLeft2, ballLeft3, ballLeft4, ballRight1, ballRight2, ballRight3, ballRight4];

    for (element of balls) {
        element.style.opacity = "0.2";
    }

    if (result.means != meansArray[global_control]) {
        if (result.means > meansArray[global_control]) {
            meansArray[global_control] = result.means;
            lights(result.means);
        } else {
            meansArray[global_control] = result.means;
            k = 3;
            lightsReverse(result.means);
        }
    } else {
        sun(result.means);
    }

}

function sun(mean) {
    if (mean >= 0) {
        sunGroup.style.width = "160px";
        sunGroup.style.height = "160px";
    }
    if (mean >= 10) {
        sunGroup.style.width = "170px";
        sunGroup.style.height = "170px";
    }
    if (mean >= 20) {
        sunGroup.style.width = "180px";
        sunGroup.style.height = "180px";
    }
    if (mean >= 30) {
        sunGroup.style.width = "190px";
        sunGroup.style.height = "190px";
    }
    if (mean >= 40) {
        sunGroup.style.width = "200px";
        sunGroup.style.height = "200px";
    }
    if (mean >= 50) {
        sunGroup.style.width = "210px";
        sunGroup.style.height = "210px";
    }
    if (mean >= 60) {
        sunGroup.style.width = "220px";
        sunGroup.style.height = "220px";
    }
    if (mean >= 70) {
        sunGroup.style.width = "230px";
        sunGroup.style.height = "230px";
    }
    if (mean >= 80) {
        sunGroup.style.width = "240px";
        sunGroup.style.height = "240px";
    }
    if (mean >= 90) {
        sunGroup.style.width = "250px";
        sunGroup.style.height = "250px";
    }
    if (mean == 100) {
        sunGroup.style.width = "260px";
        sunGroup.style.height = "260px";
    }
    return;
}

function lights(promedio) {
    if (k == 0)
        callLights = setInterval(lights, 800, [promedio]);
    if (k > 3) {
        clearInterval(callLights);
        k = 0;
        for (element of balls) {
            element.style.opacity = "0.2";
        }
        sun(promedio);
        return;
    }

    balls[k].style.opacity = "1";
    balls[k + 4].style.opacity = "1";
    if (k > 0) {
        for (let m = 0; m < k; m++) {
            balls[m].style.opacity = "0.2";
            balls[m + 4].style.opacity = "0.2";
        }
    }
    k++;
}

function lightsReverse(promedio) {
    if (k == 3)
        callLightsReverse = setInterval(lightsReverse, 800, [promedio]);
    sun(promedio);
    if (k == -1) {
        clearInterval(callLightsReverse);
        k = 0;
        for (element of balls) {
            element.style.opacity = "0.2";
        }
        return;
    }

    balls[k].style.opacity = "1";
    balls[k + 4].style.opacity = "1";
    if (k < 3) {
        for (let m = 3; m > k; m--) {
            balls[m].style.opacity = "0.2";
            balls[m + 4].style.opacity = "0.2";
        }
    }
    k--;
}