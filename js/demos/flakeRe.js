const sym = 6;
const minSize = 100;
const range = 200;
const xSpeed = 0.01;
const ySpeed = 0.1;
const parallax = 0.6;

let flakes = [];

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    textSize(30);
}

function draw() {
    background(100, 190, 255);
    if (frameCount % 45 === 0) {
        spawnSnowflake();
    }
    let removed = [];
    for (let i = 0; i < flakes.length; i++) {
        push();
        image(flakes[i].graphics, flakes[i].x, flakes[i].y);
        pop();
        flakes[i].x += xSpeed * Math.pow(flakes[i].size, parallax);
        flakes[i].y += ySpeed * Math.pow(flakes[i].size, parallax);
        if (flakes[i].y > windowHeight + flakes[i].size / 2) {
            removed.push(i);
        }
    }
    for (let i = 0; i < removed.length; i++) {
        flakes[removed[i]].graphics.remove();
        flakes.splice(removed[i], 1);
    }
}

function mouseClicked() {
    spawnSnowflake();
}

function spawnSnowflake() {
    let flake = {pts: []};
    flake.size = Math.random() * range + minSize;
    flake.x = Math.random() * windowWidth;
    flake.y = -flake.size;
    flake.graphics = createGraphics(flake.size, flake.size);
    flake.graphics.clear();
    let ct = Math.random() * 10 + 5;
    for (let i = 0; i < ct; i++) {
        addPoint(flake);
    }

    flake.graphics.noFill();
    flake.graphics.strokeWeight(5);
    flake.graphics.stroke(255);
    flake.graphics.strokeCap(SQUARE);
    flake.graphics.strokeJoin(MITER);
    flake.graphics.noSmooth();
    flake.graphics.translate(flake.size / 2, flake.size / 2);
    showSnowflake(flake);

    flakes.push(flake);
}

function addPoint(flake) {
    let pt = {};
    pt.x = 0;
    pt.y = randomPoint(flake.size);
    randomRotation(pt);
    if (flake.pts.length > 1 && Math.random() < 0.5) {
        let pt2 = flake.pts[Math.floor(Math.random() * flake.pts.length)];
        pt.x = pt2.x;
        pt.y = pt2.y;
    }
    if (Math.pow(Math.random(), 3) < -pt.y / (flake.size / 2)) { //connect to existing point
        let other = {x: pt.x, y: pt.y};
        if (flake.pts.length < 2) {
            other.x = 0;
            other.y = 0;
        } else {
            while (other.x === pt.x && other.y === pt.y) {
                other = flake.pts[Math.floor(Math.random() * flake.pts.length)];
            }
        }
        pt.ring = false;
        pt.other = {x: other.x, y: other.y};
    } else { //create ring
        pt.ring = true;
    }
    flake.pts.push(pt);
}

function showSnowflake(flake) {
    let graphics = flake.graphics;
    graphics.strokeWeight(flake.size / 80);
    let a = flake.size / range;
    let alpha = a.toString();
    graphics.stroke('rgba(255,255,255,' + alpha+')');
    flake.pts.forEach(function(pt) {
        if (!pt.ring) {
            for (let i = 0; i < sym; i++) {
                graphics.beginShape();
                graphics.vertex(pt.x, pt.y);
                graphics.vertex(pt.other.x, pt.other.y);
                graphics.endShape();

                graphics.beginShape();
                graphics.vertex(-pt.x, pt.y);
                graphics.vertex(-pt.other.x, pt.other.y);
                graphics.endShape();

                graphics.rotate(2 * Math.PI / sym);
            }
        } else {
            graphics.beginShape();
            let other = {x: -pt.x, y: pt.y};
            for (let i = 0; i < sym; i++) {
                graphics.vertex(other.x, other.y);
                graphics.vertex(pt.x, pt.y);
                originRotation(other, 2 * Math.PI / sym);
                originRotation(pt, 2 * Math.PI / sym);
            }
            graphics.vertex(other.x, other.y);
            graphics.endShape();
        }
    });
}

function randomRotation(pt) {
    let angle;
    let rand = Math.random();
    if (rand < 0.3) {
        angle = 0;
    } else if (rand < 0.5) {
        angle = Math.PI / sym
    } else {
        angle = Math.random() * Math.PI / sym;
    }
    originRotation(pt, angle);
}

function originRotation(pt, angle) {
    let x = pt.x * Math.cos(angle) - pt.y * Math.sin(angle);
    let y = pt.x * Math.sin(angle) + pt.y * Math.cos(angle);
    pt.x = x;
    pt.y = y;
}

function randomPoint(size) {
    return -Math.random() * size / 2;
}