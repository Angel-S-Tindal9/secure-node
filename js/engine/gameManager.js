// js/engine/gameManager.js

const GameManager = {
    state: {
        currentRoom: 'room1',
        timeRemaining: 900, // 15 minutos en segundos
        inventory: [],
        flags: {
            room1KeyFound: false,
            powerRestored: false
        }
    },

    init: function() {
        this.loadProgress();
        this.startTimer();
    },

    saveProgress: function() {
        // CAMBIO 1: Usamos sessionStorage en lugar de localStorage
        sessionStorage.setItem('escapeGameState', JSON.stringify(this.state));
        console.log("Progreso guardado automáticamente.");
    },

    loadProgress: function() {
        // CAMBIO 2: Usamos sessionStorage en lugar de localStorage
        const saved = sessionStorage.getItem('escapeGameState');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    addItem: function(item) {
        if (!this.state.inventory.includes(item)) {
            this.state.inventory.push(item);
            
            // CAMBIO 3: Quitamos el "this." para que llame al nuevo inventory.js correctamente
            if (typeof renderInventory === 'function') {
                renderInventory(); 
            }
            
            this.saveProgress();
        }
    },

    startTimer: function() {
        setInterval(() => {
            if (this.state.timeRemaining > 0) {
                this.state.timeRemaining--;
                this.updateTimerUI();
            } else {
                this.triggerGameOver();
            }
        }, 1000);
    },

    updateTimerUI: function() {
        const minutes = Math.floor(this.state.timeRemaining / 60);
        const seconds = this.state.timeRemaining % 60;
        const display = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        const timerElement = document.getElementById('timer');
        if (timerElement) timerElement.innerText = display;
    },

    triggerGameOver: function() {
        alert("¡El tiempo se ha agotado! El sistema se ha bloqueado.");
        // Lógica de reinicio o pantalla de fallo
    },

    resetProgress: function() {
        this.state = {
            currentRoom: 'room1',
            timeRemaining: 900, // 15 minutos
            inventory: [],
            flags: {}
        };
        
        // CAMBIO 4: Destruir tanto la partida como la nueva caja fuerte del inventario
        sessionStorage.removeItem('escapeGameState');
        sessionStorage.removeItem('secureNodeInventory');
        
        this.saveProgress();
    }
};

// Iniciar el motor cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
});

window.salirDelJuego = function(rutaInicio) {
    const confirmar = confirm("¿Estás seguro de que deseas abandonar la misión? Se perderá todo el progreso actual.");
    
    if (confirmar) {
        // La opción nuclear: Borra absolutamente TODO lo que haya en la memoria temporal
        sessionStorage.clear(); 
        
        // Redirige al jugador al menú principal
        window.location.href = rutaInicio || '../index.html'; 
    }
};
