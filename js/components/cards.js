/* =====================================================================
   COMPONENTE · Tarjeta de servicio (+ estado vacío)
   serviceCard(s) devuelve el HTML. bindServiceCards() activa "Agregar" en toda la página.
   ===================================================================== */
import { url } from '../paths.js';
import { formatPrice, categoryLabel, getService } from '../../data/services.js';
import { isInCart, toggleCart, subscribe } from '../store.js';
import { toast, escapeHTML as esc } from '../ui.js';

export function serviceCard(s) {
  const added = isInCart(s.id);
  return `
    <article class="card service-card reveal${added ? ' is-added' : ''}" data-id="${s.id}">
      <div class="service-card__media">
        <img src="${url(s.imagen)}" alt="${esc(s.alt)}" loading="lazy" width="640" height="480" onerror="this.parentElement.classList.add('is-missing')">
        <span class="service-card__tag" aria-hidden="true">✓ AGREGADO</span>
      </div>
      <div class="service-card__body">
        <p class="service-card__cat">${esc(categoryLabel(s.categoria))}</p>
        <h3 class="service-card__title"><a href="${url('detalle.html')}?id=${s.id}">${esc(s.nombre)}</a></h3>
        <p class="service-card__desc">${esc(s.resumen)}</p>
        <div class="price"><span class="price__value">${formatPrice(s.precio)}</span><span class="price__label">Precio referencial · ${esc(s.unidad)}</span></div>
        <div class="service-card__actions">
          <a class="btn btn--outline btn--block" href="${url('detalle.html')}?id=${s.id}">Ver detalles</a>
          <button type="button" class="btn btn--secondary btn--block${added ? ' is-added' : ''}" data-add="${s.id}" aria-pressed="${added}">${added ? '✓ Agregado' : 'Agregar a mi reserva'}</button>
        </div>
      </div>
    </article>`;
}

/** Mantiene todos los botones "Agregar" y tarjetas al día con el carrito. */
export function syncServiceCards(root = document) {
  root.querySelectorAll('[data-add]').forEach((btn) => {
    const on = isInCart(btn.dataset.add);
    btn.classList.toggle('is-added', on); btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? '✓ Agregado' : 'Agregar a mi reserva';
    const card = btn.closest('.service-card'); if (card) card.classList.toggle('is-added', on);
  });
}

/** Llamar una sola vez por página. */
export function bindServiceCards() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]'); if (!btn) return;
    const id = btn.dataset.add, s = getService(id), added = toggleCart(id);
    toast({ type: added ? 'success' : 'info', title: added ? 'Agregado a tu reserva' : 'Quitado de tu reserva', message: s.nombre,
      actionLabel: 'Deshacer', onAction: () => toggleCart(id) });
  });
  subscribe((key) => { if (key === 'cart') syncServiceCards(); });
}

/** Estado vacío con invitación a actuar. */
export function emptyState({ title, text, actionLabel, href }) {
  return `<div class="empty-state"><h3>${esc(title)}</h3><p>${esc(text)}</p>${actionLabel ? `<a class="btn btn--secondary" href="${href}">${esc(actionLabel)}</a>` : ''}</div>`;
}
