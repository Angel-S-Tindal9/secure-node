// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DEL DOM ---
    // Botones del menú principal
    const btnPlay = document.getElementById('btn-play');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLeaderboard = document.getElementById('btn-leaderboard');
    const btnLogout = document.getElementById('btn-logout');
    const authButtons = document.querySelectorAll('.auth-btn');

    // Modales (Ventanas emergentes)
    const modalLogin = document.getElementById('modal-login');
    const modalRegister = document.getElementById('modal-register');
    const modalLeaderboard = document.getElementById('modal-leaderboard');

    // Botones de cierre general
    const closeBtns = document.querySelectorAll('.btn-close-modal');

    // Formularios
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // URL base de tu API Express
    const API_URL = 'http://localhost:3000/api';

    function checkLoginStatus() {
        const user = localStorage.getItem('secureNodeUser');
        if (user) {
            // Usuario logueado: Ocultar login/registro y mostrar logout
            authButtons.forEach(btn => btn.classList.add('hidden'));
            btnLogout.classList.remove('hidden');
            // Opcional: Cambiar el subtítulo para dar la bienvenida
            document.querySelector('.subtitle').innerText = `OPERATIVO: ${user.toUpperCase()}`;
        } else {
            // Usuario no logueado
            authButtons.forEach(btn => btn.classList.remove('hidden'));
            btnLogout.classList.add('hidden');
            document.querySelector('.subtitle').innerText = `PROTOCOLO DE AISLAMIENTO ACTIVO`;
        }
    }

    // Ejecutar al cargar la página
    checkLoginStatus();

    // Lógica del Botón Cerrar Sesión
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('secureNodeUser');
        // También limpiamos el progreso del juego por seguridad si cierran sesión
        localStorage.removeItem('escapeGameState');
        alert("Sesión finalizada. Conexión cerrada.");
        checkLoginStatus();
    });

    // --- FUNCIONALIDAD VISUAL (MODALES Y NAVEGACIÓN) ---

    // INICIAR MISIÓN (Redirige a la Sala 1)
    btnPlay.addEventListener('click', () => {
        window.location.href = 'rooms/room1.html';
    });

    // Abrir Modales
    btnLogin.addEventListener('click', () => {
        modalLogin.classList.remove('hidden');
    });

    btnRegister.addEventListener('click', () => {
        modalRegister.classList.remove('hidden');
    });

    // Abrir Modal de Puntuaciones y cargar datos de la base de datos
    btnLeaderboard.addEventListener('click', async () => {
        modalLeaderboard.classList.remove('hidden');
        await loadLeaderboard();
    });

    // Cerrar Modales
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalLogin.classList.add('hidden');
            modalRegister.classList.add('hidden');
            modalLeaderboard.classList.add('hidden');
        });
    });


    // --- INTEGRACIÓN CON LA API EXPRESS (BACKEND) ---

    // 1. Manejar el Registro de Operativos
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        // Obtener los valores de los inputs por su posición en el formulario
        const inputs = e.target.querySelectorAll('input');
        const username = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                modalRegister.classList.add('hidden');
                e.target.reset(); // Limpiar el formulario
            } else {
                alert("Error de registro: " + data.error);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("El servidor central (API Express) está fuera de línea.");
        }
    });

    // 2. Manejar el Inicio de Sesión
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputs = e.target.querySelectorAll('input');
        const username = inputs[0].value;
        const password = inputs[1].value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Acceso Concedido. Bienvenido operativo ${data.username}`);

                checkLoginStatus();
                
                // Guardar el nombre de usuario para el registro final de tiempo
                localStorage.setItem('secureNodeUser', data.username);
                
                modalLogin.classList.add('hidden');
                e.target.reset();
            } else {
                alert("Acceso Denegado: " + data.error);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo contactar al servidor de autenticación (API Express).");
        }
    });

    // 3. Cargar la Tabla de Puntuaciones dinámicamente
    async function loadLeaderboard() {
        const tbody = document.querySelector('.leaderboard-table tbody');
        
        try {
            const response = await fetch(`${API_URL}/leaderboard`);
            const data = await response.json();

            if (response.ok) {
                // Limpiar la tabla actual (quitar los datos de ejemplo)
                tbody.innerHTML = '';

                if (data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay registros de operativos todavía.</td></tr>';
                    return;
                }

                // Llenar la tabla con los datos reales de SQLite
                data.forEach((user, index) => {
                    const row = document.createElement('tr');
                    
                    // Formatear el tiempo de segundos a MM:SS
                    const minutes = Math.floor(user.best_time / 60);
                    const seconds = user.best_time % 60;
                    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                    row.innerHTML = `
                        <td>#${index + 1}</td>
                        <td style="color: var(--color-neon); font-weight: bold;">${user.username}</td>
                        <td>${formattedTime}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            console.error("Error al cargar puntuaciones:", error);
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">Error al conectar con la base de datos.</td></tr>';
        }
    }
});