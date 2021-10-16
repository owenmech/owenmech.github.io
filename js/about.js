let grad1, grad2, grad3, grad4;
let deg;
let opa = 0;

window.onload = function() {
    self.setInterval(updateAbout, 30);
    grad1 = document.getElementById('logo-1');
    grad2 = document.getElementById('logo-2');
    grad3 = document.getElementById('logo-3');
    grad4 = document.getElementById('logo-4');
    deg = Math.random() * 360;
    updateAbout();
}


function updateAbout() {
    updateGradient(grad1);
    updateGradient(grad2);
    updateGradient(grad3);
    updateGradient(grad4);
}

function updateGradient(grad) {
    grad.style.backgroundImage = "linear-gradient(" + deg + "deg, rgba(255,0,0," + opa + "), rgba(255,0,0,0) 70.71%),\n" +
        "            linear-gradient(" + (deg + 120) + "deg, rgba(0,255,0," + opa + "), rgba(0,255,0,0) 70.71%),\n" +
        "            linear-gradient(" + (deg + 240) + "deg, rgba(0,0,255," + opa + "), rgba(0,0,255,0) 70.71%)";
    deg += 0.3;
    if (opa < 0.6) {
        opa += 0.002;
    }
}