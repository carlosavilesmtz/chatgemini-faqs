# Plan de Implementación: Persistencia en localStorage

## 1. Objetivo

El objetivo es hacer que la configuración del panel del "Asistente de Clientes IA" persista entre sesiones del navegador. Para ello, se guardará el objeto `config` en `localStorage` cada vez que se modifique, y se cargará al iniciar la aplicación.

## 2. Archivo Principal a Modificar

- `src/App.tsx`: Este archivo contiene el estado principal de la configuración (`config`) y es el lugar idóneo para centralizar la lógica de carga y guardado.

## 3. Pasos de Implementación

### 3.1. Carga de la Configuración al Iniciar

La mejor manera de manejar la carga inicial es directamente en la inicialización del estado `useState` para evitar un parpadeo o renderizado innecesario.

**Lógica:**

1.  Modificar la llamada `useState` para el estado `config` en el componente `ChatInterface`.
2.  En lugar de pasar directamente el objeto de configuración por defecto, se pasará una función.
3.  Dentro de esta función:
    -   Intentar obtener el item `'chatConfig'` desde `localStorage`.
    -   Usar un bloque `try...catch` para el `JSON.parse()` por si los datos en `localStorage` están corruptos.
    -   Si se encuentra y se parsea correctamente una configuración guardada, retornarla.
    -   Si no se encuentra nada, o si hay un error en el parseo, retornar el objeto de configuración por defecto que ya está definido.

### 3.2. Guardado de la Configuración al Detectar Cambios

Se utilizará un `useEffect` para reaccionar a cualquier cambio en el estado `config` y guardarlo automáticamente.

**Lógica:**

1.  Crear un nuevo `useEffect` dentro del componente `ChatInterface`.
2.  Añadir `[config]` como el array de dependencias. Esto asegurará que el efecto se ejecute cada vez que el objeto `config` cambie.
3.  Dentro del efecto, llamar a `localStorage.setItem('chatConfig', JSON.stringify(config))` para guardar la versión más reciente del estado en `localStorage`.

## 4. Resumen del Flujo

1.  **El usuario abre la app:** El `useState` de `config` se ejecuta. Intenta leer de `localStorage`. Si tiene éxito, la app se carga con la configuración guardada. Si no, usa la configuración por defecto.
2.  **El usuario modifica la configuración:** El usuario cambia algo en el `SettingsPanel`, lo que actualiza el estado `config`.
3.  **El `useEffect` se dispara:** Al detectar el cambio en `config`, el `useEffect` se ejecuta y guarda el nuevo objeto `config` en `localStorage`, sobreescribiendo el valor anterior.
4.  **El usuario recarga la página:** El ciclo vuelve a empezar, cargando la configuración que se acaba de guardar.
