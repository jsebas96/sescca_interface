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

let i = 5;
if(i>=1)
    birdRight1.style.opacity = "1";
if(i>2)
    birdLeft1.style.opacity = "1";
if(i>=3)
    birdRight2.style.opacity = "1";
if(i>=4)
    birdLeft2.style.opacity = "1";
if(i>=5)
    birdRight3.style.opacity = "1";
if(i>=6)
    birdLeft3.style.opacity = "1";
if(i>=7)
    birdRight4.style.opacity = "1";
if(i>=8)
    birdLeft4.style.opacity = "1";
// var test = setInterval(sendToPython, 10000);


// function sendToPython() {
//     var { PythonShell } = require('python-shell');

//     let options = {
//         mode: 'json',
//         //args: [input.value]
//     };
//     var results1 = [];//JSON.parse('{"names":[], "scores":[]}');

//     PythonShell.run('python/ind_view.py', options, function (err, results) {
//         if (err) throw err;
//     });
// }