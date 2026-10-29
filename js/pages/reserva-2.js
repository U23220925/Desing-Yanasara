/* =====================================================================
   PÁGINA · 08 RESERVA · PASO 2 DATOS DEL VISITANTE
   Validación en vivo, autocompletado de prueba, botón habilitado solo si
   todo es válido y persistencia en store.js.
   ===================================================================== */
import '../main.js';
import { getBooking, saveVisitor, getLines, bookingTotal, createReservation } from '../store.js';
import { formatPrice } from '../../data/services.js';
import { qs, setFieldError, setFieldValid, toast, initReveal, escapeHTML as esc } from '../ui.js';

const form = qs('#visitor-form');
const inputNombres = qs('#visitor-nombres');
const inputApellidos = qs('#visitor-apellidos');
const selectTipoDoc = qs('#visitor-tipodoc');
const inputNumDoc = qs('#visitor-numdoc');
const inputCorreo = qs('#visitor-correo');
const inputCelular = qs('#visitor-celular');
const checkTerms = qs('#visitor-terms');
const btnSubmit = qs('#btn-confirm-step');
const btnAutofill = qs('#btn-autofill-visitor');
const btnBackStep1 = qs('#btn-back-step1');

// Campos DOM para errores
const fieldNombres = qs('#field-nombres');
const fieldApellidos = qs('#field-apellidos');
const fieldNumDoc = qs('#field-numdoc');
const fieldCorreo = qs('#field-correo');
const fieldCelular = qs('#field-celular');
const fieldTerminos = qs('#field-terminos');

// Resumen lateral
const summaryLinesList = qs('#summary-lines-list');
const sbDateVal = qs('#sb-date-val');
const sbTimeVal = qs('#sb-time-val');
const sbVisitorsVal = qs('#sb-visitors-val');
const sbTotalVal = qs('#sb-total-val');

const booking = getBooking();

/* Carga datos previos si ya existían para no perderlos al volver */
if (booking.visitor) {
  inputNombres.value = booking.visitor.nombres || '';
  inputApellidos.value = booking.visitor.apellidos || '';
  selectTipoDoc.value = booking.visitor.tipoDoc || 'DNI';
  inputNumDoc.value = booking.visitor.numDoc || '';
  inputCorreo.value = booking.visitor.correo || '';
  inputCelular.value = booking.visitor.celular || '';
  checkTerms.checked = true;
}

/* Renderiza resumen en el sidebar */
function renderSummary() {
  const lines = getLines();
  const total = bookingTotal();

  summaryLinesList.innerHTML = lines.map((l) => `
    <div class="summary-line-item">
      <span>${esc(l.nombre)}</span>
      <strong>${formatPrice(l.total)}</strong>
    </div>
  `).join('');

  const dayNum = parseInt((booking.date || '2026-10-18').split('-')[2], 10);
  sbDateVal.textContent = `${dayNum} oct 2026`;
  sbTimeVal.textContent = `${booking.time || '10:00'} h`;
  sbVisitorsVal.textContent = `${booking.adults || 2} adultos${booking.children > 0 ? `, ${booking.children} niños` : ''}`;
  sbTotalVal.textContent = formatPrice(total);
}

/* Guardado silencioso antes de volver al paso 1 */
btnBackStep1.addEventListener('click', () => {
  saveDraftVisitor();
});

function saveDraftVisitor() {
  saveVisitor({
    nombres: inputNombres.value.trim(),
    apellidos: inputApellidos.value.trim(),
    tipoDoc: selectTipoDoc.value,
    numDoc: inputNumDoc.value.trim(),
    correo: inputCorreo.value.trim(),
    celular: inputCelular.value.trim(),
  });
}

/* Validación en vivo de cada campo (Requerimiento estricto) */
function validateForm(showErrors = false) {
  let valid = true;

  // 1. Nombres
  const nombres = inputNombres.value.trim();
  if (!nombres) {
    if (showErrors) setFieldError(fieldNombres, 'El nombre es obligatorio.');
    valid = false;
  } else if (nombres.length < 2) {
    if (showErrors) setFieldError(fieldNombres, 'Ingresa un nombre válido (mín. 2 caracteres).');
    valid = false;
  } else {
    setFieldValid(fieldNombres);
  }

  // 2. Apellidos
  const apellidos = inputApellidos.value.trim();
  if (!apellidos) {
    if (showErrors) setFieldError(fieldApellidos, 'El apellido es obligatorio.');
    valid = false;
  } else if (apellidos.length < 2) {
    if (showErrors) setFieldError(fieldApellidos, 'Ingresa un apellido válido.');
    valid = false;
  } else {
    setFieldValid(fieldApellidos);
  }

  // 3. Documento (8 dígitos para DNI)
  const tipoDoc = selectTipoDoc.value;
  const numDoc = inputNumDoc.value.trim();
  if (!numDoc) {
    if (showErrors) setFieldError(fieldNumDoc, 'El número de documento es obligatorio.');
    valid = false;
  } else if (tipoDoc === 'DNI' && !/^\d{8}$/.test(numDoc)) {
    if (showErrors) setFieldError(fieldNumDoc, 'El DNI debe contener exactamente 8 dígitos numéricos.');
    valid = false;
  } else if (numDoc.length < 5) {
    if (showErrors) setFieldError(fieldNumDoc, 'Ingresa un documento válido.');
    valid = false;
  } else {
    setFieldValid(fieldNumDoc);
  }

  // 4. Correo electrónico válido
  const correo = inputCorreo.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correo) {
    if (showErrors) setFieldError(fieldCorreo, 'El correo electrónico es obligatorio.');
    valid = false;
  } else if (!emailRegex.test(correo)) {
    if (showErrors) setFieldError(fieldCorreo, 'Escribe un correo válido (ejemplo: nombre@correo.com).');
    valid = false;
  } else {
    setFieldValid(fieldCorreo);
  }

  // 5. Celular (9 dígitos)
  const celular = inputCelular.value.trim();
  if (!celular) {
    if (showErrors) setFieldError(fieldCelular, 'El celular es obligatorio.');
    valid = false;
  } else if (!/^9\d{8}$/.test(celular)) {
    if (showErrors) setFieldError(fieldCelular, 'El celular debe tener 9 dígitos y comenzar con 9.');
    valid = false;
  } else {
    setFieldValid(fieldCelular);
  }

  // 6. Casilla de aceptación
  if (!checkTerms.checked) {
    if (showErrors) setFieldError(fieldTerminos, 'Debes aceptar las condiciones referenciales para continuar.');
    valid = false;
  } else {
    setFieldValid(fieldTerminos);
  }

  // El botón "Confirmar ejemplo" se habilita solo si todo es válido (README)
  btnSubmit.disabled = !valid;
  return valid;
}

/* Listeners de validación interactiva */
[inputNombres, inputApellidos, inputNumDoc, inputCorreo, inputCelular].forEach((inp) => {
  inp.addEventListener('input', () => validateForm(false));
  inp.addEventListener('blur', () => validateForm(true));
});
selectTipoDoc.addEventListener('change', () => validateForm(true));
checkTerms.addEventListener('change', () => validateForm(true));

/* Autocompletar datos de ejemplo */
btnAutofill.addEventListener('click', () => {
  inputNombres.value = 'Valeria';
  inputApellidos.value = 'Rojas';
  selectTipoDoc.value = 'DNI';
  inputNumDoc.value = '74829163';
  inputCorreo.value = 'valeria.rojas@example.com';
  inputCelular.value = '999123456';
  checkTerms.checked = true;

  toast({
    type: 'info',
    title: 'Datos de ejemplo cargados',
    message: 'Se han completado los datos válidos del visitante.',
  });

  validateForm(true);
});

/* Envío y confirmación */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm(true)) return;

  saveDraftVisitor();

  // Crea la reserva en el store global y limpia el carrito
  const newReservation = createReservation();

  toast({
    type: 'success',
    title: '¡Reserva confirmada!',
    message: `Código generado: ${newReservation.codigo}`,
    duration: 1500,
  });

  btnSubmit.classList.add('is-loading');

  setTimeout(() => {
    window.location.href = `reserva-3.html?codigo=${encodeURIComponent(newReservation.codigo)}`;
  }, 400);
});

renderSummary();
validateForm(false);
initReveal();
