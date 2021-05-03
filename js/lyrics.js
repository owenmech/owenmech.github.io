let cnv;
let finished;
let GRID_SIZE = 6;
const KEY_SIZE = 40;
let rawLyrics = "";
let lyrics = "";
let indexData = new Map();
let orderData = new Map();
let curWord = -1;
let hoverWord = -1;
let maxFreq = 0;
let waiting = true;
let optionsOpen = false;
let animating = false;
let hovering = false;

let pBefore = true;
let pAfter = true;
let pOpacity = 0.02;
let pSkew = 0.1;

function setup() {
    uiSetup();
    noLoop();
}

// TODO: HOVER INFO

function generate() {
    pBefore = document.getElementById("beforeBool").checked;
    pAfter = document.getElementById("afterBool").checked;
    pOpacity = parseFloat(document.getElementById("opacitySlider").value);
    pSkew = parseFloat(document.getElementById("skewSlider").value);
    lyricSetup();
}

function toggleOptions() {
    optionsOpen = !optionsOpen;
    let textField = document.getElementById("lyricInput");
    let optionsGroup = document.getElementById("optionsGroup");
    let optionsButton = document.getElementById("optionsButton");
    if (optionsOpen) {
        textField.style.display = "none";
        optionsGroup.style.display = "block";
        optionsButton.innerHTML = "LYRICS";

    } else {
        textField.style.display = "block";
        optionsGroup.style.display = "none";
        optionsButton.innerHTML = "OPTIONS";
    }
}

function uiSetup() {
    let fullSize = min(windowWidth, windowHeight) - 40;
    cnv = createCanvas(fullSize, fullSize);
    cnv.parent("canvDiv");
    let inputParent = document.getElementById("lyricParent");
    let space = document.getElementById("extraSpace");

    if (fullSize > 3 / 4 * windowWidth) { // SKINNY
        cnv.position((windowWidth - fullSize) / 2, fullSize / 2);
        inputParent.style.width = (windowWidth - 40).toString() + "px";
        inputParent.style.height = (fullSize / 2 - 100).toString() + "px";
        space.style.top = (fullSize * 1.5).toString() + "px";
        space.style.display = "block";
    } else {
        cnv.position(windowWidth - fullSize - 20, 20);
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

    GRID_SIZE = (width - KEY_SIZE) / (lyrics.length);

    colorMode(HSB, orderData.size, 1, 1);
    pixelDensity(5);
    frameRate(60);
    textSize(KEY_SIZE / 2);
    background(0);
    push();
    translate(KEY_SIZE, KEY_SIZE);
    if (pBefore) drawGrid();
    curWord = -2;
    animating = true;
    loop();
}

function draw() {
    translate(KEY_SIZE, KEY_SIZE);
    if (rawLyrics.length === 0) return;

    if (curWord < lyrics.length) // animating
    {
        if (curWord >= 0) {
            drawLines(curWord);
            drawKey(curWord, true);
        }
    } else if (animating) { // final frame
        if (pAfter) drawGrid();
        animating = false;
        finished = createGraphics(width, height);
        finished.pixelDensity(5);
        finished.copy(cnv, 0, 0, width, height, 0, 0, width, height);
    } else { // hover time
        checkHover();
    }
    curWord++;
}

function drawGrid(isolate = "") {
    let limit = false;
    if (isolate.length > 0) limit = true;
    strokeWeight(GRID_SIZE / 6);
    const iterator = indexData[Symbol.iterator]();
    for (let pair of iterator) {
        let coords = pair[1];
        stroke(orderData.get(pair[0]), 0.3, 0, 1);
        fill(orderData.get(pair[0]), 0.9, limit && isolate !== pair[0] ? 0.2 : 1);
        for (let i = 0; i < coords.length; i++) {
            for (let j = 0; j < coords.length; j++) {
                circle((coords[i] + .5) * GRID_SIZE, (coords[j] + .5) * GRID_SIZE, GRID_SIZE);
            }
        }
    }
}

function drawLines(word) {
    if (word < 0) return;
    let coords = indexData.get(lyrics[word]);
    strokeWeight(GRID_SIZE / 2);
    stroke(orderData.get(lyrics[word]), 0.9, 1, pSkew * (1 - coords.length / maxFreq) + pOpacity); // alpha should be constant
    for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
            line((coords[i] + .5) * GRID_SIZE, (coords[j] + .5) * GRID_SIZE, (word + .5) * GRID_SIZE, (word + .5) * GRID_SIZE);
        }
    }
}

function drawKey(idx, on) {
    strokeWeight(0);
    fill(orderData.get(lyrics[idx]), 0.9, on ? 1 : 0.2, 1);
    rect(-KEY_SIZE, idx * GRID_SIZE + GRID_SIZE * 0.05, 10, GRID_SIZE * 0.9); // left
    rect(idx * GRID_SIZE + GRID_SIZE * 0.05, -KEY_SIZE, GRID_SIZE * 0.9, 10); // top
}

function checkHover() {
    let idx = -1;
    let mX = mouseX - GRID_SIZE / 2;
    let mY = mouseY - GRID_SIZE / 2;
    let xCoord = round((mX - KEY_SIZE) / (width - KEY_SIZE) * lyrics.length);
    let yCoord = round((mY - KEY_SIZE) / (height - KEY_SIZE) * lyrics.length);
    if (mouseX <= 10 && mouseX >= 0 && mouseY >= KEY_SIZE) {
        idx = yCoord;
    } else if (mouseY <= 10 && mouseY >= 0 && mouseX >= KEY_SIZE) {
        idx = xCoord;
    }

    if (idx > -1 && idx < lyrics.length) {
        hovering = true;
        drawIsolated(idx);
    } else if (xCoord < lyrics.length && yCoord < lyrics.length
        && xCoord > -1 && yCoord > -1
        && lyrics[xCoord] === lyrics[yCoord]) {
        hovering = true;
        drawIsolated(xCoord, yCoord);
    } else if (hovering) {
        copy(finished, 0, 0, width, height, -KEY_SIZE, -KEY_SIZE, width, height);
        hovering = false;
    }
}

function drawIsolated(idx, idx2 = -1) {
    background(0);
    let word = lyrics[idx];

    if (pBefore) drawGrid(word);
    drawLines(idx);
    if (idx2 > -1) drawLines(idx2);
    if (pAfter) drawGrid(word);

    for (let i = 0; i < lyrics.length; i++) {
        drawKey(i, lyrics[i] === word);
    }
    fill(255);
    strokeWeight(0);
    text(word, -KEY_SIZE, -10);
}

function mouseClicked() {
    curWord++;
}

function saveVis() {
    saveCanvas(cnv, Date.now().toString(), 'jpg');
}

function changePreset() {
    let presetsDropdown = document.getElementById("presetsDropdown");
    let idx = parseInt(presetsDropdown.value);
    document.getElementById("beforeBool").checked = presets[idx].b;
    document.getElementById("afterBool").checked = presets[idx].a;
    document.getElementById("opacitySlider").value = presets[idx].o;
    document.getElementById("skewSlider").value = presets[idx].s;
    document.getElementById("lyricInput").value = presets[idx].l;
}

let presets = [
    {
        b: true,
        a: false,
        o: 0.005,
        s: 0.118,
        l: "She may contain the urge to run away\n" +
            "But hold her down with soggy clothes and breezeblocks\n" +
            "Citrezene your fever's gripped me again\n" +
            "Never kisses all you ever send are fullstops, la la la la\n" +
            "Do you know where the wilds things go\n" +
            "They go along to take your honey, la la la la\n" +
            "Break down now weep build up breakfast now\n" +
            "Let's eat my love my love love love, la la la la\n" +
            "Muscle to muscle and toe to toe\n" +
            "The fear has gripped me but here I go\n" +
            "My heart sinks as I jump up\n" +
            "Your hand grips hand as my eyes shut\n" +
            "Ahhh ahhh ahhh ah ah, ahhh ahhh ahhh ah ah\n" +
            "Do you know where the wild things go\n" +
            "They go along to take your honey, la la la la\n" +
            "Break down let's sleep build up breakfast now\n" +
            "Let's eat my love my love love love, la la la la\n" +
            "She bruises coughs she splutters pistol shots\n" +
            "But hold her down with soggy clothes and breezeblocks\n" +
            "She's morphine queen of my vaccine my love my love love love, la la la la\n" +
            "Muscle to muscle and toe to toe\n" +
            "The fear has gripped me but here I go\n" +
            "My heart sinks as I jump up\n" +
            "Your hand grips hand as my eyes shut\n" +
            "And ahhh ahhh ahhh ah ah, ahhh ahhh ahhh ah ah\n" +
            "Ahhh ahhh ahhh ah ah, ahhh ahhh ahhh ah ah\n" +
            "She may contain the urge to runaway\n" +
            "But hold her down with soggy clothes and breezeblocks\n" +
            "Germaline disinfect the scene my love my love love love\n" +
            "But please don't go I love you so my lovely\n" +
            "Please don't go, please don't go, I love you so, I love you so\n" +
            "Please don't go, please don't go, I love you so, I love you so\n" +
            "Please break my heart, hey\n" +
            "Please don't go, please don't go, I love you so, I love you so\n" +
            "Please don't go, please don't go, I love you so, I love you so\n" +
            "Please break my heart, ah ha\n" +
            "Please don't go, I'll eat you whole\n" +
            "I love you so, I love you, so I love you so\n" +
            "Please don't go I'll eat you whole\n" +
            "I love you so, I love you so, I love you so, I love you so"
    },
    {
        b: true,
        a: true,
        o: 0.06,
        s: 0.08,
        l: "Kid A, Kid A\n" +
            "Kid A, Kid A\n" +
            "Everything\n" +
            "Everything\n" +
            "Everything\n" +
            "Everything\n" +
            "In its right place\n" +
            "In its right place\n" +
            "In its right place\n" +
            "In its right place\n" +
            "Yesterday, I woke up sucking on a lemon\n" +
            "Yesterday, I woke up sucking on a lemon\n" +
            "Yesterday, I woke up sucking on a lemon\n" +
            "Yesterday, I woke up sucking on a lemon\n" +
            "Everything\n" +
            "Everything\n" +
            "Everything\n" +
            "In its right place\n" +
            "In its right place\n" +
            "In its right place\n" +
            "Right place\n" +
            "There are two colors in my head\n" +
            "There are two colors in my head\n" +
            "What, what is that you tried to say?\n" +
            "What, what was that you tried to say?\n" +
            "Tried to say\n" +
            "Tried to say\n" +
            "Tried to say\n" +
            "Tried to say\n" +
            "Everything\n" +
            "Everything\n" +
            "Everything\n" +
            "Everything"
    },
    {
        b: true,
        a: true,
        o: 0.042,
        s: 0.036,
        l: "I'm a puppet on a string\n" +
            "Tracy Island, time-travelin' diamond cutter-shaped heartaches\n" +
            "Come to find you four in some velvet mornin' years too late\n" +
            "She's a silver linin', lone ranger ridin' through an open space\n" +
            "In my mind, when she's not right there beside me\n" +
            "I go crazy 'cause here isn't where I wanna be\n" +
            "And satisfaction feels like a distant memory\n" +
            "And I can't help myself\n" +
            "All I wanna ever say is, \"Are you mine?\"\n" +
            "Well, are you mine?\n" +
            "Are you mine?\n" +
            "Are you mine? Oh, ah\n" +
            "I guess what I'm tryin' to say is I need the deep end\n" +
            "Keep imaginin' meetin', wished away entire lifetimes\n" +
            "Unfair we're not somewhere misbehavin' for days\n" +
            "Great escape, lost track of time and space\n" +
            "She's a silver linin', climbin' on my desire\n" +
            "And I go crazy 'cause here isn't where I wanna be\n" +
            "And satisfaction feels like a distant memory\n" +
            "And I can't help myself\n" +
            "All I wanna ever say is, \"Are you mine?\"\n" +
            "Well, are you mine? (Are you mine tomorrow?)\n" +
            "Are you mine? (Or just mine tonight?)\n" +
            "Are you mine? (Are you mine? Mine?)\n" +
            "And the thrill of the chase moves in mysterious ways\n" +
            "So in case I'm mistaken, I\n" +
            "Just wanna hear you say, \"You got me baby\"\n" +
            "\"Are you mine?\"\n" +
            "She's a silver linin', lone ranger ridin' through an open space\n" +
            "In my mind, when she's not right there beside me\n" +
            "I go crazy 'cause here isn't where I wanna be\n" +
            "And satisfaction feels like a distant memory\n" +
            "And I can't help myself\n" +
            "All I wanna ever say is, \"Are you mine?\"\n" +
            "Well, are you mine? (Are you mine tomorrow?)\n" +
            "Are you mine? (Or just mine tonight?)\n" +
            "Are you mine? (Are you mine? Mine?)"
    },
    {
        b: true,
        a: true,
        o: 0.027,
        s: 0.101,
        l: "Did you stand there all alone?\n" +
            "Oh I cannot explain what's going down\n" +
            "I can see you standing next to me\n" +
            "In and out somewhere else right now\n" +
            "You sigh, look away\n" +
            "I can see it clear as day\n" +
            "Close your eyes, so afraid\n" +
            "Hide behind that baby face\n" +
            "Do do do do do do\n" +
            "You can drive all night\n" +
            "Looking for answers in the pouring rain\n" +
            "You wanna find peace of mind\n" +
            "Looking for the answer\n" +
            "Funny how it seems like yesterday\n" +
            "As I recall you were looking out of place\n" +
            "Gathered up your things and slipped away\n" +
            "No time at all I followed you into the hall\n" +
            "Cigarette daydream\n" +
            "You were only seventeen\n" +
            "Soft speak with a mean streak\n" +
            "Nearly brought me to my knees\n" +
            "Do do do do do do\n" +
            "You can drive all night\n" +
            "Looking for the answers in the pouring rain\n" +
            "You wanna find peace of mind\n" +
            "Looking for the answer\n" +
            "If we could find a reason, a reason to change\n" +
            "Looking for the answer\n" +
            "If you could find a reason, a reason to stay\n" +
            "Standing in the pouring rain\n" +
            "Do do do do do do\n" +
            "You can drive all night\n" +
            "Looking for answers in the pouring rain\n" +
            "You wanna find peace of mind\n" +
            "Looking for the answer\n" +
            "If we could find a reason, a reason to change\n" +
            "Looking for the answer\n" +
            "If you could find a reason, a reason to stay\n" +
            "Standing in the pouring rain"
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
    {
        b: true,
        a: false,
        o: 0.07,
        s: 0,
        l: "1\n" +
            "1\n" +
            "1 2\n" +
            "1 3 2\n" +
            "1 4 3 2 5\n" +
            "1 6 4 3 7 2 8 5\n" +
            "1 9 6 4 10 3 11 7 2 12 8 5 13\n" +
            "1 14 9 6 15 4 16 10 3 17 11 7 18 2 19 12 8 20 5 21 13\n" +
            "1 22 14 9 23 6 24 15 4 25 16 10 26 3 27 17 11 28 7 29 18 2 30 19 12 31 8 32 20 5 33 21 13 34\n" +
            "1 35 22 14 36 9 37 23 6 38 24 15 39 4 40 25 16 41 10 42 26 3 43 27 17 44 11 45 28 7 46 29 18 47 2 48 30 19 49 12 50 31 8 51 32 20 52 5 53 33 21 54 13 55 34\n" +
            "1 56 35 22 57 14 58 36 9 59 37 23 60 6 61 38 24 62 15 63 39 4 64 40 25 65 16 66 41 10 67 42 26 68 3 69 43 27 70 17 71 44 11 72 45 28 73 7 74 46 29 75 18 76 47 2 77 48 30 78 19 79 49 12 80 50 31 81 8 82 51 32 83 20 84 52 5 85 53 33 86 21 87 54 13 88 55 34 89"
    }
]