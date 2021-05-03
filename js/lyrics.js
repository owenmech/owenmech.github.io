let GRID_SIZE = 6;
let lyrics = "";
let indexData = new Map();
let orderData = new Map();
let curWord = -1;
let cnv;
let maxFreq = 0;
let waiting = true;
let optionsOpen = false;

let pBefore = true;
let pAfter = true;
let pOpacity = 0.02;
let pSkew = 0.1;

function setup() {
    uiSetup();
    noLoop();
}

// HOVER INFO

function generate() {
    if (optionsOpen) {
        pBefore = document.getElementById("beforeBool").checked;
        pAfter = document.getElementById("afterBool").checked;
        pOpacity = document.getElementById("opacitySlider").value * 0.2;
        pSkew = document.getElementById("skewSlider").value * 0.2;
        reRender();
    } else {
        lyricSetup();
    }
}

function toggleOptions() {
    optionsOpen = !optionsOpen;
    let textField = document.getElementById("lyricInput");
    let optionsGroup = document.getElementById("optionsGroup");
    let generateButton = document.getElementById("generateButton");
    let optionsButton = document.getElementById("optionsButton");
    if (optionsOpen) {
        textField.style.display = "none";
        optionsGroup.style.display = "block";
        optionsButton.innerHTML = "LYRICS";
        generateButton.innerHTML = "APPLY";

    } else {
        textField.style.display = "block";
        optionsGroup.style.display = "none";
        optionsButton.innerHTML = "OPTIONS";
        generateButton.innerHTML = "GENERATE";
    }
}

function uiSetup() {
    let fullSize = min(windowWidth, windowHeight) - 40;
    cnv = createCanvas(fullSize, fullSize);
    if (fullSize > 3 / 4 * windowWidth) {
        cnv.position((windowWidth - fullSize) / 2, fullSize / 2);
    } else {
        cnv.position(windowWidth - fullSize - 20, 20);
    }
    cnv.parent("canvDiv");

    let inputParent = document.getElementById("lyricParent");
    let space = document.getElementById("extraSpace");
    if (fullSize > 3 / 4 * windowWidth) { // SKINNY
        inputParent.style.width = (windowWidth - 40).toString() + "px";
        inputParent.style.height = (fullSize / 2 - 100).toString() + "px";
        space.style.top = (fullSize * 1.5).toString() + "px";
        space.style.display = "block";
    } else {
        inputParent.style.width = (windowWidth - fullSize - 100).toString() + "px";
        inputParent.style.height = (windowHeight - 100).toString() + "px";
        space.style.display = "none";
    }
}

function lyricSetup() {
    rawLyrics = document.getElementById("lyricInput").value;
    rawLyrics = rawLyrics.replace(/[.,\/#!$%\^&\*\";:{}=\-_`~()]/g, "");
    rawLyrics = rawLyrics.replace(/[\n]/g, " ");
    rawLyrics = rawLyrics.replace(/\s{2,}/g, " ");
    rawLyrics = rawLyrics.toLowerCase();

    lyrics = rawLyrics.split(" ");
    indexData = new Map();
    let alpha = [];
    for (let l = 0; l < lyrics.length; l++) {
        let word = lyrics[l];
        if (word.length === 0) {
            lyrics.splice(l, 1);
            continue;
        }
        if (!indexData.has(word)) {
            indexData.set(word, []);
            alpha.push(word);
        }
        indexData.get(word).push(l);
        maxFreq = max(maxFreq, indexData.get(word).length);
    }

    //alphabetize
    orderData = new Map();
    alpha.sort();
    for (let i = 0; i < alpha.length; i++) {
        orderData.set(alpha[i], i);
    }

    GRID_SIZE = width / lyrics.length;

    colorMode(HSB, orderData.size, 1, 1);
    pixelDensity(5);
    background(0);
    if (pBefore) drawGrid();
    loop();
}

function draw() {
    if (rawLyrics.length === 0) return;
    if (frameCount % 1 === 0) curWord++;
    // for (curWord = 0; curWord < lyrics.length; curWord++) {
    //     drawLines();
    // }
    if (curWord >= lyrics.length) {
        // drawGrid();
        noLoop();
        curWord = -1;
        if (pAfter) drawGrid();
    } else {
        drawLines();
    }
}

function reRender() {
    background(0);
    if (pBefore) drawGrid();
    drawAllLines();
    if (pAfter) drawGrid();
}

function drawGrid() {
    const iterator = indexData[Symbol.iterator]();
    for (let pair of iterator) {
        let coords = pair[1];
        strokeWeight(GRID_SIZE / 6);
        stroke(orderData.get(pair[0]), 0.3, 0, 1);
        fill(orderData.get(pair[0]), 0.95, 1);
        for (let i = 0; i < coords.length; i++) {
            for (let j = 0; j < coords.length; j++) {
                circle((coords[i] + .5) * GRID_SIZE, (coords[j] + .5) * GRID_SIZE, GRID_SIZE);
            }
        }
    }
    strokeWeight(2);
    stroke(255);
    fill(255);
}

function drawLines() {
    if (curWord < 0) return;
    let coords = indexData.get(lyrics[curWord]);
    strokeWeight(GRID_SIZE / 2);
    stroke(orderData.get(lyrics[curWord]), 1, 1, pSkew * (1 - coords.length / maxFreq) + pOpacity); // alpha should be constant
    // 0.08 * (1 - coords.length / maxFreq) + 0.02
    for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
            line((coords[i] + .5) * GRID_SIZE, (coords[j] + .5) * GRID_SIZE, (curWord + .5) * GRID_SIZE, (curWord + .5) * GRID_SIZE);
        }
    }
}

function drawAllLines() {
    for (curWord = 0; curWord < lyrics.length; curWord++) {
        drawLines();
    }
    curWord = -1;
}

function mouseClicked() {
    curWord++;
}

function keyPressed() {
    if (keyCode === TAB) {
        saveCanvas(cnv, 'matrix', 'jpg');
    }
}

let rawLyrics = "";