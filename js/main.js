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