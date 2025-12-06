const toggle = document.getElementById("darkModeToggle");
const logo = document.querySelector(".logo-star");
const saber = document.querySelector(".logo-dark");


window.addEventListener("DOMContentLoaded", () => {
    const prefsalva = JSON.parse(sessionStorage.getItem("preference"));
    if (prefsalva.theme === "dark") {
        document.body.classList.add("dark-mode");

        logo.src = "../src/img/Logo Branca.png";
        saber.src = "../src/img/sabre_vermelho.png";
        saber.classList.add("rotacionado");

        window.parent.postMessage("enable-dark-mode", "*");
    } else {
        logo.src = "../src/img/Logo Preta.png";
        saber.src = "../src/img/sabre_azul.png";
        saber.classList.remove("rotacionado");

        window.parent.postMessage("disable-dark-mode", "*");
    }
});


toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");

    const preferencia = { theme: isDark ? "dark" : "light" };
    sessionStorage.setItem("preference", JSON.stringify(preferencia));

    if (isDark) {
        logo.src = "../src/img/Logo Branca.png";
        saber.src = "../src/img/sabre_vermelho.png";
        window.parent.postMessage("enable-dark-mode", "*");
    } else {
        logo.src = "../src/img/Logo Preta.png";
        saber.src = "../src/img/sabre_azul.png";
        window.parent.postMessage("disable-dark-mode", "*");
    }

    saber.classList.toggle("rotacionado");
});