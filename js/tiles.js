let gridSize = 20;
let tileSize = 40;
let weight = 8;
let grid = [];


let r = 0;
let g = 0;
let b = 0;


function setup() {
    createCanvas(gridSize * tileSize, gridSize * tileSize);
    background(42);
    fill(255);
    strokeWeight(weight);

}

function draw() {

}

function mouseClicked() {
    begin();
}

function begin() {
    r = random(256);
    g = random(256);
    b = random(256);

    grid = [];
    background(42);
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(false);
        }
    }
    placeTiles(4);
    placeTiles(2);
    placeTiles(1);
}

function placeTiles(size) {
    for (let attempt = 0; attempt < 10000; attempt++) {
        let x = Math.floor(random(gridSize - size + 1));
        let y = Math.floor(random(gridSize - size + 1));
        if (attemptPlacement(size, x, y)) {
            randColor();
            rect(tileSize * (x + 0 * size / 2) + weight / 2, tileSize * (y + 0 * size / 2) + weight / 2, size * tileSize - weight, size * tileSize - weight);
        }
    }
}

function attemptPlacement(size, x, y) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[x + i][y + j] === true) {
                return false
            }
        }
    }
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            grid[x + i][y + j] = true;
        }
    }
    return true;
}

function randColor() {
    let variance = 80;
    fill(random(variance) - variance / 2 + r, random(variance) - variance / 2 + g, random(variance) - variance / 2 + b);
    stroke(random(variance) - variance / 2 + r, random(variance) - variance / 2 + g, random(variance) - variance / 2 + b);
}