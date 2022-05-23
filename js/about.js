// logo
let grad1, grad2, grad3, grad4, initials;
let deg;
let opa = 0;
let countdown = 30;

// bio
let bioStrip;
let illinois, california;
let dotWrapper;
const numSegments = 8;
const dotsPerSeg = 6;
const numDots = numSegments * dotsPerSeg + 1;
const aimlessness = 0.6;

// dev
let devStrip;
let devIcon;
let codeElements = [];
let codeStrings = [];
const codeStrWidth = 0.90;

// usc
let uscStrip;
let capWrapper;
let caps = [];
let capCount;
let capOrder = [];
let capHeights = [];
const maxCapHeight = 75;
const minCapHeight = 45;
let capRots = [];
const maxCapRot = 180;
const minCapRot = 360;

window.onload = function () {
    initAbout();

    initBio();
    initDev();
    initUsc();

    resizeAbout();
}

function resizeAbout() {
    resizeBio();
    resizeDev();
    resizeUsc();

    scrollAbout();
}

window.addEventListener('resize', resizeAbout);

function scrollAbout() {
    // let maxScroll = document.body.clientHeight - window.innerHeight;
    // let progress = window.scrollY / maxScroll;
    // let bioProgress = stagger(progress, 3, 0, 3);
    // let devProgress = stagger(progress, 2, 1, 3);
    // let uscProgress = stagger(progress, 3.7, 3, 4);
    let bioProgress = scrollRemap(bioStrip, 0.1, 0.6);
    let devProgress = scrollRemap(devStrip, 0.1, 0.7);
    let uscProgress = scrollRemap(uscStrip, 0.25, 1);

    scrollBio(bioProgress);
    scrollDev(devProgress);
    scrollUsc(uscProgress);
}

document.addEventListener("scroll", scrollAbout);

// region logo
function initAbout() {
    self.setInterval(updateAbout, 30);
    grad1 = document.getElementById('logo-1');
    grad2 = document.getElementById('logo-2');
    grad3 = document.getElementById('logo-3');
    grad4 = document.getElementById('logo-4');
    initials = document.getElementById('initials');
    deg = Math.random() * 360;
}

function updateAbout() {
    if (countdown > 0) {
        countdown--;
        return;
    }
    updateGradient(grad1);
    updateGradient(grad2);
    updateGradient(grad3);
    updateGradient(grad4);
    initials.style.opacity = (1 - opa) * 100 + "%";
    deg += 1;
    if (opa < 1) {
        opa += 0.0125;
    }
}

function updateGradient(grad) {
    let scaled = opa * 0.6;
    grad.style.backgroundImage = "linear-gradient(" + deg + "deg, rgba(255,0,0," + scaled + "), rgba(255,0,0,0) 70.71%),\n" +
        "            linear-gradient(" + (deg + 120) + "deg, rgba(0,255,0," + scaled + "), rgba(0,255,0,0) 70.71%),\n" +
        "            linear-gradient(" + (deg + 240) + "deg, rgba(0,0,255," + scaled + "), rgba(0,0,255,0) 70.71%)";
    grad.style.opacity = (opa * 100) + "%";
}

// endregion logo

// region bio
function initBio() {
    illinois = document.getElementById("illinois");
    california = document.getElementById("california");
    bioStrip = document.getElementById("bio");
    dotWrapper = document.getElementById("path-dots");

    // create elements
    for (let i = 0; i < numDots; ++i) {
        const dot = document.createElement("div");
        dotWrapper.appendChild(dot);
    }
}

function resizeBio() {
    // calculate straight shot
    let startPos = [
        illinois.offsetLeft + illinois.clientWidth * 0.85,
        illinois.offsetTop + illinois.clientHeight * 0.125
    ];
    let endPos = [
        california.offsetLeft + california.clientWidth * 0.6,
        california.offsetTop + california.clientHeight * 0.80
    ];
    let pathVec = [endPos[0] - startPos[0], endPos[1] - startPos[1]];

    // build jagged path points
    let segVec = [pathVec[0] / numSegments, pathVec[1] / numSegments];
    let perpVec = [-segVec[1], segVec[0]];
    let pathPoints = [startPos];
    let curPos = [startPos[0], startPos[1]];
    for (let i = 0; i < numSegments - 1; ++i) {
        curPos[0] += segVec[0];
        curPos[1] += segVec[1];
        let nextPoint = [curPos[0], curPos[1]];
        if (Math.random() > 0.5) {
            nextPoint[0] += Math.random() * perpVec[0] * aimlessness;
            nextPoint[1] += Math.random() * perpVec[1] * aimlessness;
        } else {
            nextPoint[0] -= Math.random() * perpVec[0] * aimlessness;
            nextPoint[1] -= Math.random() * perpVec[1] * aimlessness;
        }
        pathPoints.push(nextPoint);
    }
    pathPoints.push(endPos);

    // place points along path
    curPos = [startPos[0], startPos[1]];
    let dots = dotWrapper.children;
    let i = 0;
    for (let s = 0; s < numSegments; ++s) {
        let pathStep = [
            pathPoints[s + 1][0] - pathPoints[s][0],
            pathPoints[s + 1][1] - pathPoints[s][1]
        ];
        for (d = 0; d < dotsPerSeg; ++d) {
            dots[i].style.left = (curPos[0] - dots[i].clientWidth * 0.5) + "px";
            dots[i].style.top = (curPos[1] - dots[i].clientHeight * 0.5) + "px";
            curPos[0] += pathStep[0] / dotsPerSeg;
            curPos[1] += pathStep[1] / dotsPerSeg;
            i++
        }
    }

    // last dot
    dots[i].style.left = (endPos[0] - dots[i].clientWidth * 0.5) + "px";
    dots[i].style.top = (endPos[1] - dots[i].clientHeight * 0.5) + "px";
}

function scrollBio(bioProgress) {
    let dots = dotWrapper.children;
    let numToShow = bioProgress * dots.length;
    for (let i = 0; i < dots.length; i++) {
        if (i < numToShow) {
            dots[i].style.opacity = "100%";
        } else {
            dots[i].style.opacity = "0%";
        }
    }
}

// endregion bio

//region dev
function initDev() {
    codeElements.push(document.getElementById("laptop-code"));
    codeElements.push(document.getElementById("controller-code"));
    codeElements.push(document.getElementById("phone-code"));
    codeElements.push(document.getElementById("desktop-code"));
    devStrip = document.getElementById("dev");
    devIcon = document.getElementsByClassName("dev-icon")[0];
}

function resizeDev() {
    codeElements[0].innerHTML = "0";
    let charWidth = codeElements[0].clientWidth;
    let numChars = (devStrip.clientWidth - devIcon.clientWidth) / charWidth * codeStrWidth;

    codeStrings = [];

    for (let i = 0; i < codeElements.length; ++i) {
        let str = "";
        for (let c = 0; c < numChars; ++c) {
            if (Math.random() > 0.5) {
                str += '0';
            } else {
                str += '1';
            }
        }
        codeStrings.push(str);
        codeElements[i].innerHTML = "";
    }
}

function scrollDev(devProgress) {
    let left = true;
    for (let i = 0; i < codeElements.length; ++i) {
        let rowProgress = stagger(devProgress, 1.5, i, codeElements.length);
        let charsToShow = rowProgress * codeStrings[i].length;
        if (left) {
            codeElements[i].innerHTML = codeStrings[i].substr(0, charsToShow);
        } else {
            codeElements[i].innerHTML = codeStrings[i].substr(codeStrings[i].length - charsToShow);
        }
        left = !left;
    }
}

// endregion dev

// region usc
function initUsc() {
    capWrapper = document.getElementById("cap-wrapper");
    uscStrip = document.getElementById("usc");
    caps = [];
    capOrder = [];
    capCount = capWrapper.children.length;
    for (let i = 0; i < capCount; ++i) {
        caps.push(capWrapper.children[i].children[0]);
        capOrder.push(i);
        capHeights.push(Math.random() * (maxCapHeight - minCapHeight) + minCapHeight);
        capRots.push(Math.random() * (maxCapRot - minCapRot) + minCapRot);
    }
    shuffleArray(capOrder);

}

function resizeUsc() {

}

function scrollUsc(uscProgress) {
    for (let i = 0; i < capCount; ++i) {
        let invFrac = 2.5;
        let capProgress = stagger(uscProgress, 2.5, i, capCount);
        let eased = 1 - Math.pow(1 - capProgress, 3);
        caps[capOrder[i]].style.bottom = (eased * capHeights[i]) + "%";
        let transStr = "translate(-50%, 0) rotate(" + (eased * capRots[i]) + "deg)";
        caps[capOrder[i]].style.transform = transStr;
    }
}

// endregion usc