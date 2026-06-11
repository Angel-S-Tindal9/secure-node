// js/rooms/room1.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del DOM
    const painting = document.getElementById('painting');
    const hiddenNote = document.getElementById('hidden-note');
    const safe = document.getElementById('safe');
    const modal = document.getElementById('keypad-modal');
    const door = document.getElementById('door');
    const safeInput = document.getElementById('safe-input');

    
    // Variables de estado de la habitación
    let isDoorUnlocked = false;
    const correctCode = "4096"; // Código que aparece en la nota
    let currentInput = "";

    if (typeof GameManager !== 'undefined' && GameManager.state.flags.room1Solved) {
        isDoorUnlocked = true;
        door.classList.remove('locked');
        door.classList.add('unlocked');
        door.innerText = "Puerta Abierta (Avanzar)";
    }

    // 1. Interacción con el Cuadro
    painting.addEventListener('click', () => {
        painting.classList.toggle('moved'); // Aplica la animación CSS
        hiddenNote.classList.toggle('revealed'); // Muestra/Oculta la nota
    });

    // 2. Interacción con la Nota (Recoger objeto)
    hiddenNote.addEventListener('click', () => {
        if(hiddenNote.classList.contains('revealed')) {
            // Usamos el nuevo sistema de inventario
            Inventory.addItem('nota_codigo', 'Nota con código (4096)', '📄');
            
            hiddenNote.style.display = "none"; // Desaparece del escenario
        }
    });

    // 3. Abrir la caja fuerte
    safe.addEventListener('click', () => {
        modal.classList.remove('hidden');
        currentInput = "";
        safeInput.value = "";
    });

    // 4. Cerrar el modal
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // 5. Lógica del teclado (Keypad) de la caja fuerte
    const keys = document.querySelectorAll('.key-num');
    keys.forEach(key => {
        key.addEventListener('click', (e) => {
            if (currentInput.length < 4) {
                currentInput += e.target.innerText;
                safeInput.value = currentInput;
            }
        });
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        currentInput = "";
        safeInput.value = "";
    });

    // 6. Validar el código ingresado
    document.getElementById('btn-enter').addEventListener('click', () => {
        if (currentInput === correctCode) {
            safeInput.value = "EXITO";
            safeInput.style.color = "var(--color-primary)";
            
            setTimeout(() => {
                modal.classList.add('hidden');
                door.classList.remove('locked');
                door.classList.add('unlocked');
                door.innerText = "Puerta Abierta (Avanzar)";
                isDoorUnlocked = true;
                
                // GUARDAR EL PROGRESO GLOBALMENTE
                if(typeof GameManager !== 'undefined') {
                    GameManager.state.flags.room1Solved = true;
                    GameManager.saveProgress();
                }
                
                mostrarAlerta("¡Se escuchó un 'clic'! La puerta se ha desbloqueado.", "ÉXITO");
            }, 1000);

        } else {
            safeInput.value = "ERROR";
            safeInput.style.color = "red";
            setTimeout(() => {
                currentInput = "";
                safeInput.value = "";
                safeInput.style.color = "var(--color-primary)";
            }, 800);
        }
    });

    // 7. Salir por la puerta
    door.addEventListener('click', () => {
        if (isDoorUnlocked) {
            // Guardar progreso si estás usando el GameManager
            if(typeof GameManager !== 'undefined') {
                GameManager.state.currentRoom = 'room2';
                GameManager.saveProgress();
            }
            // Redirigir a la siguiente sala
            window.location.href = 'room2.html'; 
        } else {
            mostrarAlerta("La puerta está bloqueada electromagnéticamente. Requiere código de anulación.", "ACCESO DENEGADO");
        }
    });

    let radioClicks = 0;
    document.querySelector('.radio-oculta').addEventListener('click', (e) => {
        radioClicks++;
        if (radioClicks < 5) {
            console.log(`Clics en radio: ${radioClicks}/5`); // Pista en consola para los curiosos
        } else if (radioClicks === 5) {
            mostrarAlerta("La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )");
            Inventory.addItem('morse_1', 'Señal 1: ....', '📻');
            e.target.style.display = 'none';
        }
    });

});
