window.addEventListener("message", (event) => {
    const frase = document.querySelector(".frase-final");
    const fraseLogo = document.querySelector(".frase-logo");
    const SoleLua = document.querySelector(".SoleLua");
    if (event.data === "enable-dark-mode") {
      document.body.classList.add("dark-mode");
      frase.textContent = "Que a escuridão esteja com você";
      fraseLogo.textContent = "O caminho do império";
      SoleLua.src = "../src/img/lua.png";
    } else if (event.data === "disable-dark-mode") {
      document.body.classList.remove("dark-mode");
      frase.textContent = "Que a força esteja com você";
      fraseLogo.textContent = "O caminho da força";
      SoleLua.src = "../src/img/sol.png";
    }
  });
