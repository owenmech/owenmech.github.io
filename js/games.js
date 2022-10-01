document.addEventListener('DOMContentLoaded', (event) => {
    initGames();

    initSpective();
    initRotator();
    initWordflop()
    initCheckItOut();

    resizeGames();
});

function resizeGames() {
    resizeSpective();
    resizeRotator();
    resizeWordflop();
    resizeCheckItOut();

    scrollGames();
}

window.addEventListener('resize', resizeGames);

function scrollGames() {
    scrollSpective();
    scrollRotator();
    scrollWordflop();
    scrollCheckItOut();
}

document.addEventListener("scroll", scrollGames);

// region logo
var animState = 1;
const STATES = 8;
var box1, box2, box3, box4;

function initGames() {
    self.setInterval(updateGames, 175);
    box1 = document.getElementById('logo-1');
    box2 = document.getElementById('logo-2');
    box3 = document.getElementById('logo-3');
    box4 = document.getElementById('logo-4');

    // randomHue(box1);
    // randomHue(box2);
    // randomHue(box3);
    // randomHue(box4);
}

function updateGames() {
    updateCoin(box4, "coin", animState);
    updateCoin(box3, "coin", animState + 1);
    updateCoin(box2, "big-coin", animState + 2);
    updateCoin(box1, "coin", animState + 3);
    animState = animState % STATES + 1;
}

function updateCoin(box, name, state) {
    if (state > 8) {
        state -= 8;
    }
    if (state === 4) {
        randomHue(box);
    }
    if (state > 4) {
        state -= 4;
    }
    box.className = name + state;
}

function randomHue(box) {
    let hue = Math.random() * 360;
    box.style.filter = "hue-rotate(" + hue + "deg)";
}

// endregion logo

// region spective
let spectiveStrip;
let polyLeft, polyRight;
const squareLCoords = [
    [30, 30], // TL
    [70, 30], // TR
    [70, 30], // (TR)
    [70, 70], // BR
    [30, 70], // (BL)
    [30, 70] // BL
];
const diamondCoords = [
    [50, 20], // T
    [100, 45], // R
    [100, 50], // (R)
    [50, 85], // (B)
    [0, 50], // (L)
    [0, 45] // L
];
const squareRCoords = [
    [30, 30], // TL
    [70, 30], // TR
    [70, 70], // BR
    [70, 70], // (BR)
    [30, 70], // (BL)
    [30, 70] // BL
];
const trapezoidCoords = [
    [20, 30], // TL
    [80, 30], // TR
    [100, 70], // BR
    [100, 75], // (BR)
    [0, 75], // (BL)
    [0, 70] // BL
];

function initSpective() {
    spectiveStrip = document.getElementById('spective');
    polyLeft = document.getElementById('poly-left');
    polyRight = document.getElementById('poly-right');
}

function resizeSpective() {

}

function scrollSpective() {
    // left shape
    let leftProgress = scrollRemap(spectiveStrip, 0.2, 0.5);
    for (let i = 0; i < squareLCoords.length; ++i) {
        polyLeft.points[i].x = myLerp(squareLCoords[i][0], diamondCoords[i][0], leftProgress);
        polyLeft.points[i].y = myLerp(squareLCoords[i][1], diamondCoords[i][1], leftProgress);
    }

    // right shape
    let rightProgress = scrollRemap(spectiveStrip, 0.35, 0.65);
    for (let i = 0; i < squareRCoords.length; ++i) {
        polyRight.points[i].x = myLerp(squareRCoords[i][0], trapezoidCoords[i][0], rightProgress);
        polyRight.points[i].y = myLerp(squareRCoords[i][1], trapezoidCoords[i][1], rightProgress);
    }
}

// endregion spective

// region rotator
let rotatorStrip;
let rcTL, rcTR, rcBR, rcBL;
let rotTL, rotTR, rotBR, rotBL;
const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];

function initRotator() {
    rotatorStrip = document.getElementById('rotator');
    rcTL = document.getElementById('rot-cont-tl');
    rcTR = document.getElementById('rot-cont-tr');
    rcBR = document.getElementById('rot-cont-br');
    rcBL = document.getElementById('rot-cont-bl');
    rotTL = document.getElementById('rot-tl');
    rotTR = document.getElementById('rot-tr');
    rotBR = document.getElementById('rot-br');
    rotBL = document.getElementById('rot-bl');

    initRot(rotTL);
    initRot(rotTR);
    initRot(rotBR);
    initRot(rotBL);
}

function initRot(rot) {
    let center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    center.setAttribute('r', '5');
    center.setAttribute('cx', '50');
    center.setAttribute('cy', '50');
    rot.appendChild(center);

    let occupied = new Set();
    occupied.add([1, 1].join());
    let open = [];
    open.push({from: [1, 1], to: [1, 0]}); // T
    open.push({from: [1, 1], to: [2, 1]}); // R
    open.push({from: [1, 1], to: [1, 2]}); // B
    open.push({from: [1, 1], to: [0, 1]}); // L

    let numNodes = Math.floor(Math.random() * 3 + 1); // 1-3 new nodes
    for (let i = 0; i < numNodes; ++i) {
        // select open connection
        let randInd = Math.floor(Math.random() * open.length);
        let bridge = open[randInd];
        open.splice(randInd, 1);
        occupied.add(bridge.to.join());

        // display node
        let node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        node.setAttribute('r', '5');
        node.setAttribute('cx', (bridge.to[0] * 25 + 25).toString());
        node.setAttribute('cy', (bridge.to[1] * 25 + 25).toString());
        rot.appendChild(node);

        // display line
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', (bridge.from[0] * 25 + 25).toString());
        line.setAttribute('y1', (bridge.from[1] * 25 + 25).toString());
        line.setAttribute('x2', (bridge.to[0] * 25 + 25).toString());
        line.setAttribute('y2', (bridge.to[1] * 25 + 25).toString());
        line.setAttribute('style', 'stroke:rgb(0,0,0);stroke-width:3');
        rot.appendChild(line);

        // add new potential connections
        for (let d = 0; d < dirs.length; ++d) {
            let spot = [
                bridge.to[0] + dirs[d][0],
                bridge.to[1] + dirs[d][1]
            ];
            if (!occupied.has(spot.join())
                && spot[0] >= 0 && spot[0] <= 2
                && spot[1] >= 0 && spot[1] <= 2) {
                // valid potential spot
                open.push({from: bridge.to, to: spot});
            }
        }
    }
}

function resizeRotator() {

}

function scrollRotator() {
    let progressTL = scrollRemap(rotatorStrip, 0.2, 0.4);
    let progressTR = scrollRemap(rotatorStrip, 0.3, 0.5);
    let progressBR = scrollRemap(rotatorStrip, 0.4, 0.6);
    let progressBL = scrollRemap(rotatorStrip, 0.5, 0.7);
    rcTL.style.transform = 'rotate(' + (progressTL * 90) + 'deg)';
    rcTR.style.transform = 'rotate(' + (progressTR * 90) + 'deg)';
    rcBR.style.transform = 'rotate(' + (progressBR * 90) + 'deg)';
    rcBL.style.transform = 'rotate(' + (progressBL * 90) + 'deg)';
}

//endregion rotator

// region wordflop
let wordflopStrip;
let wfWords, wfPlaceholder;
let wordCount = 0;
let wordElems = [];
let wfColByRow = [];
const pathLength = 5;
let wordPaths = [];
let wordCycle = [
    "WORD",
    "WOOD",
    "FOOD",
    "FOOT",
    "SOOT",
    "SLOT",
    "SLOP",
    "FLOP",
    "FLOW",
    "FLEW",
    "FLED",
    "FEED",
    "DEED",
    "DYED",
    "DYES",
    "EYES",
    "EVES",
    "EVEN",
    "OVEN",
    "OWEN",
    "OWED",
    "AWED",
    "APED",
    "SPED",
    "SEED",
    "SEES",
    "SEWS",
    "MEWS",
    "MESS",
    "MESH",
    "MECH",
    "MUCH",
    "MUSH",
    "MUST",
    "MAST",
    "EAST",
    "EASY",
    "EASE",
    "CASE",
    "CARE",
    "CARD",
    "HARD",
    "HARE",
    "HIRE",
    "SIRE",
    "SITE",
    "SINE",
    "SANE",
    "SAME",
    "GAME",
    "GALE",
    "GALL",
    "FALL",
    "FELL",
    "FELT",
    "FEET",
    "FRET",
    "FREE",
    "FLEE",
    "FLEX",
    "FLAX",
    "FLAY",
    "PLAY",
    "CLAY",
    "CLAD",
    "GLAD",
    "GOAD",
    "GOOD",
    "GOON",
    "GOWN",
    "DOWN",
    "DAWN",
    "LAWN",
    "LAIN",
    "LOIN",
    "LOAN",
    "LOAD",
    "LEAD",
    "LEND",
    "FEND",
    "FIND",
    "FINS",
    "PINS",
    "PANS",
    "PATS",
    "PATH",
    "MATH",
    "MATE",
    "MARE",
    "FARE",
    "FIRE",
    "FIVE",
    "FILE",
    "FILL",
    "SILL",
    "SELL",
    "SEAL",
    "SEAR",
    "STAR",
    "SOAR",
    "BOAR",
    "BOAS",
    "BIAS",
    "BITS",
    "BITE",
    "RITE",
    "RATE",
    "RATS",
    "RUTS",
    "RUNS",
    "RUNT",
    "HUNT",
    "HINT",
    "PINT",
    "PING",
    "SING",
    "SONG",
    "SONS",
    "SOBS",
    "ROBS",
    "RIBS",
    "RIMS",
    "AIMS",
    "ALMS",
    "ALPS",
    "APPS",
    "ASPS",
    "ASKS",
    "ARKS",
    "IRKS",
    "INKS",
    "INNS",
    "IONS",
    "TONS",
    "TANS",
    "BANS",
    "BAND",
    "HAND",
    "RAND",
    "RAID",
    "RAIL",
    "FAIL",
    "FOIL",
    "FOUL",
    "FOUR",
    "POUR",
    "POUT",
    "PORT",
    "PORE",
    "LORE",
    "LOVE",
    "MOVE",
    "MOLE",
    "SOLE",
    "SOLO",
    "SILO",
    "SILK",
    "MILK",
    "MILE",
    "MALE",
    "MADE",
    "WADE",
    "WADS",
    "DADS",
    "DUDS",
    "DUES",
    "HUES",
    "SUES",
    "SUNS",
    "SUNK",
    "SUCK",
    "PUCK",
    "PACK",
    "PACT",
    "PAST",
    "PEST",
    "TEST",
    "TENT",
    "TINT",
    "TINE",
    "TONE",
    "CONE",
    "CODE",
    "BODE",
    "BONE",
    "BANE",
    "BASE",
    "BAKE",
    "TAKE",
    "TYKE",
    "TYPE",
    "TAPE",
    "TAPS",
    "TAGS",
    "BAGS",
    "BUGS",
    "BOGS",
    "BOWS",
    "BOWL",
    "BOIL",
    "COIL",
    "COIN",
    "CORN",
    "TOWN",
    "TOWS",
    "LOWS",
    "LOGS",
    "LOGO",
    "POGO",
    "POLO",
    "POLE",
    "PALE",
    "PALL",
    "PAIL",
    "PAID",
    "SAID",
    "SKID",
    "SKIN",
    "SPIN",
    "SHIN",
    "THIN",
    "THEN",
    "TEEN",
    "BEEN",
    "BEES",
    "FEES",
    "FENS",
    "FANS",
    "FADS",
    "FADE",
    "FAME",
    "LAME",
    "LANE",
    "LONE",
    "LONG",
    "LUNG",
    "SUNG",
    "SANG",
    "RANG",
    "RANT",
    "RAFT",
    "RIFT",
    "LIFT",
    "LIST",
    "LAST",
    "LASS",
    "BASS",
    "BARS",
    "BARN",
    "EARN",
    "EARS",
    "CARS",
    "CART",
    "PART",
    "PARS",
    "PASS",
    "MASS",
    "MOSS",
    "MOST",
    "COST",
    "COAT",
    "CHAT",
    "CHAP",
    "CHIP",
    "SHIP",
    "SLIP",
    "SKIP",
    "SKIM",
    "SWIM",
    "SWAM",
    "SLAM",
    "SEAM",
    "SEAT",
    "SENT",
    "WENT",
    "WEST",
    "WEPT",
    "KEPT",
    "KELT",
    "MELT",
    "MALT",
    "SALT",
    "SALE",
    "TALE",
    "TALL",
    "TELL",
    "TEAL",
    "TEAR",
    "PEAR",
    "PEER",
    "PIER",
    "TIER",
    "TIED",
    "TIES",
    "TOES",
    "DOES",
    "DIES",
    "DIET",
    "DUET",
    "DUEL",
    "DUAL",
    "DIAL",
    "VIAL",
    "VEAL",
    "DEAL",
    "REAL",
    "REAM",
    "TEAM",
    "TRAM",
    "CRAM",
    "CLAM",
    "FLAM",
    "FOAM",
    "FORM",
    "WORM",
    "WORE",
    "WERE",
    "HERE",
    "HERB",
    "VERB",
    "VERY",
    "VARY",
    "WARY",
    "WARP",
    "TARP",
    "TARS",
    "TABS",
    "LABS",
    "LAPS",
    "GAPS",
    "GARS",
    "WARS",
    "WARD",
    "LARD",
    "LAID",
    "LAIR",
    "HAIR",
    "HAIL",
    "TAIL",
    "TOIL",
    "TOOL",
    "COOL",
    "COOP",
    "CHOP",
    "SHOP",
    "SHOW",
    "SLOW",
    "SLOG",
    "SLUG",
    "SLUM",
    "SLIM",
    "SLIT",
    "SPIT",
    "SPAR",
    "SPAS",
    "SEAS",
    "LEAS",
    "LESS",
    "LOSS",
    "LOSE",
    "ROSE",
    "ROPE",
    "COPE",
    "CORE",
    "CORD"
];

function initWordflop() {
    wordflopStrip = document.getElementById("wordflop");
    wfWords = document.getElementById("wf-words");
    wfPlaceholder = document.getElementById("wf-placeholder");
}

function resizeWordflop() {
    // clear existing words
    for (let i = 0; i < wordElems.length; ++i) {
        wordElems[i].remove();
    }
    wordElems = [];

    let letterWidth = wfPlaceholder.clientWidth;
    let letterHeight = wfPlaceholder.clientHeight;
    let marginLeft = letterWidth;
    let marginTop = letterHeight;
    let playableWidth = wordflopStrip.clientWidth - marginLeft * 2;
    let playableHeight = wordflopStrip.clientHeight - marginTop * 2;

    // numCols * wordWidth + (numCols - 1) * minSpaceWidth = playableWidth
    let wordWidth = letterWidth * 4;
    let minSpaceWidth = letterWidth;
    let numCols = (playableWidth + minSpaceWidth) / (wordWidth + minSpaceWidth);

    // numRows * wordHeight + (numRows - 1) * minSpaceHeight = playableHeight
    let wordHeight = letterHeight;
    let minSpaceHeight = letterHeight / 4;
    let numRows = (playableHeight + minSpaceHeight) / (wordHeight + minSpaceHeight);

    let prevWC = wordCount;
    wordCount = Math.floor(Math.min(numCols, numRows));
    let diffWC = wordCount !== prevWC;

    // calculate spacing between columns and rows
    let totalSpaceHoriz = playableWidth - (wordWidth * wordCount);
    let spaceWidth = totalSpaceHoriz / (wordCount - 1);
    let totalSpaceVert = playableHeight - (wordHeight * wordCount);
    let spaceHeight = totalSpaceVert / (wordCount - 1);

    // generate random positions in grid
    if (diffWC) {
        wfColByRow = [];
        for (let i = 0; i < wordCount; ++i) {
            wfColByRow.push(i);
        }
        shuffleArray(wfColByRow);
    }

    // generate word paths
    if (diffWC) {
        wordPaths = [];
        let totalWords = wordCycle.length;
        let pos = Math.floor(Math.random() * totalWords);
        for (let i = 0; i < wordCount; ++i) {
            let path = [];
            for (let w = 0; w < pathLength; ++w) {
                path.push(wordCycle[pos % totalWords]);
                pos++;
            }
            pos--;
            wordPaths.push(path);
        }
    }

    // create and position word elements
    for (let i = 0; i < wordCount; ++i) {
        let elem = document.createElement("div");
        elem.innerHTML = wordPaths[i][0];

        let top = (wordHeight + spaceHeight) * i + marginTop;
        elem.style.top = top + "px";
        let left = (wordWidth + spaceWidth) * wfColByRow[i] + marginLeft;
        elem.style.left = left + "px";

        wfWords.appendChild(elem);
        wordElems.push(elem);
    }
}

function scrollWordflop() {
    for (let i = 0; i < wordElems.length; ++i) {
        let progress = scrollStagger(wordflopStrip, 0.1, 0.8, 0.3, wordCount, i);
        let curIndex = Math.floor(progress * (pathLength - 1));
        let prevIndex = Math.max(0, curIndex - 1);
        let curWord = wordPaths[i][curIndex];
        let prevWord = wordPaths[i][prevIndex];
        let inner = "";
        for (let c = 0; c < curWord.length; ++c) {
            if (curWord[c] !== prevWord[c]) {
                inner += "<span style='font-weight: 900; color: #000000'>" + curWord[c] + "</span>"
            } else {
                inner += curWord[c];
            }
        }
        wordElems[i].innerHTML = inner;
    }
}

// endregion wordflop

// region check-it-out
let checkItOutStrip;
let itemParent;
let cioImgList = [
    "../img/apple.png",
    "../img/bottle.png",
    "../img/box.png",
    "../img/can.png",
    "../img/carrot.png"
];
let cioColByRow = [0, 1, 2, 3, 4];
let startRotations = [];
let endRotations = [];
const cioScaleFactor = 0.35;

function initCheckItOut() {
    checkItOutStrip = document.getElementById("check-it-out");
    itemParent = document.getElementById("item-parent");
    shuffleArray(cioImgList);
    shuffleArray(cioColByRow);
    startRotations = [];
    endRotations = [];
    for (let i = 0; i < cioImgList.length; ++i) {
        startRotations.push(Math.random() * 90 - 45);
        endRotations.push(Math.random() * 180 - 90);
    }
}

function resizeCheckItOut() {
    let horizMargin = 10;
    let vertMargin = 10;
    let playableWidth = checkItOutStrip.clientWidth - horizMargin * 2;
    let playableHeight = checkItOutStrip.clientHeight - vertMargin * 2;
    let minDim = Math.min(playableWidth, playableHeight);

    let imgSize = minDim / 5;
    let horizSpace = (playableWidth - minDim) / 4; // one of these will be 0
    let vertSpace = (playableHeight - minDim) / 4; // if it was the smaller dimension

    for (let i = 0; i < itemParent.children.length; ++i) {
        let elem = itemParent.children[i];
        elem.setAttribute("src", cioImgList[i]);
        elem.style.width = imgSize + "px";
        elem.style.height = imgSize + "px";
        elem.style.top = (i * (imgSize + vertSpace) + vertMargin) + "px";
        elem.style.left = (cioColByRow[i] * (imgSize + horizSpace) + horizMargin) + "px";
        elem.style.transform = "rotate(" + startRotations[i] + "deg)";
    }
}

function scrollCheckItOut() {
    for (let i = 0; i < itemParent.children.length; ++i) {
        let elem = itemParent.children[i];
        let progress = scrollStagger(checkItOutStrip, 0.2, 0.75, 0.4, itemParent.children.length, i);
        let rotation = (endRotations[i] - startRotations[i]) * progress + startRotations[i];
        let scale = (1.25 - cioScaleFactor) * progress + cioScaleFactor;
        elem.style.transform = "rotate(" + rotation + "deg) scale(" + scale + ")";
    }
}

// endregion check-it-out

// region wishy-washy
let wishyWashyStrip;
let buildingsParent;
let buildingsBack;
let buildingsFront;
function initWishyWashy() {
    wishyWashyStrip = document.getElementById("wishy-washy");
    buildingsParent = document.getElementById("buildings-parent");
    buildingsBack = document.getElementById("buildings-back");
    buildingsFront = document.getElementById("buildings-front");
}

function resizeWishyWashy() {
    let sideMargin = 100;
    let bottomMargin = 100;

    
}

function scrollWishyWashy() {

}
// endregion wishy-washy