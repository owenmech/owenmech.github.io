window.addEventListener("resize", function () {
    if (document.body.clientWidth < 1350) {
        document.documentElement.style.setProperty('--content-size', '800px');
    } else {
        document.documentElement.style.setProperty('--content-size', '600px');
    }
});

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
    if (value > 0) {
        if (value < 1) {
            return value;
        } else {
            return 1;
        }
    } else {
        return 0;
    }
}

function myLerp(start, end, t) {
    return (end - start) * t + start;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function stagger(progress, multiplier, index, total) {
    return reclamp(progress * multiplier - index * (multiplier - 1) / (total - 1));
}

function scrollRemap(element, animStart, animEnd) {
    let box = element.getBoundingClientRect();
    let top = box.top + window.scrollY;
    let bottom = box.bottom + window.scrollY - document.getElementById("header").clientHeight;

    // get beginning of visible range
    let viewStart;
    if (top < window.innerHeight)
    {
        // element is already showing when scroll is 0
        viewStart = 0;
    }
    else
    {
        // when the element first appears at the bottom
        viewStart = top - window.innerHeight;
    }

    // get end of visible range
    let maxScroll = document.body.clientHeight - window.innerHeight;
    let viewEnd;
    if (bottom > maxScroll)
    {
        // element is still in view when at max scroll
        viewEnd = maxScroll;
    }
    else
    {
        // when the element leaves view
        viewEnd = bottom;
    }


    // 0 = element first visible, 1 = element last visible
    let viewProgress = (window.scrollY - viewStart) / (viewEnd - viewStart);
    // 0 = viewProgress is animStart, 1 = viewProgress is animEnd
    let animProgress = (viewProgress - animStart) / (animEnd - animStart);
    return reclamp(animProgress);
}

function scrollStagger(element, animStart, animEnd, duration, total, index) {
    let startRange = (animEnd - animStart) - duration;
    let offset = startRange / (total + 1); // 0 = first start, 1 = last start
    let curStart = animStart + offset * index;
    let curEnd = curStart + duration;
    return scrollRemap(element, curStart, curEnd);
}