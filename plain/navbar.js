function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    document.getElementsByClassName("container")[0].classList.toggle('transparent');
    document.getElementsByClassName("earthLatLogo")[0].classList.toggle('transparent');
    document.getElementById("landingLinks").classList.toggle('open');
}
