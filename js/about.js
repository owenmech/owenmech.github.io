let grad1, grad2, grad3, grad4, initials;
let deg;
let opa = 0;
let countdown = 30

window.onload = function() {
    self.setInterval(updateAbout, 30);
    grad1 = document.getElementById('logo-1');
    grad2 = document.getElementById('logo-2');
    grad3 = document.getElementById('logo-3');
    grad4 = document.getElementById('logo-4');
    initials = document.getElementById('initials');
    deg = Math.random() * 360;
}


function updateAbout() {
    if (countdown > 0)
    {
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
    let scaled = opa * 0.6
    grad.style.backgroundImage = "linear-gradient(" + deg + "deg, rgba(255,0,0," + scaled + "), rgba(255,0,0,0) 70.71%),\n" +
        "            linear-gradient(" + (deg + 120) + "deg, rgba(0,255,0," + scaled + "), rgba(0,255,0,0) 70.71%),\n" +
        "            linear-gradient(" + (deg + 240) + "deg, rgba(0,0,255," + scaled + "), rgba(0,0,255,0) 70.71%)";
    grad.style.opacity = (opa * 100) + "%";
}