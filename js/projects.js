var box1, box2, box3, box4;
const ADD_CT = 3;

window.onload = function() {
    self.setInterval(updateProjects, 150);
    box1 = document.getElementById('logo-1');
    box2 = document.getElementById('logo-2');
    box3 = document.getElementById('logo-3');
    box4 = document.getElementById('logo-4');
    refreshSize();
}

document.addEventListener("scroll", refreshSize);

function updateProjects() {
    updateColumn(box1);
    updateColumn(box2, 68.2);
    updateColumn(box3);
    updateColumn(box4);
}

function updateColumn(box, big = false) {
    let ht = big ? 68.2 : 28.1
    let add = ADD_CT * (big ? 2 : 1);
    let randColor = Math.random() * 360;
    for (let i = 0; i < add; i++) {
        let offset = Math.random() * (ht + 0.5) - 0.5;
        let randString = makeString();
        let node = document.createElement("SPAN");
        let textNode = document.createTextNode(randString);
        node.appendChild(textNode);
        node.style.position = "absolute";
        node.style.top = offset + "ex";
        node.style.color = "hsl(" + randColor + "deg, 100%, 50%)";
        node.style.whiteSpace = "pre";
        box.appendChild(node);
    }

    if (box.children.length >= add * 2) { // make sure there's at least two sets
        for (let i = 0; i < add; i++) { // tell prev set to fade out
            box.children[box.children.length - 2 * add + i].className += " fade-out";
        }
    }
    if (box.children.length >= add * 20) { // opacity should hit 0 by now
        for (let i = 0; i < add; i++) {
            box.children[0].remove();
        }
    }
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
    for (let i = 0; i < 9; i++ ) {
        if (Math.random() > 0.5) {
            result += 'X';
        } else {
            result += ' '
        }
    }
    return result;
}

function refreshSize() {
    let logo = document.getElementById("logo");
    logo.style.fontSize = (logo.clientWidth / 39.75) + "px";
}