/* =====================================================================
   STORE · estado compartido entre páginas (localStorage)
   Carrito, datos de la reserva, reservas creadas y sesión demo de admin.
   Todo es demostrativo: no hay servidor ni pagos.
   ===================================================================== */
import { getService, getPlan, PLANS } from '../data/services.js';
import { SEED_RESERVATIONS } from '../data/reservations.js';

const NS = 'yanasara:v1:';
const memory = {};                       // respaldo si localStorage no está disponible
const clamp = (n, a, b) => Math.min(b, Math.max(a, Number(n) || a));

function read(key, fallback) {
  try { const raw = localStorage.getItem(NS + key); return raw === null ? fallback : JSON.parse(raw); }
  catch { return key in memory ? memory[key] : fallback; }
}
function write(key, value) {
  try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch { memory[key] = value; }
  emit(key);
}
const emit = (key) => window.dispatchEvent(new CustomEvent('yanasara:store', { detail: { key } }));
window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith(NS)) emit(e.key.slice(NS.length)); });

/** Escucha cambios del store. Devuelve la función para dejar de escuchar. */
export function subscribe(fn) {
  const h = (e) => fn(e.detail.key);
  window.addEventListener('yanasara:store', h);
  return () => window.removeEventListener('yanasara:store', h);
}

/* ---------------- Carrito (ids de servicios) ---------------- */
export const getCart = () => read('cart', []).filter((id) => getService(id));
export const isInCart = (id) => getCart().includes(id);
export const cartCount = () => getCart().length;
export const cartSubtotal = () => getCart().reduce((sum, id) => sum + getService(id).precio, 0);   // por persona
export function addToCart(id) { if (!getService(id) || isInCart(id)) return false; write('cart', [...getCart(), id]); return true; }
export function removeFromCart(id) { write('cart', getCart().filter((x) => x !== id)); }
export function toggleCart(id) { if (isInCart(id)) { removeFromCart(id); return false; } addToCart(id); return true; }
export const clearCart = () => write('cart', []);

/* ---------------- Reserva en curso ---------------- */
const DEFAULT_BOOKING = { planId: null, date: '2026-10-18', time: '10:00', adults: 2, children: 0, visitor: null };
export const getBooking = () => ({ ...DEFAULT_BOOKING, ...read('booking', {}) });
export function updateBooking(patch) {
  const b = { ...getBooking(), ...patch };
  b.adults = clamp(b.adults, 1, 6); b.children = clamp(b.children, 0, 6);
  write('booking', b); return b;
}
export const setPlan = (planId) => updateBooking({ planId });
export const saveVisitor = (visitor) => updateBooking({ visitor });
export const resetBooking = () => write('booking', DEFAULT_BOOKING);

/** Líneas de la reserva: el plan elegido, o los servicios del carrito, o el Circuito termal por defecto. */
export function getLines() {
  const b = getBooking();
  const plan = getPlan(b.planId) || (getCart().length ? null : PLANS[0]);
  if (plan) {
    return [{ id: plan.id, tipo: 'plan', nombre: plan.nombre, precio: plan.precio, unidad: plan.unidad,
      total: plan.unidad === 'por familia' ? plan.precio : plan.precio * b.adults }];
  }
  return getCart().map((id) => { const s = getService(id);
    return { id, tipo: 'servicio', nombre: s.nombre, precio: s.precio, unidad: s.unidad, total: s.precio * b.adults }; });
}
export const bookingTotal = () => getLines().reduce((sum, l) => sum + l.total, 0);

/* ---------------- Reservas registradas ---------------- */
export function getReservations() {
  const overrides = read('overrides', {});
  return [...read('reservations', []), ...SEED_RESERVATIONS]
    .map((r) => (overrides[r.codigo] ? { ...r, estado: overrides[r.codigo] } : r))
    .sort((a, b) => b.codigo.localeCompare(a.codigo));
}
export const getReservation = (code) => getReservations().find((r) => r.codigo === code) || null;
export const getLastReservation = () => getReservation(read('last', ''));
export const nextCode = () => 'YT-' + String(Math.max(128, ...getReservations().map((r) => parseInt(r.codigo.slice(3), 10))) + 1).padStart(5, '0');

/** Convierte la reserva en curso en una reserva registrada y limpia el carrito. */
export function createReservation() {
  const b = getBooking();
  const r = { codigo: nextCode(), visitante: b.visitante, experiencia: getLines().map((l) => l.nombre).join(' + '),
    fecha: b.date, hora: b.time, adultos: b.adults, ninos: b.children, total: bookingTotal(), estado: 'Confirmada', creada: new Date().toISOString() };
  write('reservations', [r, ...read('reservations', [])]);
  write('last', r.codigo);
  clearCart(); resetBooking();
  return r;
}
export function setReservationStatus(code, estado) { write('overrides', { ...read('overrides', {}), [code]: estado }); }

/* ---------------- Sesión demo de administración ---------------- */
export const DEMO_ADMIN = { email: 'admin@yanasara.example', password: 'Demo2026' };
export const isAdmin = () => read('admin', false) === true;
export function loginAdmin(email, password) {
  const ok = String(email).trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  write('admin', ok); return ok;
}
export const logoutAdmin = () => write('admin', false);

/** Borra todo el estado de la demo (útil entre pruebas de usabilidad). */
export function resetDemo() {
  ['cart', 'booking', 'reservations', 'overrides', 'last', 'admin'].forEach((k) => { try { localStorage.removeItem(NS + k); } catch {} delete memory[k]; emit(k); });
}
