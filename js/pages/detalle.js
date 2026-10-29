/* =====================================================================
   PÁGINA · 03 DETALLE DEL SERVICIO
   Carga del servicio por ?id=, tres datos clave, botón Agregar y otros servicios.
   Si el servicio no existe, redirige a 404.html.
   ===================================================================== */
import '../main.js';
import { SERVICES, getService, formatPrice, categoryLabel } from '../../data/services.js';
import { isInCart, toggleCart, subscribe } from '../store.js';
import { serviceCard, bindServiceCards } from '../components/cards.js';
import { qs, initReveal, toast, escapeHTML as esc } from '../ui.js';

const params = new URLSearchParams(window.location.search);
const serviceId = params.get('id') || '';
const service = getService(serviceId);

const container = qs('#service-detail-container');
const otrosGrid = qs('#otros-servicios-grid');

// Si el id no existe en los datos, muestra o redirige a la página 404 (README)
if (!service) {
  window.location.replace('404.html');
} else {
  renderServiceDetail(service);
  renderOtrosServicios(service.id);
  bindServiceCards();
  initReveal();
}

function renderServiceDetail(s) {
  const added = isInCart(s.id);
  document.title = `${s.nombre} · YANASARA TERMALES`;

  container.innerHTML = `
    <!-- Hero / Breadcrumb -->
    <header class="detalle-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Miga de pan">
          <a class="back-link" href="servicios.html">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13 5 8l5-5"/></svg>
            Volver a Servicios
          </a>
        </nav>
        <p class="detalle-cat">${esc(categoryLabel(s.categoria))}</p>
        <h1 class="detalle-title">${esc(s.nombre)}</h1>
      </div>
    </header>

    <!-- Sección principal del detalle -->
    <section class="section section--tight detalle-main-section">
      <div class="container detalle-grid">
        <!-- Columna izquierda: Foto amplia, descripción y 3 datos -->
        <div class="detalle-info-column reveal">
          <!-- Foto amplia -->
          <div class="detalle-media${added ? ' is-added' : ''}" id="detalle-media-box">
            <img src="${esc(s.imagen)}" alt="${esc(s.alt)}" loading="eager" width="960" height="600" onerror="this.parentElement.classList.add('is-missing')">
            <span class="detalle-tag-added" aria-hidden="true">✓ AGREGADO A TU RESERVA</span>
          </div>

          <!-- Descripción del mismo servicio -->
          <h2 style="font-size: var(--fs-h3); margin-bottom: var(--sp-3);">Sobre esta experiencia</h2>
          <p class="detalle-desc">${esc(s.descripcion)}</p>

          <!-- Tres datos clave: Horario, Capacidad y Recomendación -->
          <h3 style="font-size: var(--fs-card); margin-bottom: var(--sp-3);">Información clave de visita</h3>
          <div class="detalle-facts-grid">
            <div class="detalle-fact-card">
              <span class="detalle-fact-label">Horario</span>
              <span class="detalle-fact-val">${esc(s.horario)}</span>
            </div>
            <div class="detalle-fact-card">
              <span class="detalle-fact-label">Capacidad</span>
              <span class="detalle-fact-val">${esc(s.capacidad)}</span>
            </div>
            <div class="detalle-fact-card">
              <span class="detalle-fact-label">Recomendación</span>
              <span class="detalle-fact-val">${esc(s.recomendacion)}</span>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Tarjeta flotante de reserva -->
        <aside class="detalle-card-booking reveal">
          <p class="eyebrow" style="margin-bottom: var(--sp-2);">Tarifa Individual</p>
          <div class="price detalle-card-booking__price">
            <span class="price__value" style="font-size: 38px;">${formatPrice(s.precio)}</span>
            <span class="price__label">Precio referencial · ${esc(s.unidad)}</span>
          </div>

          <p class="small muted" style="margin-bottom: var(--sp-4);">
            Demostración académica. Agrega este servicio a tu selección para simular tu reserva personalizada.
          </p>

          <div class="detalle-card-booking__actions">
            <button type="button" class="btn btn--primary btn--block${added ? ' is-added' : ''}" id="btn-detalle-add" data-add="${s.id}">
              ${added ? '✓ Agregado a mi reserva' : 'Agregar a mi reserva'}
            </button>
            <a href="carrito.html" class="btn btn--outline btn--block">
              Ver mi reserva
            </a>
          </div>
        </aside>
      </div>
    </section>`;

  // Sincronización del botón en la página de detalle
  subscribe((key) => {
    if (key === 'cart') {
      const nowAdded = isInCart(s.id);
      const btn = qs('#btn-detalle-add');
      const mediaBox = qs('#detalle-media-box');
      if (btn) {
        btn.classList.toggle('is-added', nowAdded);
        btn.textContent = nowAdded ? '✓ Agregado a mi reserva' : 'Agregar a mi reserva';
      }
      if (mediaBox) {
        mediaBox.classList.toggle('is-added', nowAdded);
      }
    }
  });
}

function renderOtrosServicios(currentId) {
  const others = SERVICES.filter((s) => s.id !== currentId).slice(0, 3);
  otrosGrid.innerHTML = others.map(serviceCard).join('');
}
