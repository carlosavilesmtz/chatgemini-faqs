# Development Plan: FIG 2025 Carín León Landing Page

## 🎯 Objective
Transform the existing `BusinessProfile.tsx` component into a comprehensive, single-page landing page for the Carín León concert event at the Festival Internacional del Globo (FIG) 2025. This plan will use the provided strategic report as the blueprint for all content and structure.

---

## Phase 1: Component Scaffolding & Content Integration

### Step 1.1: Prepare `BusinessProfile.tsx`
- **Action:** Clear all existing JSX and logic from `C:/Users/CARLOSAVILESMX/chatgemini-faqs/components/BusinessProfile.tsx`.
- **Goal:** Create a clean slate to build the new landing page.

### Step 1.2: Structure the Landing Page Content
- **Action:** Create a new JSX structure within `BusinessProfile.tsx` using semantic HTML tags. The structure will mirror the provided report.
- **JSX Outline:**
  ```jsx
  <div className="bg-slate-100 text-gray-800 font-sans p-4 sm:p-6 md:p-8">
    <header>
      {/* Title and introduction */}
    </header>
    <main>
      {/* Section I: EL EVENTO CENTRAL */}
      <section id="evento">
        {/* I.A. Contexto General */}
        {/* I.B. Programa Proyectado */}
        {/* I.C. Tabla I: Programa Proyectado */}
      </section>

      {/* Section II: ESTRUCTURA COMERCIAL */}
      <section id="boletos">
        {/* II.A. Tipos de Boleto */}
        {/* II.B. La Experiencia VIP */}
        {/* II.C. Políticas de Venta */}
      </section>

      {/* Section III: LOGÍSTICA DE VISITANTES */}
      <section id="logistica">
        {/* III.A. Rutas de Acceso */}
        {/* III.B. Estacionamiento y Transporte */}
        {/* III.C. Tabla III: Normativa de Seguridad */}
      </section>

      {/* Section IV: EXPERIENCIA DEL ASISTENTE */}
      <section id="recomendaciones">
        {/* IV.A. Consejos Prácticos */}
        {/* IV.B. Protocolos de Contingencia */}
      </section>

      {/* Section V: BLUEPRINT DE CONTENIDO (FAQ) */}
      <section id="faq">
        {/* V.B. Elaboración de la Sección FAQ */}
      </section>
    </main>
    <footer>
      {/* Conclusiones y Recomendaciones Estratégicas */}
    </footer>
  </div>
  ```

### Step 1.3: Integrate Text and Data
- **Action:** Populate the JSX structure with the text content from the strategic report.
- **Details:**
    - Convert report headings into `<h2>`, `<h3>` tags.
    - Convert paragraphs into `<p>` tags.
    - Use `<strong>` or `<b>` for bolded text.
    - Convert the tables ("Programa Proyectado", "Normativa Esencial") into structured HTML `<table>` elements with `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` tags.

---

## Phase 2: Styling and UI/UX Enhancements

### Step 2.1: Apply Base Styling with Tailwind CSS
- **Action:** Use Tailwind CSS utility classes to style the entire page for readability and visual appeal.
- **Styling Goals:**
    - **Typography:** Establish a clear visual hierarchy for headings and body text (e.g., `text-3xl`, `text-xl`, `text-base`).
    - **Layout:** Use Flexbox and Grid to create a clean, organized layout for each section.
    - **Color Palette:** Use a professional color scheme. We can start with neutral grays and add accent colors for buttons and warnings.
    - **Spacing:** Ensure generous use of `margin` and `padding` for a clean, uncluttered look.

### Step 2.2: Create Custom Visual Components
- **Action:** Design and style key informational elements to make them stand out.
- **Component Ideas:**
    - **Ticket Tiers (`II.A`):** Display `Day Pass`, `Acceso Vespertino`, and `Abono FIG` in a card-based layout to make comparison easy. Highlight the `Day Pass` as the "best value" option as suggested in the report.
    - **Critical Warnings:** Use visually distinct "alert" or "banner" components with a unique background color (e.g., light yellow or red) and an icon for:
        - "Programa sujeto a cambios"
        - "Política de No Reembolso"
        - "Alerta de Tráfico de Salida" (re: shuttle service ending)
    - **Tables (`I.C`, `III.C`):** Style the HTML tables to be clean, readable, and responsive. Add borders, alternating row colors (`bg-gray-50`), and proper text alignment.

### Step 2.3: Implement Interactive FAQ
- **Action:** Develop the FAQ section (`V.B`) as an interactive accordion.
- **Implementation:**
    - Each question will be a clickable header.
    - Clicking the header will toggle the visibility of the answer below it.
    - This will require managing a state in React (e.g., `useState` to track the currently open FAQ item).

---

## Phase 3: Final Touches & Deployment

### Step 3.1: Add Visual Placeholders
- **Action:** Insert placeholder images to enhance visual engagement.
- **Suggestions:**
    - A main hero image at the top (placeholder for Carín León or the festival).
    - Smaller images within relevant sections (e.g., hot air balloons, map of the park).
    - We can use a service like `https://via.placeholder.com/` for this.

### Step 3.2: Review and Refine
- **Action:** Conduct a full review of the implemented page.
- **Checklist:**
    - **Content Accuracy:** All text and data matches the strategic report.
    - **Styling Consistency:** The design is cohesive and professional.
    - **Responsiveness:** The layout is fully functional and looks great on mobile, tablet, and desktop screen sizes.
    - **Interactivity:** The FAQ accordion works as expected.

### Step 3.3: Integration Check
- **Action:** Ensure the modified `BusinessProfile.tsx` component integrates smoothly back into the main `App.tsx` layout.
- **Goal:** The new landing page should be displayed correctly within the application's overall structure, replacing the old profile component.
