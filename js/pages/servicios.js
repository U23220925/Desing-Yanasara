/* =====================================================================
   PÁGINA · 02 SERVICIOS
   Catálogo de 6 tarjetas, búsqueda en vivo, filtros combinados,
   ordenamiento por precio, estado vacío y barra de resumen en tiempo real.
   ===================================================================== */
import '../main.js';
import {
  SERVICES,
  CATEGORIES,
  EXPERIENCES,
  FACILITIES,
  PRICE_RANGE,
  formatPrice,
  getService,
  categoryLabel,
} from '../../data/services.js';
import {
  serviceCard,
  bindServiceCards,
  emptyState,
} from '../components/cards.js';
import {
  getCart,
  cartCount,
  cartSubtotal,
  subscribe,
} from '../store.js';
import {
  qs,
  qsa,
  initRange,
  initReveal,
  bump,
  debounce,
  escapeHTML as esc,
} from '../ui.js';

/* ---------------- Estado interno de filtros y búsqueda ---------------- */
const state = {
  search: '',
  categories: new Set(),
  experiences: new Set(),
  facilities: new Set(),
  price: { min: PRICE_RANGE.min, max: PRICE_RANGE.max },
  sortBy: 'default',
};

/* Normalizador de texto para búsqueda sin tildes ni mayúsculas */
const cleanStr = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/* ---------------- Elementos del DOM ---------------- */
const searchInput = qs('#search-input');
const searchClear = qs('#search-clear');
const sortSelect = qs('#sort-select');
const filterToggleBtn = qs('#btn-toggle-filters');
const filterBadge = qs('#filter-badge');
const filtersPanel = qs('#filters-panel');
const filtersScrim = qs('#filters-scrim');
const btnCloseFilters = qs('#btn-close-filters');
const btnApplyFilters = qs('#btn-apply-filters');
const btnClearFilters = qs('#btn-clear-filters');
const filtersForm = qs('#filters-form');
const resultsCountEl = qs('#results-count');
const activeChipsEl = qs('#active-chips');
const servicesGrid = qs('#services-grid');
const emptyWrapper = qs('#empty-state-wrapper');
const rangeOutput = qs('#range-out');

/* Rango de precio dual */
const priceMinInput = qs('#price-min');
const priceMaxInput = qs('#price-max');
const priceRangeEl = qs('#price-range');

/* ---------------- Filtrado y ordenamiento ---------------- */
function getFilteredServices() {
  const query = cleanStr(state.search);

  return SERVICES.filter((service) => {
    // 1. Búsqueda por texto (nombre, resumen, descripción o categoría)
    if (query) {
      const matchText = cleanStr(
        `${service.nombre} ${service.resumen} ${service.descripcion} ${categoryLabel(service.categoria)}`
      );
      if (!matchText.includes(query)) return false;
    }

    // 2. Filtro por tipo de servicio
    if (state.categories.size > 0 && !state.categories.has(service.categoria)) {
      return false;
    }

    // 3. Filtro por experiencia
    if (state.experiences.size > 0 && !state.experiences.has(service.experiencia)) {
      return false;
    }

    // 4. Filtro por instalaciones
    if (state.facilities.size > 0 && !state.facilities.has(service.instalacion)) {
      return false;
    }

    // 5. Filtro por rango de precio referencial
    if (service.precio < state.price.min || service.precio > state.price.max) {
      return false;
    }

    return true;
  });
}

function sortServices(list) {
  const result = [...list];
  switch (state.sortBy) {
    case 'price-asc':
      return result.sort((a, b) => a.precio - b.precio);
    case 'price-desc':
      return result.sort((a, b) => b.precio - a.precio);
    case 'name-asc':
      return result.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    default:
      // Orden predeterminado del archivo de datos
      return result;
  }
}

/* ---------------- Renderizado del catálogo ---------------- */
function renderCatalog() {
  const filtered = getFilteredServices();
  const sorted = sortServices(filtered);
  const total = SERVICES.length;

  // Actualiza contador de resultados
  resultsCountEl.textContent = `Mostrando ${sorted.length} de ${total} ${
    sorted.length === 1 ? 'servicio' : 'servicios'
  }`;

  if (sorted.length === 0) {
    servicesGrid.innerHTML = '';
    servicesGrid.hidden = true;
    emptyWrapper.hidden = false;
    emptyWrapper.innerHTML = emptyState({
      title: 'No se encontraron servicios',
      text: 'No hay actividades ni servicios que coincidan con los criterios seleccionados. Prueba ajustando el rango de precio o desmarcando algunos filtros.',
      actionLabel: 'Limpiar todos los filtros',
      href: '#',
    });

    const resetBtn = emptyWrapper.querySelector('a');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetAllFilters();
      });
    }
  } else {
    emptyWrapper.hidden = true;
    servicesGrid.hidden = false;
    servicesGrid.innerHTML = sorted.map(serviceCard).join('');
    initReveal(servicesGrid);
  }

  renderActiveChips();
  updateFilterBadge();
}

/* ---------------- Etiquetas de filtros activos (Chips) ---------------- */
function renderActiveChips() {
  const chips = [];

  // Búsqueda
  if (state.search) {
    chips.push({
      type: 'search',
      label: `Texto: "${state.search}"`,
    });
  }

  // Categorías
  state.categories.forEach((catId) => {
    const item = CATEGORIES.find((c) => c.id === catId);
    chips.push({
      type: 'category',
      value: catId,
      label: item ? item.label : catId,
    });
  });

  // Experiencias
  state.experiences.forEach((expId) => {
    const item = EXPERIENCES.find((e) => e.id === expId);
    chips.push({
      type: 'experience',
      value: expId,
      label: item ? item.label : expId,
    });
  });

  // Instalaciones
  state.facilities.forEach((facId) => {
    const item = FACILITIES.find((f) => f.id === facId);
    chips.push({
      type: 'facility',
      value: facId,
      label: item ? item.label : facId,
    });
  });

  // Rango de precio
  if (state.price.min > PRICE_RANGE.min || state.price.max < PRICE_RANGE.max) {
    chips.push({
      type: 'price',
      label: `${formatPrice(state.price.min)} – ${formatPrice(state.price.max)}`,
    });
  }

  if (chips.length === 0) {
    activeChipsEl.innerHTML = '';
    return;
  }

  const chipsHtml = chips
    .map(
      (chip) => `
      <span class="chip">
        <span class="chip__label">${esc(chip.label)}</span>
        <button type="button" class="chip__btn" data-chip-type="${chip.type}" ${
          chip.value ? `data-chip-value="${chip.value}"` : ''
        } aria-label="Quitar filtro ${esc(chip.label)}">×</button>
      </span>`
    )
    .join('');

  activeChipsEl.innerHTML = `${chipsHtml}
    <button type="button" class="chip-clear-all" id="btn-chip-clear-all">Limpiar todo</button>`;

  // Delegación de eventos para eliminar chip individual
  activeChipsEl.querySelectorAll('.chip__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { chipType, chipValue } = btn.dataset;
      removeFilter(chipType, chipValue);
    });
  });

  const clearAllBtn = activeChipsEl.querySelector('#btn-chip-clear-all');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', resetAllFilters);
  }
}

/* Quita un filtro individual desde su chip */
function removeFilter(type, value) {
  if (type === 'search') {
    state.search = '';
    searchInput.value = '';
    searchClear.hidden = true;
  } else if (type === 'category') {
    state.categories.delete(value);
    const cb = filtersForm.querySelector(`input[name="category"][value="${value}"]`);
    if (cb) cb.checked = false;
  } else if (type === 'experience') {
    state.experiences.delete(value);
    const cb = filtersForm.querySelector(`input[name="experience"][value="${value}"]`);
    if (cb) cb.checked = false;
  } else if (type === 'facility') {
    state.facilities.delete(value);
    const cb = filtersForm.querySelector(`input[name="facility"][value="${value}"]`);
    if (cb) cb.checked = false;
  } else if (type === 'price') {
    state.price.min = PRICE_RANGE.min;
    state.price.max = PRICE_RANGE.max;
    priceMinInput.value = PRICE_RANGE.min;
    priceMaxInput.value = PRICE_RANGE.max;
    priceRangeEl.style.setProperty('--lo', '0%');
    priceRangeEl.style.setProperty('--hi', '100%');
    rangeOutput.textContent = `${formatPrice(PRICE_RANGE.min)} – ${formatPrice(PRICE_RANGE.max)}`;
  }
  renderCatalog();
}

/* Restablece todos los filtros a sus valores iniciales */
function resetAllFilters() {
  state.search = '';
  state.categories.clear();
  state.experiences.clear();
  state.facilities.clear();
  state.price.min = PRICE_RANGE.min;
  state.price.max = PRICE_RANGE.max;
  state.sortBy = 'default';

  searchInput.value = '';
  searchClear.hidden = true;
  sortSelect.value = 'default';

  filtersForm.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });

  priceMinInput.value = PRICE_RANGE.min;
  priceMaxInput.value = PRICE_RANGE.max;
  priceRangeEl.style.setProperty('--lo', '0%');
  priceRangeEl.style.setProperty('--hi', '100%');
  rangeOutput.textContent = `${formatPrice(PRICE_RANGE.min)} – ${formatPrice(PRICE_RANGE.max)}`;

  renderCatalog();
}

/* Actualiza el indicador numérico del botón de filtros */
function updateFilterBadge() {
  const count =
    (state.search ? 1 : 0) +
    state.categories.size +
    state.experiences.size +
    state.facilities.size +
    (state.price.min > PRICE_RANGE.min || state.price.max < PRICE_RANGE.max ? 1 : 0);

  if (count > 0) {
    filterBadge.textContent = count;
    filterBadge.hidden = false;
  } else {
    filterBadge.hidden = true;
  }
}

/* ---------------- Control del Panel de Filtros Plegable ---------------- */
function setFiltersOpen(isOpen) {
  filtersPanel.classList.toggle('is-open', isOpen);
  filtersScrim.classList.toggle('is-open', isOpen);
  filterToggleBtn.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('filters-open', isOpen);

  if (isOpen) {
    btnCloseFilters.focus();
  } else {
    filterToggleBtn.focus();
  }
}

filterToggleBtn.addEventListener('click', () => {
  const isOpen = filtersPanel.classList.contains('is-open');
  setFiltersOpen(!isOpen);
});

btnCloseFilters.addEventListener('click', () => setFiltersOpen(false));
filtersScrim.addEventListener('click', () => setFiltersOpen(false));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && filtersPanel.classList.contains('is-open')) {
    setFiltersOpen(false);
  }
});

/* Lectura de los checkboxes desde el formulario */
function syncFiltersFromForm() {
  state.categories.clear();
  filtersForm.querySelectorAll('input[name="category"]:checked').forEach((cb) => {
    state.categories.add(cb.value);
  });

  state.experiences.clear();
  filtersForm.querySelectorAll('input[name="experience"]:checked').forEach((cb) => {
    state.experiences.add(cb.value);
  });

  state.facilities.clear();
  filtersForm.querySelectorAll('input[name="facility"]:checked').forEach((cb) => {
    state.facilities.add(cb.value);
  });
}

btnApplyFilters.addEventListener('click', () => {
  syncFiltersFromForm();
  renderCatalog();
  setFiltersOpen(false);
});

btnClearFilters.addEventListener('click', () => {
  resetAllFilters();
  setFiltersOpen(false);
});

// Los checkboxes actualizan en tiempo real
filtersForm.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    syncFiltersFromForm();
    renderCatalog();
  }
});

/* ---------------- Rango de Precio con Doble Control ---------------- */
initRange(priceRangeEl, ({ min, max }) => {
  state.price.min = min;
  state.price.max = max;
  rangeOutput.textContent = `${formatPrice(min)} – ${formatPrice(max)}`;
  renderCatalog();
});

/* ---------------- Búsqueda en Vivo ---------------- */
const onSearchInput = debounce(() => {
  state.search = searchInput.value.trim();
  searchClear.hidden = !state.search;
  renderCatalog();
}, 200);

searchInput.addEventListener('input', onSearchInput);

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  state.search = '';
  searchClear.hidden = true;
  searchInput.focus();
  renderCatalog();
});

/* ---------------- Ordenamiento por Precio / Nombre ---------------- */
sortSelect.addEventListener('change', () => {
  state.sortBy = sortSelect.value;
  renderCatalog();
});

/* ---------------- Barra de Resumen en Vivo ---------------- */
const sbCountEl = qs('#sb-count');
const sbNamesEl = qs('#sb-names');
const sbTotalEl = qs('#sb-total');
const sbBtnContinue = qs('#sb-btn-continue');

function updateSummaryBar() {
  const n = cartCount();
  const subtotal = cartSubtotal();

  sbCountEl.textContent = `${n} ${n === 1 ? 'servicio' : 'servicios'}`;
  sbNamesEl.textContent = n
    ? getCart()
        .map((id) => getService(id).nombre)
        .join(', ')
    : 'Aún no has elegido servicios.';
  sbTotalEl.textContent = formatPrice(subtotal);

  // Estado atenuado si no hay selección (requerimiento explícito del README)
  if (n === 0) {
    sbBtnContinue.classList.add('is-disabled');
    sbBtnContinue.setAttribute('aria-disabled', 'true');
    sbBtnContinue.setAttribute('tabindex', '-1');
  } else {
    sbBtnContinue.classList.remove('is-disabled');
    sbBtnContinue.setAttribute('aria-disabled', 'false');
    sbBtnContinue.setAttribute('tabindex', '0');
    bump(sbCountEl);
  }
}

// Suscripción al store global para sincronizar resumen al agregar/quitar servicios
subscribe((key) => {
  if (key === 'cart') {
    updateSummaryBar();
  }
});

/* ---------------- Inicialización ---------------- */
// 1. Activa botones "Agregar a mi reserva" y toast con deshacer
bindServiceCards();

// 2. Renderiza catálogo inicial (6 servicios)
renderCatalog();

// 3. Inicializa estado de la barra de resumen
updateSummaryBar();
