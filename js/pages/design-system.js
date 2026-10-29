/* =====================================================================
   PÁGINA · 13 DESIGN SYSTEM & UI KIT
   Documentación viva, interactividad de controles y disparadores de toast.
   ===================================================================== */
import '../main.js';
import { formatPrice } from '../../data/services.js';
import { qs, qsa, initQty, initRange, toast, initReveal } from '../ui.js';

/* 1. Genera los swatches de color vivos */
const SWATCHES = [
  { name: 'primary', hex: '#245a43', desc: 'Verde bosque (títulos, footer)' },
  { name: 'primary-dark', hex: '#194332', desc: 'Verde bosque oscuro (hover)' },
  { name: 'secondary', hex: '#167a59', desc: 'Verde esmeralda (éxito, enlaces)' },
  { name: 'accent', hex: '#b96849', desc: 'Terracota (precios, acentos)' },
  { name: 'accent-strong', hex: '#a25a3e', desc: 'Terracota reforzado (botones, 5.1:1)' },
  { name: 'bg', hex: '#f6f1e7', desc: 'Crema (fondo general)' },
  { name: 'surface', hex: '#fffefa', desc: 'Blanco cálido (tarjetas, campos)' },
  { name: 'surface-alt', hex: '#e9ddc9', desc: 'Arena (secciones de contraste)' },
  { name: 'border', hex: '#a8bca4', desc: 'Verde salvia (bordes principales)' },
  { name: 'text', hex: '#2b2a26', desc: 'Texto principal' },
  { name: 'text-muted', hex: '#6b655a', desc: 'Texto secundario atenuado' },
];

const swatchesContainer = qs('#swatches-container');
if (swatchesContainer) {
  swatchesContainer.innerHTML = SWATCHES.map((s) => {
    const isDark = ['primary', 'primary-dark', 'secondary', 'accent', 'accent-strong'].includes(s.name);
    return `
      <div class="ds-swatch" style="background: var(--color-${s.name}); color: ${isDark ? 'var(--color-on-dark)' : 'var(--color-text)'};">
        <span class="ds-swatch__name">--color-${s.name}</span>
        <span class="ds-swatch__val">${s.hex}</span>
        <span style="font-size: 10px; margin-top: 4px; opacity: 0.85;">${s.desc}</span>
      </div>`;
  }).join('');
}

/* 2. Activa Stepper de demostración */
const qtyEl = qs('#ds-qty');
if (qtyEl) {
  initQty(qtyEl, { min: 1, max: 6, value: 2 });
}

/* 3. Activa Rango de demostración */
const rangeEl = qs('#ds-range');
const rangeOut = qs('#ds-range-out');
if (rangeEl && rangeOut) {
  initRange(rangeEl, ({ min, max }) => {
    rangeOut.textContent = `${formatPrice(min)} – ${formatPrice(max)}`;
  });
}

/* 4. Disparadores de Toast Interactivos */
qsa('[data-toast-trigger]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.toastTrigger;
    const titles = {
      success: 'Operación confirmada',
      error: 'Error de procesamiento',
      warning: 'Advertencia importante',
      info: 'Información del sistema',
    };
    const messages = {
      success: 'Los cambios se han guardado con éxito en el almacenamiento local.',
      error: 'No fue posible completar la solicitud. Verifica los campos requeridos.',
      warning: 'Recuerda que todas las tarifas y horarios mostrados son referenciales.',
      info: 'Estás navegando en el prototipo interactivo de Yanasara Termales.',
    };

    toast({
      type,
      title: titles[type] || 'Notificación',
      message: messages[type] || 'Aviso del sistema de interfaz.',
      duration: 3500,
    });
  });
});

initReveal();
