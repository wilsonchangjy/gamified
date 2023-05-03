window.addEventListener('scroll', function(){
    var scroll = document.querySelector('.back-top');
    scroll.classList.toggle("active", window.scrollY > 650);

    if (window.scrollY > 325) {
        $('.menu-button').toggleClass("click", false);
        $('.side-bar').toggleClass("show", false);
    }
});