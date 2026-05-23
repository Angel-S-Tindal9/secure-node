/**
 * ==========================================
 * SECURENODE - SISTEMA DE INVENTARIO
 * ==========================================
 * Este archivo maneja la persistencia de datos (localStorage),
 * la adición de objetos y la inspección dinámica (Panel de Detalles).
 */

// 1. ESTADO GLOBAL DEL JUEGO
// Inicializamos el objeto vacío por defecto
let gameState = {
    inventory: [],
    timeRemaining: 600, // 10 minutos (600 segundos) por defecto
    room1Solved: false,
    room2Solved: false,
    room3Solved: false,
    room4Solved: false
};

// Intentamos recuperar el estado guardado al recargar o cambiar de sala
const savedState = localStorage.getItem('escapeGameState');
if (savedState) {
    gameState = JSON.parse(savedState);
    // Aseguramos que el inventario sea un array válido aunque haya errores previos
    if (!Array.isArray(gameState.inventory)) {
        gameState.inventory = [];
    }
}

// Función auxiliar para guardar el estado actual en el navegador
function saveGameState() {
    localStorage.setItem('escapeGameState', JSON.stringify(gameState));
}

// 2. DICCIONARIO DE OBJETOS (BASE DE DATOS LOCAL)
// Aquí defines todos los objetos que pueden existir en el Escape Room
const itemDatabase = {
    'diploma': {
        name: 'Diploma Académico',
        img: '../assests/img/room1_img_diploma.jpg', 
        desc: 'Un antiguo diploma de ingeniería. Al reverso, alguien ha escrito números con tinta invisible: 8 - 3 - 2.'
    },
    'radio_pilas': {
        name: 'Radio a Pilas Antigua',
        img: '../assets/img/radio_static.jpg', 
        desc: 'Una radio vieja. Sintoniza una frecuencia extraña (98.5 FM) donde solo se escucha estática y un patrón rítmico.'
    },
    'llave_servidor': {
        name: 'Llave Encriptada',
        img: '../assets/img/llave_usb.jpg',
        desc: 'Un pendrive de seguridad metálico. Contiene la clave asimétrica para desencriptar el terminal de la Sala 3.'
    },
    'tarjeta_roja': {
        name: 'Tarjeta de Acceso - Nivel 1',
        img: '../assets/img/room4_img_tarjeta_final.jpg', 
        desc: 'Una tarjeta de acceso magnética de color rojo. Parece estar completamente operativa tras ensamblar sus fragmentos.'
    },

    'nota_codigo': { // Asegúrate de que este ID coincida con el que usas al guardarlo
        name: 'Nota de Acceso',
        img: '../assets/img/nota_codigo.jpg', // Pon la ruta de la imagen de tu nota
        desc: 'Una nota vieja y arrugada con instrucciones garabateadas a toda prisa. Al final del texto, resalta un número: 4096. Parece ser un código de anulación del servidor.'
    },

    // --- OBJETOS DE LA SALA 3 ---
    'nota_vars': {
        name: 'Variables del Sistema',
        img: '../assets/img/nota_codigo.jpg', // Reemplaza con la ruta de tu imagen
        desc: 'VARIABLES DEL SISTEMA:\nX = 20\nY = 2\nZ = 30\n(Faltan las instrucciones de las válvulas)'
    },
    'clue_v1': {
        name: 'Fórmula Válvula 1',
        img: '../assets/img/nota_codigo.jpg', 
        desc: 'Un papel arrugado: "Fórmula de Válvula 1: X + Y * Z"'
    },
    'clue_v2': {
        name: 'Registro de Error Válvula 2',
        img: '../assets/img/nota_codigo.jpg', 
        desc: 'Registro del monitor: "ERROR EN VÁLVULA 2. CALIBRACIÓN: X * Y - Z"'
    },
    'clue_v3': {
        name: 'Plano Válvula 3',
        img: '../assets/img/nota_codigo.jpg', 
        desc: 'Un plano esquemático: "Configuración Válvula 3: X / Y + Z"'
    },

    'morse_1': {
        name: 'Transmisión de Radio',
        img: '../img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    },
    'morse_2': {
        name: 'Transmisión de Radio',
        img: '../img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    },

    'morse_3': {
        name: 'Transmisión de Radio',
        img: '../img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    },

    'morse_4': {
        name: 'Transmisión de Radio',
        img: '../img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    }
    // Puedes añadir más objetos aquí separándolos con comas
};


// 3. FUNCIONES LÓGICAS DEL INVENTARIO

/**
 * Añade un objeto al inventario si no existe previamente
 * @param {string} itemId - El ID del objeto (ej: 'diploma')
 */
function addToInventory(itemId) {
    if (!gameState.inventory.includes(itemId)) {
        gameState.inventory.push(itemId);
        saveGameState(); // Guardar el progreso
        renderInventory(); // Actualizar la interfaz visual
        console.log(`[Sistema] Objeto añadido: ${itemId}`);
    }
}

/**
 * Comprueba si el jugador tiene un objeto específico
 * @param {string} itemId - El ID del objeto a buscar
 * @returns {boolean}
 */
function hasItem(itemId) {
    return gameState.inventory.includes(itemId);
}


// 4. FUNCIONES DE INTERFAZ GRÁFICA (UI)

/**
 * Dibuja los íconos en la barra inferior del HTML
 */
function renderInventory() {
    const inventoryContainer = document.getElementById('inventory-bar');
    
    // Si no existe la barra en el HTML actual, detenemos la función
    if (!inventoryContainer) return;
    
    // Limpiamos la barra antes de volver a dibujar
    inventoryContainer.innerHTML = ''; 
    
    // Recorremos los objetos que tiene el jugador
    gameState.inventory.forEach(itemId => {
        const itemData = itemDatabase[itemId];
        
        // Medida de seguridad por si hay un ID que no está en el diccionario
        if (!itemData) return; 

        // Crear el contenedor del ícono
        const itemIcon = document.createElement('div');
        itemIcon.className = 'inventory-icon';
        
        // Aplicar la imagen de fondo (Asegúrate de tener un CSS para .inventory-icon)
        itemIcon.style.backgroundImage = `url('${itemData.img}')`;
        itemIcon.style.backgroundSize = 'cover';
        itemIcon.style.backgroundPosition = 'center';
        
        // Añadir el evento de clic para abrir el nuevo Panel de Detalles
        itemIcon.addEventListener('click', () => {
            showItemDetails(itemId);
        });
        
        // Insertar el ícono en la barra
        inventoryContainer.appendChild(itemIcon);
    });
}


// 5. LÓGICA DEL PANEL DE DETALLES (INSPECCIÓN)

/**
 * Extrae los datos del diccionario y los pinta en el panel flotante
 * @param {string} itemId - El ID del objeto clickeado
 */
function showItemDetails(itemId) {
    const detailsPanel = document.getElementById('item-details-panel');
    const itemData = itemDatabase[itemId];
    
    // Validar que el panel exista en el HTML y que el objeto sea válido
    if (!detailsPanel || !itemData) {
        console.error("Error: Falta el panel en el HTML o el objeto no existe.");
        return;
    }
    
    // Insertar la información dinámica
    document.getElementById('detail-item-image').src = itemData.img;
    document.getElementById('detail-item-name').innerText = itemData.name;
    document.getElementById('detail-item-description').innerText = itemData.desc;
    
    // Mostrar el panel quitando la clase 'hidden'
    detailsPanel.classList.remove('hidden');
}


// 6. INICIALIZACIÓN AUTOMÁTICA
// Este bloque se ejecuta en cuanto la página termina de cargar
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pintar el inventario inicial
    renderInventory();
    
    // 2. Configurar el botón de cerrar del Panel de Detalles
    const closeBtn = document.getElementById('close-details-btn');
    const detailsPanel = document.getElementById('item-details-panel');
    
    if (closeBtn && detailsPanel) {
        closeBtn.addEventListener('click', () => {
            // Volver a añadir la clase 'hidden' para ocultarlo
            detailsPanel.classList.add('hidden'); 
        });
    }
});

// =========================================================
// PUENTE DE COMPATIBILIDAD CON EL CÓDIGO ANTERIOR DE LAS SALAS
// =========================================================
const Inventory = {
    // 1. Para cuando la sala intenta darte un objeto
    addItem: function(id, desc, icon) {
        if (typeof itemDatabase !== 'undefined' && !itemDatabase[id]) {
            itemDatabase[id] = {
                name: 'Objeto Encontrado: ' + id,
                img: '', 
                desc: desc || 'Objeto sin descripción detallada.'
            };
        }
        if (typeof addToInventory === 'function') {
            addToInventory(id);
        }
    },
    
    // 2. Para cuando la sala intenta dibujar el inventario
    renderInventory: function() {
        if (typeof renderInventory === 'function') renderInventory();
    },

    // 3. ¡NUEVO! Para cuando la sala pregunta si tienes un objeto (El error de Room 2)
    hasItem: function(id) {
        // Llama a la nueva función global hasItem() que creamos arriba
        if (typeof hasItem === 'function') {
            return hasItem(id);
        }
        return false;
    }
};