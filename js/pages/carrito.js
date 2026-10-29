/* =====================================================================
   PÁGINA · 06 MI RESERVA (CARRITO)
   Lista de servicios, quitar y deshacer, selector de adultos,
   recalculo en vivo del total referencial y estado vacío.
   ===================================================================== */
import '../main.js';
import { getCart, removeFromCart, toggleCart, cartSubtotal, getBooking, updateBooking, clearCart, subscribe } from '../store.js';
import { getService, formatPrice, categoryLabel } from '../../data/services.js';
import { emptyState } from '../components/cards.js';
import { qs, initQty, initReveal, toast, escapeHTML as esc } from '../ui.js';

const layout = qs('#carrito-layout');
const itemsList = qs('#carrito-items-list');
const emptyWrapper = qs('#carrito-empty-wrapper');
const countEl = qs('#cart-items-count');
const btnClear = qs('#btn-clear-cart');

const subtotalValEl = qs('#cart-subtotal-val');
const multiplierValEl = qs('#cart-multiplier-val');
const totalValEl = qs('#cart-total-val');
const qtyEl = qs('#cart-qty');

let booking = getBooking();
let adultsQty = booking.adults || 2;

/* Inicializa stepper de cantidad de adultos */
const qtyController = initQty(qtyEl, {
  min: 1,
  max: 6,
  value: adultsQty,
  onChange: (val) => {
    adultsQty = val;
    updateBooking({ adults: val });
    renderSummary();
  },
});

function renderSummary() {
  const subtotal = cartSubtotal();
  const total = subtotal * adultsQty;

  subtotalValEl.textContent = formatPrice(subtotal);
  multiplierValEl.textContent = `× ${adultsQty} ${adultsQty === 1 ? 'adulto' : 'adultos'}`;
  totalValEl.textContent = formatPrice(total);
}

function renderCart() {
  const cartIds = getCart();
  countEl.textContent = cartIds.length;

  if (cartIds.length === 0) {
    layout.hidden = true;
    emptyWrapper.hidden = false;
    emptyWrapper.innerHTML = emptyState({
      title: 'Tu reserva está vacía',
      text: 'Aún no has agregado ningún servicio a tu selección. Explora nuestro catálogo de piscinas y pozas para comenzar.',
      actionLabel: 'Explorar catálogo de servicios',
      href: 'servicios.html',
    });
    return;
  }

  emptyWrapper.hidden = true;
  layout.hidden = false;

  itemsList.innerHTML = cartIds.map((id) => {
    const s = getService(id);
    if (!s) return '';
    return `
      <article class="cart-item" data-id="${s.id}">
        <div class="cart-item__media">
          <img src="${esc(s.imagen)}" alt="${esc(s.alt)}" loading="lazy" width="120" height="90" onerror="this.parentElement.classList.add('is-missing')">
        </div>
        <div class="cart-item__body">
          <p class="cart-item__cat">${esc(categoryLabel(s.categoria))}</p>
          <h3 class="cart-item__title"><a href="detalle.html?id=${s.id}">${esc(s.nombre)}</a></h3>
          <span class="cart-item__price">${formatPrice(s.precio)} <span class="small muted">· ${esc(s.unidad)}</span></span>
        </div>
        <div class="cart-item__action">
          <button type="button" class="btn--text cart-item__remove" data-remove="${s.id}" aria-label="Quitar ${esc(s.nombre)} de la reserva">
            Quitar
          </button>
        </div>
      </article>`;
  }).join('');

  renderSummary();
  initReveal();
}

/* Eventos de quitar y deshacer */
itemsList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;

  const id = btn.dataset.remove;
  const s = getService(id);
  removeFromCart(id);

  toast({
    type: 'info',
    title: 'Servicio quitado',
    message: `${s.nombre} se eliminó de tu selección.`,
    actionLabel: 'Deshacer',
    onAction: () => {
      toggleCart(id);
    },
  });

  renderCart();
});

btnClear.addEventListener('click', () => {
  if (confirm('¿Vaciar todos los servicios de tu reserva?')) {
    clearCart();
    toast({
      type: 'info',
      title: 'Reserva vaciada',
      message: 'Se han retirado todos los servicios de la selección.',
    });
    renderCart();
  }
});

// Sincronización con eventos del store
subscribe((key) => {
  if (key === 'cart') {
    renderCart();
  }
});

renderCart();
