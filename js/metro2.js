const gridSize = 20;
const tileSize = 40;
let weight = 20;
let grid = [];
let corners = [];

const outerDegree = 2;
const chaos = 0.2;

const Dir = {
    N: {x: 0, y: -1},
    S: {x: 0, y: 1},
    E: {x: 1, y: 0},
    W: {x: -1, y: 0},
    NE: {x: 1, y: -1},
    NW: {x: -1, y: -1},
    SE: {x: 1, y: 1},
    SW: {x: -1, y: 1},
};

let curCol = 0;

function setup() {
    createCanvas((gridSize + 2) * tileSize, (gridSize + 2) * tileSize);
    background(255);
    noFill();
    strokeWeight(weight);
    strokeCap(PROJECT);

    grid = [];
    corners = [];
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        corners.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(false);
            corners[i].push(false);
        }
    }
    curCol = 0;
}

function draw() {
    translate(tileSize, tileSize);
}

function mouseClicked() {
    setup();
    begin();
}

function begin() {
    // background(255);
    for (let i = 0; i < 8; i++) {
        push();
        createLine();
        pop();
    }
}

function createLine() {
    nextColor();

    let x0 = outerPosition();
    let y0 = outerPosition();
    let x = x0;
    let y = y0;

    translate((x0 + .5) * tileSize, (y0 + .5) * tileSize);

    let directions = [];

    let curX = 0;
    let curY = 0;

    beginShape();

    vertex(curX, curY);

    directions.push(startDirection(x0, y0));
    x += directions[0].x;
    y += directions[0].y;
    curX += directions[0].x * tileSize;
    curY += directions[0].y * tileSize;

    let len = Math.random() * 100;

    for (let i = 0; i < len; i++) {
        // translate(directions[i].x * tileSize, directions[i].y * tileSize);
        // station(false);
        if (grid[x][y] !== false) {
            if (!parallel(directions[i], grid[x][y])) {
                directions.push(directions[i]);
            } else {
                vertex(curX, curY);
                let newDir = grid[x][y];
                while (parallel(newDir, grid[x][y])) {
                    newDir = randTurn(directions[i]);
                }
                directions.push(newDir);
            }
        } else if (Math.random() < chaos) {
            vertex(curX, curY);
            directions.push(randTurn(directions[i]));
        } else {
            directions.push(directions[i]);
        }
        x += directions[i + 1].x;
        y += directions[i + 1].y;
        if (x >= gridSize || x < 0 || y >= gridSize || y < 0) {
            directions.pop();
            break;
        } else {
            curX += directions[i + 1].x * tileSize;
            curY += directions[i + 1].y * tileSize;
        }
    }

    vertex(curX, curY);
    endShape();

    x = x0;
    y = y0;

    station(false);
    placeStation(grid, x, y, directions[0]);

    for (let i = 0; i < directions.length; i++) {
        translate(directions[i].x * tileSize, directions[i].y * tileSize);
        x += directions[i].x;
        y += directions[i].y;
        placeStation(grid, x, y, directions[i]);
        push();
        switch (directions[i]) {
            case Dir.NW:
                translate(tileSize / 2, tileSize / 2);
                placeStation(corners, x, y, Dir.NW);
                break;
            case Dir.NE:
                translate(-tileSize / 2, tileSize / 2);
                placeStation(corners, x - 1, y, Dir.NE);
                break;
            case Dir.SW:
                translate(tileSize / 2, -tileSize / 2);
                placeStation(corners, x, y - 1, Dir.SW);
                break;
            case Dir.SE:
                translate(-tileSize / 2, -tileSize / 2);
                placeStation(corners, x - 1, y - 1, Dir.SE);
                break;
        }
        pop();
    }

    station(false);
}

function placeStation(arr, x, y, dir) {
    if (arr[x][y] !== false) {
        station(true);
    } else {
        arr[x][y] = dir;
        if (Math.random() < 0.3) {
            station(false);
        }
    }
}

function station(transfer) {
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    if (transfer) {
        ellipse(0, 0, weight + 6, weight + 6)
    }
    ellipse(0, 0, weight - 6, weight - 6)

    pop();
}

function outerPosition() {
    let p = Math.floor(Math.pow(random(Math.pow(gridSize, 1 / outerDegree)), outerDegree));
    if (random() > 0.5) {
        p = gridSize - p - 1;
    }
    return p;
}

function startDirection(x, y) {
    let dx = x - (gridSize / 2);
    let dy = y - (gridSize / 2);

    let horiz = random(gridSize / 2) < Math.abs(dx);
    let vert = random(gridSize / 2) < Math.abs(dy);

    if (horiz && vert) {
        if (dx > 0) {
            if (dy > 0) {
                return Dir.NW;
            } else {
                return Dir.SW;
            }
        } else {
            if (dy > 0) {
                return Dir.NE;
            } else {
                return Dir.SE;
            }
        }
    } else if (horiz) {
        if (dx > 0) {
            return Dir.W;
        } else {
            return Dir.E;
        }
    } else if (vert) {
        if (dy > 0) {
            return Dir.N;
        } else {
            return Dir.S;
        }
    } else {
        return randDir();
    }
}

function randTurn(dir) {
    let options;
    switch (dir) {
        case Dir.N:
            options = [Dir.W, Dir.NW, Dir.NE, Dir.NW, Dir.NE, Dir.E];
            break;
        case Dir.S:
            options = [Dir.W, Dir.SW, Dir.SE, Dir.SW, Dir.SE, Dir.E];
            break;
        case Dir.E:
            options = [Dir.N, Dir.NE, Dir.SE, Dir.NE, Dir.SE, Dir.S];
            break;
        case Dir.W:
            options = [Dir.N, Dir.NW, Dir.SW, Dir.NW, Dir.SW, Dir.S];
            break;
        case Dir.NE:
            options = [Dir.NW, Dir.N, Dir.E, Dir.N, Dir.E, Dir.SE];
            break;
        case Dir.NW:
            options = [Dir.SW, Dir.W, Dir.N, Dir.W, Dir.N, Dir.NE];
            break;
        case Dir.SE:
            options = [Dir.NE, Dir.E, Dir.S, Dir.E, Dir.S, Dir.SW];
            break;
        case Dir.SW:
            options = [Dir.NW, Dir.W, Dir.S, Dir.W, Dir.S, Dir.SE];
            break;
    }
    return options[Math.floor(Math.random() * options.length)];
}

function nextColor() {
    switch (curCol) {
        case 0:
            stroke(255, 0, 0);
            break;
        case 1:
            stroke(0, 200, 0);
            break;
        case 2:
            stroke(10, 10, 255);
            break;
        case 3:
            stroke(245, 235, 0);
            break;
        case 4:
            stroke(0, 255, 255);
            break;
        case 5:
            stroke(255, 0, 255);
            break;
        case 6:
            stroke(255, 128, 0);
            break;
        default:
            stroke(128, 128, 128);
            break;
    }
    curCol++;
}

function parallel(dir1, dir2) {
    switch (dir1) {
        case Dir.N:
            return dir2 === Dir.N || dir2 === Dir.S;
        case Dir.S:
            return dir2 === Dir.S || dir2 === Dir.N;
        case Dir.E:
            return dir2 === Dir.E || dir2 === Dir.W;
        case Dir.W:
            return dir2 === Dir.W || dir2 === Dir.E;
        case Dir.NE:
            return dir2 === Dir.NE || dir2 === Dir.SW;
        case Dir.NW:
            return dir2 === Dir.NW || dir2 === Dir.SE;
        case Dir.SE:
            return dir2 === Dir.SE || dir2 === Dir.NW;
        case Dir.SW:
            return dir2 === Dir.SW || dir2 === Dir.NE;
    }
}

function randColor() {
    // fill(random(256), random(256), random(256));
    stroke(random(256), random(256), random(256));
}

function randDir() {
    return Dir[Object.keys(Dir)[Math.floor(random(8))]];
}