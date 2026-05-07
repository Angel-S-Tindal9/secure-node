// js/engine/inventory.js

const Inventory = {
    maxSlots: 10, // Inventario ampliado a 10 espacios

    // Función segura para leer siempre el estado actual guardado
    getItems: function() {
        if (typeof GameManager !== 'undefined' && GameManager.state && GameManager.state.inventory) {
            return GameManager.state.inventory;
        }
        return [];
    },

    init: function() {
        this.render();
    },

    addItem: function(id, name, icon) {
        let items = this.getItems();
        
        // 1. Evitar duplicados ESTRICTAMENTE verificando el ID
        if (!items.some(item => item.id === id)) {
            
            // 2. Verificar el límite de espacio
            if (items.length < this.maxSlots) {
                items.push({ id, name, icon });
                
                // 3. Guardar forzosamente en el GameManager
                if (typeof GameManager !== 'undefined') {
                    GameManager.state.inventory = items;
                    GameManager.saveProgress();
                }
                
                this.render();
                this.showNotification(`Has recogido: ${name}`);
            } else {
                this.showNotification("El inventario está lleno.");
            }
        } else {
            console.log("El objeto ya está en el inventario.");
        }
    },

    removeItem: function(id) {
        let items = this.getItems();
        items = items.filter(item => item.id !== id);
        
        if (typeof GameManager !== 'undefined') {
            GameManager.state.inventory = items;
            GameManager.saveProgress();
        }
        this.render();
    },

    hasItem: function(id) {
        return this.getItems().some(item => item.id === id);
    },

    render: function() {
        const container = document.getElementById('inventory-slots');
        if (!container) return;

        container.innerHTML = ''; 
        const items = this.getItems();

        // Dibujar objetos reales
        items.forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot filled';
            slot.innerHTML = item.icon; 
            slot.title = item.name; 
            
            slot.addEventListener('click', () => {
                alert(`Examinando: ${item.name}`);
            });
            
            container.appendChild(slot);
        });

        // Dibujar casillas vacías restantes hasta llegar al límite (10)
        for (let i = items.length; i < this.maxSlots; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'inventory-slot';
            container.appendChild(emptySlot);
        }
    },

    showNotification: function(message) {
        const notif = document.createElement('div');
        notif.className = 'ui-notification';
        notif.innerText = message;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Inventory.init();
});