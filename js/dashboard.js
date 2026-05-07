// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si hay una sesión activa usando nuestro módulo Session
    const user = Session.checkAuth();
    
    if (user) {
        // Mostrar el nombre del operador capitalizado
        document.getElementById('display-user').innerText = 
            user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }

    // 2. Configurar botón de cerrar sesión
    document.getElementById('btn-logout').addEventListener('click', () => {
        Session.logout();
    });

    // 3. Configurar el inicio de una Nueva Partida
    document.getElementById('btn-start').addEventListener('click', () => {
        // Inicializamos los valores por defecto en el gameManager
        GameManager.resetProgress();
        
        // Redirigir a la primera habitación
        window.location.href = 'rooms/room1.html';
    });

    // 4. Verificar si hay una partida guardada para habilitar el botón "Continuar"
    const savedState = localStorage.getItem('escapeGameState');
    if (savedState) {
        const btnContinue = document.getElementById('btn-continue');
        btnContinue.disabled = false;
        btnContinue.style.color = "var(--color-primary)";
        btnContinue.style.borderColor = "var(--color-primary)";
        btnContinue.style.cursor = "pointer";

        btnContinue.addEventListener('click', () => {
            const state = JSON.parse(savedState);
            // Redirigir a la habitación donde se quedó el jugador
            window.location.href = `rooms/${state.currentRoom}.html`;
        });
    }
});