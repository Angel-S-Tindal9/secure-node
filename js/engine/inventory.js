/**
 * ==========================================
 * SECURENODE - SISTEMA DE INVENTARIO AISLADO
 * ==========================================
 * Memoria independiente para evitar que el cronómetro borre los objetos.
 */

// 1. ESTADO INDEPENDIENTE DEL INVENTARIO (La nueva caja fuerte)
let miInventario = [];

// Recuperar objetos al cambiar de sala
const inventarioGuardado = sessionStorage.getItem('secureNodeInventory');
if (inventarioGuardado) {
    miInventario = JSON.parse(inventarioGuardado);
}

// Función para guardar en la nueva caja
function saveInventory() {
    sessionStorage.setItem('secureNodeInventory', JSON.stringify(miInventario));
}


// 2. DICCIONARIO DE OBJETOS
// ¡Copia aquí todos tus objetos (nota_vars, clue_v1, etc.)!
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
        img: '../assets/img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    },
    'morse_2': {
        name: 'Transmisión de Radio',
        img: '../assets/img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    },

    'morse_3': {
        name: 'Transmisión de Radio',
        img: '../assets/img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    },

    'morse_4': {
        name: 'Transmisión de Radio',
        img: '../assets/img/radio_static.jpg', // Usa la imagen de tu radio
        desc: 'La radio emite estática y una secuencia: PUNTO PUNTO PUNTO PUNTO ( .... )'
    }
    // Puedes añadir más objetos aquí separándolos con comas
};


// 3. FUNCIONES LÓGICAS
function addToInventory(itemId) {
    // Si no tenemos el objeto, lo añadimos
    if (!miInventario.includes(itemId)) {
        miInventario.push(itemId);
        saveInventory(); // Guardar en la caja segura
        renderInventory(); // Dibujar de nuevo
        console.log(`[Sistema] Objeto asegurado en memoria: ${itemId}`);
    }
}

function hasItem(itemId) {
    return miInventario.includes(itemId);
}


// 4. INTERFAZ GRÁFICA (DIBUJAR INVENTARIO)
function renderInventory() {
    const inventoryContainer = document.getElementById('inventory-bar');
    if (!inventoryContainer) return;
    
    inventoryContainer.innerHTML = ''; 
    
    // Dibujamos solo los objetos que están en la nueva memoria
    miInventario.forEach(itemId => {
        const itemData = itemDatabase[itemId];
        if (!itemData) return; 

        const itemIcon = document.createElement('div');
        itemIcon.className = 'inventory-icon';
        itemIcon.style.backgroundImage = `url('${itemData.img}')`;
        
        itemIcon.addEventListener('click', () => {
            showItemDetails(itemId);
        });
        
        inventoryContainer.appendChild(itemIcon);
    });
}


// 5. LÓGICA DEL PANEL DE DETALLES
function showItemDetails(itemId) {
    const detailsPanel = document.getElementById('item-details-panel');
    const itemData = itemDatabase[itemId];
    
    if (!detailsPanel || !itemData) return;
    
    document.getElementById('detail-item-image').src = itemData.img;
    document.getElementById('detail-item-name').innerText = itemData.name;
    document.getElementById('detail-item-description').innerText = itemData.desc;
    
    detailsPanel.classList.remove('hidden');
}


// 6. INICIALIZACIÓN AUTOMÁTICA
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    
    const closeBtn = document.getElementById('close-details-btn');
    const detailsPanel = document.getElementById('item-details-panel');
    
    if (closeBtn && detailsPanel) {
        closeBtn.addEventListener('click', () => {
            detailsPanel.classList.add('hidden'); 
        });
    }
});


// 7. PUENTE DE COMPATIBILIDAD CON LAS SALAS
const Inventory = {
    addItem: function(id, desc, icon) {
        if (typeof itemDatabase !== 'undefined' && !itemDatabase[id]) {
            itemDatabase[id] = { name: 'Objeto: ' + id, img: '', desc: desc };
        }
        addToInventory(id);
    },
    renderInventory: function() {
        renderInventory();
    },
    hasItem: function(id) {
        return hasItem(id);
    }
};
