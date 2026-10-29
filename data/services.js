/* =====================================================================
   DATOS · única fuente de verdad (servicios, planes y filtros)
   Todos los precios son DEMOSTRATIVOS y deben mostrarse como "referenciales".
   ===================================================================== */
export const CATEGORIES = [
  { id: 'termales', label: 'Termales' },
  { id: 'recreativo', label: 'Recreativo' },
  { id: 'naturaleza', label: 'Naturaleza' },
];
export const EXPERIENCES = [
  { id: 'relajacion', label: 'Relajación' },
  { id: 'familiar', label: 'Familiar' },
  { id: 'paisaje', label: 'Paisaje' },
];
export const FACILITIES = [
  { id: 'privada', label: 'Privadas' },
  { id: 'compartida', label: 'Compartidas' },
  { id: 'familiar', label: 'Familiares' },
];
export const PRICE_RANGE = { min: 0, max: 30 };
export const TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

export const SERVICES = [
  { id: 'piscina-olimpica', nombre: 'Piscina olímpica', categoria: 'termales', experiencia: 'relajacion', instalacion: 'compartida',
    precio: 10, unidad: 'por persona',
    resumen: 'Piscina amplia de agua templada para nadar, entrenar o simplemente flotar un rato.',
    descripcion: 'Una piscina de gran tamaño con agua templada, pensada para quienes quieren nadar con calma o combinar el baño con un descanso al aire libre. Alrededor hay zonas de reposo con vista a las montañas.',
    horario: '9:00 a 18:00 h', capacidad: 'Aforo compartido', recomendacion: 'Traje de baño, gorro y toalla',
    imagen: 'assets/img/Olimpica.jpeg', alt: 'Piscina amplia con agua templada rodeada de montañas' },
  { id: 'piscina-ninos', nombre: 'Piscina para niños', categoria: 'recreativo', experiencia: 'familiar', instalacion: 'familiar',
    precio: 7, unidad: 'por persona',
    resumen: 'Zona de baja profundidad con agua templada y entorno seguro para los más pequeños.',
    descripcion: 'Un espacio de poca profundidad para que los niños jueguen y se refresquen bajo la mirada de sus familias, con sombra cercana y bancas para los adultos.',
    horario: '9:00 a 18:00 h', capacidad: 'Menores acompañados por un adulto', recomendacion: 'Traje de baño, toalla y ropa de cambio',
    imagen: 'assets/img/child.jpeg', alt: 'Piscina de poca profundidad para niños' },
  { id: 'pozas-privadas', nombre: 'Pozas privadas', categoria: 'termales', experiencia: 'relajacion', instalacion: 'privada',
    precio: 12, unidad: 'por persona',
    resumen: 'Espacios termales reservados para parejas o familias, con vegetación andina alrededor.',
    descripcion: 'Pozas de piedra reservadas para un solo grupo, rodeadas de vegetación andina. Un lugar para desconectar, conversar y disfrutar del paisaje a tu ritmo.',
    horario: '9:00 a 18:00 h', capacidad: 'Hasta 4 personas', recomendacion: 'Traje de baño, toalla y sandalias',
    imagen: 'assets/img/Poza.jpeg', alt: 'Poza de piedra privada entre vegetación andina' },
  { id: 'aguas-temperadas', nombre: 'Aguas temperadas termales', categoria: 'termales', experiencia: 'relajacion', instalacion: 'compartida',
    precio: 10, unidad: 'por persona',
    resumen: 'Pozas de piedra con agua temperada para desconectar y conversar sin prisa.',
    descripcion: 'Pozas rústicas de piedra con agua temperada, integradas al paisaje. Son el corazón del circuito termal y se comparten con otros visitantes.',
    horario: '9:00 a 18:00 h', alt: 'Poza de piedra con agua temperada', 
    imagen: 'assets/img/Templada.png', alt: 'Poza de piedra con agua temperada' },
  { id: 'mirador', nombre: 'Mirador', categoria: 'naturaleza', experiencia: 'paisaje', instalacion: 'compartida',
    precio: 2, unidad: 'por persona',
    resumen: 'Punto elevado con vista abierta al valle y a las montañas de Yanasara.',
    descripcion: 'Un sendero corto conduce a un punto elevado con vista abierta al valle. Es ideal para caminar con calma y detenerse a mirar el paisaje.',
    horario: '9:00 a 18:00 h', capacidad: 'Acceso libre', recomendacion: 'Calzado cómodo y protector solar',
    imagen: 'assets/img/mirador.png', alt: 'Sendero que lleva a un mirador sobre el valle' }, // Imagen 2 (Tierra)
  { id: 'area-juegos', nombre: 'Área de juegos', categoria: 'recreativo', experiencia: 'familiar', instalacion: 'familiar',
    precio: 5, unidad: 'por persona',
    resumen: 'Zona verde con áreas de descanso, juegos infantiles y canchas para fútbol y vóley.',
    descripcion: 'Una zona verde y abierta con juegos infantiles, canchas para fútbol y vóley, y áreas de descanso para compartir en familia.',
    horario: '9:00 a 18:00 h', capacidad: 'Uso compartido', recomendacion: 'Ropa cómoda y protector solar',
    imagen: 'assets/img/Area.jpeg', alt: 'Zona verde con juegos y canchas vista desde el mirador superior' }, // Imagen Nueva (Mirador)
];


export const PLANS = [
  { id: 'circuito-termal', nombre: 'Circuito termal', etiqueta: 'Experiencia esencial', precio: 15, unidad: 'por adulto', destacado: true,
    incluye: ['Aguas temperadas termales', 'Piscina olímpica', 'Mirador'] },
  { id: 'pase-familiar', nombre: 'Pase Familiar Recreativo', etiqueta: 'Familias y grupos', precio: 30, unidad: 'por familia', nota: 'Hasta 4 personas',
    incluye: ['Piscina para niños y piscina olímpica', 'Aguas temperadas termales', 'Área de juegos y acceso al mirador'] },
  { id: 'encuentro-paisaje', nombre: 'Encuentro con el paisaje', etiqueta: 'Privacidad y calma', precio: 25, unidad: 'por adulto',
    incluye: ['Pozas privadas', 'Acceso al mirador', 'Uso prioritario de vestuarios y áreas de descanso'] },
];

/* ---------- Ayudas ---------- */
export const getService = (id) => SERVICES.find((s) => s.id === id) || null;
export const getPlan = (id) => PLANS.find((p) => p.id === id) || null;
export const categoryLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || id;
export const formatPrice = (n) => 'S/ ' + (Number.isInteger(n) ? n : n.toFixed(2));
