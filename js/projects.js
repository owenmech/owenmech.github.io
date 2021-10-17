let box1, box2, box3, box4;
let ind = 0;

window.onload = function () {
    self.setInterval(updateProjects, 150);
    box1 = document.getElementById('logo-1');
    box2 = document.getElementById('logo-2');
    box3 = document.getElementById('logo-3');
    box4 = document.getElementById('logo-4');
    refreshSize();
}

document.addEventListener("scroll", refreshSize);

function updateProjects() {
    updateColumn(box1, false);
    updateColumn(box2, true);
    updateColumn(box3, false);
    updateColumn(box4, false);
    ind++;
}

function updateColumn(box, big) {
    let ht = big ? 51.8 : 11.7;
    let ct = big ? 14 : 4;
    let randColor = Math.random() * 360;
    let offset = Math.random() * (ht + 0.5) - 0.5;
    let randString = makeString();
    let node;
    if (box.children.length >= ct) {
        node = box.children[ind % box.children.length];
        node.innerText = randString;
    } else {
        node = document.createElement("SPAN");
        let textNode = document.createTextNode(randString);
        node.appendChild(textNode);
        node.style.position = "absolute";
        node.style.whiteSpace = "pre";
        box.appendChild(node);
    }
    node.style.top = offset + "ex";
    node.style.color = "hsl(" + randColor + "deg, 100%, 50%)";
}

function bitRandom() {
    let bitString = "";
    for (let i = 0; i < 9; i++) {
        bitString += Math.floor(Math.random() * 2);
    }
    return bitString;
}

function makeString() {
    let result = '';
    for (let line = 0; line < 8; line++) {
        for (let i = 0; i < 9; i++) {
            if (Math.random() > 0.5) {
                result += 'X';
            } else {
                result += ' '
            }
        }
        result += '\n';
    }
    return result;
}

function refreshSize() {
    let logo = document.getElementById("logo");
    logo.style.fontSize = (logo.clientWidth / 39.75) + "px";
}