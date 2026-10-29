# YANASARA TERMALES · Prototipo web (Avance 3)

Sitio estático (HTML + CSS + JavaScript sin librerías) del proyecto académico de turismo de bienestar en Huamachuco.
**Todos los precios, fechas y datos son demostrativos.** No hay pagos reales.

## Cómo probarlo en tu computadora
Los módulos de JavaScript necesitan un servidor local (no abrir el HTML con doble clic):
- VS Code: instalar **Live Server** → clic derecho en `_prueba-base.html` → *Open with Live Server*, o
- Terminal: `python -m http.server 8000` y abrir `http://localhost:8000/_prueba-base.html`

`_prueba-base.html` muestra todos los componentes y comprueba que la base funciona.

## Estructura
```
/css   tokens.css (variables) · base.css (reset y layout) · components.css (UI Kit) · pages/ (un css por pantalla)
/js    main.js (arranque) · store.js (estado) · ui.js (utilidades) · paths.js · components/ (header, footer, cards) · pages/ (un js por pantalla)
/data  services.js (servicios, planes, filtros) · reservations.js (reservas ficticias)
/assets/img  fotos (ver README de la carpeta)
/admin       páginas del panel de administración
/docs        interacciones.md (catálogo de animaciones)
```

## Cómo crear una pantalla (3 pasos)
1. Copia `_plantilla.html` con el nombre de la pantalla y pon el `data-page` correcto.
2. Crea `css/pages/NOMBRE.css` y `js/pages/NOMBRE.js`. El JS empieza siempre con `import '../main.js';`
3. Usa **solo** variables de `tokens.css` (nada de colores, tamaños o tiempos sueltos) y las clases de `components.css`.

Las páginas dentro de `/admin` usan `<html data-root="../">` y rutas `../css`, `../js`.

## Qué ya está resuelto (no lo repitas)
| Necesitas | Usa |
|---|---|
| Encabezado y footer | `main.js` los monta solos (`#site-header`, `#site-footer`) |
| Botones | `.btn` + `.btn--primary / --secondary / --outline / --light / --text` (`.is-loading`, `disabled`) |
| Campos y validación | `.field`, `.input`, `.select`, `.check`, `.radio`, `setFieldError()`, `setFieldValid()` |
| Cantidad y rango de precio | `initQty()`, `initRange()` |
| Indicador de pasos de reserva | `.steps` (`is-done`, `is-current`) |
| Tarjeta de servicio con "Agregar" | `serviceCard(s)` + `bindServiceCards()` (una vez por página) |
| Avisos | `toast({ type, title, message })`, `.alert`, `.badge`, `emptyState()` |
| Revelado al hacer scroll | clase `.reveal` + `initReveal()` |
| Datos | `data/services.js` (`SERVICES`, `PLANS`, `getService`, `formatPrice`) |
| Carrito y reserva | `store.js` (`toggleCart`, `getLines`, `bookingTotal`, `updateBooking`, `createReservation`) |
| Sesión de administración | `store.js` (`loginAdmin`, `isAdmin`) · demo: `admin@yanasara.example` / `Demo2026` |
| Volver a cero entre pruebas | `resetDemo()` en `store.js` |

## Reglas del equipo
- No se edita directo en `main` ni en `develop`: cada tarea va en su rama `feature/...` y entra por Pull Request.
- Cada persona toca **solo sus archivos** (`NOMBRE.html`, `css/pages/NOMBRE.css`, `js/pages/NOMBRE.js`).
- Los archivos compartidos (`tokens.css`, `base.css`, `components.css`, `store.js`, `ui.js`, `data/*`, `js/components/*`) solo se cambian avisando y con un Pull Request pequeño.
- Si falta un componente, se agrega a `components.css` con todos sus estados y se documenta aquí.
- Responsive: probar siempre en 1440, 768 y 390 px (F12 → modo dispositivo). Menú hamburguesa por debajo de 900 px.
- Textos: sin términos médicos ni afirmaciones no verificables; precios siempre "referenciales".
