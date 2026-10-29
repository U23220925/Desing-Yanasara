/* =====================================================================
   COMPONENTE · Encabezado global (idéntico en todas las páginas)
   Uso: <body data-page="servicios"> + <div id="site-header" data-component="header">
   ===================================================================== */
import { url } from '../paths.js';
import { subscribe, cartCount } from '../store.js';
import { bump } from '../ui.js';

const LINKS = [['inicio', 'Inicio', 'index.html'], ['servicios', 'Servicios', 'servicios.html'], ['tarifas', 'Tarifas', 'tarifas.html'], ['historia', 'Historia', 'historia.html']];

export const LOGO = `<svg class="brand__mark" viewBox="0 0 40 44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 30 14 9l6 11 5-7 12 17"/><path d="M20 31c0 0-4.5 5-4.5 8a4.5 4.5 0 0 0 9 0c0-3-4.5-8-4.5-8Z"/></svg>`;
const CART = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 7H6"/></svg>`;

const navLinks = (active) => LINKS.map(([id, label, href]) =>
  `<a class="nav__link" href="${url(href)}"${id === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');

export function mountHeader(target = document.getElementById('site-header')) {
  if (!target) return;
  const active = document.body.dataset.page || '';
  const n = cartCount();
  target.innerHTML = `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="${url('index.html')}" aria-label="YANASARA TERMALES, ir al inicio">${LOGO}<span><span class="brand__name">YANASARA</span><span class="brand__sub">TERMALES</span></span></a>
        <nav class="nav" aria-label="Principal">${navLinks(active)}</nav>
        <div class="header-actions">
          <a class="nav__admin" href="${url('admin/acceso.html')}">Administración</a>
          <a class="cart-link" href="${url('carrito.html')}" aria-label="Mi reserva: ${n} servicios">${CART}<span class="badge-count" data-count="${n}">${n}</span></a>
          <a class="btn btn--primary btn--sm" href="${url('reserva-1.html')}">Reservar ahora</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-panel" aria-label="Abrir menú"><span class="menu-toggle__bars"></span></button>
        </div>
      </div>
    </header>
    <div class="scrim" id="scrim"></div>
    <nav class="mobile-panel" id="mobile-panel" aria-label="Menú móvil">
      ${navLinks(active)}
      <a class="nav__link" href="${url('admin/acceso.html')}">Administración</a>
      <a class="btn btn--primary btn--block" href="${url('reserva-1.html')}">Reservar ahora</a>
    </nav>`;

  const header = target.querySelector('.site-header'), toggle = target.querySelector('.menu-toggle');
  const panel = target.querySelector('#mobile-panel'), scrim = target.querySelector('#scrim');

  const setMenu = (open) => {
    panel.classList.toggle('is-open', open); scrim.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
    if (open) panel.querySelector('a').focus(); else if (document.activeElement && panel.contains(document.activeElement)) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(!panel.classList.contains('is-open')));
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) setMenu(false); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Contador del carrito: se actualiza solo y rebota al aumentar
  const badge = target.querySelector('.badge-count'), cart = target.querySelector('.cart-link');
  let last = n;
  subscribe((key) => {
    if (key !== 'cart') return;
    const c = cartCount();
    badge.textContent = c; badge.dataset.count = c; cart.setAttribute('aria-label', `Mi reserva: ${c} servicios`);
    if (c > last) bump(badge);
    last = c;
  });
}
