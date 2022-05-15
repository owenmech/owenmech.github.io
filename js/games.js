var animState = 1;
const STATES = 8;
var box1, box2, box3, box4;

window.onload = function () {
    self.setInterval(updateGames, 175);
    box1 = document.getElementById('logo-1');
    box2 = document.getElementById('logo-2');
    box3 = document.getElementById('logo-3');
    box4 = document.getElementById('logo-4');

    // randomHue(box1);
    // randomHue(box2);
    // randomHue(box3);
    // randomHue(box4);
}

function updateGames() {
    updateCoin(box4, "coin", animState);
    updateCoin(box3, "coin", animState + 1);
    updateCoin(box2, "big-coin", animState + 2);
    updateCoin(box1, "coin", animState + 3);
    animState = animState % STATES + 1;
}

function updateCoin(box, name, state) {
    if (state > 8)
    {
        state -= 8;
    }
    if (state === 4) {
        randomHue(box);
    }
    if (state > 4) {
        state -= 4;
    }
    box.className = name + state;
}

function randomHue(box) {
    let hue = Math.random() * 360;
    box.style.filter = "hue-rotate(" + hue + "deg)";
}