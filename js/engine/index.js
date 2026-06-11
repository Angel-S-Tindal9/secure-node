// js/index.js

// ==========================================
// FUNCIÓN GLOBAL DE ALERTAS DEL MENÚ
// ==========================================
function mostrarAlertaMenu(mensaje, titulo = "ERROR DE SISTEMA") {
    let modal = document.getElementById('cyber-alert-menu');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cyber-alert-menu';
        modal.className = 'modal hidden';
        modal.style.zIndex = "9999"; 
        modal.innerHTML = `
            <div class="glass-panel" style="max-width: 400px;">
                <h2 id="alert-menu-title" style="color: #ff003c; margin-bottom: 20px; font-family: 'Share Tech Mono', monospace;">${titulo}</h2>
                <p id="alert-menu-text" style="color: white; margin-bottom: 30px; font-family: 'Share Tech Mono', monospace; line-height: 1.5;"></p>
                <button id="alert-menu-btn" class="cyber-btn" style="border-color: #00ff41; color: #00ff41; width: 100%;">ENTENDIDO</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('alert-menu-btn').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    // Cambiar color del título dependiendo de si es éxito o error
    const titleElement = document.getElementById('alert-menu-title');
    titleElement.innerText = titulo;
    if (titulo === "OPERACIÓN EXITOSA" || titulo === "ACCESO CONCEDIDO") {
        titleElement.style.color = "#00ff41";
    } else {
        titleElement.style.color = "#ff003c";
    }

    document.getElementById('alert-menu-text').innerText = mensaje;
    modal.classList.remove('hidden');
}

// ==========================================
// INICIALIZACIÓN PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DEL DOM ---
    const btnPlay = document.getElementById('btn-play');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLeaderboard = document.getElementById('btn-leaderboard');
    const btnLogout = document.getElementById('btn-logout');
    const authButtons = document.querySelectorAll('.auth-btn');

    const modalLogin = document.getElementById('modal-login');
    const modalRegister = document.getElementById('modal-register');
    const modalLeaderboard = document.getElementById('modal-leaderboard');
    const closeBtns = document.querySelectorAll('.btn-close-modal');

    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    const API_URL = 'http://localhost:3000/api';

    // --- SISTEMA DE RETROALIMENTACIÓN ACÚSTICA ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playCyberHover() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05); 

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05); 

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05); 
    }

    document.querySelectorAll('.cyber-btn').forEach(btn => {
        btn.addEventListener('mouseenter', playCyberHover);
    });

    // --- CONTROL DE SESIÓN ---
    function checkLoginStatus() {
        const user = localStorage.getItem('secureNodeUser');
        if (user) {
            authButtons.forEach(btn => btn.classList.add('hidden'));
            btnLogout.classList.remove('hidden');
            document.querySelector('.subtitle').innerText = `OPERATIVO: ${user.toUpperCase()}`;
        } else {
            authButtons.forEach(btn => btn.classList.remove('hidden'));
            btnLogout.classList.add('hidden');
            document.querySelector('.subtitle').innerText = `PROTOCOLO DE AISLAMIENTO ACTIVO`;
        }
    }

    checkLoginStatus();

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('secureNodeUser');
        sessionStorage.removeItem('escapeGameState');
        sessionStorage.removeItem('secureNodeInventory');
        mostrarAlertaMenu("Sesión finalizada. Desconexión completada.", "SISTEMA CERRADO");
        checkLoginStatus();
    });

    // --- NAVEGACIÓN Y MODALES ---
    btnPlay.addEventListener('click', () => {
        sessionStorage.removeItem('secureNodeInventory'); // Vaciamos por seguridad
        window.location.href = 'rooms/room1.html';
    });

    btnLogin.addEventListener('click', () => modalLogin.classList.remove('hidden'));
    btnRegister.addEventListener('click', () => modalRegister.classList.remove('hidden'));
    
    btnLeaderboard.addEventListener('click', () => {
        modalLeaderboard.classList.remove('hidden');
        cargarMejoresTiempos(); // Cargamos los tiempos dinámicamente al abrir
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalLogin.classList.add('hidden');
            modalRegister.classList.add('hidden');
            modalLeaderboard.classList.add('hidden');
        });
    });

    // --- TABLA DE PUNTUACIONES ---
    function cargarMejoresTiempos() {
        const contenedorRanking = document.getElementById('tabla-ranking-body');
        if (!contenedorRanking) return;
        
        // Priorizamos los datos locales del final del juego (Victory Loop)
        const ranking = JSON.parse(localStorage.getItem('secureNodeRanking')) || [];
        contenedorRanking.innerHTML = '';
        
        if (ranking.length === 0) {
            contenedorRanking.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay registros operativos aún.</td></tr>';
            return;
        }
        
        const top5 = ranking.slice(0, 5);
        
        top5.forEach((registro, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>#${index + 1}</td>
                <td style="color: var(--color-neon);">${registro.nombre}</td>
                <td>${registro.tiempoMostrado}</td>
            `;
            contenedorRanking.appendChild(fila);
        });
    }

    // --- INTEGRACIÓN Y VALIDACIONES (BACKEND / LOCAL) ---

    // 1. Registro con Validaciones Estrictas
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const inputs = e.target.querySelectorAll('input');
            const username = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const password = inputs[2].value.trim();

            // Validaciones Frontend
            if (username.length < 4 || username.includes(" ")) {
                mostrarAlertaMenu("El ID debe tener al menos 4 caracteres y no contener espacios.");
                return;
            }
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(email)) {
                mostrarAlertaMenu("Formato de correo inválido (ej: agente@nodo.com).");
                return;
            }
            if (password.length < 6) {
                mostrarAlertaMenu("La clave debe contener un mínimo de 6 caracteres.");
                return;
            }

            // Consumo de API
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    mostrarAlertaMenu(data.message, "OPERACIÓN EXITOSA");
                    modalRegister.classList.add('hidden');
                    e.target.reset(); 
                } else {
                    mostrarAlertaMenu(data.error, "ERROR DE REGISTRO");
                }
            } catch (error) {
                console.error("Error API:", error);
                mostrarAlertaMenu("El servidor central está fuera de línea. Revisar conexión de backend.");
            }
        });
    }

    // 2. Login con Validaciones
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const inputs = e.target.querySelectorAll('input');
            const username = inputs[0].value.trim();
            const password = inputs[1].value.trim();

            if (username === "" || password === "") {
                mostrarAlertaMenu("Credenciales incompletas. Llene todos los campos requeridos.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    mostrarAlertaMenu(`Bienvenido al sistema, operativo ${data.username}`, "ACCESO CONCEDIDO");
                    localStorage.setItem('secureNodeUser', data.username);
                    
                    modalLogin.classList.add('hidden');
                    e.target.reset();
                    checkLoginStatus();
                } else {
                    mostrarAlertaMenu(data.error, "ACCESO DENEGADO");
                }
            } catch (error) {
                console.error("Error API:", error);
                mostrarAlertaMenu("No se pudo contactar al servidor de autenticación.");
            }
        });
    }
});
