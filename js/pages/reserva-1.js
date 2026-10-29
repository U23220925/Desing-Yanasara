/* =====================================================================
   PÁGINA · 07 RESERVA · PASO 1 EXPERIENCIA Y FECHA
   Tarjeta de experiencia, calendario de octubre 2026 con animación de salto,
   selector de horarios, steppers y resumen interactivo en vivo.
   ===================================================================== */
import '../main.js';
import { TIMES, PLANS, getPlan, formatPrice } from '../../data/services.js';
import { getBooking, updateBooking, getLines, bookingTotal } from '../store.js';
import { qs, qsa, initQty, initReveal, toast, escapeHTML as esc } from '../ui.js';

/* 1. Procesa parámetros de URL iniciales */
const urlParams = new URLSearchParams(window.location.search);
const planParam = urlParams.get('plan');
const dateParam = urlParams.get('date');
const adultsParam = urlParams.get('adults');
const childrenParam = urlParams.get('children');

const patch = {};
if (planParam) patch.planId = planParam;
if (dateParam) patch.date = dateParam;
if (adultsParam) patch.adults = Number(adultsParam);
if (childrenParam) patch.children = Number(childrenParam);
if (Object.keys(patch).length > 0) {
  updateBooking(patch);
}

let booking = getBooking();

/* 2. Tarjeta de Experiencia Elegida */
const expTitleEl = qs('#chosen-exp-title');
const expSubtitleEl = qs('#chosen-exp-subtitle');
const btnChangeExp = qs('#btn-change-exp');

function renderChosenExperience() {
  const lines = getLines();
  if (lines.length === 1 && lines[0].tipo === 'plan') {
    const plan = getPlan(lines[0].id) || PLANS[0];
    expTitleEl.textContent = plan.nombre;
    expSubtitleEl.textContent = `${plan.etiqueta} · ${formatPrice(plan.precio)} ${plan.unidad}`;
    btnChangeExp.href = 'tarifas.html';
  } else if (lines.length > 0) {
    expTitleEl.textContent = lines.map((l) => l.nombre).join(' + ');
    expSubtitleEl.textContent = `${lines.length} servicios elegidos de forma individual`;
    btnChangeExp.href = 'servicios.html';
  } else {
    expTitleEl.textContent = 'Circuito termal';
    expSubtitleEl.textContent = 'Experiencia esencial · S/ 15 por adulto';
    btnChangeExp.href = 'tarifas.html';
  }
}

/* 3. Calendario Octubre 2026 */
const daysGrid = qs('#calendar-days-grid');
const selectedDateFeedback = qs('#calendar-selected-text');

function renderCalendar() {
  daysGrid.innerHTML = '';

  // Octubre 1, 2026 fue Jueves -> 3 días vacíos (Lunes, Martes, Miércoles)
  for (let i = 0; i < 3; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'calendar-day-empty';
    emptyDiv.setAttribute('aria-hidden', 'true');
    daysGrid.appendChild(emptyDiv);
  }

  const currentDateStr = booking.date || '2026-10-18';
  const currentDayNum = parseInt(currentDateStr.split('-')[2], 10) || 18;

  for (let day = 1; day <= 31; day++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `calendar-day-btn${day === currentDayNum ? ' is-selected' : ''}`;
    btn.textContent = day;
    btn.dataset.day = day;
    const isoDate = `2026-10-${String(day).padStart(2, '0')}`;
    btn.setAttribute('aria-label', `${day} de octubre de 2026`);

    btn.addEventListener('click', () => {
      qsa('.calendar-day-btn', daysGrid).forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      booking = updateBooking({ date: isoDate });
      renderSummary();
    });

    daysGrid.appendChild(btn);
  }
}

/* 4. Selector de Horarios */
const timesGrid = qs('#times-chips-grid');

function renderTimes() {
  const currentHour = booking.time || '10:00';
  timesGrid.innerHTML = TIMES.map((time) => `
    <button type="button" class="time-chip-btn${time === currentHour ? ' is-selected' : ''}" data-time="${time}" role="radio" aria-checked="${time === currentHour}">
      ${time} h
    </button>
  `).join('');

  timesGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.time-chip-btn');
    if (!btn) return;
    qsa('.time-chip-btn', timesGrid).forEach((b) => {
      b.classList.remove('is-selected');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('is-selected');
    btn.setAttribute('aria-checked', 'true');

    booking = updateBooking({ time: btn.dataset.time });
    renderSummary();
  });
}

/* 5. Steppers de Visitantes */
const qtyAdultsEl = qs('#qty-adults');
const qtyChildrenEl = qs('#qty-children');

initQty(qtyAdultsEl, {
  min: 1,
  max: 6,
  value: booking.adults || 2,
  onChange: (val) => {
    booking = updateBooking({ adults: val });
    renderSummary();
  },
});

initQty(qtyChildrenEl, {
  min: 0,
  max: 6,
  value: booking.children || 0,
  onChange: (val) => {
    booking = updateBooking({ children: val });
    renderSummary();
  },
});

/* 6. Resumen en Vivo */
const summaryLinesList = qs('#summary-lines-list');
const sbDateVal = qs('#sb-date-val');
const sbTimeVal = qs('#sb-time-val');
const sbVisitorsVal = qs('#sb-visitors-val');
const sbTotalVal = qs('#sb-total-val');
const btnNextStep = qs('#btn-next-step');

function renderSummary() {
  const lines = getLines();
  const total = bookingTotal();

  summaryLinesList.innerHTML = lines.map((l) => `
    <div class="summary-line-item">
      <span>${esc(l.nombre)}</span>
      <strong>${formatPrice(l.total)}</strong>
    </div>
  `).join('');

  // Formato de fecha
  const dayNum = parseInt(booking.date.split('-')[2], 10);
  selectedDateFeedback.textContent = `${dayNum} de octubre de 2026`;
  sbDateVal.textContent = `${dayNum} oct 2026`;
  sbTimeVal.textContent = `${booking.time} h`;
  sbVisitorsVal.textContent = `${booking.adults} adultos${booking.children > 0 ? `, ${booking.children} niños` : ''}`;
  sbTotalVal.textContent = formatPrice(total);
}

btnNextStep.addEventListener('click', () => {
  window.location.href = 'reserva-2.html';
});

/* Inicialización */
renderChosenExperience();
renderCalendar();
renderTimes();
renderSummary();
initReveal();
