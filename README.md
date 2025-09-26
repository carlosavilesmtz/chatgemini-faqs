
# Asistente de Clientes IA con Google Gemini

Este proyecto es una aplicación web de un chatbot de atención al cliente altamente configurable. Utiliza la API de Google Gemini para proporcionar respuestas inteligentes y contextuales basadas en la información específica de un negocio. La interfaz permite a los usuarios personalizar la personalidad del asistente, los modelos de IA, los límites de tokens y la base de conocimiento del negocio.

## Características Principales

- **Chat Interactivo**: Interfaz de chat en tiempo real para conversar con el asistente.
- **Panel de Configuración Completo**:
    - Define la **personalidad** del asistente.
    - Selecciona el **modelo de IA** a utilizar.
    - Ajusta los **límites de tokens** (mínimos y máximos) para las respuestas.
    - **Base de Conocimiento**: Proporciona contexto sobre tu empresa, productos/servicios y promociones.
    - **Límites de Caracteres Configurables**: Establece el tamaño máximo para cada campo de la base de conocimiento.
    - **Gestor de FAQs**: Añade, edita y elimina dinámicamente preguntas frecuentes.
- **Integración con Herramientas (Simulada)**: Demostración de *Function Calling* con una simulación de Google Calendar.
- **Renderizado de Markdown**: Muestra texto en **negrita** para una mejor legibilidad.
- **Diseño Moderno y Responsivo**: Creado con Tailwind CSS para una experiencia de usuario agradable en cualquier dispositivo.

## Tecnologías Utilizadas

- **Google Gemini API**: El motor del chatbot.
- **React**: Para construir la interfaz de usuario interactiva.
- **Tailwind CSS**: Para el diseño y los estilos de la aplicación.
- **TypeScript**: Para un código más robusto y mantenible.

---

## Guía de Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Requisitos Previos

- Un navegador web moderno (Chrome, Firefox, Edge).
- **Node.js** instalado en tu sistema (para usar `npx`). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

### Paso 1: Obtener una API Key de Google Gemini

1.  Ve a [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Inicia sesión con tu cuenta de Google.
3.  Haz clic en "**Create API key**" para generar una nueva clave.
4.  Copia la clave generada. La necesitarás en el siguiente paso.

### Paso 2: Configurar tu API Key

Por razones de seguridad, la API Key no debe escribirse directamente en el código fuente. La cargaremos a través de un archivo de entorno que no se debe compartir.

1.  En la carpeta principal del proyecto, crea un nuevo archivo llamado `env.js`.
2.  Abre el archivo `env.js` y pega el siguiente código:

    ```javascript
    // Este archivo simula las variables de entorno para el navegador.
    window.process = {
      env: {
        API_KEY: "AQUI_VA_TU_API_KEY"
      }
    };
    ```

3.  **Importante**: Reemplaza el texto `"AQUI_VA_TU_API_KEY"` con la clave que obtuviste de Google AI Studio.

### Paso 3: Iniciar un Servidor Local

Debido a las políticas de seguridad de los navegadores, no puedes abrir el archivo `index.html` directamente. Necesitas servir los archivos a través de un servidor local.

1.  Abre una terminal o línea de comandos en la carpeta raíz del proyecto.
2.  Ejecuta el siguiente comando. Esto descargará y ejecutará un servidor web simple.

    ```bash
    npx serve
    ```

3.  La terminal te mostrará una o más direcciones URL, usualmente algo como `http://localhost:3000`.
4.  Abre esa URL en tu navegador.

¡Listo! La aplicación del Asistente de Clientes IA debería estar funcionando.

## Cómo Usar la Aplicación

1.  **Explora la Configuración**: A la derecha, encontrarás el panel de configuración. Revisa los datos de ejemplo y ajústalos como prefieras.
2.  **Guarda los Cambios**: Haz clic en el botón "Guardar Cambios" para que el asistente utilice la nueva configuración.
3.  **Chatea con el Asistente**: Escribe tus preguntas en el campo de texto inferior y presiona Enter o el botón de enviar.
