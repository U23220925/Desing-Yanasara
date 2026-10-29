# Desing-Yanasara

Actúa como desarrollador front-end senior y diseñador de interfaces. Construye el prototipo funcional de alta fidelidad de la web de YANASARA TERMALES (Baños Termales de Yanasara, Huamachuco, La Libertad, Perú): turismo de bienestar y reservas. Es un proyecto académico: todos los precios, fechas y datos son demostrativos y deben decirse "referenciales"; no hay pagos reales.

STACK
- HTML5 semántico + CSS3 (variables CSS) + JavaScript vanilla (módulos ES), sin frameworks ni librerías. Multipágina estática, publicable en GitHub Pages.
- Mobile-first y 100% responsive. Se evaluará con F12 (modo dispositivo) en 1440 px (PC), 768 px (Tablet) y 390 px (móvil). Breakpoints: móvil ≤ 767, tablet 768–1279, PC ≥ 1280.
- Estado compartido entre páginas con localStorage (carrito, datos de la reserva y reservas registradas). Un solo módulo store.js.
- Tipografías con Google Fonts: Montserrat 600 (títulos) e Inter 400/500/600 (texto e interfaz).
- Código comentado en español, sin errores en consola, sin dependencias externas salvo las fuentes.

DESIGN SYSTEM (definir en css/tokens.css como variables --nombre; ninguna pantalla puede usar valores sueltos)
Colores:
- --color-primary #245A43 (verde bosque: títulos, botones principales, footer)
- --color-secondary #167A59 (verde esmeralda: enlaces, íconos, estados confirmados)
- --color-accent #B96849 (terracota: precios y acentos) y --color-accent-strong #A25A3E (botones con texto blanco; contraste 5,1:1)
- --color-bg #F6F1E7 (crema, fondo), --color-surface #FFFEFA (blanco cálido: tarjetas y campos), --color-surface-alt #E9DDC9 (arena: avisos y secciones de contraste)
- --color-border #A8BCA4 (verde salvia), --color-text #2B2A26, --color-text-muted #746E63
- Estados: éxito #167A59 sobre #E8F3EC, error #B3382C sobre #FBE9E6, aviso #8A6B2F sobre #F5EBD3, info #245A43 sobre #E9DDC9.
- Contraste mínimo WCAG 2.1 AA (4,5:1 en texto normal). No usar grises azulados ni colores fuera de la paleta.
Tipografía (PC / Tablet / Móvil): h1 54/42/32 px, h2 42/36/28, h3 28/22/22, título de tarjeta 17–22, texto de lectura 17/16/16, interfaz 14, botones 14 SemiBold en mayúsculas con espaciado 0,8 px, etiquetas 11–12 px en mayúsculas con espaciado 1–2 px.
Espaciado (múltiplos de 4): 4, 8, 12, 16, 24, 32, 48, 64, 96. Radios: 8 (botones y campos), 16 (tarjetas), 999 (etiquetas). Sombras: sm, md, lg suaves en tono verde oscuro con baja opacidad.
Layout: contenedor máximo 1280 px; márgenes laterales 80/32/16 px; grilla de 12/8/4 columnas, separación 24 px.
Movimiento (tokens): --dur-fast 150ms, --dur-base 300ms, --dur-slow 500ms; --ease-out cubic-bezier(0,0,0.2,1), --ease-in-out cubic-bezier(0.4,0,0.2,1), --ease-spring cubic-bezier(0.34,1.56,0.64,1). Respetar prefers-reduced-motion (reducir o anular animaciones).

COMPONENTES (reutilizables, con todos sus estados; agrupados en el UI Kit)
- Botones: primario (terracota), secundario (verde bosque), contorno, texto; estados normal, hover, active (scale 0,98), focus-visible, disabled y loading. Altura 48 px.
- Formularios: campo de texto, select, checkbox con animación de check, radio, stepper de cantidad (− y +), selector de fecha (calendario propio), rango de precio con dos controles; estados normal, foco, error (borde y mensaje) y éxito.
- Navegación: encabezado con logo, enlaces (INICIO, SERVICIOS, TARIFAS, HISTORIA) con estado activo, ícono de carrito con contador (badge) y botón RESERVAR AHORA; menú hamburguesa móvil con panel deslizante; indicador de pasos (stepper) con línea conectora; migas "Volver"; footer completo.
- Tarjetas: servicio (foto, categoría, nombre, descripción, precio, VER DETALLES y AGREGAR A MI RESERVA con estado "Agregado"), plan de tarifa, valor, reserva (admin), resumen "Tu experiencia".
- Alertas: toast (éxito, error, aviso, info) con aria-live, aviso en línea, estado vacío, insignias de estado (Confirmada, Pendiente, Cancelada).

DATOS (data/services.js; única fuente de verdad)
Servicios: 1 Piscina olímpica · Termales · S/ 10 por persona; 2 Piscina para niños · Recreativo · S/ 7; 3 Pozas privadas · Termales · S/ 12; 4 Aguas temperadas termales · Termales · S/ 10; 5 Mirador · Naturaleza · S/ 2; 6 Área de juegos · Recreativo · S/ 5. Cada uno con id, categoría, instalación (privada/compartida/familiar), experiencia (relajación/familiar/paisaje), descripción corta y larga, horario, capacidad, recomendación, foto distinta y alt.
Planes de tarifas: Circuito termal S/ 15 por adulto (destacado); Pase Familiar Recreativo S/ 30 por familia (hasta 4 personas); Encuentro con el paisaje S/ 25 por adulto.
Redacción: sin términos médicos ni afirmaciones no verificables (nada de "terapéutico", "curativo" ni "alivia dolores"), ni mención a otros lugares turísticos.

PANTALLAS (cada una con su HTML, CSS y JS propios; el encabezado y el footer son componentes compartidos)
01 Inicio: hero con foto de pozas entre montañas y degradado oscuro, título "DESCUBRE LA RELAJACIÓN TOTAL", texto de apoyo y botones EXPLORAR SERVICIOS y RESERVAR AHORA; buscador de reservas flotante (fecha de visita, salida opcional, adultos, niños, VER DISPONIBILIDAD que lleva al paso 1 con esos datos); "VIVE YANASARA" (3 tarjetas); "NATURALEZA QUE INSPIRA" (galería asimétrica de 4 fotos con vista ampliada al hacer clic); presentación del lugar con 3 valores; footer.
02 Servicios: título, búsqueda en vivo y botón FILTRAR; panel de filtros (tipo de servicio, experiencias, instalaciones, precio mínimo y máximo) que filtra de verdad, con etiquetas de filtros activos, contador de resultados, APLICAR FILTROS y LIMPIAR; catálogo de 6 tarjetas (3×2 en PC, 2 columnas en tablet, 1 en móvil; en tablet y móvil los filtros son un panel plegable); ordenar por precio; estado vacío cuando no hay resultados; barra de resumen (cantidad, nombres, subtotal ilustrativo, CONTINUAR CON LA RESERVA, atenuado si no hay selección) que se actualiza en vivo.
03 Detalle del servicio (detalle.html?id=): página completa con foto amplia, nombre, categoría, descripción del MISMO servicio, tres datos (horario, capacidad, recomendación), precio referencial, AGREGAR A MI RESERVA y "Otros servicios" (tarjetas del mismo estilo). Si el id no existe, mostrar la página 404.
04 Tarifas: tres planes con lo que incluye y botón Reservar (precarga el plan en el paso 1); comparador sencillo y nota de precios demostrativos.
05 Historia: relato conceptual (sin fechas ni certificaciones inventadas), foto, tres valores, línea de tiempo opcional con animación al hacer scroll y botón hacia Servicios.
06 Mi reserva (carrito): lista de servicios agregados con foto, precio, quitar y deshacer; selector de adultos por reserva; subtotal y total referencial; estado vacío con botón hacia Servicios; botón CONTINUAR.
07 Reserva · Paso 1 Experiencia y fecha: tarjeta con la experiencia o plan elegido y "Cambiar", calendario de octubre de 2026 navegable con selección de día, selector de horario, adultos (1 a 6) y tarjeta "Tu experiencia" con total = adultos × tarifa recalculado en vivo.
08 Reserva · Paso 2 Datos del visitante: nombres, apellidos, tipo y número de documento, correo, celular, casilla de aceptación; validación en vivo (campo obligatorio, correo válido, documento de 8 dígitos para DNI, celular de 9 dígitos); el botón "Confirmar ejemplo" se habilita solo si todo es válido; botón Volver sin perder datos.
09 Reserva · Paso 3 Confirmación: check animado, código de ejemplo generado (YT-00xxx), datos tomados de lo ingresado, insignia "Confirmada · demo", botones "Volver a Inicio" y "Ver reserva en administración". La reserva se guarda y aparece en el panel de administración.
10 Administración · Acceso: formulario demostrativo (correo y contraseña de ejemplo), mensaje de error si no coinciden, aviso "no hay autenticación real".
11 Administración · Reservas: menú lateral (colapsable en móvil), 4 indicadores con conteo animado (reservas, confirmadas, visitantes, total referencial), filtros por texto, fecha y estado, tabla ordenable con insignias y acciones; en móvil la tabla se convierte en tarjetas. Incluye 6 reservas ficticias más las creadas en la web.
12 Administración · Detalle de reserva: datos del visitante, resumen de la experiencia, acciones demostrativas (Marcar como atendida, Cancelar reserva demo) que cambian el estado con toast de confirmación.
13 Design System / UI Kit (design-system.html): documentación viva con tokens (categoría, nombre, valor, descripción), componentes base, UI Kit agrupado en Botones, Formularios, Navegación, Tarjetas y Alertas con todos sus estados, patrones de interfaz, principios de uso, guías de interacción y consolidado de tokens.
14 Página 404 y página de error con botón de regreso.

INTERACCIONES Y ANIMACIONES (catálogo; cada una con ID, descripción, duración y curva; documentarlas en docs/interacciones.md)
Microinteracciones: hover y active de botones y enlaces; check del checkbox dibujado en 150 ms; tarjeta que se eleva 4 px al pasar el cursor; botón AGREGAR que pasa a "✓ AGREGADO" y el contador del carrito que "rebota" (ease-spring, 300 ms); toasts que entran y salen; stepper de cantidad con cambio de número animado; día del calendario que "salta" al seleccionarse; campo con error que vibra suavemente; conteo animado de indicadores.
Transiciones: entre páginas, fundido de 300 ms (ease-in-out); menú móvil que se desliza en 300 ms (ease-out); filtros plegables en 300 ms; revelado al hacer scroll (IntersectionObserver, 500 ms ease-out, escalonado de 80 ms); paso a paso de la reserva con deslizamiento lateral; barra de progreso del stepper que se llena en 500 ms.
Estados: normal, hover, foco, activo, deshabilitado, cargando, error, éxito y vacío en cada componente.

USABILIDAD
- Cada pantalla tiene un único llamado a la acción principal claramente visible; el usuario siempre sabe en qué paso está y puede volver sin perder datos.
- Retroalimentación inmediata (toasts, estados, mensajes junto al campo); confirmación antes de acciones destructivas; deshacer al quitar un servicio.
- Teclado completo (Tab, Enter, Esc), foco visible, etiquetas asociadas a campos, alt en imágenes, roles ARIA en menús, calendario y toasts, áreas táctiles de 44–48 px.
- Página de Encuesta SUS (sus.html): las 10 preguntas estándar en escala 1 a 5, cálculo automático del puntaje (0–100) con su interpretación, y modo prueba opcional (?test=1) con lista de tareas, cronómetro por tarea, conteo de clics y exportación de resultados en CSV.

ESTRUCTURA DE ARCHIVOS
/index.html, /servicios.html, /detalle.html, /tarifas.html, /historia.html, /carrito.html, /reserva-1.html, /reserva-2.html, /reserva-3.html, /admin/acceso.html, /admin/reservas.html, /admin/detalle.html, /design-system.html, /sus.html, /404.html
/css/tokens.css, base.css, components.css, /css/pages/*.css
/js/store.js, ui.js (toasts, menú, reveal), /js/components/ (header, footer, tarjetas), /js/pages/*.js
/data/services.js, /assets/img/, /docs/interacciones.md y README.md

CRITERIOS DE CALIDAD
Cero valores de color, tamaño o tiempo fuera de los tokens; Lighthouse de accesibilidad ≥ 90; sin errores en consola; imágenes con lazy loading y proporción fija (sin saltos de diseño); navegación y botones 100% funcionales; consistencia visual idéntica en las 3 vistas.

ENTREGA
Entrega código completo y listo para copiar, archivo por archivo, indicando la ruta de cada uno. Responde solo con lo que pido en cada mensaje (una ronda o una pantalla) y respeta los archivos compartidos ya creados.
