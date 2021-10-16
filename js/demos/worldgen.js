let step = 0.0;
let shrines = [];
const STEP_SIZE = 2;
const SHRINE_SIZE = 15;
const SHRINE_FREQ = 0.04;

function setup() {
    let cnv = createCanvas(2 * windowWidth / 3, 2 * windowHeight / 3);
    cnv.position(windowWidth / 6, windowHeight / 6);
    for (let x = 0; x < width; x += STEP_SIZE) {
        if (Math.random() < 0.01) {
            shrines.push({x: x, y: (Math.random() * height)});
        }
    }
    pixelDensity(1);
    stroke(color(20, 40, 255));
    strokeWeight(2);
    fill(color(50, 150, 255));
    rectMode(CENTER);
}

function draw() {
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let pix = (x + y * width) * 4;
            let rgb = zelda(x, y);
            pixels[pix + 0] = rgb.r;
            pixels[pix + 1] = rgb.g;
            pixels[pix + 2] = rgb.b;
            pixels[pix + 3] = 255;
        }
    }
    updatePixels();

    doShrines();
    step += STEP_SIZE;
}

function doShrines() {
    for (let i = shrines.length - 1; i >= 0; i--) {
        let dx = shrines[i].x - step;
        if (dx < -SHRINE_SIZE) {
            shrines.splice(i, 1);
        } else {
            rect(dx, shrines[i].y, SHRINE_SIZE, SHRINE_SIZE);
        }
    }
    if (Math.random() < SHRINE_FREQ) {
        shrines.push({x: width + step + SHRINE_SIZE, y: Math.random() * height});
    }
}

function zelda(x, y) {
    let dx = (x + step) * 0.005;
    let dy = y * 0.005;
    let n = noise(dx, dy);
    let floored = Math.floor(n * 15) / 15.0;
    let diff = n - floored;
    if (floored < 0.25) {
        return {r: 60, g: 70, b: 80};
    } else if (diff < 0.003) {
        if (n < 0.30) {
            return {r: 100, g: 110, b: 120};
        }
        return {r: 0, g: 0, b: 0};
//        } else if (diff > 0.02 && diff < 0.04) {
//            return color(255, 0, 0);
    }
    return HSVtoRGB(0.10, 0.5, floored * 0.7 + 0.05);
}

function terrain(x, y) {
    let dx = (x + step) * 0.005;
    let dy = y * 0.005;
    let noinse = noise(dx, dy);
    let c = color(Math.floor(n * 255));
//        if (n < 0.37)
//        {
//            c = color(0, 30, 180);
//        } else if (n < 0.45)
//        {
//            c = color(0, 100, 180);
//        } else if (n < 0.5)
//        {
//            c = color(210, 190, 60);
//        } else
//        {
//            c = color(15, 170, 15);
//        }
    return c;
}

function gray(x, y) {
    let n = noise(x * 0.01 + step, y * 0.01);
    return color(n * 255);
}

function HSVtoRGB(h, s, v) {
    let r = 0, g = 0, b = 0, f, p, q, t;
    let i = Math.round(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return {
        r: r * 255,
        g: g * 255,
        b: b * 255
    };
}

function mouseClicked() {
    background(69);
    noiseSeed(random() * Number.MAX_SAFE_INTEGER);
    shrines = [];
    setup();
}
