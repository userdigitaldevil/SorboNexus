document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const message = document.getElementById('loginMessage');

      // Demo: identifiants fixes
      if (username === 'admin' && password === 'sorbo123') {
        message.style.color = 'lightgreen';
        message.textContent = 'Connexion réussie !';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        message.style.color = 'red';
        message.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
      }
    });
  }
});