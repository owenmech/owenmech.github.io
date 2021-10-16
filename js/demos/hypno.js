const screenSize = 800;
const total = 30;
const speed = 1.01;

let shapes = [];
let ct = 0;

function setup() {
    createCanvas(screenSize, screenSize);
    background(0);
    colorMode(HSB);
}

function mouseClicked() {
    begin();
}

function draw() {
    background(0);
    translate(screenSize / 2, screenSize / 2);
    begin();
    rotate(ct / 100);
    for (let i = 0; i < shapes.length; i++) {
        adjust(shapes[i], i/total);
        makeShape(shapes[i]);
    }
    if (ct > total) {
        shapes.shift();
    }
    ct++;
}

function begin() {
    let sections = Math.random() * 5 + 4; // 4 - 8
    let angle = 2 * Math.PI / sections;
    let x0 = randomPoint();
    let y0 = randomPoint();

    let col = randomColor();
    let h = col[0];
    let s = col[1];
    let b = col[2];
    let a = col[3];
    let w = randomWeight();

    shapes.push([x0, y0, angle, sections, h, s, b, a, w]);
}

function makeShape(vals) {
    let x0 = vals[0];
    let y0 = vals[1];
    let angle = vals[2];
    let sections = vals[3];
    stroke(vals[4], vals[5], vals[6], vals[7]);
    strokeWeight(vals[8]);
    noFill();
    beginShape();
    vertex(x0, y0);
    for (let i = 0; i < sections * 3; i++) {
        let arr = originRotation(x0, y0, angle);
        x0 = arr[0];
        y0 = arr[1];
        vertex(x0, y0);
    }
    endShape();
}

function adjust(shape, progress) {
    shape[0] *= speed
    shape[1] *= speed;
    shape[7] = progress;
}

function originRotation(x, y, angle) {
    let xP = x * Math.cos(angle) - y * Math.sin(angle);
    let yP = x * Math.sin(angle) + y * Math.cos(angle);
    return [xP, yP];
}

function randomPoint() {
    return (Math.random() * screenSize - screenSize / 2)/2;
}

function randomColor() {
    return [Math.random() * 360, 100, 100, 1];
}

function randomWeight() {
    return Math.random() * 8 + 2;
}