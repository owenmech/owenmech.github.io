const shapes = [];
let passed = 0;
let left = true;

function setup() {
    let cnv;
    if (windowWidth < 2 * windowHeight) {
        let w = windowWidth;
        if (windowWidth % 2 == 1) {
            w -= 1;
        }
        cnv = createCanvas(w - 20, w / 4 - 10);
    } else {
        cnv = createCanvas(windowHeight * 2 - 40, windowHeight / 2 - 20);
    }
    cnv.position(10, 10);
    pixelDensity(1);
    noSmooth();
    fill(255);
    strokeWeight(.012 * width);
    background(30);

    let radius = 0.06;
    shapes.push({
        left: true,
        x: width / 2 - 45,
        y: height / 2,
        r1: radius * width / 2,
        velX: 0,
        velY: 0,
        rot: 0,
        velR: 0
    });
    shapes.push({
        left: false,
        x: width / 2 + 45,
        y: height / 2 + 27,
        r1: radius * width / 2 + 10,
        velX: 0,
        velY: 0,
        rot: PI / 6,
        velR: 0
    });
}

function draw() {
    background(0, 20, 60, 255);

    doShapes();
    loadPixels();
    // boolean logic
    let d = pixelDensity();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            for (let i = 0; i < d; i++) {
                for (let j = 0; j < d; j++) {
                    let pix = ((x * d + i) + (y * d + j) * width * d) * 4;
                    if (pixels[pix] % 2 == 0) {
                        pixels[pix + 0] = 0;
                        pixels[pix + 1] = 200;
                        pixels[pix + 2] = 255;
                        pixels[pix + 3] = 255;
                    } else {
                        pixels[pix + 0] = 0;
                        pixels[pix + 1] = 20;
                        pixels[pix + 2] = 60;
                        pixels[pix + 3] = 255;
                    }
                }
        }
    }
}

updatePixels();
}

function mouseClicked() {
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) return;
    let radius = Math.random() * 0.025 + 0.025;
    let vel = Math.random() * 0.002 + 0.0003;
    vel = 0;
    let dir = Math.random() * 2 * PI;
    shapes.push({
        left: left,
        x: mouseX,
        y: mouseY,
        r1: radius * width / 2,
        velX: Math.cos(dir) * vel * width,
        velY: Math.sin(dir) * vel * width,
        rot: Math.random() * 2 * PI,
        velR: 0
    });
    left = !left;
}

function doShapes() {
    for (let i = 0; i < shapes.length; i++) {
        present(shapes[i]);
    }
}

function present(shape) {

    fill(0, 0, 0, 0);
    stroke(16, 200, 255, 16);
    strokeWeight(0.4 * shape.r1);
    if (shape.left) { // circle
        circle(shape.x, shape.y, shape.r1 * 2);
    } else { // triangle
        let angle = 2 * PI / 3;
        beginShape();
        for (let a = shape.rot; a < 2 * PI + shape.rot; a += angle) {
            let sx = shape.x + Math.cos(a) * shape.r1;
            let sy = shape.y + Math.sin(a) * shape.r1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }


    shape.x += shape.velX;
    shape.y += shape.velY;
    if (shape.x < 0 || shape.x >= width) {
        shape.velX *= -1;
    }
    if (shape.y < 0 || shape.y >= height) {
        shape.velY *= -1;
    }
    shape.rot += shape.velR;
}

function myHSVtoRGB(h, s, v) {
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