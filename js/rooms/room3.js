// js/rooms/room3.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Entorno
    const doorEscape = document.getElementById('door-escape');
    const consoleTrigger = document.getElementById('console-trigger');
    const modal = document.getElementById('engine-modal');
    const btnClose = document.getElementById('btn-close-console');
    
    // Objetos Ocultos y Escondites
    const mathNote = document.getElementById('math-note');
    const grate = document.getElementById('grate');
    const clueV1 = document.getElementById('clue-v1');
    const terminal = document.getElementById('terminal');
    const toolbox = document.getElementById('toolbox');
    const clueV3 = document.getElementById('clue-v3');
    
    // Controles del Panel
    const sliderV1 = document.getElementById('slider-v1');
    const sliderV2 = document.getElementById('slider-v2');
    const sliderV3 = document.getElementById('slider-v3');
    const valV1 = document.getElementById('val-v1');
    const valV2 = document.getElementById('val-v2');
    const valV3 = document.getElementById('val-v3');
    const statusBox = document.getElementById('engine-status');
    
    // Resultados esperados (X=20, Y=2, Z=30)
    const targetV1 = 80; // X + Y * Z
    const targetV2 = 10; // X * Y - Z
    const targetV3 = 40; // X / Y + Z
    let isEngineStable = false;

    if (typeof GameManager !== 'undefined' && GameManager.state.flags.room3Solved) {
        isEngineStable = true;
        doorEscape.classList.remove('locked');
        doorEscape.classList.add('unlocked');
        doorEscape.style.backgroundColor = "var(--color-primary)";
        doorEscape.style.color = "#000";
    }

    // --- ESTADO INICIAL AL CARGAR LA PÁGINA ---
    // Si el jugador recarga la página, ocultamos los objetos que ya están en su inventario
    
    if (Inventory.hasItem('nota_vars')) {
        mathNote.style.display = 'none';
    }
    
    if (Inventory.hasItem('clue_v1')) {
        grate.classList.add('moved');
        clueV1.style.display = 'none';
    }
    
    if (Inventory.hasItem('clue_v2')) {
        terminal.innerText = "ERR_V2";
        terminal.style.color = "red";
    }
    
    if (Inventory.hasItem('clue_v3')) {
        toolbox.classList.add('open');
        toolbox.innerText = "Abierta";
        clueV3.style.display = 'none';
    }

    // Botón de retroceso
    document.getElementById('btn-back').addEventListener('click', () => {
        window.location.href = 'room2.html'; // Cambia esto al número de la sala anterior
    });

    // --- EXPLORACIÓN DE LA SALA ---

    // 1. Plaqueta de Variables (Base)
    mathNote.addEventListener('click', () => {
        mostrarAlerta("VARIABLES DEL SISTEMA:\nX = 20\nY = 2\nZ = 30\n(Faltan las instrucciones de las válvulas)");
        Inventory.addItem('nota_vars', 'Variables (X=20, Y=2, Z=30)', '🧮');
        mathNote.style.display = 'none';
    });

    // 2. Mover la Rejilla -> Descubrir V1
    grate.addEventListener('click', () => {
        grate.classList.add('moved');
        clueV1.classList.add('revealed');
    });

    clueV1.addEventListener('click', () => {
        if(clueV1.classList.contains('revealed')) {
            mostrarAlerta("Has encontrado un papel arrugado: 'Fórmula de Válvula 1: X + Y * Z'");
            Inventory.addItem('clue_v1', 'Fórmula V1: X + Y * Z', '📝');
            clueV1.style.display = 'none';
        }
    });

    // 3. Revisar la Terminal -> Descubrir V2
    terminal.addEventListener('click', () => {
        mostrarAlerta("El monitor parpadea y muestra un registro de error:\n'ERROR EN VÁLVULA 2. SE REQUIERE CALIBRACIÓN: X * Y - Z'");
        Inventory.addItem('clue_v2', 'Fórmula V2: X * Y - Z', '💻');
        // Cambiar el texto del monitor visualmente
        terminal.innerText = "ERR_V2";
        terminal.style.color = "red";
    });

    // 4. Abrir la Caja de Herramientas -> Descubrir V3
    toolbox.addEventListener('click', () => {
        toolbox.classList.add('open');
        toolbox.innerText = "Abierta";
        clueV3.classList.add('revealed');
    });

    clueV3.addEventListener('click', () => {
        if(clueV3.classList.contains('revealed')) {
            mostrarAlerta("Encuentras un plano esquemático: 'Configuración Válvula 3: X / Y + Z'");
            Inventory.addItem('clue_v3', 'Fórmula V3: X / Y + Z', '🗺️');
            clueV3.style.display = 'none';
        }
    });

    // --- INTERACCIÓN CON EL PANEL ---
    consoleTrigger.addEventListener('click', () => {
        if(!isEngineStable) {
            modal.classList.remove('hidden');
        } else {
            mostrarAlerta("El núcleo ya está estabilizado. Procede a la salida.");
        }
    });

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // --- LÓGICA DEL PUZZLE MATEMÁTICO ---
    function checkEngine() {
        const currentV1 = parseInt(sliderV1.value);
        const currentV2 = parseInt(sliderV2.value);
        const currentV3 = parseInt(sliderV3.value);
        
        if (currentV1 === targetV1 && currentV2 === targetV2 && currentV3 === targetV3) {
            solvePuzzle();
        } else {
            if(isEngineStable) {
                isEngineStable = false;
                statusBox.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                statusBox.style.color = "var(--color-alert)";
                statusBox.style.borderColor = "var(--color-alert)";
                statusBox.style.boxShadow = "none";
                statusBox.innerText = "FLUJO INESTABLE";
            }
        }
    }

    function solvePuzzle() {
        isEngineStable = true;
        
        statusBox.style.backgroundColor = "rgba(0, 255, 65, 0.2)";
        statusBox.style.color = "var(--color-primary)";
        statusBox.style.borderColor = "var(--color-primary)";
        statusBox.style.boxShadow = "0 0 15px var(--color-primary)";
        statusBox.innerText = "NÚCLEO ESTABILIZADO";
        
        sliderV1.disabled = true;
        sliderV2.disabled = true;
        sliderV3.disabled = true;
        
        setTimeout(() => {
            modal.classList.add('hidden');
            doorEscape.classList.remove('locked');
            doorEscape.classList.add('unlocked'); 
            doorEscape.style.backgroundColor = "var(--color-primary)";
            doorEscape.style.color = "#000";
            doorEscape.innerText = "SALIR DEL SISTEMA";
            
            // GUARDAR EL PROGRESO
            if(typeof GameManager !== 'undefined') {
                GameManager.state.flags.room3Solved = true;
                GameManager.saveProgress();
            }
            
            mostrarAlerta("¡Sistemas en línea! El bloqueo maestro ha sido desactivado.");
        }, 1000);
    }

    sliderV1.addEventListener('input', (e) => { valV1.innerText = e.target.value; checkEngine(); });
    sliderV2.addEventListener('input', (e) => { valV2.innerText = e.target.value; checkEngine(); });
    sliderV3.addEventListener('input', (e) => { valV3.innerText = e.target.value; checkEngine(); });

    // --- SALIDA FINAL ---
    doorEscape.addEventListener('click', () => {
        if (isEngineStable) {
            window.location.href = 'room4.html'; 
        } else {
            mostrarAlerta("La puerta no tiene energía. Revisa el entorno y configura el panel de válvulas primero.");
        }
    });

    let radioClicks = 0;
    document.querySelector('.radio-oculta').addEventListener('click', (e) => {
        radioClicks++;
        if (radioClicks === 8) {
            mostrarAlerta("La radio emite estática y una secuencia: RAYA PUNTO RAYA PUNTO ( -.-. )");
            Inventory.addItem('morse_3', 'Señal 3: -.-.', '📻');
            e.target.style.display = 'none';
        }
    });
});
