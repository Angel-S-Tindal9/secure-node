// js/auth/session.js

function loginUser(username, password) {
    // Simulación de validación (AQUÍ podrías conectar a un backend más adelante)
    if (username.trim() !== "" && password === "admin123") {
        localStorage.setItem('currentUser', username);
        window.location.href = 'dashboard.html';
        return true;
    } else {
        alert("Credenciales incorrectas.");
        return false;
    }
}

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html'; // Redirigir si no está logueado
    }
}

// Este archivo maneja la conexión simulada y el localStorage

const MOCK_DB = {
    users: [
        { username: "angel", password: "123", role: "sysadmin" },
        { username: "mateo", password: "123", role: "auditor" },
        { username: "danner", password: "123", role: "operator" },
        { username: "admin", password: "admin", role: "superuser" }
    ]
};

const Session = {
    login: function(username, password) {
        const user = MOCK_DB.users.find(u => u.username === username.toLowerCase() && u.password === password);
        
        if (user) {
            // Guardamos la sesión en el navegador
            localStorage.setItem('escapeUser', JSON.stringify({
                username: user.username,
                role: user.role,
                loginTime: new Date().toISOString()
            }));
            return true;
        }
        return false;
    },

    logout: function() {
        localStorage.removeItem('escapeUser');
        window.location.href = 'login.html';
    },

    checkAuth: function() {
        const user = localStorage.getItem('escapeUser');
        if (!user && window.location.pathname.includes('rooms')) {
            window.location.href = '../login.html';
        }
        return user ? JSON.parse(user) : null;
    }
};