window.addEventListener("scroll", () => {

const nav = document.querySelector(".navbar");

if(window.scrollY > 40){

nav.style.background = "rgba(0,0,0,.85)";

}else{

nav.style.background = "rgba(0,0,0,.35)";

}

});