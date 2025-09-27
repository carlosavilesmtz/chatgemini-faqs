# Plan de Implementación: Funcionalidad de Crawling

## 1. Objetivo

Añadir una funcionalidad que permita al usuario introducir una URL para que la aplicación la "crawlee" (analice), extraiga su contenido de texto, lo procese con IA y lo utilice para rellenar automáticamente los campos de la Base de Conocimiento (`Información de la Empresa`, `Productos y Servicios`, `Promociones`).

## 2. Archivos a Modificar

-   **`components/SettingsPanel.tsx`**: Para añadir la nueva interfaz de usuario y manejar la lógica de estado y los eventos de clic.
-   **`services/geminiService.ts`**: Para añadir la lógica de orquestación que llama a las herramientas de crawling y a la IA para procesar el texto.

## 3. Pasos de Implementación

### 3.1. Cambios en la Interfaz de Usuario (`SettingsPanel.tsx`)

1.  **Crear un Nuevo Componente de UI**:
    -   Dentro de la sección "Base de Conocimiento", añadir una nueva tarjeta o sub-sección titulada **"Base de Conocimiento Automática desde URL"**.
    -   Esta sección contendrá:
        -   Un `input` de tipo `text` para que el usuario pegue la URL.
        -   Un botón con el texto **"Extraer y Rellenar"**.

2.  **Manejar el Estado del Componente**:
    -   Añadir un estado para almacenar la URL introducida: `const [crawlUrl, setCrawlUrl] = useState('');`
    -   Añadir un estado de carga para dar feedback al usuario: `const [isCrawling, setIsCrawling] = useState(false);`
    -   Añadir un estado para mostrar mensajes de éxito o error: `const [crawlStatus, setCrawlStatus] = useState('');`

3.  **Lógica del Evento `onClick`**:
    -   El botón "Extraer y Rellenar" llamará a una nueva función asíncrona, por ejemplo, `handleExtractAndFill`.
    -   Esta función establecerá `isCrawling` a `true` y `crawlStatus` a vacío.
    -   Llamará a una nueva función en `geminiService.ts` (ej. `processUrlForKnowledge`) pasándole la `crawlUrl`.
    -   Al recibir la respuesta, actualizará los campos correspondientes en el estado `localConfig`.
    -   Finalmente, establecerá `isCrawling` a `false` y mostrará un mensaje de éxito o error.

### 3.2. Lógica del Servicio (`geminiService.ts`)

1.  **Crear Nueva Función Orquestadora**:
    -   Exportar una nueva función asíncrona: `export const processUrlForKnowledge = async (url: string) => { ... }`.

2.  **Paso 1: Obtener Contenido Web**:
    -   Dentro de la nueva función, llamar a la herramienta `web_fetch` con la `url` proporcionada.
    -   Esto devolverá el contenido de texto principal de la página.

3.  **Paso 2: Procesar Contenido con IA**:
    -   Tomar el texto obtenido y usarlo en un prompt para el modelo Gemini.
    -   El prompt instruirá al modelo para que actúe como un analista de contenido y clasifique la información en tres categorías: `companyInfo`, `productsInfo`, y `promotionsInfo`.
    -   Se le pedirá explícitamente que la salida sea un objeto JSON.

    **Ejemplo de Prompt para la IA:**
    ```
    Eres un asistente de IA experto en análisis y estructuración de contenido. A continuación, se te proporciona el texto extraído de un sitio web. Tu tarea es leerlo y clasificar la información en las siguientes categorías: 'companyInfo', 'productsInfo', 'promotionsInfo'.

    - En 'companyInfo', resume quién es la empresa, su misión o historia.
    - En 'productsInfo', describe los productos o servicios que ofrece.
    - En 'promotionsInfo', extrae cualquier promoción, oferta o descuento mencionado.

    Devuelve el resultado únicamente en formato JSON. Si una categoría no tiene información, déjala como un string vacío.

    Texto del sitio web:
    ---
    [Aquí se inserta el texto extraído por web_fetch]
    ---

    JSON de salida:
    ```

4.  **Paso 3: Devolver Datos Estructurados**:
    -   La función `processUrlForKnowledge` recibirá la respuesta del modelo, la parseará como JSON y la devolverá al componente `SettingsPanel.tsx`.

## 4. Flujo de Trabajo Final

1.  El usuario pega una URL y hace clic en "Extraer y Rellenar".
2.  `SettingsPanel.tsx` muestra un indicador de carga y llama a `processUrlForKnowledge`.
3.  `geminiService.ts` usa `web_fetch` para obtener el texto de la URL.
4.  `geminiService.ts` usa el modelo Gemini para analizar y estructurar el texto en un JSON.
5.  `SettingsPanel.tsx` recibe el JSON y actualiza su estado `localConfig` con la nueva información, rellenando los `textarea`.
6.  El usuario ve los campos actualizados, puede editarlos si es necesario y luego guardarlos permanentemente.
