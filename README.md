# secure-node

# SecureNode - Escape Room Interactivo

SecureNode es una aplicación web interactiva estilo "Escape Room" diseñada bajo una temática de ciberseguridad. El proyecto pone a prueba la lógica de los usuarios mediante la resolución de puzzles integrados en una interfaz de terminal antigua, combinando un diseño inmersivo con una arquitectura de software robusta.

## 🚀 Arquitectura y Tecnologías
El proyecto está desarrollado utilizando Vanilla JavaScript para demostrar un dominio profundo del DOM y la manipulación de estado sin depender de frameworks externos.
* **Frontend:** HTML5, CSS3 (Glassmorphism, animaciones CSS, CSS Grid/Flexbox), Vanilla JavaScript (ES6+).
* **Almacenamiento:** `sessionStorage` para el control de la partida local y `localStorage` para caché global.
* **Backend / API:** Node.js + Express (Gestión de usuarios y registro de tiempos).
* **Audio:** Web Audio API (Generación de sonido por síntesis matemática).

---

## 🧠 Decisiones Técnicas y Justificación (Arquitectura del Proyecto)

Para garantizar una experiencia de usuario fluida, segura y libre de errores de estado, se tomaron las siguientes decisiones de ingeniería:

### 1. Aislamiento del Estado (State Management)
* **El problema:** En las primeras iteraciones, el reloj del juego y el inventario compartían el mismo bloque de memoria, lo que causaba sobreescrituras (race conditions) al cambiar de sala.
* **La solución:** Se implementó un patrón `GameManager` centralizado. El estado del cronómetro y las banderas de nivel se guardan en una clave de memoria (`escapeGameState`), mientras que el inventario se encapsula en una "caja fuerte" independiente (`secureNodeInventory`). Esto previene la pérdida de objetos al renderizar vistas.

### 2. Seguridad Anti-Trampas (SessionStorage)
* Para evitar que los usuarios mantengan su progreso si recargan abruptamente o intentan burlar el cronómetro cambiando de pestaña, el núcleo del juego utiliza `sessionStorage` en lugar de `localStorage`. 
* Si la pestaña se cierra, el estado se volatiliza. Además, el botón de salida ejecuta una rutina global (`sessionStorage.clear()`) que realiza una limpieza absoluta de la memoria temporal antes de redirigir al menú.

### 3. Síntesis de Audio (Web Audio API) vs. Archivos .MP3
* **Decisión:** En lugar de cargar archivos `.wav` o `.mp3` genéricos para el feedback visual de los botones, se implementó un sistema de retroalimentación acústica usando la **Web Audio API** nativa de JavaScript.
* **Justificación:** Al instanciar un `AudioContext` y un oscilador de onda cuadrada (`square wave`) que decae en exactamente 50 milisegundos, el navegador sintetiza el sonido en tiempo real. Esto elimina la latencia de red al 100%, reduce el peso del proyecto y otorga un "clic" mecánico único que refuerza la inmersión cibernética.

### 4. Validaciones Estrictas y UX
* Se reemplazaron las alertas nativas del navegador (`alert()`) por un sistema de modales dinámicos generados a través del DOM (`mostrarAlerta()`).
* El flujo de autenticación (Login/Registro) cuenta con validación estricta en el Frontend utilizando Expresiones Regulares (Regex) para el formateo de correos e intercepción del evento `submit` mediante `e.preventDefault()`. Esto asegura que la API Express solo reciba datos sanitizados.

### 5. Renderizado Dinámico de Puntuaciones (Victory Loop)
* Al resolver la sala final, el sistema calcula el diferencial de tiempo invertido y actualiza la tabla de posiciones dinámicamente utilizando `document.createElement`. Esto evita la inyección directa de HTML mediante strings y previene vulnerabilidades XSS.

---

## ⚙️ Instalación y Ejecución

1. Clona este repositorio en tu máquina local.
2. Inicia el servidor de base de datos (Backend/API Express) ejecutando `npm start` o `node server.js` en la carpeta del servidor.
3. Abre el archivo `index.html` en un servidor local (Live Server de VS Code o similar) para evitar bloqueos de políticas CORS al consumir los módulos JS y el audio.
4. Las credenciales de prueba o registro de nuevos operativos se gestionan directamente desde la vista inicial.

---
**Desarrollado por:** Luis Ángel Soliz Tindal
