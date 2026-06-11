// js/rooms/room5.js

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ELEMENTOS DEL DOM
    // ==========================================
    const serverTrigger = document.getElementById('server-trigger');
    const morseManual = document.getElementById('morse-manual');
    
    const manualModal = document.getElementById('manual-modal');
    const terminalModal = document.getElementById('terminal-modal');
    
    const btnCloseManual = document.getElementById('btn-close-manual');
    const btnCloseTerminal = document.getElementById('btn-close-terminal');
    
    const masterInput = document.getElementById('master-input');
    const btnVerify = document.getElementById('btn-verify');
    const terminalStatus = document.getElementById('terminal-status');

    // ==========================================
    // 2. NAVEGACIÓN Y SALIDA SEGURA
    // ==========================================
    
    // Botón para volver a la sala anterior
    document.getElementById('btn-back').addEventListener('click', () => {
        // Asegúrate de guardar el progreso en el GameManager antes de retroceder
        if(typeof GameManager !== 'undefined') {
            GameManager.state.currentRoom = 'room4';
            GameManager.saveProgress();
        }
        window.location.href = 'room4.html'; 
    });

    // Botón de salida (Opción Nuclear para limpiar la memoria)
    const btnExit = document.getElementById('btn-exit-game');
    if (btnExit) {
        btnExit.addEventListener('click', () => {
            if(confirm("¿Seguro que deseas abandonar la misión? Se perderá el progreso actual.")) {
                if(typeof sessionStorage !== 'undefined') {
                    // Destruimos la partida y el inventario temporal
                    sessionStorage.removeItem('escapeGameState'); 
                    sessionStorage.removeItem('secureNodeInventory'); 
                }
                window.location.href = '../index.html';
            }
        });
    }

    // ==========================================
    // 3. INTERACCIÓN CON EL ENTORNO
    // ==========================================
    
    // Abrir el manual y guardarlo en el inventario
    morseManual.addEventListener('click', () => {
        manualModal.classList.remove('hidden');
        
        // Se añade a la nueva mochila global
        if(typeof Inventory !== 'undefined') {
            Inventory.addItem('manual_morse', 'Manual de Cifrado', '📖');
        }
    });

    btnCloseManual.addEventListener('click', () => {
        manualModal.classList.add('hidden');
    });

    // Abrir la terminal del servidor
    serverTrigger.addEventListener('click', () => {
        terminalModal.classList.remove('hidden');
        masterInput.value = "";
        terminalStatus.innerText = "";
    });

    btnCloseTerminal.addEventListener('click', () => {
        terminalModal.classList.add('hidden');
    });

    // ==========================================
    // 4. LÓGICA DE VICTORIA Y PUNTUACIÓN
    // ==========================================
    
    btnVerify.addEventListener('click', () => {
        const code = masterInput.value.toUpperCase();
        
        if (code === "HACK") {
            // Estilos de éxito
            terminalStatus.innerText = "CÓDIGO ACEPTADO. PROTOCOLO DE AISLAMIENTO DESACTIVADO.";
            terminalStatus.style.color = "var(--color-primary)";
            masterInput.style.borderColor = "var(--color-primary)";
            
            // --- CÁLCULO DE PUNTUACIÓN (VICTORY LOOP) ---
            if (typeof GameManager !== 'undefined') {
                // El total inicial es 900 segundos (15 min). Le restamos lo que sobró.
                const tiempoRestante = GameManager.state.timeRemaining; 
                const tiempoInvertido = 900 - tiempoRestante; 
                
                const minutos = Math.floor(tiempoInvertido / 60);
                const segundos = tiempoInvertido % 60;
                const tiempoTexto = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
                
                // Buscamos el nombre del jugador en el caché (debe coincidir con tu sistema de login)
                const jugador = localStorage.getItem('secureNodeUser') || 'Operativo Anónimo';
                
                // Traemos la tabla de puntuaciones (o creamos una si no existe)
                let ranking = JSON.parse(localStorage.getItem('secureNodeRanking')) || [];
                
                // Añadimos la nueva marca de tiempo
                ranking.push({
                    nombre: jugador,
                    segundosTotales: tiempoInvertido,
                    tiempoMostrado: tiempoTexto
                });
                
                // Ordenamos de menor a mayor tiempo (el más rápido queda primero)
                ranking.sort((a, b) => a.segundosTotales - b.segundosTotales);
                
                // Guardamos la tabla permanentemente en el navegador
                localStorage.setItem('secureNodeRanking', JSON.stringify(ranking));
                // Guardamos el tiempo específicamente para que la pantalla final lo lea
                sessionStorage.setItem('tiempoVictoria', tiempoTexto);
            }
            
            // Pausa dramática y redirección a la pantalla final
            setTimeout(() => {
                window.location.href = 'ending.html'; 
            }, 2000);

        } else {
            // Estilos de error
            terminalStatus.innerText = "CÓDIGO INCORRECTO. ACCESO DENEGADO.";
            terminalStatus.style.color = "var(--color-alert)";
            masterInput.style.borderColor = "var(--color-alert)";
            
            // Reinicio de la interfaz después de un fallo
            setTimeout(() => {
                masterInput.value = "";
                terminalStatus.innerText = "";
                masterInput.style.borderColor = "var(--color-primary)";
            }, 1500);
        }
    });
});
