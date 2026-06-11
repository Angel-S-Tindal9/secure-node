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
        this.setupExitButton(); // 👈 El GameManager ahora toma el control del botón de salida
    },

    // 🏆 FUNCIÓN MAESTRA PARA CONTROLAR EL BOTÓN DE SALIDA EN CUALQUIER SALA
    setupExitButton: function() {
        const btnExit = document.getElementById('btn-exit-game');
        
        if (btnExit) {
            // Usamos un clon del botón para evitar que se dupliquen los eventos si se recarga
            const newBtnExit = btnExit.cloneNode(true);
            btnExit.parentNode.replaceChild(newBtnExit, btnExit);

            newBtnExit.addEventListener('click', () => {
                if(confirm("¿Seguro que deseas abandonar la misión? Se perderá todo el progreso actual.")) {
                    // Limpieza absoluta de la memoria temporal
                    sessionStorage.removeItem('escapeGameState'); 
                    sessionStorage.removeItem('secureNodeInventory');
                    sessionStorage.removeItem('tiempoVictoria');
                    
                    // Redirección al menú principal
                    window.location.href = '../index.html';
                }
            });
        }
    },

    saveProgress: function() {
        sessionStorage.setItem('escapeGameState', JSON.stringify(this.state));
        console.log("Progreso guardado automáticamente.");
    },

    loadProgress: function() {
        const saved = sessionStorage.getItem('escapeGameState');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    addItem: function(item) {
        if (!this.state.inventory.includes(item)) {
            this.state.inventory.push(item);
            
            // Llama al nuevo inventory.js correctamente
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
        mostrarAlerta("¡El tiempo se ha agotado! El sistema se ha bloqueado.", "BRECHA DETECTADA");
        // Aquí podrías redirigir a una pantalla de "Game Over"
    },

    resetProgress: function() {
        this.state = {
            currentRoom: 'room1',
            timeRemaining: 900, // 15 minutos
            inventory: [],
            flags: {}
        };
        
        // Destruir tanto la partida como la caja fuerte del inventario
        sessionStorage.removeItem('escapeGameState');
        sessionStorage.removeItem('secureNodeInventory');
        
        this.saveProgress();
    }
};

// Iniciar el motor cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
});

// ==========================================
// FUNCIÓN GLOBAL DE SALIDA (Respaldo)
// ==========================================
window.salirDelJuego = function(rutaInicio) {
    const confirmar = confirm("¿Estás seguro de que deseas abandonar la misión? Se perderá todo el progreso actual.");
    
    if (confirmar) {
        sessionStorage.clear(); 
        window.location.href = rutaInicio || '../index.html'; 
    }
};

// ==========================================
// SISTEMA DE ALERTAS CIBERNÉTICAS (Global)
// ==========================================
window.mostrarAlerta = function(mensaje, titulo = "SISTEMA") {
    let modal = document.getElementById('cyber-alert-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cyber-alert-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="glass-panel" style="max-width: 450px;">
                <h2 id="cyber-alert-title" style="color: #00ff41; margin-bottom: 20px; letter-spacing: 2px; font-family: 'Share Tech Mono', monospace;"></h2>
                <p id="cyber-alert-text" style="color: white; font-size: 1.1rem; margin-bottom: 30px; line-height: 1.5; font-family: 'Share Tech Mono', monospace;"></p>
                <button id="cyber-alert-btn" class="cyber-btn" style="width: 100%;">ENTENDIDO</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('cyber-alert-btn').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    // Asignar el color dependiendo de si es un error o éxito
    const titleElement = document.getElementById('cyber-alert-title');
    titleElement.innerText = titulo;
    if (titulo === "ACCESO DENEGADO" || titulo === "ERROR" || titulo === "BRECHA DETECTADA") {
        titleElement.style.color = "#ff003c";
    } else {
        titleElement.style.color = "#00ff41";
    }

    document.getElementById('cyber-alert-text').innerText = mensaje;
    modal.classList.remove('hidden');
};
