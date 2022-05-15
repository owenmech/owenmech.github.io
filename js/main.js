document.addEventListener("scroll", function () {
    let logo = document.getElementById("logo");
    let fakeLogo = document.getElementById("fake-logo");
    let height = fakeLogo.clientHeight - window.scrollY;

    let headerHeight = document.getElementById("header").clientHeight;
    if (height < headerHeight) {
        height = headerHeight;
    }

    let width = height * 16 / 9;
    logo.style.width = width + "px";
});

function reclamp(value) {
    if (value > 0)
    {
        if (value < 1)
        {
            return value;
        }
        else
        {
            return 1;
        }
    }
    else
    {
        return 0;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function stagger(progress, multiplier, index, total)
{
    return reclamp(progress * multiplier - index * (multiplier - 1) / (total - 1));
}