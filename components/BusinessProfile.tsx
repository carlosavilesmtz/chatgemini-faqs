import React from 'react';

// --- Iconos SVG para usar en el componente ---

const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-amber-500" />
    <path d="M2 17L12 22L22 17L12 12L2 17Z" className="fill-amber-700" />
    <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
    <path d="M2 12V17" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
    <path d="M22 12V17" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
    <path d="M12 17V22" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
  </svg>
);

const ServiceIcon1 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ServiceIcon2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ServiceIcon3 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ProductPlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// --- Componente principal del Perfil de Negocio ---

const BusinessProfile: React.FC = () => {
  const services = [
    { icon: <ServiceIcon1 />, title: "Sistema ERP Personalizado", description: "Implementamos 'Optimizador Pro' para unificar y automatizar todos los procesos de tu empresa." },
    { icon: <ServiceIcon2 />, title: "Plataforma CRM a Medida", description: "Con 'Conecta CRM', gestiona y fortalece las relaciones con tus clientes de manera eficiente." },
    { icon: <ServiceIcon3 />, title: "Análisis de Datos Avanzado", description: "Utiliza 'Analítica Web' para obtener insights valiosos y tomar decisiones basadas en datos." },
  ];

  const products = [
    { name: "Optimizador Pro", description: "Solución integral para la planificación de recursos empresariales." },
    { name: "Conecta CRM", description: "Plataforma líder para la gestión de la relación con el cliente." },
    { name: "Analítica Web", description: "Herramienta potente para el seguimiento y análisis de métricas web." },
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <div className="container mx-auto px-6 py-12">
        
        {/* Encabezado */}
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <LogoIcon />
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Innovatech Solutions</h1>
          <p className="text-lg text-slate-400 mt-2 max-w-2xl mx-auto">Ayudamos a las empresas a optimizar sus procesos a través de la tecnología y la innovación.</p>
        </header>

        {/* Información de Contacto y CTA */}
        <div className="bg-slate-800/50 rounded-xl p-8 mb-16 flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-700">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">¿Listo para transformar tu negocio?</h2>
                <p className="text-slate-300">Contáctanos para una demostración personalizada.</p>
                <div className="mt-4 text-slate-400 space-y-1">
                    <p><strong>Email:</strong> contacto@innovatech.com</p>
                    <p><strong>Teléfono:</strong> +52 55 1234 5678</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                    Solicitar Cotización
                </button>
                <button className="bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors duration-200">
                    Contactar Ventas
                </button>
            </div>
        </div>

        {/* Sección de Servicios */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center hover:border-amber-500 hover:scale-105 transition-all duration-300">
                {service.icon}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Productos */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Nuestros Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col group">
                <div className="bg-slate-700 h-48 flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <ProductPlaceholderIcon />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-slate-400 flex-grow">{product.description}</p>
                   <a href="#" className="mt-4 self-start text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                    Ver más &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default BusinessProfile;