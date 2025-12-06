window.addEventListener("message", (event) => {
    if (event.data === "enable-dark-mode") {
      document.body.classList.add("dark-mode");
    } else if (event.data === "disable-dark-mode") {
      document.body.classList.remove("dark-mode");
    }
  });