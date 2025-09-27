# Plan de Integración con Google Calendar

## 1. Objetivo

Integrar el asistente con la API de Google Calendar para permitirle consultar la disponibilidad de la agenda de un usuario. Esto reemplazará la actual funcionalidad simulada por una implementación real y segura utilizando el protocolo OAuth 2.0.

El flujo principal será:
1.  El usuario conecta su cuenta de Google a través de la aplicación.
2.  El asistente, mediante *Function Calling*, podrá consultar la API de Google Calendar para ver los horarios ocupados.
3.  El asistente usará esa información para responder preguntas sobre la disponibilidad de citas.

## 2. Componentes Requeridos

La integración con OAuth 2.0 requiere un **componente de backend** para manejar de forma segura los secretos de la API y el intercambio de tokens. Dado que el proyecto actual es solo de frontend, será necesario crear un pequeño servidor o usar funciones serverless.

-   **Google Cloud Platform**: Para configurar el proyecto, habilitar la API y obtener las credenciales.
-   **Backend (Nuevo)**: Un servidor simple (ej. Node.js con Express) o funciones serverless para gestionar el flujo OAuth.
-   **Frontend (Modificaciones)**: Cambios en `SettingsPanel.tsx` para la interfaz de conexión y en `geminiService.ts` para definir y manejar la nueva herramienta.

---

## 3. Pasos de Implementación

### Fase 1: Configuración en Google Cloud Platform

1.  **Crear un Proyecto**: Ir a la [Consola de Google Cloud](https://console.cloud.google.com/) y crear un nuevo proyecto.
2.  **Habilitar la API**: En el nuevo proyecto, buscar y habilitar la **"Google Calendar API"**.
3.  **Configurar la Pantalla de Consentimiento OAuth**:
    -   Ir a "APIs y servicios" -> "Pantalla de consentimiento de OAuth".
    -   Seleccionar "Externo" y rellenar los datos de la aplicación (nombre, correo, etc.).
    -   En "Alcances" (Scopes), añadir el siguiente: `.../auth/calendar.readonly` para obtener permiso de solo lectura sobre los eventos.
4.  **Crear Credenciales**:
    -   Ir a "Credenciales" -> "Crear credenciales" -> "ID de cliente de OAuth".
    -   Seleccionar "Aplicación web".
    -   En **"URI de redireccionamiento autorizados"**, añadir la URL a la que Google redirigirá al usuario tras la autenticación. Para desarrollo local, será `http://localhost:PORT/oauth2callback` (donde `PORT` es el puerto del backend).
    -   Copiar el **ID de cliente** y el **Secreto del cliente**. El secreto debe guardarse de forma segura en el backend.

### Fase 2: Desarrollo del Backend

Se creará un nuevo directorio (ej. `server/`) con un servidor Express.

1.  **Instalar Dependencias**: `npm install express googleapis @google-cloud/local-auth`
2.  **Crear Endpoints**:
    -   **`GET /auth/google`**:
        -   Inicia el flujo OAuth.
        -   Crea una instancia del cliente OAuth2 con las credenciales obtenidas.
        -   Genera una URL de autenticación con el alcance `calendar.readonly`.
        -   Redirige al usuario a esa URL de Google.
    -   **`GET /oauth2callback`**:
        -   El URI de redirección que Google llama después de que el usuario da su consentimiento.
        -   Recibe un `code` de autorización en los parámetros de la URL.
        -   Usa este código para intercambiarlo por un **token de acceso** y un **token de actualización** usando el método `getToken`.
        -   **Importante**: Almacenar de forma segura estos tokens asociados al usuario (ej. en una base de datos o en la sesión del servidor). El token de actualización es crucial para obtener nuevos tokens de acceso sin que el usuario tenga que autenticarse de nuevo.
    -   **`POST /api/calendar/free-busy`**:
        -   Este endpoint será llamado por nuestro frontend (`geminiService`).
        -   Recibe en el cuerpo de la petición un `startTime` y `endTime`.
        -   Recupera el token de acceso del usuario.
        -   Inicializa la API de Google Calendar con el token.
        -   Llama a la función `freebusy.query` de la API, pasándole el rango de tiempo y el ID del calendario (`primary`).
        -   Devuelve los bloques de tiempo "ocupado" (`busy`) al frontend.

### Fase 3: Modificaciones en el Frontend

1.  **`components/SettingsPanel.tsx`**:
    -   Reemplazar el checkbox de "Google Calendar (Simulado)" por un botón **"Conectar con Google Calendar"**.
    -   Este botón será un enlace (`<a>`) que apunta al endpoint `http://localhost:PORT/auth/google` del backend.
    -   Añadir lógica para mostrar el estado de la conexión. Por ejemplo, si el usuario está conectado, mostrar "Conectado como: [email]" y un botón para "Desconectar".
    -   El estado de la conexión se gestionará en el componente principal `App.tsx`.

2.  **`services/geminiService.ts`**:
    -   **Definir la Herramienta**: Crear una nueva definición de herramienta para Gemini que se llamará `check_calendar_availability`.
        -   **Nombre**: `check_calendar_availability`
        -   **Descripción**: "Consulta la agenda de Google Calendar para verificar si hay horarios disponibles o si un horario específico está ocupado".
        -   **Parámetros**: Un objeto con `startTime` (formato ISO 8601) y `endTime` (formato ISO 8601).
    -   **Modificar `getChatResponse`**:
        -   En la llamada a `generateContent`, incluir la nueva herramienta en la configuración de `tools`.
        -   Revisar la respuesta del modelo. Si contiene una llamada a la función `check_calendar_availability`, extraer los argumentos (`startTime`, `endTime`).
        -   Hacer una llamada `fetch` al endpoint `/api/calendar/free-busy` del backend, enviando los parámetros.
        -   Con la respuesta del backend (los bloques de tiempo ocupado), hacer una segunda llamada a Gemini, pasándole el resultado de la herramienta para que pueda generar una respuesta en lenguaje natural.

3.  **`App.tsx` (Gestión de Estado)**:
    -   Añadir un nuevo estado para gestionar la conexión con Calendar: `const [calendarStatus, setCalendarStatus] = useState({ isConnected: false, userEmail: '' });`.
    -   Este estado se pasará como props a `SettingsPanel` y será utilizado por `geminiService` para saber si puede o no usar la herramienta.

---

## 4. Flujo de Usuario Final

1.  El usuario va al panel de configuración y hace clic en "Conectar con Google Calendar".
2.  Es redirigido a la pantalla de consentimiento de Google. Acepta los permisos.
3.  Google lo redirige de vuelta a la aplicación. El backend guarda los tokens. El frontend actualiza la UI para mostrar "Conectado".
4.  El usuario pregunta al asistente: "¿Tienes disponibilidad mañana a las 3 PM?".
5.  El modelo Gemini decide usar la herramienta `check_calendar_availability` con los parámetros de tiempo correspondientes.
6.  `geminiService` detecta la llamada, contacta al backend, y el backend consulta la API de Google Calendar.
7.  El backend devuelve los horarios ocupados.
8.  `geminiService` envía esta información de vuelta a Gemini.
9.  Gemini genera la respuesta final: "Sí, tengo ese horario disponible." o "No, a esa hora tengo una reunión. ¿Te parece bien a las 4 PM?".
