const toggle = document.getElementById("darkModeToggle");
const logo = document.querySelector(".logo-star");
const saber = document.querySelector(".logo-dark");

toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode")
    
    logo.src = isDark ? "../src/img/Logo Branca.png" : "../src/img/Logo Preta.png";
    saber.src =  isDark ? "../src/img/sabre_vermelho.png": "../src/img/sabre_azul.png";

    //rotacao do sabre
    saber.classList.toggle("rotacionado");

    window.parent.postMessage(isDark ? "enable-dark-mode" : "disable-dark-mode", "*");
});