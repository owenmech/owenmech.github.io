// logo
var animState = 1;
const STATES = 8;
var box1, box2, box3, box4;

// spective
let spectiveStrip;
let polyLeft, polyRight;
const squareLCoords = [
    [40, 40], // TL
    [60, 40], // TR
    [60, 40],
    [60, 60], // BR
    [40, 60],
    [40, 60] // BL
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
    [40, 40], // TL
    [60, 40], // TR
    [60, 60], // BR
    [60, 60], // (BR)
    [40, 60], // (BL)
    [40, 60] // BL
];
const trapezoidCoords = [
    [20, 30], // TL
    [80, 30], // TR
    [100, 70], // BR
    [100, 75], // (BR)
    [0, 75], // (BL)
    [0, 70] // BL
];

// rotator
let rotatorStrip;
let rcTL, rcTR, rcBR, rcBL;
let rotTL, rotTR, rotBR, rotBL;
const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];

window.onload = function () {
    initGames();

    initSpective();
    initRotator();

    resizeGames();
}

function resizeGames() {
    resizeSpective();

    scrollGames();
}

window.addEventListener('resize', resizeGames);

function scrollGames() {
    scrollSpective();
    scrollRotator();
}

document.addEventListener("scroll", scrollGames);

// region logo
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
    occupied.add([1,1].join());
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