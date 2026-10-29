/* =====================================================================
   UI · utilidades de interfaz reutilizables
   toast, revelado al scroll, transición entre páginas, contador animado,
   ayudas de formulario (errores, cantidad, rango).
   ===================================================================== */
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
export const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const formatDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
export const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Reinicia la animación "bump" (rebote) de un elemento. */
export function bump(el) { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }

/* ---------------- Toasts (alertas flotantes) ---------------- */
let region;
function getRegion() {
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('role', 'region'); region.setAttribute('aria-label', 'Notificaciones'); region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  return region;
}
/** toast({ type: 'success'|'error'|'warning'|'info', title, message, duration, actionLabel, onAction }) */
export function toast({ type = 'info', title = '', message = '', duration = 4000, actionLabel, onAction } = {}) {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  const body = document.createElement('div'); body.className = 'toast__body';
  const t = document.createElement('p'); t.className = 'toast__title'; t.textContent = title; body.append(t);
  if (message) { const m = document.createElement('p'); m.className = 'toast__msg'; m.textContent = message; body.append(m); }
  let timer;
  const close = () => {
    clearTimeout(timer);
    if (!el.isConnected || el.classList.contains('is-leaving')) return;
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 450);
  };
  if (actionLabel) {
    const a = document.createElement('button'); a.type = 'button'; a.className = 'toast__action'; a.textContent = actionLabel;
    a.addEventListener('click', () => { onAction && onAction(); close(); }); body.append(a);
  }
  const x = document.createElement('button'); x.type = 'button'; x.className = 'toast__close'; x.setAttribute('aria-label', 'Cerrar aviso'); x.textContent = '×';
  x.addEventListener('click', close);
  el.append(body, x);
  const r = getRegion(); r.append(el);
  while (r.children.length > 3) r.firstElementChild.remove();
  if (duration > 0) timer = setTimeout(close, duration);
  return { close };
}

/* ---------------- Revelado al hacer scroll ---------------- */
export function initReveal(root = document) {
  const els = qsa('.reveal:not(.is-visible)', root);
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) { els.forEach((e) => e.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((e, i) => { if (!e.style.getPropertyValue('--i')) e.style.setProperty('--i', String(i % 4)); io.observe(e); });
}

/* ---------------- Fundido entre páginas (300 ms) ---------------- */
export function initPageTransitions() {
  window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || prefersReducedMotion()) return;
    if (u.pathname === location.pathname && (u.hash || u.search === location.search)) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { location.href = a.href; }, 260);
  });
}

/* ---------------- Contador animado (indicadores) ---------------- */
export function countUp(el, to, { duration = 800, format = (n) => String(Math.round(n)) } = {}) {
  if (prefersReducedMotion()) { el.textContent = format(to); return; }
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - p, 3);   // ease-out cúbico
    el.textContent = format(to * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------------- Ayudas de formulario ---------------- */
/** Marca un .field como inválido con su mensaje, o lo limpia si message es vacío. */
export function setFieldError(field, message = '') {
  const input = qs('input, select, textarea', field), err = qs('.field__error', field);
  field.classList.toggle('is-invalid', Boolean(message)); field.classList.remove('is-valid');
  if (err) err.textContent = message;
  if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
}
export function setFieldValid(field) { setFieldError(field, ''); field.classList.add('is-valid'); }

/** Cantidad con − y +: <div class="qty" data-min data-max> <button data-qty="-1"> <output> <button data-qty="1"> */
export function initQty(el, { min = 0, max = 99, value = 0, onChange } = {}) {
  const out = qs('output', el), minus = qs('[data-qty="-1"]', el), plus = qs('[data-qty="1"]', el);
  let v = value;
  const render = (animate) => {
    out.textContent = v; minus.disabled = v <= min; plus.disabled = v >= max;
    if (animate) bump(out);
  };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty]'); if (!b) return;
    const next = Math.min(max, Math.max(min, v + Number(b.dataset.qty)));
    if (next === v) return; v = next; render(true); onChange && onChange(v);
  });
  render(false);
  return { get: () => v, set: (n) => { v = Math.min(max, Math.max(min, n)); render(false); } };
}

/** Rango doble: <div class="range"> <i class="range__track"> <i class="range__fill"> <input type="range"> <input type="range"> */
export function initRange(el, onChange) {
  const [a, b] = qsa('input[type="range"]', el), min = Number(a.min), max = Number(a.max);
  const update = (src) => {
    let lo = Number(a.value), hi = Number(b.value);
    if (lo > hi) { if (src === a) { a.value = hi; lo = hi; } else { b.value = lo; hi = lo; } }
    el.style.setProperty('--lo', ((lo - min) / (max - min)) * 100 + '%');
    el.style.setProperty('--hi', ((hi - min) / (max - min)) * 100 + '%');
    onChange && onChange({ min: lo, max: hi });
  };
  a.addEventListener('input', () => update(a)); b.addEventListener('input', () => update(b));
  update();
}

/** Activa lo común de cualquier página. */
export function initUI() { initPageTransitions(); initReveal(); }
