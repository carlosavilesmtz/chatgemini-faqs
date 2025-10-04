import React, { useState } from 'react';

// --- Helper Components ---

const Alert = ({ title, children }) => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg my-4" role="alert">
        <p className="font-bold">{title}</p>
        <p>{children}</p>
    </div>
);

const FaqItem = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left flex justify-between items-center py-4 font-semibold text-lg"
            >
                <span>{question}</span>
                <span>{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && <div className="pb-4 text-gray-600">{children}</div>}
        </div>
    );
};


const BusinessProfile: React.FC = () => {
    return (
        <div className="bg-slate-100 text-gray-800 font-sans">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">

                <header className="text-center mb-12">
                    <img src="https://via.placeholder.com/1200x400.png?text=Festival+Internacional+del+Globo+2025" alt="Carin Leon Concert" className="w-full h-auto object-cover rounded-lg shadow-lg mb-6"/>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Carín León en el Festival Internacional del Globo (FIG) 2025</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
                        Este es un blueprint de desarrollo para un sitio web de alta especificación, enfocado en la jornada del domingo 16 de noviembre de 2025, y el concierto estelar de Carín León.
                    </p>
                </header>

                <main className="space-y-16">
                    
                    {/* Section I: EL EVENTO CENTRAL */}
                    <section id="evento">
                        <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">I. El Evento Central: Domingo 16 de Noviembre</h2>
                        
                        <div className="space-y-4 text-gray-700">
                            <p>La jornada de clausura del FIG 2025 representa el pico de afluencia del festival, combinando el espectáculo aerostático matutino con el cierre musical de talla internacional a cargo de Carín León, uno de los artistas más esperados.</p>
                            <h3 className="text-2xl font-semibold pt-4">I.A. Contexto General del Festival y Localización</h3>
                            <p>El Festival Internacional del Globo 2025 se llevará a cabo del viernes 14 al lunes 17 de noviembre en el <strong>Parque Metropolitano de León, Guanajuato</strong>. El horario del parque es de <strong>05:00 Hrs a 22:30 Hrs</strong>.</p>
                            <p>El evento del domingo 16 de noviembre está anclado por la actuación de Carín León, siguiendo a Gloria Trevi el viernes 14 y Martin Garrix el sábado 15.</p>
                            
                            <h3 className="text-2xl font-semibold pt-4">I.B. Programa Proyectado y la Brecha Crítica de Horarios</h3>
                            <p>El inflado de los globos comienza alrededor de las 06:30 Hrs, con el despegue proyectado a las 08:00 Hrs. La Noche Mágica se proyecta a las 19:00 Hrs, seguida por el concierto de Carín León en el Main Stage.</p>
                            
                            <Alert title="Gestión de la Incertidumbre Horaria">
                                La hora exacta de inicio del concierto de Carín León no ha sido publicada. Basado en eventos similares, la proyección más lógica sitúa el inicio entre las <strong>20:30 Hrs y las 21:00 Hrs</strong>. Esta información es una proyección y está <strong>sujeta a cambios</strong>.
                            </Alert>

                            <h3 className="text-2xl font-semibold pt-4">I.C. Tabla I: Programa Proyectado del Domingo 16 de Noviembre</h3>
                            <div className="overflow-x-auto shadow-md rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Actividad</th>
                                            <th scope="col" className="px-6 py-3">Horario</th>
                                            <th scope="col" className="px-6 py-3">Detalles Clave</th>
                                            <th scope="col" className="px-6 py-3">Ubicación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b"><td className="px-6 py-4">Apertura del Parque / Ingreso Day Pass</td><td className="px-6 py-4">05:00 Hrs</td><td className="px-6 py-4">Acceso a todas las actividades.</td><td className="px-6 py-4">Todos los accesos</td></tr>
                                        <tr className="bg-gray-50 border-b"><td className="px-6 py-4">Inflado de Globos</td><td className="px-6 py-4">06:30 Hrs</td><td className="px-6 py-4">Sujeto a clima.</td><td className="px-6 py-4">Aeródromo FIG</td></tr>
                                        <tr className="bg-white border-b"><td className="px-6 py-4">Despegue de Globos</td><td className="px-6 py-4">08:00 Hrs (Proyección)</td><td className="px-6 py-4">Más de 200 aeronaves.</td><td className="px-6 py-4">Aeródromo FIG</td></tr>
                                        <tr className="bg-gray-50 border-b"><td className="px-6 py-4">Ingreso Acceso Vespertino</td><td className="px-6 py-4">13:00 Hrs</td><td className="px-6 py-4">Para eventos estelares.</td><td className="px-6 py-4">Todos los accesos</td></tr>
                                        <tr className="bg-white border-b"><td className="px-6 py-4">Ingreso Acceso VIP Carín León</td><td className="px-6 py-4">16:00 Hrs</td><td className="px-6 py-4">Acceso a zona preferencial.</td><td className="px-6 py-4">Zona VIP / Main Stage</td></tr>
                                        <tr className="bg-gray-50 border-b"><td className="px-6 py-4">Noche Mágica FIG</td><td className="px-6 py-4">19:00 Hrs (Proyección)</td><td className="px-6 py-4">Espectáculo de luz y música.</td><td className="px-6 py-4">Aeródromo FIG</td></tr>
                                        <tr className="bg-white border-b"><td className="px-6 py-4 font-bold">Concierto Estelar: CARÍN LEÓN</td><td className="px-6 py-4 font-bold">20:30 Hrs (Proyección)</td><td className="px-6 py-4">Evento principal de la noche.</td><td className="px-6 py-4">Main Stage</td></tr>
                                        <tr className="bg-gray-50 border-b"><td className="px-6 py-4">Cierre de Actividades</td><td className="px-6 py-4">21:00 Hrs</td><td className="px-6 py-4">Límite de salida para Day Pass/Vespertino.</td><td className="px-6 py-4">Parque Metropolitano</td></tr>
                                        <tr className="bg-white"><td className="px-6 py-4">Cierre Total del Parque</td><td className="px-6 py-4">22:30 Hrs</td><td className="px-6 py-4">Hora final de permanencia.</td><td className="px-6 py-4">Parque Metropolitano</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section II: ESTRUCTURA COMERCIAL */}
                    <section id="boletos">
                        <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">II. Estructura Comercial y Boletos</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="border p-6 rounded-lg shadow-lg bg-white">
                                <h3 className="text-xl font-bold">Day Pass</h3>
                                <p className="text-3xl font-bold my-4">$750.00 <span className="text-sm font-normal">MXN</span></p>
                                <p className="text-gray-600">Acceso de 05:00 a 21:00 Hrs. Incluye TODAS las actividades.</p>
                                <p className="mt-4 font-semibold text-green-600">¡La mejor opción para la experiencia completa!</p>
                            </div>
                            <div className="border p-6 rounded-lg shadow-lg bg-white">
                                <h3 className="text-xl font-bold">Acceso Vespertino</h3>
                                <p className="text-3xl font-bold my-4">$635.00 <span className="text-sm font-normal">MXN</span></p>
                                <p className="text-gray-600">Acceso de 13:00 a 21:00 Hrs. Enfocado en Noche Mágica y Concierto.</p>
                            </div>
                            <div className="border p-6 rounded-lg shadow-lg bg-white">
                                <h3 className="text-xl font-bold">Abono FIG</h3>
                                <p className="text-3xl font-bold my-4">$2,200.00 <span className="text-sm font-normal">MXN</span></p>
                                <p className="text-gray-600">Acceso a los 4 días del festival (14-17 Nov).</p>
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <h3 className="text-2xl font-semibold pt-4">II.B. La Experiencia VIP Exclusiva para Carín León</h3>
                            <p>Se ofrece una Zona VIP con boleto especial que incluye acceso general y una zona preferente con amenidades, baños y puntos de venta exclusivos. El acceso a la Zona VIP inicia a las <strong>16:00 Hrs</strong> para gestionar el flujo de manera escalonada y garantizar una experiencia premium.</p>
                            
                            <Alert title="Política de Venta y Contingencia Climática">
                                <strong>No hay reembolso, cambio o reposición</strong> en caso de que el clima impida la realización de actividades. La compra del boleto es por el acceso al festival, no por un acto específico.
                            </Alert>
                        </div>
                    </section>

                    {/* Section III: LOGÍSTICA DE VISITANTES */}
                    <section id="logistica">
                        <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">III. Logística de Visitantes</h2>
                        <div className="space-y-4">
                            <p>Se recomienda utilizar los tres accesos principales: <strong>Acceso Principal Parque, Acceso Amazonas y Acceso Balcones</strong>.</p>
                            <h3 className="text-2xl font-semibold pt-4">III.B. Estacionamiento y Transporte</h3>
                            <p>Hay estacionamientos remotos con servicio de shuttle. Costo: $11 MXN general, $6 MXN infantes.</p>
                            <Alert title="⚠️ Riesgo de Transporte de Cierre">
                                El servicio de shuttle desde estacionamientos remotos opera solo hasta las <strong>22:00 Hrs</strong>, mientras que el parque cierra a las <strong>22:30 Hrs</strong>. Planifique su salida con antelación para evitar el colapso logístico y tarifas de taxi/plataformas muy elevadas.
                            </Alert>
                            <h3 className="text-2xl font-semibold pt-4">III.C. Normativa de Seguridad</h3>
                             <div className="overflow-x-auto shadow-md rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Categoría</th>
                                            <th scope="col" className="px-6 py-3">Ítem Estrictamente Prohibido</th>
                                            <th scope="col" className="px-6 py-3">Justificación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b"><td className="px-6 py-4">Controles Legales</td><td className="px-6 py-4">Armas, Sustancias Ilícitas, Bebidas Alcohólicas</td><td className="px-6 py-4">Seguridad pública.</td></tr>
                                        <tr className="bg-gray-50 border-b"><td className="px-6 py-4">Seguridad Física</td><td className="px-6 py-4">Botellas de Vidrio, Objetos Punzocortantes</td><td className="px-6 py-4">Prevención de lesiones.</td></tr>
                                        <tr className="bg-white border-b"><td className="px-6 py-4">Seguridad Aérea</td><td className="px-6 py-4">Drones</td><td className="px-6 py-4">Riesgo de colisión con aeronaves.</td></tr>
                                        <tr className="bg-gray-50"><td className="px-6 py-4">Operacional</td><td className="px-6 py-4">Fumar en Zona de Despegue</td><td className="px-6 py-4">Riesgo de incendio.</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section IV: EXPERIENCIA DEL ASISTENTE */}
                    <section id="recomendaciones">
                        <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">IV. Experiencia del Asistente</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Vestimenta y Clima:</strong> Vestir en capas. El clima es variable (frío en la madrugada, calor de día, frío de noche).</li>
                            <li><strong>Calzado:</strong> Usar calzado cómodo es obligatorio debido a las largas caminatas.</li>
                            <li><strong>Planificación:</strong> Establecer un punto de encuentro fijo con familiares y amigos.</li>
                            <li><strong>Seguridad:</strong> Localizar los servicios de emergencia al llegar.</li>
                            <li><strong>Medio Ambiente:</strong> Ayudar a mantener limpio el parque y llevar bolsas para la basura propia.</li>
                        </ul>
                    </section>

                    {/* Section V: FAQ */}
                    <section id="faq">
                        <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">V. Preguntas Frecuentes (FAQ)</h2>
                        <div className="space-y-2">
                            <FaqItem question="¿Se requiere un boleto especial para el concierto de Carín León?">
                                <p>No. El concierto está incluido en la entrada del domingo 16 de noviembre (Day Pass o Acceso Vespertino).</p>
                            </FaqItem>
                            <FaqItem question="¿A qué hora comienza el concierto estelar?">
                                <p>La hora exacta está pendiente de confirmación. Se proyecta que inicie entre las <strong>20:30 Hrs y 21:00 Hrs</strong>. Consulta el programa oficial en tiempo real.</p>
                            </FaqItem>
                            <FaqItem question="Si el clima cancela el evento, ¿hay reembolso?">
                                <p><strong>No.</strong> El boleto es para el acceso al festival y no es reembolsable si las actividades se cancelan por mal tiempo.</p>
                            </FaqItem>
                            <FaqItem question="¿Hasta qué hora hay transporte al estacionamiento remoto?">
                                <p>El servicio de shuttle opera solo hasta las <strong>22:00 Hrs</strong>. Si planeas quedarte hasta el cierre del parque (22:30 Hrs), debes prever transporte privado.</p>
                            </FaqItem>
                            <FaqItem question="¿Puedo ingresar con mi dron o bebidas alcohólicas?">
                                <p>No. Los drones, bebidas alcohólicas, botellas de vidrio y armas están estrictamente prohibidos.</p>
                            </FaqItem>
                        </div>
                    </section>
                </main>

                <footer className="text-center mt-16 pt-8 border-t">
                    <p className="text-sm text-gray-500">Este contenido es un blueprint de desarrollo y se basa en la información y proyecciones disponibles. La información oficial del evento prevalecerá.</p>
                </footer>

            </div>
        </div>
    );
};

export default BusinessProfile;
