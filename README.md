
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

1.  En la carpeta raíz del proyecto, busca o crea un archivo llamado `.env.local`.
2.  Abre el archivo y añade la siguiente línea, reemplazando `AQUI_VA_TU_API_KEY` con la clave que obtuviste de Google AI Studio:

    ```
    VITE_GEMINI_API_KEY="AQUI_VA_TU_API_KEY"
    ```

    *Nota: El archivo `.env.local` está incluido en el `.gitignore` para prevenir que tu clave secreta se suba accidentalmente a un repositorio.*

### Paso 3: Instalar Dependencias y Ejecutar el Proyecto

1.  Abre una terminal en la carpeta raíz del proyecto.
2.  Instala las dependencias necesarias con el siguiente comando:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
4.  La terminal te mostrará una URL local (generalmente `http://localhost:5173`). Ábrela en tu navegador.

¡Listo! La aplicación del Asistente de Clientes IA debería estar funcionando.

## Cómo Usar la Aplicación

1.  **Explora la Configuración**: A la derecha, encontrarás el panel de configuración. Revisa los datos de ejemplo y ajústalos como prefieras.
2.  **Guarda los Cambios**: Haz clic en el botón "Guardar Cambios" para que el asistente utilice la nueva configuración.
3.  **Chatea con el Asistente**: Escribe tus preguntas en el campo de texto inferior y presiona Enter o el botón de enviar.
