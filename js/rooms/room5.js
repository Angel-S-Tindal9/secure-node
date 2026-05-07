// js/rooms/room5.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Entorno
    const serverTrigger = document.getElementById('server-trigger');
    const morseManual = document.getElementById('morse-manual');
    
    // Modales
    const manualModal = document.getElementById('manual-modal');
    const terminalModal = document.getElementById('terminal-modal');
    
    // Botones de cierre
    const btnCloseManual = document.getElementById('btn-close-manual');
    const btnCloseTerminal = document.getElementById('btn-close-terminal');
    
    // Lógica Terminal
    const masterInput = document.getElementById('master-input');
    const btnVerify = document.getElementById('btn-verify');
    const terminalStatus = document.getElementById('terminal-status');

    // Botón de retroceso
    document.getElementById('btn-back').addEventListener('click', () => {
        window.location.href = 'room4.html'; // Cambia esto al número de la sala anterior
    });

    const btnExit = document.getElementById('btn-exit-game');
        if (btnExit) {
            btnExit.addEventListener('click', () => {
                if(confirm("¿Seguro que deseas abandonar la misión? Se perderá el progreso no guardado.")) {
                    window.location.href = '../index.html';
                }
            });
        }

    // --- INTERACCIÓN CON EL MANUAL ---
    morseManual.addEventListener('click', () => {
        manualModal.classList.remove('hidden');
        
        // Lo añadimos al inventario para que lo puedan ver en cualquier momento
        Inventory.addItem('manual_morse', 'Manual de Cifrado', '📖');
    });

    btnCloseManual.addEventListener('click', () => {
        manualModal.classList.add('hidden');
    });

    // --- INTERACCIÓN CON LA TERMINAL ---
    serverTrigger.addEventListener('click', () => {
        terminalModal.classList.remove('hidden');
        masterInput.value = "";
        terminalStatus.innerText = "";
    });

    btnCloseTerminal.addEventListener('click', () => {
        terminalModal.classList.add('hidden');
    });

    // --- VALIDACIÓN DE LA CONTRASEÑA ---
    btnVerify.addEventListener('click', () => {
        const code = masterInput.value.toUpperCase();
        
        if (code === "HACK") {
            terminalStatus.innerText = "CÓDIGO ACEPTADO. PROTOCOLO DE AISLAMIENTO DESACTIVADO.";
            terminalStatus.style.color = "var(--color-primary)";
            masterInput.style.borderColor = "var(--color-primary)";
            
            // Pausa dramática antes de ganar el juego
            setTimeout(() => {
                window.location.href = 'ending.html'; // VICTORIA FINAL
            }, 2000);

        } else {
            terminalStatus.innerText = "CÓDIGO INCORRECTO. ACCESO DENEGADO.";
            terminalStatus.style.color = "var(--color-alert)";
            masterInput.style.borderColor = "var(--color-alert)";
            
            setTimeout(() => {
                masterInput.value = "";
                terminalStatus.innerText = "";
                masterInput.style.borderColor = "var(--color-primary)";
            }, 1500);
        }
    });
});