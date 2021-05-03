let GRID_SIZE = 6;
let rawLyrics = "";
let lyrics = "";
let indexData = new Map();
let orderData = new Map();
let curWord = -1;
let cnv;
let maxFreq = 0;
let waiting = true;
let optionsOpen = false;
let applying = 0;

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
        let generateButton = document.getElementById("generateButton");
        let optionsButton = document.getElementById("optionsButton");
        let presetsDropdown = document.getElementById("presetsDropdown");
        generateButton.innerHTML = "....."
        generateButton.disabled = true;
        optionsButton.disabled = true;
        presetsDropdown.disabled = true;
        pBefore = document.getElementById("beforeBool").checked;
        pAfter = document.getElementById("afterBool").checked;
        pOpacity = parseFloat(document.getElementById("opacitySlider").value);
        pSkew = parseFloat(document.getElementById("skewSlider").value);
        applying = 3;
        loop();
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
    curWord = -3;
    loop();
}

function draw() {
    if (applying > 0) {
        applying--;
        if (applying === 0) {
            reRender();
            applying = false;
            noLoop();
        }
        return;
    }
    if (rawLyrics.length === 0) return;
    curWord++;
    if (curWord >= lyrics.length) {
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
    let generateButton = document.getElementById("generateButton");
    let optionsButton = document.getElementById("optionsButton");
    let presetsDropdown = document.getElementById("presetsDropdown");
    generateButton.innerHTML = "APPLY"
    generateButton.disabled = false;
    optionsButton.disabled = false;
    presetsDropdown.disabled = false;
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

function changePreset() {
    let presetsDropdown = document.getElementById("presetsDropdown");
    let idx = parseInt(presetsDropdown.value);
    document.getElementById("beforeBool").checked = presets[idx].b;
    document.getElementById("afterBool").checked = presets[idx].a;
    document.getElementById("opacitySlider").value = presets[idx].o;
    document.getElementById("skewSlider").value = presets[idx].s;
    document.getElementById("lyricInput").value = presets[idx].l;
    pBefore = presets[idx].b;
    pAfter = presets[idx].a;
    pOpacity = presets[idx].o;
    pSkew = presets[idx].s;
}

let presets = [
    {
        b: false,
        a: true,
        o: 0.016,
        s: 0.03,
        l: "0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s\n" +
            "t\n" +
            "s\n" +
            "r\n" +
            "q\n" +
            "p\n" +
            "o o\n" +
            "n\n" +
            "m\n" +
            "l\n" +
            "k k\n" +
            "j\n" +
            "i\n" +
            "h h\n" +
            "g g\n" +
            "f\n" +
            "e e\n" +
            "d d\n" +
            "c\n" +
            "b b\n" +
            "a a\n" +
            "9 9 9\n" +
            "8 8\n" +
            "7 7 7\n" +
            "6 6\n" +
            "5 5 5\n" +
            "4 4 4 4\n" +
            "3 3 3 3\n" +
            "2 2 2 2 2\n" +
            "1 1 1 1 1 1 1\n" +
            "0 0 0 0 0 0 0 0 0 0\n" +
            "0 0 0 0 0 0 0 0 0 0\n" +
            "1 1 1 1 1 1 1\n" +
            "2 2 2 2 2\n" +
            "3 3 3 3\n" +
            "4 4 4 4\n" +
            "5 5 5\n" +
            "6 6\n" +
            "7 7 7\n" +
            "8 8\n" +
            "9 9 9\n" +
            "a a\n" +
            "b b\n" +
            "c\n" +
            "d d\n" +
            "e e\n" +
            "f\n" +
            "g g\n" +
            "h h\n" +
            "i\n" +
            "j\n" +
            "k k\n" +
            "l\n" +
            "m\n" +
            "n\n" +
            "o o\n" +
            "p\n" +
            "q\n" +
            "r\n" +
            "s\n" +
            "t\n" +
            "s r q p o n m l k j i h g f e d c b a 9 8 7 6 5 4 3 2 1 0"
    },
    {
        b: false,
        a: false,
        o: 0,
        s: 0.15,
        l: "A5 Ab5 G5 Gb5 G5 Gb5 F5 E5 F5 E5 Eb5 D5 Db5 C5 B4 Bb4\n" +
            "A4 Ab4 G4 Gb4 G4 Gb4 F4 E4 F4 E4 Eb4 D4 Db4 C4 B4 Bb4\n" +
            "A3 Ab3 G3 Gb3 G3 Gb3 F3 E3 A3 Ab3 G3 Gb3 G3 Gb3 F3 E3\n" +
            "A3 Ab3 G3 Gb3 F3 Bb3 A3 Ab3 A3 Ab3 G3 Gb3 F3 Gb3 G3 Ab3\n" +
            "A3 Ab3 G3 Gb3 F3 Bb3 A3 Ab3 A3 Ab3 G3 Gb3 F3 Gb3 G3 Ab3\n" +
            "A3 Ab3 G3 Gb3 G3 Gb3 F3 E3 F3 Gb3 G3 Ab3 A3 Bb3 A3 Ab3\n" +
            "A3 Ab3 G3 Gb3 G3 Gb3 F3 E3 F3 Gb3 G3 Ab3 A3 B3 C4 Db4\n" +
            "D4 Db4 C4 B3 Bb3 Eb4 D4 Db4 D4 Db4 C4 B3 Bb3 B3 C4 Db4\n" +
            "D4 Db4 C4 B3 Bb3 Eb4 D4 Db4 D4 Db4 C4 B3 Bb3 B3 C4 Db4\n" +
            "D4 Db4 C4 B3 C4 B3 Bb3 A3 Bb3 B3 C4 Db4 D4 Eb4 D4 Eb4\n" +
            "D4 Db4 C4 B3 C4 B3 Bb3 A3 Bb3 B3 C4 Db4 D4 Eb4 D4 Eb4\n" +
            "D4 D3 D3 D3 D3 D3 D3 D3 Eb3 D3 Eb3 Eb4 Eb3 D3 Eb3 Eb4\n" +
            "D3 D4 D4 D4 D4 D4 D4 D4 Eb4 D4 Eb4 Eb5 Eb4 D4 Eb4 Eb5\n" +
            "D4 Eb4 D4 Db4 D4 Eb4 D4 Db4 D4 Eb4 D4 Db4 D4 Eb4 D4 Db4\n" +
            "D4 Eb4 E4 F4 Gb4 F4 E4 Eb4 D4 Eb4 E4 F4 Gb4 F4 E4 Eb4\n" +
            "D4 G3 G3 G3 G3 G3 G3 G3 Ab3 G3 Ab3 Ab4 Ab3 G3 Ab3 Ab4\n" +
            "G3 G4 G4 G4 G4 G4 G4 G4 Ab4 G4 Ab4 Ab5 Ab4 G4 Ab4 Ab5\n" +
            "G4 Ab4 G4 Gb4 G4 Ab4 G4 Gb4 G4 Ab4 G4 Gb4 G4 Ab4 G4 Gb4\n" +
            "G4 Ab4 A4 Bb4 B4 Bb4 A4 Ab4 G4 Ab4 A4 Bb4 B4 Bb4 A4 Ab4"
    },
    {
        b: true,
        a: true,
        o: 0,
        s: 0,
        l: "1\n" +
            "1 2 1\n" +
            "1 2 3 2 1\n" +
            "1 2 3 4 3 2 1\n" +
            "1 2 3 4 5 4 3 2 1\n" +
            "1 2 3 4 5 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 8 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 8 9 8 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 8 9 a 9 8 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 8 9 a b a 9 8 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 8 9 a 9 8 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 8 9 8 7 6 5 4 3 2 1 \n" +
            "1 2 3 4 5 6 7 8 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 7 6 5 4 3 2 1\n" +
            "1 2 3 4 5 6 5 4 3 2 1\n" +
            "1 2 3 4 5 4 3 2 1\n" +
            "1 2 3 4 3 2 1\n" +
            "1 2 3 2 1\n" +
            "1 2 1\n" +
            "1"
    },

]