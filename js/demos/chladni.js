let size;
let grains = [];
const maxSpeed = 10;
const forceRange = 4;
let bg;
let chaosMap = [];
let pattern = 0;

let indices = [];

function setup() {
    size = Math.min(windowWidth, windowHeight) - 20;
    let cnv = createCanvas(size, size);
    cnv.position(10, 10);
    pixelDensity(1);
    background(42);

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
    for (let i = 0; i < 2000; i++) {
        grains.push({x: Math.random() * (size - 1), y: Math.random() * (size - 1), vX: 0, vY: 0});
    }

    bg = createImage(size, size);
    recalculateChaosMap();
}

function draw() {
    // image(bg, 0, 0);
    background(42);

    // loadPixels();
    for (const grain of grains) {
        let chaos = chaosMap[Math.round(grain.x)][Math.round(grain.y)];
        let dV = forceRange * chaos;
        let damp = 0.85;
        grain.vY += Math.random() * 2 * dV - dV;
        grain.vX += Math.random() * 2 * dV - dV;
        grain.vX *= damp
        grain.vY *= damp

        if (grain.vX > maxSpeed) grain.vX = maxSpeed;
        else if (grain.vX < -maxSpeed) grain.vX = -maxSpeed;
        if (grain.vY > maxSpeed) grain.vY = maxSpeed;
        else if (grain.vY < -maxSpeed) grain.vY = -maxSpeed;

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

        fill(255, 255, 0, 255);
        circle(grain.x, grain.y, 5);
    }
    // updatePixels();
}

function mouseClicked() {
    pattern++;
    recalculateChaosMap();
}

function recalculateChaosMap() {
    chaosMap = [];
    for (let i = 0; i < size; i++) {
        chaosMap.push([]);
        for (let j = 0; j < size; j++) {
            chaosMap[i].push(localChaos(i, j));
        }
    }

    bg.loadPixels();
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let val = chaosMap[x][y] * 255;
            let index = (x + y * width) * 4;
            bg.pixels[index + 0] = val;
            bg.pixels[index + 1] = val;
            bg.pixels[index + 2] = val;
            bg.pixels[index + 3] = 255;
        }
    }
    bg.updatePixels();
}

function localChaos(x, y) {
    let ij = indices[x][y];
    let n = noise(ij.i / size * 8 + pattern, ij.j / size * 8);
    let dist = Math.abs(n - 0.5);
    dist *= 7;
    return min(dist, 1);

    // if (pattern % 2 === 0) return sin(ij.i / 20 + pattern) / 2 + 0.5;
    // else return sin(ij.j / 20 + pattern) / 2 + 0.5;
}

function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        saveCanvas("chladni", "png");
    }
}