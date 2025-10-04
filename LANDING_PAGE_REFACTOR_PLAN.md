# Plan de Refactorización: Landing Page FIG 2025

## 🎯 Objetivo
Refactorizar el componente `BusinessProfile.tsx` para transformar la página actual, densa en información, en una landing page moderna, escaneable y visualmente atractiva. El enfoque principal es mejorar la experiencia del usuario (UX) sintetizando la información y mejorando la jerarquía visual, no eliminando contenido.

---

## Fase 1: Rediseño del Hero Section (Above the Fold)

**Problema:** La cabecera actual es solo una imagen y un título. No captura la atención ni comunica la información más crítica de inmediato.

**Solución:** Crear un verdadero "Hero Section" que sirva como un resumen de alto impacto.

- **Paso 1.1: Implementar un Hero Section de Vista Completa.**
  - **Acción:** Reemplazar el `<header>` actual por un `div` que ocupe una parte significativa de la pantalla inicial (`min-h-screen/2` o similar) con una imagen de fondo más evocadora (relacionada con el festival o el artista).

- **Paso 1.2: Crear un Titular y Subtitular Atractivos.**
  - **Acción:** Usar un titular principal grande y claro, y un subtitular que lo complemente.
    - `<h1>`: **Carín León Cierra el FIG 2025**
    - `<p>` (subtítulo): Domingo 16 de Noviembre | Parque Metropolitano de León

- **Paso 1.3: Componente de "Información Clave".**
  - **Acción:** Justo debajo del titular, crear un componente visual (una fila o grid con 3-4 elementos) que resalte los datos más importantes con iconos.
    - **Icono de Calendario:** Domingo, 16 de Nov.
    - **Icono de Reloj:** Concierto: 20:30 Hrs (Proyección)
    - **Icono de Ubicación:** Parque Metropolitano
    - **Icono de Globo:** Noche Mágica + Despegue Matutino

- **Paso 1.4: Botones de Llamada a la Acción (CTA).**
  - **Acción:** Añadir dos botones claros.
    - **Botón Primario:** Un botón grande y llamativo (ej. `bg-blue-600`) con el texto **"Ver Boletos"**, que haga un scroll suave a la sección de `id="boletos"`.
    - **Botón Secundario:** Un botón con menos peso visual (ej. bordeado) con el texto **"Ver Programa Completo"**, que haga scroll a la sección `id="evento"`.

---

## Fase 2: Sintetizar Contenido y Mejorar la Jerarquía Visual

**Problema:** La página es una columna única y larga de texto, difícil de escanear y visualmente monótona.

**Solución:** Romper la monotonía con técnicas de diseño visual.

- **Paso 2.1: Layout Basado en Secciones.**
  - **Acción:** Separar visualmente cada sección principal (`<section>`) usando colores de fondo alternados (ej. `bg-white`, `bg-slate-50`). Esto crea bloques de contenido digeribles.

- **Paso 2.2: Introducir Iconografía.**
  - **Acción:** Añadir iconos SVG simples y limpios junto a los títulos de cada sección para dar pistas visuales sobre el contenido.
    - `<h2><IconoTicket /> Boletos y Precios</h2>`
    - `<h2><IconoMapa /> Logística y Transporte</h2>`
    - `<h2><IconoInfo /> Recomendaciones</h2>`

- **Paso 2.3: Usar Layouts de Tarjetas (Cards).**
  - **Acción:** Convertir listas y párrafos en tarjetas visuales.
    - **Sección de Boletos:** Presentar cada tipo de boleto (`Day Pass`, `Vespertino`, `Abono`) como una tarjeta individual en un grid. La tarjeta del **Day Pass** debe ser visualmente diferente (más grande, con un borde de color o una insignia de "Recomendado") para destacar su valor.
    - **Sección de Recomendaciones:** En lugar de una lista de `<ul>`, mostrar cada recomendación (`Vestimenta`, `Calzado`, `Planificación`) como una tarjeta pequeña con su propio icono.

- **Paso 2.4: Simplificar y Estilizar las Tablas.**
  - **Acción:** Hacer las tablas más escaneables.
    - **Resaltar Filas Clave:** En la tabla del programa, dar un color de fondo o un texto más grueso a las filas más importantes: **Despegue de Globos**, **Noche Mágica** y, sobre todo, **Concierto Estelar: CARÍN LEÓN**.

---

## Fase 3: Resaltar Información Crítica

**Problema:** Las advertencias son funcionales pero pueden perderse en la masa de texto.

**Solución:** Integrarlas de manera más estratégica y visualmente impactante.

- **Paso 3.1: Rediseñar Componente de Alerta.**
  - **Acción:** Mejorar el diseño del componente `Alert`. Usar iconos más grandes y colores estándar de UX (amarillo para advertencias, rojo para riesgos altos).

- **Paso 3.2: Reubicar Estratégicamente las Alertas.**
  - **Acción:** Mover cada alerta para que esté junto a la información más relevante.
    - La alerta de **"No Reembolso"** debe estar justo al lado o debajo de los precios de los boletos.
    - La alerta de **"Incertidumbre Horaria"** debe estar directamente al lado de la tabla del programa.
    - La alerta de **"Riesgo de Transporte"** debe ser el elemento más prominente en la sección de logística.

---

## Fase 4: Interactividad y Pulido Final

**Problema:** La página es mayormente estática.

**Solución:** Añadir interactividad para mejorar la navegación y la experiencia.

- **Paso 4.1: Implementar Navegación Fluida (Smooth Scrolling).**
  - **Acción:** Asegurarse de que todos los enlaces internos (los CTAs del hero y la futura barra de navegación) usen `scroll-behavior: smooth` (vía CSS) o una librería de JS para un desplazamiento suave.

- **Paso 4.2: (Recomendado) Añadir Barra de Navegación Fija (Sticky Navbar).**
  - **Acción:** Crear una barra de navegación simple que aparezca en la parte superior de la página después de que el usuario haga scroll más allá del Hero Section.
  - **Contenido del Navbar:** Enlaces a las secciones principales: `Evento`, `Boletos`, `Logística`, `FAQ`.
  - **Beneficio:** Facilita enormemente la navegación en una página larga sin necesidad de hacer scroll hacia arriba.

- **Paso 4.3: Revisión Tipográfica Final.**
  - **Acción:** Realizar una última revisión de todos los tamaños de fuente, grosores (`font-weight`) y alturas de línea (`line-height`) para garantizar una legibilidad perfecta en todos los dispositivos.
