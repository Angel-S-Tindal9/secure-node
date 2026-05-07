// js/auth/login.js
// Este archivo maneja únicamente los eventos del DOM de la vista de login

document.addEventListener('DOMContentLoaded', () => {
    
    // Si ya está logueado, lo mandamos directo al dashboard
    if(localStorage.getItem('escapeUser')) {
        window.location.href = 'dashboard.html';
    }

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitamos que la página se recargue

        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Efecto visual de carga
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Verificando...";
        btn.disabled = true;

        setTimeout(() => {
            const success = Session.login(user, pass);

            if (success) {
                errorDiv.innerText = "";
                window.location.href = 'dashboard.html'; // Redirigimos al menú principal
            } else {
                errorDiv.innerText = "Acceso denegado. Credenciales inválidas.";
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }, 800); // Simulamos un pequeño retraso de red de 800ms
    });
});