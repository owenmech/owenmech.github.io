const stars = [];
let passed = 0;

let indices = [];

function setup() {
    let cnv;
    if (windowWidth < 2 * windowHeight)
    {
        cnv = createCanvas(windowWidth - 20, windowWidth / 2 - 20);
    }
    else
    {
        cnv = createCanvas(windowHeight * 2 - 20, windowWidth - 20);
    }
    cnv.position(10, 10);
    pixelDensity(1);
    fill(255);
    strokeWeight(10);
    background(30);
    for (let x = 0; x < width / 2; x++) {
        for (let y = 0; y < height; y++) {
            let a = Math.floor(Math.abs(x - (width - 1) / 4));
            let b = Math.floor(Math.abs(y - (height - 1) / 2));
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
            a += Math.floor(3 * (width - 1) / 4);
            b += Math.floor((height - 1) / 2);
            indices[x + y * height] = a + b * width;
        }
    }
}

function draw() {
    background(50);
    loadPixels();
    for (let x = 0; x < width / 2; x++) {
        for (let y = 0; y < height; y++) {
            let pix = indices[x + y * height] * 4;
            pixels[pix + 0] = 20;
            pixels[pix + 1] = 20;
            pixels[pix + 2] = 20;
            pixels[pix + 3] = 255;
        }
    }
    updatePixels();
    doStars();
    loadPixels();
//        antiLines();
    for (let x = 0; x < width / 2; x++) {
        for (let y = 0; y < height; y++) {
            let ind = indices[x + y * height] * 4;
            let pix = (x + y * width) * 4;
            pixels[pix + 0] = pixels[ind + 0];
            pixels[pix + 1] = pixels[ind + 1];
            pixels[pix + 2] = pixels[ind + 2];
            pixels[pix + 3] = pixels[ind + 3];
//                pixels[x + y * width] = color((hue(col) + frameCount) % 255, saturation(col), brightness(col) * 2);
        }
    }
    updatePixels();
    stroke(255);
    fill(255);
}

function mouseClicked() {
    if (mouseX <= width / 2) return;
    let col = myHSVtoRGB(Math.random(), 1, 1);
    let radius = Math.random() * 120 + 60;
    let vel = Math.random() * 3 + 1;
    let dir = Math.random() * 2 * PI;
    stars.push({
        x: mouseX,
        y: mouseY,
        col: col,
        r1: radius,
        r2: radius / 2,
        velX: Math.cos(dir) * vel,
        velY: Math.sin(dir) * vel,
        rot: Math.random() * 2 * PI,
        velR: Math.random() * 0.04 - 0.02
    });
}

function doStars() {
    for (let i = 0; i < stars.length; i++) {
        present(stars[i]);
    }
}

function present(star) {
    fill(star.col.r, star.col.g, star.col.b, 100);
    stroke(star.col.r, star.col.g, star.col.b, 255);
    let angle = 2 * PI / 5;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = star.rot; a < 2 * PI + star.rot; a += angle) {
        let sx = star.x + Math.cos(a) * star.r2;
        let sy = star.y + Math.sin(a) * star.r2;
        vertex(sx, sy);
        sx = star.x + Math.cos(a + halfAngle) * star.r1;
        sy = star.y + Math.sin(a + halfAngle) * star.r1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
    star.x += star.velX;
    star.y += star.velY;
    if (star.x < width / 2.0 || star.x >= width)
    {
        star.velX *= -1;
    }
    if (star.y < 0 || star.y >= height) {
        star.velY *= -1;
    }
    star.rot += star.velR;
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