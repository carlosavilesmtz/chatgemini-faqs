# Plan de Mejoras para el Asistente de Clientes IA

## 1. Introducción

Este documento describe un plan estratégico para mejorar y expandir las capacidades de la aplicación "Asistente de Clientes IA". El objetivo es evolucionar la herramienta desde su estado actual como una demostración funcional hacia una aplicación más robusta, intuitiva y potente.

Las mejoras se han categorizado en las siguientes áreas:
- **Experiencia de Usuario del Chat (UX/UI)**
- **Panel de Configuración y Persistencia**
- **Capacidades del Modelo y Base de Conocimiento**
- **Mejoras Técnicas y de Código**
- **Nuevas Funcionalidades (A Futuro)**

Cada punto incluye una descripción, el beneficio esperado y una prioridad sugerida (Alta, Media, Baja).

---

## 2. Experiencia de Usuario del Chat (UX/UI)

Mejoras enfocadas en hacer la interacción con el chatbot más fluida, rápida y amigable.

### 2.1. Streaming de Respuestas
- **Descripción:** Implementar el método `generateContentStream` de la API de Gemini para que la respuesta del asistente aparezca palabra por palabra, en lugar de esperar a que se genere por completo.
- **Beneficio:** Mejora drásticamente la percepción de velocidad y mantiene al usuario enganchado, ya que ve que el asistente está "pensando" y escribiendo en tiempo real.
- **Prioridad:** **Alta**

### 2.2. Sugerencias de Inicio
- **Descripción:** Cuando el chat está vacío, mostrar 3-4 botones con preguntas de ejemplo basadas en el contexto actual (ej. "¿Qué promociones tienen?", "¿Cuál es el horario de atención?").
- **Beneficio:** Guía al usuario sobre las capacidades del asistente y reduce la fricción inicial para empezar una conversación.
- **Prioridad:** **Media**

### 2.3. Gestión del Historial de Chat
- **Descripción:** Añadir un botón en la interfaz de chat para limpiar la conversación actual y empezar de nuevo.
- **Beneficio:** Ofrece un control más directo al usuario, permitiéndole reiniciar la interacción sin tener que recargar toda la página.
- **Prioridad:** **Media**

### 2.4. Soporte Extendido de Markdown
- **Descripción:** Utilizar una librería como `react-markdown` para renderizar correctamente listas, enlaces, tablas y otros elementos de formato que el modelo pueda generar.
- **Beneficio:** Aumenta significativamente la legibilidad y la riqueza visual de las respuestas del asistente.
- **Prioridad:** **Baja**

### 2.5. Funcionalidad de Copiar Mensajes
- **Descripción:** Añadir un pequeño icono en cada burbuja de chat (tanto del usuario como del asistente) que permita copiar el contenido del mensaje al portapapeles.
- **Beneficio:** Facilita al usuario guardar o compartir información importante proporcionada por el asistente.
- **Prioridad:** **Baja**

---

## 3. Panel de Configuración y Persistencia

Mejoras para hacer la configuración más inteligente, persistente y fácil de gestionar.

### 3.1. Persistencia de la Configuración en `localStorage`
- **Descripción:** Guardar el estado del objeto `config` en el `localStorage` del navegador cada vez que se guardan los cambios. Al cargar la aplicación, se debe intentar recuperar esta configuración.
- **Beneficio:** Los ajustes personalizados del usuario se mantienen entre sesiones, eliminando la necesidad de reconfigurar el asistente cada vez que se visita la página. Es la mejora de usabilidad más importante para el panel.
- **Prioridad:** **Alta**

### 3.2. Feedback de "Cambios sin Guardar"
- **Descripción:** Deshabilitar el botón "Guardar Cambios" si no se ha modificado ningún campo. Al detectar un cambio, habilitarlo y quizás mostrar un pequeño indicador visual (ej. un punto de color) para señalar que hay cambios pendientes.
- **Beneficio:** Proporciona una retroalimentación clara e inmediata al usuario sobre el estado de la configuración, evitando clics innecesarios y confusiones.
- **Prioridad:** **Media**

### 3.3. Importar / Exportar Configuración
- **Descripción:** Añadir dos botones: "Exportar" para descargar la configuración actual como un archivo `.json`, e "Importar" para cargar una configuración desde un archivo `.json`.
- **Beneficio:** Permite a los usuarios guardar diferentes perfiles de asistente, compartirlos con otros o hacer copias de seguridad de sus configuraciones.
- **Prioridad:** **Baja**

---

## 4. Capacidades del Modelo y Base de Conocimiento

Expandir la inteligencia del asistente y facilitar la forma en que se nutre de información.

### 4.1. Integración de Búsqueda Web (Google Search Grounding)
- **Descripción:** Incorporar la herramienta `googleSearch` en las llamadas a la API. Cuando se active, permitir que el modelo consulte información actualizada en la web para responder preguntas sobre eventos recientes o temas no cubiertos en el contexto. Es crucial mostrar las URLs de las fuentes obtenidas.
- **Beneficio:** Aumenta drásticamente el alcance y la utilidad del chatbot, permitiéndole responder con información actualizada y relevante del mundo real.
- **Prioridad:** **Alta**

### 4.2. Carga de Archivos para Contexto
- **Descripción:** Permitir al usuario subir archivos (`.txt`, `.md`) para poblar los campos de la base de conocimiento (ej. "Información de la Empresa", "Productos"). El contenido del archivo se leería y se insertaría en el `textarea` correspondiente.
- **Beneficio:** Simplifica enormemente la tarea de añadir grandes volúmenes de información, evitando el tedioso proceso de copiar y pegar.
- **Prioridad:** **Media**

---

## 5. Mejoras Técnicas y de Código

Optimizar la arquitectura interna, el manejo de errores y la robustez general de la aplicación.

### 5.1. Manejo de Errores Específico
- **Descripción:** Mejorar el bloque `catch` en `getChatResponse` para identificar y mostrar errores más específicos al usuario (ej. "API Key inválida o faltante", "Error de red", "El modelo está sobrecargado").
- **Beneficio:** Proporciona una mejor guía al usuario para diagnosticar y solucionar problemas, en lugar de un mensaje de error genérico.
- **Prioridad:** **Media**

### 5.2. Validación de Entradas en el Panel
- **Descripción:** Añadir validaciones en los campos de configuración. Por ejemplo, asegurar que "Tokens Mín." no sea mayor que "Tokens Máx." y mostrar un mensaje de error si la condición no se cumple.
- **Beneficio:** Previene configuraciones erróneas que podrían causar fallos en la API y mejora la robustez general de la aplicación.
- **Prioridad:** **Baja**

---

## 6. Nuevas Funcionalidades (A Futuro)

Ideas para funcionalidades mayores que podrían implementarse en fases posteriores para llevar la aplicación al siguiente nivel.

### 6.1. Integración Real con Google Calendar
- **Descripción:** Reemplazar la simulación actual con una integración real mediante el protocolo OAuth 2.0. El usuario podría autenticarse con su cuenta de Google, otorgando permisos a la aplicación para leer eventos de su calendario real.
- **Beneficio:** Convierte una característica de demostración en una herramienta funcional y extremadamente potente, mostrando el verdadero potencial de *Function Calling*.
- **Prioridad:** **Baja** (Complejidad alta)

### 6.2. Interacción por Voz (Voz a Texto y Texto a Voz)
- **Descripción:** Integrar las APIs del navegador (`SpeechRecognition` y `SpeechSynthesis`) para permitir al usuario hablar con el asistente y escuchar sus respuestas.
- **Beneficio:** Aumenta la accesibilidad y ofrece una modalidad de interacción más natural y moderna.
- **Prioridad:** **Baja**
