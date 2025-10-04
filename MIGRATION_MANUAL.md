# Manual de Migración del Chatbot a un Nuevo Proyecto

## 🎯 Objetivo
Esta guía detalla el proceso paso a paso para migrar el AI Chat Widget de este proyecto a un nuevo y limpio proyecto standalone de React + TypeScript, utilizando Vite como herramienta de construcción.

## ✅ Prerrequisitos
- **Node.js**: Asegúrate de tener instalado Node.js (versión 18+).
- **VS Code**: Editor de código principal.
- **Terminal en VS Code**: Saber cómo abrir una terminal integrada (`Ctrl + ` `).

---

### Paso 1: Crear el Nuevo Proyecto Vite

1.  **Abre una nueva terminal** en VS Code.
2.  Navega a la carpeta donde deseas crear tu nuevo proyecto.
3.  Ejecuta el siguiente comando para crear un nuevo proyecto React con TypeScript usando Vite. Nombraremos al proyecto `new-chat-widget`:
    ```bash
    npm create vite@latest new-chat-widget -- --template react-ts
    ```
4.  Una vez creado, navega al directorio del nuevo proyecto e instala las dependencias iniciales:
    ```bash
    cd new-chat-widget
    npm install
    ```

### Paso 2: Copiar los Archivos Esenciales del Chatbot

Ahora, copiaremos los archivos clave del proyecto original (`chatgemini-faqs`) al nuevo (`new-chat-widget`). Puedes hacerlo arrastrando y soltando los archivos entre dos ventanas de VS Code o usando el explorador de archivos de tu sistema operativo.

1.  **Crea las siguientes carpetas** dentro de la carpeta `src` de tu nuevo proyecto:
    - `src/components`
    - `src/services`

2.  **Copia los siguientes archivos** desde `chatgemini-faqs` a `new-chat-widget`:

    | Archivo Origen                                               | Destino en el Nuevo Proyecto                                 |
    | ------------------------------------------------------------ | ------------------------------------------------------------ |
    | `types.ts`                                                   | `src/types.ts`                                               |
    | `services/geminiService.ts`                                  | `src/services/geminiService.ts`                              |
    | `components/ChatMessage.tsx`                                 | `src/components/ChatMessage.tsx`                             |
    | `components/ChatWindow.tsx`                                  | `src/components/ChatWindow.tsx`                              |
    | `components/MessageInput.tsx`                                | `src/components/MessageInput.tsx`                            |
    | `components/SettingsPanel.tsx`                               | `src/components/SettingsPanel.tsx`                           |
    | `components/TokenUsage.tsx`                                  | `src/components/TokenUsage.tsx`                              |

### Paso 3: Instalar Dependencias Adicionales

El chatbot depende de la librería de Google GenAI. Instálala en tu nuevo proyecto.

1.  En la terminal de tu nuevo proyecto, ejecuta:
    ```bash
    npm install @google/genai
    ```

### Paso 4: Configurar Tailwind CSS

Para mantener el estilo, instalaremos y configuraremos Tailwind CSS.

1.  **Instala las dependencias de desarrollo**:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    ```
2.  **Inicializa Tailwind CSS**. Esto creará los archivos `tailwind.config.js` y `postcss.config.js`.
    ```bash
    npx tailwindcss init -p
    ```
3.  **Configura las rutas de contenido** en `tailwind.config.js`. Esto le dice a Tailwind qué archivos escanear para encontrar las clases que se están utilizando.
    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Asegúrate de que esta línea exista
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
4.  **Añade las directivas de Tailwind** a tu archivo CSS principal. Abre `src/index.css`, borra su contenido y añade lo siguiente:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

### Paso 5: Reemplazar el Contenido de `App.tsx`

El archivo `App.tsx` del proyecto original contiene toda la lógica para ensamblar y operar el chat. Lo copiaremos al nuevo proyecto.

1.  **Abre `chatgemini-faqs/App.tsx`** y copia todo su contenido.
2.  **Abre `new-chat-widget/src/App.tsx`**, borra todo su contenido y pega el código que copiaste.
3.  **Ajusta las rutas de importación**. El código copiado tiene rutas relativas como `./types` o `./components/SettingsPanel`. Como hemos replicado la estructura de carpetas, estas rutas deberían funcionar correctamente. Solo asegúrate de que los archivos estén en `src/`.

### Paso 6: Configurar las Variables de Entorno

El servicio de Gemini necesita una clave de API para funcionar.

1.  **Crea un archivo `.env`** en la raíz de tu nuevo proyecto (`new-chat-widget/.env`).
2.  Añade tu clave de API de Gemini al archivo:
    ```
    GEMINI_API_KEY=TU_API_KEY_AQUI
    ```
3.  **Importante**: Para que Vite exponga esta variable al cliente, el nombre debe empezar con `VITE_`. Renombra la variable a `VITE_GEMINI_API_KEY` en tu archivo `.env` y en el código donde se usa (principalmente en `services/geminiService.ts` y `vite.config.ts` si es necesario).

    *Actualiza tu `vite.config.ts` en el nuevo proyecto para que se vea así:*
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
    })
    ```
    *Y en `geminiService.ts`, asegúrate de leer `import.meta.env.VITE_GEMINI_API_KEY`.*

### Paso 7: Ejecutar y Verificar

¡Todo está listo! Ahora puedes lanzar el servidor de desarrollo para ver tu chatbot funcionando de forma aislada.

1.  En la terminal de tu nuevo proyecto, ejecuta:
    ```bash
    npm run dev
    ```
2.  Abre la URL que aparece en la terminal (normalmente `http://localhost:5173`).

Deberías ver el widget del chatbot funcionando exactamente como en el proyecto original. ¡Migración completada!
