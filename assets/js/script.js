const header = document.querySelector(".header, .navbar");

window.addEventListener("scroll", () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
});
