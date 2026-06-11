// js/rooms/room2.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Entorno (Buscamos la puerta por los dos nombres posibles por si acaso)
    let doorFinal = document.getElementById('door-final');
    if (!doorFinal) { doorFinal = document.getElementById('door'); } // Respaldo por si el ID es "door"
    
    const panelTrigger = document.getElementById('memory-panel-trigger');
    const modal = document.getElementById('memory-modal');
    const btnClose = document.getElementById('btn-close-memory');
    
    // Puzzle
    const btnStart = document.getElementById('btn-start-memory');
    const statusText = document.getElementById('memory-status');
    const memoryGrid = document.querySelector('.memory-grid');
    const memoryBtns = document.querySelectorAll('.memory-btn');
    
    // Botón de Volver Seguro
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.href = 'room1.html'; 
        });
    }

    // Variables Lógicas
    const colors = ['green', 'red', 'yellow', 'blue'];
    let sequence = [];
    let playerSequence = [];
    let currentLevel = 0;
    const maxLevels = 5;
    let isPanelUnlocked = false;
    let speedGap = 800;
    let lightDuration = 400;

    // --- ESTADO INICIAL / PERSISTENCIA SEGURA ---
    if (typeof GameManager !== 'undefined' && GameManager.state.flags.room2Solved) {
        isPanelUnlocked = true;
        if (doorFinal) {
            doorFinal.classList.remove('locked');
            doorFinal.classList.add('unlocked');
        }
    }

    // --- ESTADO INICIAL DE LA RADIO ---
    const radio = document.querySelector('.radio-oculta');
    if (radio && typeof Inventory !== 'undefined' && Inventory.hasItem('morse_2')) {
        radio.style.display = 'none';
    }

    // --- INTERACCIONES DEL ENTORNO ---
    if (panelTrigger) {
        panelTrigger.addEventListener('click', () => {
            if(!isPanelUnlocked) {
                modal?.classList.remove('hidden');
            } else {
                mostrarAlerta("El panel ya ha sido anulado. La puerta está abierta.");
            }
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal?.classList.add('hidden');
        });
    }

    // --- RADIO OCULTA ---
    let radioClicks = 0;
    if (radio) {
        radio.addEventListener('click', (e) => {
            radioClicks++;
            if (radioClicks === 1) {
                mostrarAlerta("La radio emite estática y una secuencia: PUNTO RAYA ( .- )");
                if (typeof Inventory !== 'undefined') {
                    Inventory.addItem('morse_2', 'Señal 2: .-', '📻');
                }
                e.target.style.display = 'none';
            }
        });
    }

    // --- LÓGICA DEL PUZZLE ---
    if (btnStart) {
        btnStart.addEventListener('click', startGame);
    }

    function startGame() {
        sequence = [];
        playerSequence = [];
        currentLevel = 0;
        speedGap = 800; 
        lightDuration = 400;
        btnStart.classList.add('hidden');
        nextLevel();
    }

    function nextLevel() {
        currentLevel++;
        playerSequence = [];
        
        if (currentLevel > 3) {
            speedGap = 350;
            lightDuration = 150;
            if (statusText) {
                statusText.innerText = `Ronda ${currentLevel}: ¡SOBRECARGA DETECTADA!`;
                statusText.style.color = "var(--color-alert)";
            }
            if (memoryGrid) memoryGrid.style.boxShadow = "0 0 30px var(--color-alert)";
        } else {
            if (statusText) {
                statusText.innerText = `Ronda ${currentLevel} de ${maxLevels}. Memorizando...`;
                statusText.style.color = "white";
            }
            if (memoryGrid) memoryGrid.style.boxShadow = "none";
        }
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
        
        playSequence();
    }

    function playSequence() {
        memoryGrid?.classList.add('disabled'); 
        let currentDelay = 500; 
        
        sequence.forEach((color) => {
            setTimeout(() => {
                lightUpButton(color);
            }, currentDelay);
            currentDelay += speedGap;
        });

        setTimeout(() => {
            memoryGrid?.classList.remove('disabled');
            if (statusText) {
                statusText.innerText = (currentLevel > 3) ? "¡RÁPIDO, TU TURNO!" : "Tu turno...";
            }
        }, currentDelay);
    }

    function lightUpButton(color) {
        const btn = document.getElementById(`btn-${color}`);
        if (btn) {
            btn.classList.add('lit');
            setTimeout(() => {
                btn.classList.remove('lit');
            }, lightDuration);
        }
    }

    memoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chosenColor = e.target.getAttribute('data-color');
            lightUpButton(chosenColor);
            checkPlayerMove(chosenColor);
        });
    });

    function checkPlayerMove(color) {
        const currentMoveIndex = playerSequence.length;
        
        if (color !== sequence[currentMoveIndex]) {
            gameOver();
            return;
        }

        playerSequence.push(color);

        if (playerSequence.length === sequence.length) {
            if (currentLevel === maxLevels) {
                gameWon();
            } else {
                memoryGrid?.classList.add('disabled');
                setTimeout(nextLevel, 1000); 
            }
        }
    }

    function gameOver() {
        if (statusText) {
            statusText.innerText = "¡Fallo de Seguridad! Sistema reiniciado.";
            statusText.style.color = "var(--color-alert)";
        }
        if (memoryGrid) {
            memoryGrid.style.boxShadow = "none";
            memoryGrid.classList.add('disabled');
        }
        if (btnStart) {
            btnStart.classList.remove('hidden');
            btnStart.innerText = "Reintentar Anulación";
        }
    }

    function gameWon() {
        if (statusText) {
            statusText.innerText = "¡SISTEMA ANULADO CON ÉXITO!";
            statusText.style.color = "var(--color-primary)";
        }
        if (memoryGrid) {
            memoryGrid.style.boxShadow = "0 0 30px var(--color-primary)";
            memoryGrid.classList.add('disabled');
        }
        isPanelUnlocked = true;
        
        setTimeout(() => {
            modal?.classList.add('hidden');
            if (doorFinal) {
                doorFinal.classList.remove('locked');
                doorFinal.classList.add('unlocked');
            }
            
            if(typeof GameManager !== 'undefined') {
                GameManager.state.flags.room2Solved = true;
                GameManager.saveProgress();
            }
        }, 2000);
    }

    // --- SALIDA FINAL ---
    if (doorFinal) {
        doorFinal.addEventListener('click', () => {
            if (isPanelUnlocked) {
                window.location.href = 'room3.html'; 
            } else {
                alert("La puerta de salida está asegurada por el Panel del Servidor.");
            }
        });
    }
});
