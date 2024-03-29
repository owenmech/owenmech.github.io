let size;
let grains = [];
let bg;
let chaosMap = [];
let pattern = 0;
const patternSize = 4;

const maxSpeed = 10;
const forceRange = 4;
const maxForceOdds = 0.1;
const minForceOdds = 0.04;
const forceOddsRange = maxForceOdds - minForceOdds;
const minFriction = 0.93;
const maxFriction = 0.96;
const frictionRange = maxFriction - minFriction;

let recalcProgress = 0;
const recalcSteps = 240;
let strengthProgress = 0;
const strengthSteps = 60;
const idleChaos = 0.4;

const grainCount = 2000;
const batchCount = 100;

let indices = [];

function setup() {
    size = Math.min(windowWidth, windowHeight) - 20;
    let cnv = createCanvas(size, size);
    cnv.parent("chladni-wrapper")
    // cnv.position(10, 10);
    pixelDensity(1);
    colorMode(HSB);
    background(42);
    noStroke();

    indices = [];
    for (let x = 0; x < size; x++) {
        indices.push([]);
        for (let y = 0; y < size; y++) {
            let a = Math.floor(Math.abs(x - (size - 1) / 2));
            let b = Math.floor(Math.abs(y - (size - 1) / 2));
            if (b > a) {
                let c = a;
                a = b;
                b = c;
            }
            let angle = Math.atan(b / a);
            let r = Math.sqrt(a * a + b * b);
            if (angle < Math.PI / 8) {
                angle = Math.PI / 4 - angle;
                a = Math.floor(r * Math.cos(angle));
                b = Math.floor(r * Math.sin(angle));
            }
            a += Math.floor(3 * (size - 1) / 2);
            b += Math.floor((size - 1) / 2);
            indices[x].push({i: a, j: b});
        }
    }

    grains = [];
    for (let i = 0; i < grainCount; i++) {
        addGrain();
    }

    chaosMap = [];
    for (let i = 0; i < size; i++) {
        chaosMap.push([]);
        for (let j = 0; j < size; j++) {
            chaosMap[i].push(1);
        }
    }

    bg = createImage(size, size);

    recalcProgress = 0;
}

function draw() {
    if (recalcProgress < recalcSteps) {
        recalculateChaosMap();
    } else if (strengthProgress < strengthSteps) {
        strengthProgress++;
    }

    // image(bg, 0, 0);
    background(0, 0, 19);

    let chaos;
    let damp;
    let dV;
    let strengthen = false;
    let weight;
    let weightedIdle;
    let settle = false;
    if (recalcProgress < recalcSteps) {
        chaos = (recalcProgress / recalcSteps) * idleChaos;
        damp = maxFriction;
    } else if (strengthProgress < strengthSteps) {
        weight = (strengthProgress / strengthSteps);
        weightedIdle = (1 - weight) * idleChaos;
        strengthen = true;
    } else {
        settle = true;
    }


    // loadPixels();
    for (const grain of grains) {
        let speed = (Math.abs(grain.vX) + Math.abs(grain.vY)) / (maxSpeed * 2.0)
        if (strengthen) {
            chaos = weightedIdle + chaosMap[Math.round(grain.x)][Math.round(grain.y)] * weight;
            damp = minFriction + chaos * frictionRange;
        } else if (settle) {
            chaos = chaosMap[Math.round(grain.x)][Math.round(grain.y)];
            damp = minFriction + chaos * frictionRange;
        }
        if (Math.random() < maxForceOdds - speed * forceOddsRange) {
            dV = forceRange * chaos;
            grain.vY += Math.random() * 2 * dV - dV;
            grain.vX += Math.random() * 2 * dV - dV;

            if (grain.vX > maxSpeed) grain.vX = maxSpeed;
            else if (grain.vX < -maxSpeed) grain.vX = -maxSpeed;
            if (grain.vY > maxSpeed) grain.vY = maxSpeed;
            else if (grain.vY < -maxSpeed) grain.vY = -maxSpeed;
        }

        grain.vX *= damp;
        grain.vY *= damp;

        grain.x += grain.vX;
        grain.y += grain.vY;

        if (grain.x < 0) {
            grain.vX *= -1;
            grain.x *= -1;
        } else if (grain.x > size - 1) {
            grain.vX *= -1;
            grain.x = (size - 1) - (grain.x - (size - 1));
        }
        if (grain.y < 0) {
            grain.vY *= -1;
            grain.y *= -1;
        } else if (grain.y > size - 1) {
            grain.vY *= -1;
            grain.y = (size - 1) - (grain.y - (size - 1));
        }


        // let pix = (Math.round(grain.y) * width + Math.round(grain.x)) * 4;
        // pixels[pix + 0] = 255;
        // pixels[pix + 1] = 255;
        // pixels[pix + 2] = 0;
        // pixels[pix + 3] = 255;

        fill(grain.h, grain.s, grain.b, 1);

        circle(grain.x, grain.y, size / 200);
    }
    // updatePixels();
}

function mouseClicked() {
    if (mouseX < 0 || mouseX >= size || mouseY < 0 || mouseY >= size) return;
    changePattern();
}

function changePattern() {
    pattern++;
    recalcProgress = 0;
}

function recalculateChaosMap() {
    // bg.loadPixels(); //
    for (let i = 0; i < size; i++) {
        for (let j = recalcProgress; j < size; j += recalcSteps) {
            chaosMap[i][j] = localChaos(i, j);
            let val = chaosMap[i][j] * 255;
            // let index = (i + j * width) * 4; //
            // bg.pixels[index + 0] = val; //
            // bg.pixels[index + 1] = val; //
            // bg.pixels[index + 2] = val; //
            // bg.pixels[index + 3] = 255; //
        }
    }
    // bg.updatePixels(); //
    recalcProgress++;
    if (recalcProgress === recalcSteps) {
        strengthProgress = 0;
    }
}

function localChaos(x, y) {
    let ij = indices[x][y];
    let n = noise(ij.i / size * patternSize + pattern, ij.j / size * patternSize);
    let chaos = Math.min(Math.abs(n - 0.4), Math.abs(n - 0.6)) * 8;
    // let chaos = Math.abs(n - 0.5) * 4;
    if (chaos < 0.01 * patternSize) chaos /= 8;
    else chaos *= 1.2;
    return min(max(chaos, 0.001), 1);

    // if (pattern % 2 === 0) return sin(ij.i / 20 + pattern) / 2 + 0.5;
    // else return sin(ij.j / 20 + pattern) / 2 + 0.5;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        increaseGrains()
    } else if (keyCode === DOWN_ARROW) {
        decreaseGrains()
    } else if (keyCode === RIGHT_ARROW) {
        changePattern()
    } else if (keyCode === TAB) {
        saveCanvas("chladni-" + pattern, "png");
    }
}

function increaseGrains() {
    for (let i = 0; i < batchCount; i++) {
        addGrain();
    }
}

function addGrain() {
    grains.push({
        x: Math.random() * (size - 1),
        y: Math.random() * (size - 1),
        vX: 0,
        vY: 0,
        h: Math.random() * 20 + 30,
        s: Math.random() * 50 + 50,
        b: Math.random() * 40 + 60,
    });
}

function decreaseGrains() {
    if (grains.length <= batchCount) return;
    for (let i = 0; i < batchCount; i++) {
        grains.pop();
    }
}