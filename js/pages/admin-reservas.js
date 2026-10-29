/* =====================================================================
   PÁGINA · 11 ADMINISTRACIÓN - RESERVAS
   Supervisión de reservas, indicadores animados, filtros dinámicos y vista móvil.
   ===================================================================== */
import '../main.js';
import { getReservations, resetDemo, logoutAdmin, isAdmin } from '../store.js';
import { formatPrice } from '../../data/services.js';
import { qs, qsa, countUp, toast, initReveal, debounce, escapeHTML as esc } from '../ui.js';

// Comprobación de autenticación demostrativa
if (!isAdmin()) {
  window.location.replace('acceso.html');
}

/* ---------------- Elementos del DOM ---------------- */
const sidebar = qs('#admin-sidebar');
const sidebarScrim = qs('#sidebar-scrim');
const btnToggleSidebar = qs('#btn-toggle-sidebar');
const btnCloseSidebar = qs('#btn-close-sidebar');
const btnLogout = qs('#btn-logout');
const btnResetDemo = qs('#btn-reset-demo');

const searchInput = qs('#admin-search');
const filterStatus = qs('#filter-status');
const filterDate = qs('#filter-date');
const sortSelect = qs('#sort-reservations');
const btnClearFilters = qs('#btn-clear-admin-filters');
const resultsCountEl = qs('#admin-results-count');

const tableEl = qs('#reservations-table');
const tbody = qs('#reservations-tbody');
const cardsView = qs('#reservations-cards-view');
const emptyStateEl = qs('#admin-empty-state');

// KPIs
const kpiTotalEl = qs('#kpi-total');
const kpiConfirmedEl = qs('#kpi-confirmed');
const kpiVisitorsEl = qs('#kpi-visitors');
const kpiRevenueEl = qs('#kpi-revenue');

/* ---------------- Control del Sidebar Móvil ---------------- */
const setSidebarOpen = (open) => {
  sidebar.classList.toggle('is-open', open);
  sidebarScrim.classList.toggle('is-open', open);
};

btnToggleSidebar.addEventListener('click', () => setSidebarOpen(true));
btnCloseSidebar.addEventListener('click', () => setSidebarOpen(false));
sidebarScrim.addEventListener('click', () => setSidebarOpen(false));

/* Cerrar sesión y Reiniciar Demo */
btnLogout.addEventListener('click', () => {
  logoutAdmin();
  toast({
    type: 'info',
    title: 'Sesión finalizada',
    message: 'Has salido del panel de administración.',
  });
  setTimeout(() => window.location.href = 'acceso.html', 300);
});

btnResetDemo.addEventListener('click', () => {
  if (confirm('¿Restablecer los datos de la demo? Esto reiniciará las reservas y el carrito.')) {
    resetDemo();
    toast({
      type: 'success',
      title: 'Datos restablecidos',
      message: 'El estado demostrativo ha vuelto a sus valores iniciales.',
    });
    setTimeout(() => window.location.reload(), 400);
  }
});

/* ---------------- Estado y Filtrado ---------------- */
const state = {
  search: '',
  status: 'todos',
  date: '',
  sort: 'code-desc',
};

const cleanStr = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function getFilteredReservations() {
  const all = getReservations();
  const query = cleanStr(state.search);

  const filtered = all.filter((r) => {
    // 1. Texto (código, nombres, apellidos, documento, correo, celular o experiencia)
    if (query) {
      const v = r.visitante || {};
      const haystack = cleanStr(
        `${r.codigo} ${v.nombres} ${v.apellidos} ${v.numDoc} ${v.correo} ${v.celular} ${r.experiencia}`
      );
      if (!haystack.includes(query)) return false;
    }

    // 2. Estado
    if (state.status !== 'todos' && r.estado !== state.status) {
      return false;
    }

    // 3. Fecha
    if (state.date && r.fecha !== state.date) {
      return false;
    }

    return true;
  });

  // Ordenamiento
  return filtered.sort((a, b) => {
    if (state.sort === 'code-asc') return a.codigo.localeCompare(b.codigo);
    if (state.sort === 'code-desc') return b.codigo.localeCompare(a.codigo);
    if (state.sort === 'total-desc') return b.total - a.total;
    if (state.sort === 'total-asc') return a.total - b.total;
    return 0;
  });
}

/* Insignia de estado según token */
function getBadge(estado) {
  if (estado === 'Confirmada') return `<span class="badge badge--success">Confirmada</span>`;
  if (estado === 'Cancelada') return `<span class="badge badge--error">Cancelada</span>`;
  return `<span class="badge badge--warning">Pendiente</span>`;
}

/* Actualización animada de Indicadores (KPIs) */
function updateKPIs(reservations) {
  const total = reservations.length;
  const confirmed = reservations.filter((r) => r.estado === 'Confirmada').length;
  const visitors = reservations.reduce((sum, r) => sum + (Number(r.adultos) || 0) + (Number(r.ninos) || 0), 0);
  const revenue = reservations.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

  countUp(kpiTotalEl, total);
  countUp(kpiConfirmedEl, confirmed);
  countUp(kpiVisitorsEl, visitors);
  countUp(kpiRevenueEl, revenue, {
    format: (n) => formatPrice(Math.round(n)),
  });
}

/* Renderizado de Tabla y Tarjetas */
function render() {
  const list = getFilteredReservations();
  const allCount = getReservations().length;

  resultsCountEl.textContent = `Mostrando ${list.length} de ${allCount} reservas registradas`;

  if (list.length === 0) {
    tbody.innerHTML = '';
    cardsView.innerHTML = '';
    emptyStateEl.hidden = false;
    emptyStateEl.innerHTML = `
      <h3>No se encontraron reservas</h3>
      <p class="muted">Ningún registro coincide con los criterios de búsqueda aplicados.</p>
    `;
    return;
  }

  emptyStateEl.hidden = true;

  // 1. Renderiza Filas de la Tabla (Desktop / Tablet)
  tbody.innerHTML = list
    .map((r) => {
      const v = r.visitante || {};
      return `
        <tr>
          <td><strong style="font-family: monospace;">${esc(r.codigo)}</strong></td>
          <td>
            <strong>${esc(v.nombres || 'Visitante')} ${esc(v.apellidos || '')}</strong>
            <span class="small muted">${esc(v.celular || 'Sin celular')}</span>
          </td>
          <td>${esc(r.experiencia || 'Circuito')}</td>
          <td>
            <span>${esc(r.fecha || '2026-10-18')}</span>
            <span class="small muted"> · ${esc(r.hora || '10:00')} h</span>
          </td>
          <td>${r.adultos} adultos${r.ninos > 0 ? `, ${r.ninos} niños` : ''}</td>
          <td><strong>${formatPrice(r.total)}</strong></td>
          <td>${getBadge(r.estado)}</td>
          <td class="text-right">
            <a class="btn btn--outline btn--sm" href="detalle.html?codigo=${encodeURIComponent(r.codigo)}">
              Ver detalle
            </a>
          </td>
        </tr>`;
    })
    .join('');

  // 2. Renderiza Tarjetas para Móvil
  cardsView.innerHTML = list
    .map((r) => {
      const v = r.visitante || {};
      return `
        <article class="admin-reserva-card">
          <div class="admin-reserva-card__head">
            <span class="admin-reserva-card__code">${esc(r.codigo)}</span>
            ${getBadge(r.estado)}
          </div>
          <div>
            <strong>${esc(v.nombres || 'Visitante')} ${esc(v.apellidos || '')}</strong>
            <p class="small muted" style="margin: 0;">${esc(r.experiencia)} · ${r.adultos} ad${r.ninos > 0 ? ` + ${r.ninos} niñ` : ''}</p>
          </div>
          <div class="admin-reserva-card__row">
            <span>Fecha: ${esc(r.fecha)} (${esc(r.hora)} h)</span>
            <strong>${formatPrice(r.total)}</strong>
          </div>
          <div class="admin-reserva-card__actions">
            <a class="btn btn--outline btn--sm btn--block" href="detalle.html?codigo=${encodeURIComponent(r.codigo)}">
              Gestionar reserva
            </a>
          </div>
        </article>`;
    })
    .join('');
}

/* ---------------- Listeners de Filtros ---------------- */
searchInput.addEventListener('input', debounce(() => {
  state.search = searchInput.value.trim();
  render();
}, 200));

filterStatus.addEventListener('change', () => {
  state.status = filterStatus.value;
  render();
});

filterDate.addEventListener('change', () => {
  state.date = filterDate.value;
  render();
});

sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  render();
});

btnClearFilters.addEventListener('click', () => {
  state.search = '';
  state.status = 'todos';
  state.date = '';
  state.sort = 'code-desc';

  searchInput.value = '';
  filterStatus.value = 'todos';
  filterDate.value = '';
  sortSelect.value = 'code-desc';

  render();
});

/* Inicialización */
const allReservations = getReservations();
updateKPIs(allReservations);
render();
initReveal();
