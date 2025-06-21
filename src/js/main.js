document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const message = document.getElementById("loginMessage");

      // Demo: identifiants fixes
      if (username === "admin" && password === "sorbo123") {
        message.style.color = "lightgreen";
        message.textContent = "Connexion réussie !";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        message.style.color = "red";
        message.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
      }
    });
  }
});

function gradientRotateHover(selector) {
  const link = document.querySelector(selector);
  if (!link) return;

  // Inject keyframes only once
  if (!document.getElementById("rotate-gradient-keyframes")) {
    const style = document.createElement("style");
    style.id = "rotate-gradient-keyframes";
    style.innerHTML = `
      @keyframes rotate-gradient {
        0% {
          background: linear-gradient(45deg, #60a5fa, #2563eb);
        }
        100% {
          background: linear-gradient(405deg, #60a5fa, #2563eb);
        }
      }
    `;
    document.head.appendChild(style);
  }

  link.addEventListener("mouseenter", () => {
    link.style.animation = "rotate-gradient 2s linear infinite";
    link.style.backgroundClip = "text";
    link.style.webkitBackgroundClip = "text";
    link.style.color = "transparent";
    link.style.webkitTextFillColor = "transparent";
    link.style.transform = "scale(1.10)";
    link.style.transition = "transform 0.2s";
  });

  link.addEventListener("mouseleave", () => {
    link.style.animation = "";
    link.style.background = "";
    link.style.backgroundClip = "";
    link.style.webkitBackgroundClip = "";
    link.style.color = "";
    link.style.webkitTextFillColor = "";
    link.style.transform = "";
    link.style.transition = "";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Appliquer l'effet sur le lien Ressources du navbar
  gradientRotateHover('a[href="ressources.html"]');
});
