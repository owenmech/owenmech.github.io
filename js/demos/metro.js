let gridSize = 20;
let tileSize = 40;
let weight = 20;
let grid = [];


function setup() {
    createCanvas((gridSize+2) * tileSize + weight, (gridSize+2) * tileSize + weight);
    background(255);
    fill(255);
    strokeWeight(weight);
}

function draw() {
    translate(tileSize, tileSize);
}

function mouseClicked() {
    begin();
}

function begin() {
    background(255);
    for(let i = 0; i < 15; i++) {
        push();
        createMap();
        pop();
    }
}

function createMap() {
    randColor();

    let x1 = Math.floor(random(gridSize));
    let y1 = Math.floor(random(gridSize));
    let x2 = Math.floor(random(gridSize));
    let y2 = Math.floor(random(gridSize));

    translate(x1 * tileSize, y1 * tileSize)

    let dx = Math.abs(x2 - x1);
    let posX = x1 < x2 ? 1 : -1;
    let dy = Math.abs(y2 - y1);
    let posY = y1 < y2 ? 1 : -1;
    let horiz = [];

    let pivot;
    let main;
    if (dx >= dy) {
        pivot = Math.floor(random(dx));
        main = true;
    } else {
        pivot = Math.floor(random(dy));
        main = false;
    }

    while (dx + dy > 0) {
        if (main) {
            if (dx === pivot && dy > 0) {
                dy--;
                horiz.push(false);
            } else {
                dx--;
                horiz.push(true);
            }
        } else {
            if (dy === pivot && dx > 0) {
                dx--;
                horiz.push(true);
            } else {
                dy--;
                horiz.push(false);
            }
        }
    }
    noFill();
    if (horiz[0] == true) {
        horizLine();
    }
    else {
        vertLine();
    }
    station(false);
    for (let i = 0; i < horiz.length - 1; i++) {
        if (horiz[i] === true) {
            translate(tileSize * posX, 0);
            if (horiz[i + 1] === true) {
                horizLine();
                if (random() < 0.50) {
                    station(false);
                }
            } else {
                let x, y, start, stop;
                if (posX > 0) {
                    x = 0;
                    if (posY > 0) {
                        y = tileSize;
                        start = -Math.PI / 2;
                        stop = 0;
                    } else {
                        y = 0;
                        start = 0;
                        stop = Math.PI / 2;
                    }
                } else {
                    x = tileSize;
                    if (posY > 0) {
                        y = tileSize;
                        start = Math.PI;
                        stop = -Math.PI / 2;
                    } else {
                        y = 0;
                        start = Math.PI / 2;
                        stop = Math.PI;
                    }
                }
                arc(x, y, tileSize, tileSize, start, stop);
            }
        } else {
            translate(0, tileSize * posY);
            if (horiz[i + 1] === false) {
                vertLine();
                if (random() < 0.50) {
                    station(false);
                }
            } else {
                let x, y, start, stop;
                if (posY > 0) {
                    y = 0;
                    if (posX > 0) {
                        x = tileSize;
                        start = Math.PI / 2;
                        stop = Math.PI;
                    } else {
                        x = 0;
                        start = 0;
                        stop = Math.PI / 2;
                    }
                } else {
                    y = tileSize;
                    if (posX > 0) {
                        x = tileSize;
                        start = Math.PI;
                        stop = -Math.PI / 2;
                    } else {
                        x = 0;
                        start = -Math.PI / 2;
                        stop = 0;
                    }
                }
                arc(x, y, tileSize, tileSize, start, stop);
            }
        }
    }
    if (horiz[horiz.length - 1] === true) {
        translate(tileSize * posX, 0);
        horizLine();
    }
    else {
        translate(0, tileSize * posY);
        vertLine();
    }
    station(true);
}

function station(stop) {
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    if (stop) {
        strokeWeight(6);
        ellipse(tileSize / 2, tileSize / 2, weight, weight)
    } else {
        ellipse(tileSize / 2, tileSize / 2, weight - 6, weight - 6)
    }
    pop();
}

function randColor() {
    fill(random(256), random(256), random(256));
    stroke(random(256), random(256), random(256));
}

function horizLine() {
    line(0, tileSize / 2, tileSize, tileSize / 2);
}
function vertLine() {
    line(tileSize / 2, 0, tileSize / 2, tileSize);
}