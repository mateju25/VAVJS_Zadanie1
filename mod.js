/*
* Autor: Matej Delincak
* Naposledy upravene: 7.10.2021
*
* Tento js subor je mod pre hru index.js.
*
* Pre zapnutie debug modu zadajte do URL parameter debug=true
* Priklad: http://localhost:63342/Zadanie1/index.html?debug=true
*
*
* */

const SIZE_OF_BLOCK = 48;
const NUMBER_OF_BLOCKS = 11;
const LINE_WIDTH = 2;

const image_alien = new Image();
image_alien.src = "https://www.clipartmax.com/png/full/9-93760_cute-sunshine-clipart.png"; //licencia https://www.clipartmax.com/middle/m2i8K9G6G6K9A0b1_free-to-use-public-domain-space-clip-art-alien-spaceship-cartoon-png/
const image_missile = new Image();
image_missile.src = "https://www.clipartmax.com/png/full/31-317895_rocket-images-clip-art.png"; //licencia https://www.clipartmax.com/middle/m2i8i8m2H7Z5d3H7_rocket-clipart-missile-clipart/
const image_ship = new Image();
image_ship.src = "https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/648ecfa1ee4c757.png"; // licencia http://pixelartmaker.com/art/648ecfa1ee4c757
const image_background = new Image();
image_background.src = "https://wallpaperaccess.com/download/pixel-space-2513478"; // licencia https://wallpaperaccess.com/pixel-space
image_background.addEventListener("load",function () {
    clearCanvas();
});

let audio = new Audio('http://free-loops.com/force-audio.php?id=8618'); //licencia http://free-loops.com/8618-melodic-dubstep-140.html
let score = 0;
let debug = false;

initSpace();

function initSpace() {
    // remove old table
    let space = document.getElementById('space').querySelector('table');
    space.parentNode.removeChild(space);

    // create a canvas
    let canvas = document.createElement('canvas');
    canvas.id = 'canvasId';
    document.getElementById('space').appendChild(canvas);
    canvas.setAttribute('width', SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH);
    canvas.setAttribute('height', SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH);

    // workaround for error while music playing
    let link = document.createElement("link");
    link.rel = "shortcut icon";
    link.href = "#";
    document.getElementById("cssmissile").parentNode.appendChild(link);

    // create a reset button
    let reset_button = document.createElement("button");
    reset_button.innerHTML = "Reset";
    reset_button.style = "margin-left: 20px";
    document.getElementById('start').parentNode.appendChild(reset_button);
    reset_button.addEventListener("click", () => {
        window.aliens = [1, 3, 5, 7, 9, 23, 25, 27, 29, 31];
        window.direction = 1;
        window.ship = [104, 114, 115, 116];
        window.missiles = [];
        window.level = 1;
        window.speed = 512;
        running = false;
        score = 0;
        document.getElementById("levelId").innerHTML = "Level: " + window.level;
        document.getElementById("scoreId").innerHTML = "Score: " + score;

        if (debug)
            console.log("Reset");

        clearCanvas();
    });

    // create a music button
    let music_start_button = document.createElement("button");
    music_start_button.innerHTML = "Play music";
    music_start_button.id = 'musicBtnId';
    music_start_button.style = "margin-left: 20px";
    document.getElementById('start').parentNode.appendChild(music_start_button);
    music_start_button.addEventListener("click", () => {
        if (audio.paused) {
            if (debug)
                console.log("Audio play");
            audio.volume = 0.5;
            audio.loop = true;
            audio.play();
            document.getElementById('musicBtnId').innerHTML = "Stop music";
        } else {
            if (debug)
                console.log("Audio pause");
            audio.pause();
            document.getElementById('musicBtnId').innerHTML = "Play music";
        }
    });

    // create a score label
    let score_label = document.createElement("Label");
    score_label.innerHTML = "Score: " + score;
    score_label.id = "scoreId";
    score_label.style = "margin-left: 20px";
    document.getElementById('start').parentNode.appendChild(score_label);

    // create a level label
    let level_label = document.createElement("Label");
    level_label.innerHTML = "Level: " + window.level;
    level_label.id = "levelId";
    level_label.style = "margin-left: 20px";
    document.getElementById('start').parentNode.appendChild(level_label);

    // create a level label
    let speed_label = document.createElement("Label");
    speed_label.innerHTML = "Speed: " + window.speed;
    speed_label.id = "speedId";
    speed_label.style = "margin-left: 20px";
    document.getElementById('start').parentNode.appendChild(speed_label);

    clearCanvas();

    // check parameters for debug
    let param = window.location.search.substr(1);
    let tmp = param.split("=");
    if (tmp[0] === "debug" && tmp[1] === "true")
        debug = true;
}

function clearCanvas() {
    let canvas = document.getElementById('canvasId');
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.drawImage(image_background, 0, 0, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH);
    ctx.stroke();
}

function putImage(img, x) {
    let canvas = document.getElementById('canvasId');
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.drawImage(img, 1.5 * LINE_WIDTH + (x % NUMBER_OF_BLOCKS) * SIZE_OF_BLOCK, 1.5 * LINE_WIDTH + Math.floor(x / NUMBER_OF_BLOCKS) * SIZE_OF_BLOCK, SIZE_OF_BLOCK - LINE_WIDTH, SIZE_OF_BLOCK - LINE_WIDTH)
    ctx.stroke();
}

window.drawSpace = function () {
    let canvas = document.getElementById('canvasId');
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.drawImage(image_background, 0, 0, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH);
    ctx.stroke();
}

window.drawAliens = function () {
    for (let i = 0; i < aliens.length; i++) {
        putImage(image_alien, aliens[i]);
    }
}

window.drawShip = function () {
    for (let i = 0; i < ship.length; i++) {
        putImage(image_ship, ship[i]);
    }
}


window.drawMissiles = function () {
    for (let i = 0; i < missiles.length; i++) {
        putImage(image_missile, missiles[i]);
    }
}

window.loose = function () {
    if (debug)
        console.log("Loss");
    let canvas = document.getElementById('canvasId');
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image_background, 0, 0, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH);
    ctx.font='100px Arial';
    ctx.fillStyle = "#ff0000";
    ctx.fillText("LOSS", SIZE_OF_BLOCK * NUMBER_OF_BLOCKS / 4, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS / 2);
    ctx.stroke();
    running = false;
}

window.win = function () {
    if (debug)
        console.log("Win");
    let canvas = document.getElementById('canvasId');
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image_background, 0, 0, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS + 2 * LINE_WIDTH);
    ctx.font='100px Arial';
    ctx.fillStyle = "#3dff00";
    ctx.fillText("WIN", SIZE_OF_BLOCK * NUMBER_OF_BLOCKS / 4 + 40, SIZE_OF_BLOCK * NUMBER_OF_BLOCKS / 2);
    ctx.stroke();
    running = false;
}

window.checkKey = function (e) {
    let i;
    e = e || window.event;
    if (e.keyCode == '37' || e.keyCode == '65') {
        if (debug)
            console.log("Ship to left");
        if (ship[0] > 100) {
            i = 0;
            for (i = 0; i < ship.length; i++) {
                ship[i]--;
            }
        }
    } else if ((e.keyCode == '39' || e.keyCode == '68') && ship[0] < 108) {
        if (debug)
            console.log("Ship to right");
        i = 0;
        for (i = 0; i < ship.length; i++) {
            ship[i]++;
        }
    } else if (e.keyCode == '32') {
        if (debug)
            console.log("Shoot");
        missiles.push(ship[0] - 11);
    }
}

let a = window.nextLevel;
window.nextLevel = function () {
    a();
    document.getElementById("levelId").innerHTML = "Level: " + window.level;
    document.getElementById("speedId").innerHTML = "Speed: " + window.speed;
}

window.checkCollisionsMA = function () {
    for (let i = 0; i < missiles.length; i++) {
        if (aliens.includes(missiles[i])) {
            if (debug)
                console.log("Hit");
            score += 10;
            document.getElementById("scoreId").innerHTML = "Score: " + score;
            let alienIndex = aliens.indexOf(missiles[i]);
            aliens.splice(alienIndex, 1);
            missiles.splice(i, 1);
        }
    }
}
