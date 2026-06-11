// js/rooms/room4.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Entorno
    const doorEscape = document.getElementById('door-escape');
    const scannerTrigger = document.getElementById('scanner-trigger');
    const modal = document.getElementById('dnd-modal');
    const btnClose = document.getElementById('btn-close-scanner');
    const statusBox = document.getElementById('scanner-status');
    
    let piecesPlaced = 0;
    const totalPieces = 4;
    let isScannerUnlocked = false;

    if (typeof GameManager !== 'undefined' && GameManager.state.flags.room4Solved) {
        isScannerUnlocked = true;
        doorEscape.classList.remove('locked');
        doorEscape.classList.add('unlocked');
        doorEscape.style.backgroundColor = "var(--color-primary)";
        doorEscape.style.color = "#000";
        doorEscape.innerText = "ESCAPAR";
    }

    // --- INTERACCIÓN CON EL ENTORNO ---
    scannerTrigger.addEventListener('click', () => {
        if(!isScannerUnlocked) {
            modal.classList.remove('hidden');
        } else {
            mostrarAlerta("El escáner está en verde. La puerta principal está libre.");
        }
    });

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Botón de retroceso
    document.getElementById('btn-back').addEventListener('click', () => {
        window.location.href = 'room3.html'; // Cambia esto al número de la sala anterior
    });

    // --- LÓGICA DE DRAG & DROP API ---
    const pieces = document.querySelectorAll('.card-piece');
    const dropZones = document.querySelectorAll('.drop-zone');

    // 1. Configurar las Piezas (Drag Start)
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            // Guardamos el ID del elemento que estamos arrastrando
            e.dataTransfer.setData('text/plain', e.target.id);
            // Efecto visual opcional
            setTimeout(() => e.target.style.opacity = '0.5', 0);
        });

        piece.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1'; // Restaurar opacidad al soltar
        });
    });

    // 2. Configurar las Zonas de Destino
    dropZones.forEach(zone => {
        
        // dragover: Necesario para permitir que un elemento se suelte aquí
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); 
        });

        // dragenter y dragleave: Efectos visuales de "hover"
        zone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if(zone.children.length === 0) { // Solo si está vacío
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        // drop: Cuando soltamos la pieza
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            // Evitar soltar si la zona ya tiene una pieza
            if (zone.children.length > 0) return;

            // Recuperar el ID de la pieza arrastrada
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedId);

            // Validar si la pieza pertenece a esta zona
            const targetSlot = zone.getAttribute('data-slot');
            const pieceSlot = draggedElement.getAttribute('data-target');

            if (targetSlot === pieceSlot) {
                // Es correcto: adjuntar la pieza a la zona
                zone.appendChild(draggedElement);
                
                // Quitar la capacidad de arrastrarlo de nuevo (se bloquea en su lugar)
                draggedElement.setAttribute('draggable', 'false');
                draggedElement.style.cursor = 'default';
                
                piecesPlaced++;
                checkWinCondition();
            } else {
                // Incorrecto: Efecto de rechazo (opcional)
                statusBox.innerText = "FRAGMENTO INCORRECTO";
                setTimeout(() => {
                    if(!isScannerUnlocked) statusBox.innerText = "TARJETA NO DETECTADA";
                }, 1000);
            }
        });
    });

    // --- VALIDACIÓN DE VICTORIA ---
    function checkWinCondition() {
        if (piecesPlaced === totalPieces) {
            isScannerUnlocked = true;
            
            // Actualizar Interfaz
            statusBox.style.backgroundColor = "rgba(0, 255, 65, 0.2)";
            statusBox.style.color = "var(--color-primary)";
            statusBox.style.borderColor = "var(--color-primary)";
            statusBox.innerText = "ACCESO MAESTRO CONCEDIDO";
            
            setTimeout(() => {
                modal.classList.add('hidden');
                doorEscape.classList.remove('locked');
                doorEscape.classList.add('unlocked');
                doorEscape.style.backgroundColor = "var(--color-primary)";
                doorEscape.style.color = "#000";
                doorEscape.innerText = "ESCAPAR";
                
                // GUARDAR EL PROGRESO
                if(typeof GameManager !== 'undefined') {
                    GameManager.state.flags.room4Solved = true;
                    GameManager.saveProgress();
                }
                
                mostrarAlerta("¡El escáner validó la tarjeta! La puerta de escape final está abierta.");
            }, 1500);
        }
    }

    // --- SALIDA FINAL ---
    doorEscape.addEventListener('click', () => {
        if (isScannerUnlocked) {
            // ¡AHORA SÍ! Redirigir a la pantalla de victoria final
            window.location.href = 'room5.html'; 
        } else {
            mostrarAlerta("Acceso denegado. Reconstruye la tarjeta maestra en el escáner.");
        }
    });

    let radioClicks = 0;
    document.querySelector('.radio-oculta').addEventListener('click', (e) => {
        radioClicks++;
        if (radioClicks === 5) {
            mostrarAlerta("La radio emite estática y una secuencia: RAYA PUNTO RAYA ( -.- )");
            Inventory.addItem('morse_4', 'Señal 4: -.-', '📻');
            e.target.style.display = 'none';
        }
    });
});
