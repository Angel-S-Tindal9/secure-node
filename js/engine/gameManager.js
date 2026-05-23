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
        localStorage.setItem('escapeGameState', JSON.stringify(this.state));
        console.log("Progreso guardado automáticamente.");
    },

    loadProgress: function() {
        const saved = localStorage.getItem('escapeGameState');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    addItem: function(item) {
        if (!this.state.inventory.includes(item)) {
            this.state.inventory.push(item);
            this.renderInventory();
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

    // Agrega esto dentro del objeto GameManager en gameManager.js
    resetProgress: function() {
        this.state = {
            currentRoom: 'room1',
            timeRemaining: 900, // 15 minutos
            inventory: [],
            flags: {}
        };
        this.saveProgress();
    }
};

// Iniciar el motor cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
});


