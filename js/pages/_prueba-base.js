import '../main.js';
import { SERVICES, formatPrice, getService } from '../../data/services.js';
import { serviceCard, bindServiceCards, emptyState } from '../components/cards.js';
import { getCart, cartCount, cartSubtotal, subscribe } from '../store.js';
import { toast, initQty, initRange, initReveal, setFieldError, qs } from '../ui.js';

// Tarjetas con datos reales
qs('#cards').innerHTML = SERVICES.map(serviceCard).join('');
bindServiceCards(); initReveal();

// Resumen en vivo (así lo usará la página Servicios)
const renderSummary = () => {
  const n = cartCount();
  qs('#sb-count').textContent = `${n} ${n === 1 ? 'servicio' : 'servicios'}`;
  qs('#sb-names').textContent = n ? getCart().map((id) => getService(id).nombre).join(', ') : 'Aún no has elegido servicios.';
  qs('#sb-total').textContent = formatPrice(cartSubtotal());
};
renderSummary(); subscribe((k) => k === 'cart' && renderSummary());

// Muestras de formulario y alertas
initQty(qs('#qty'), { min: 1, max: 6, value: 2 });
initRange(qs('#range'), ({ min, max }) => { qs('#range-out').textContent = `${formatPrice(min)} – ${formatPrice(max)}`; });
setFieldError(qs('#f-err'), 'Escribe un correo válido, por ejemplo nombre@correo.com');
qs('#btn-load').addEventListener('click', (e) => { const b = e.currentTarget; b.classList.add('is-loading'); setTimeout(() => b.classList.remove('is-loading'), 1500); });
document.querySelectorAll('[data-toast]').forEach((b) => b.addEventListener('click', () => toast({ type: b.dataset.toast, title: 'Mensaje de ejemplo', message: 'Así se ve el aviso de tipo ' + b.dataset.toast + '.' })));
qs('#empty').innerHTML = emptyState({ title: 'Tu reserva está vacía', text: 'Agrega servicios para ver aquí el resumen.', actionLabel: 'Explorar servicios', href: '#' });

// Paleta
const colors = ['primary', 'primary-dark', 'secondary', 'accent', 'accent-strong', 'bg', 'surface', 'surface-alt', 'border', 'text', 'text-muted'];
qs('#swatches').innerHTML = colors.map((c) => `<div class="swatch" style="background:var(--color-${c});color:${['bg', 'surface', 'surface-alt', 'border'].includes(c) ? 'var(--color-text)' : 'var(--color-on-dark)'}">--color-${c}</div>`).join('');
