let bar1, bar2, bar3, bar4;
let vol1 = {current: 0, target: 1};
let vol2 = {current: 0, target: 1};
let vol3 = {current: 0, target: 1};
let vol4 = {current: 0, target: 1};

document.addEventListener('DOMContentLoaded', (event) => {
    self.setInterval(updateMusic, 100);
    self.setInterval(updateBigBar, 50);
    bar1 = document.getElementById('logo-1');
    bar2 = document.getElementById('logo-2');
    bar3 = document.getElementById('logo-3');
    bar4 = document.getElementById('logo-4');

    let start = Math.random() * 360;
    applyColors(bar1, start + 22.5 * 0, start +  22.5 * 2);
    applyColors(bar2, start + 22.5 * 3, start +  22.5 * 9);
    applyColors(bar3, start + 22.5 * 10, start + 22.5  * 12);
    applyColors(bar4, start + 22.5 * 13, start + 22.5  * 15);
    // applyColors(bar1, 30, 70);
    // applyColors(bar2, 75, 245);
    // applyColors(bar3, 255, 300);
    // applyColors(bar4, 310, 380);
});

function updateMusic() {
    updateBar(bar1, vol1);
    updateBar(bar3, vol3);
    updateBar(bar4, vol4);
}

function updateBigBar() {
    updateBar(bar2, vol2);
}

function updateBar(bar, vol) {
    if (vol.current < vol.target)
    {
        let child = bar.children.length - 1 - vol.current;
        bar.children[child].style.visibility = "visible";
        vol.current++;
    }
    else if (vol.current > vol.target)
    {
        let child = bar.children.length - vol.current
        bar.children[child].style.visibility = "hidden";
        vol.current--;
    }
    if (vol.current === vol.target)
    {
        vol.target = Math.floor(Math.sqrt(Math.random()) * (bar.children.length + 1));
    }
}

function applyColors(bar, hue1, hue2) {
    let ct = bar.children.length;
    let step = (hue2 - hue1) / (bar.children.length - 1);
    let curHue = hue1;
    for (let i = 0; i < ct; i++) {
        bar.children[i].style.background = "linear-gradient(135deg, hsl(" + curHue + ", 100%, 60%), hsl(" + curHue + ", 100%, 40%))";
        curHue += step;
    }
}