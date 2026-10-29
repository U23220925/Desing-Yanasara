/* =====================================================================
   PÁGINA · 12 ADMINISTRACIÓN - DETALLE DE RESERVA
   Ficha de reserva, datos del visitante y cambio de estados demostrativos.
   ===================================================================== */
import '../main.js';
import { getReservation, setReservationStatus, logoutAdmin, isAdmin } from '../store.js';
import { formatPrice } from '../../data/services.js';
import { qs, toast, initReveal, escapeHTML as esc } from '../ui.js';

// Comprobación de autenticación
if (!isAdmin()) {
  window.location.replace('acceso.html');
}

const params = new URLSearchParams(window.location.search);
const codigo = params.get('codigo') || '';
const container = qs('#reservation-detail-content');
const btnLogout = qs('#btn-logout');

/* Control del Sidebar */
const sidebar = qs('#admin-sidebar');
const sidebarScrim = qs('#sidebar-scrim');
const btnToggleSidebar = qs('#btn-toggle-sidebar');
const btnCloseSidebar = qs('#btn-close-sidebar');

if (btnToggleSidebar) {
  btnToggleSidebar.addEventListener('click', () => {
    sidebar.classList.add('is-open');
    sidebarScrim.classList.add('is-open');
  });
}
if (btnCloseSidebar) {
  btnCloseSidebar.addEventListener('click', () => {
    sidebar.classList.remove('is-open');
    sidebarScrim.classList.remove('is-open');
  });
}
if (sidebarScrim) {
  sidebarScrim.addEventListener('click', () => {
    sidebar.classList.remove('is-open');
    sidebarScrim.classList.remove('is-open');
  });
}

if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    logoutAdmin();
    window.location.href = 'acceso.html';
  });
}

function getBadge(estado) {
  if (estado === 'Confirmada') return `<span class="badge badge--success">Confirmada</span>`;
  if (estado === 'Cancelada') return `<span class="badge badge--error">Cancelada</span>`;
  return `<span class="badge badge--warning">Pendiente</span>`;
}

function renderDetail() {
  const r = getReservation(codigo);

  if (!r) {
    container.innerHTML = `
      <div class="card empty-state" style="padding: var(--sp-8); text-align: center;">
        <h2>Reserva no encontrada</h2>
        <p class="muted">No existe una reserva registrada con el código <code>${esc(codigo)}</code>.</p>
        <a class="btn btn--primary" href="reservas.html" style="margin-top: var(--sp-4);">Volver a Reservas</a>
      </div>`;
    return;
  }

  const v = r.visitante || {};

  container.innerHTML = `
    <!-- Encabezado de la Reserva -->
    <div class="detail-header-card reveal">
      <div>
        <span class="eyebrow">Código de Reserva</span>
        <h1 class="detail-header-card__code">${esc(r.codigo)}</h1>
        <p class="small muted" style="margin-top: var(--sp-1);">Registrada para el ${esc(r.fecha)} a las ${esc(r.hora)} h</p>
      </div>
      <div id="badge-wrapper">
        ${getBadge(r.estado)}
      </div>
    </div>

    <!-- Secciones Grid: Visitante y Experiencia -->
    <div class="detail-sections-grid">
      <!-- Datos del Visitante -->
      <article class="detail-card reveal">
        <h2 class="detail-card__title">Datos del Visitante</h2>
        <div class="detail-info-list">
          <div class="detail-info-item">
            <span class="detail-info-label">Nombres y Apellidos</span>
            <span class="detail-info-value">${esc(v.nombres || 'No especificado')} ${esc(v.apellidos || '')}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">Documento de Identidad</span>
            <span class="detail-info-value">${esc(v.tipoDoc || 'DNI')}: ${esc(v.numDoc || '—')}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">Correo Electrónico</span>
            <span class="detail-info-value">
              <a href="mailto:${esc(v.correo || '')}">${esc(v.correo || '—')}</a>
            </span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">Teléfono Celular</span>
            <span class="detail-info-value">
              <a href="tel:${esc(v.celular || '')}">${esc(v.celular || '—')}</a>
            </span>
          </div>
        </div>
      </article>

      <!-- Resumen de la Experiencia -->
      <article class="detail-card reveal">
        <h2 class="detail-card__title">Resumen de la Experiencia</h2>
        <div class="detail-info-list">
          <div class="detail-info-item">
            <span class="detail-info-label">Servicio o Plan Contratado</span>
            <span class="detail-info-value" style="color: var(--color-primary); font-weight: 600;">
              ${esc(r.experiencia || 'Circuito termal')}
            </span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">Fecha y Turno</span>
            <span class="detail-info-value">${esc(r.fecha)} · ${esc(r.hora)} h</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">Visitantes Registrados</span>
            <span class="detail-info-value">${r.adultos} adulto(s)${r.ninos > 0 ? `, ${r.ninos} niño(s)` : ''}</span>
          </div>
          <div class="detail-info-item" style="margin-top: var(--sp-2); padding-top: var(--sp-2); border-top: 1px dashed var(--color-border-soft);">
            <span class="detail-info-label">Total Referencial</span>
            <span class="detail-info-value" style="font-size: var(--fs-h3); color: var(--color-accent); font-family: var(--font-display);">
              ${formatPrice(r.total)}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Acciones Demostrativas -->
    <article class="detail-actions-card reveal">
      <p class="eyebrow">Gestión Demostrativa de Estado</p>
      <h2 style="font-size: var(--fs-h4); margin-bottom: var(--sp-2);">Actualizar estado de la reserva</h2>
      <p class="muted small" style="margin-bottom: var(--sp-4);">
        Estas acciones cambian el estado en tiempo real dentro del almacenamiento local del navegador (localStorage).
      </p>

      <div class="detail-actions-buttons">
        <button type="button" class="btn btn--primary" id="btn-status-confirm">
          ✓ Marcar como Atendida (Confirmada)
        </button>
        <button type="button" class="btn btn--outline" id="btn-status-pending">
          Marcar como Pendiente
        </button>
        <button type="button" class="btn btn--text" id="btn-status-cancel" style="color: var(--color-error);">
          Cancelar reserva demo
        </button>
      </div>
    </article>`;

  // Delegación de acciones de cambio de estado
  qs('#btn-status-confirm').addEventListener('click', () => changeStatus('Confirmada'));
  qs('#btn-status-pending').addEventListener('click', () => changeStatus('Pendiente'));
  qs('#btn-status-cancel').addEventListener('click', () => {
    if (confirm('¿Confirmas que deseas cancelar esta reserva de demostración?')) {
      changeStatus('Cancelada');
    }
  });

  initReveal(container);
}

function changeStatus(newStatus) {
  setReservationStatus(codigo, newStatus);

  // Actualiza la insignia en el DOM de inmediato
  const badgeWrapper = qs('#badge-wrapper');
  if (badgeWrapper) {
    badgeWrapper.innerHTML = getBadge(newStatus);
  }

  // Notificación toast de confirmación (requerimiento del README)
  toast({
    type: newStatus === 'Confirmada' ? 'success' : newStatus === 'Cancelada' ? 'error' : 'warning',
    title: 'Estado actualizado',
    message: `La reserva ${codigo} ahora está en estado "${newStatus}".`,
  });
}

renderDetail();
