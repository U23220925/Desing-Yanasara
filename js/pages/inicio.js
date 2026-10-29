/* =====================================================================
   PÁGINA · 01 INICIO
   Buscador de reservas flotante y galería con visor lightbox ampliado.
   ===================================================================== */
import '../main.js';
import { updateBooking } from '../store.js';
import { qs, qsa, initReveal, toast } from '../ui.js';

/* ---------------- Buscador de Disponibilidad Flotante ---------------- */
const bookingForm = qs('#floating-booking-form');
const inputDate = qs('#search-date');
const selectAdults = qs('#search-adults');
const selectChildren = qs('#search-children');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = inputDate.value;
  const adults = Number(selectAdults.value) || 2;
  const children = Number(selectChildren.value) || 0;

  if (!date) {
    toast({
      type: 'warning',
      title: 'Fecha requerida',
      message: 'Por favor selecciona la fecha de tu visita.',
    });
    return;
  }

  // Actualiza la reserva en curso en el store compartido
  updateBooking({
    date,
    adults,
    children,
  });

  toast({
    type: 'success',
    title: 'Disponibilidad confirmada',
    message: `Cargando reserva para el ${date} con ${adults} adultos...`,
    duration: 1200,
  });

  const submitBtn = qs('#btn-check-availability');
  submitBtn.classList.add('is-loading');

  setTimeout(() => {
    window.location.href = `reserva-1.html?date=${encodeURIComponent(date)}&adults=${adults}&children=${children}`;
  }, 350);
});

/* ---------------- Galería con Visor Lightbox Modal ---------------- */
const modal = qs('#lightbox-modal');
const modalImg = qs('#lightbox-img');
const modalCaption = qs('#lightbox-caption');
const btnCloseModal = qs('#btn-close-lightbox');
const overlay = qs('#lightbox-overlay');

const openLightbox = (src, caption) => {
  modalImg.src = src;
  modalImg.alt = caption;
  modalCaption.textContent = caption;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  btnCloseModal.focus();
};

const closeLightbox = () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

qsa('.galeria-item').forEach((item) => {
  item.addEventListener('click', () => {
    const src = item.dataset.img;
    const caption = item.dataset.caption || 'Fotografía de Yanasara Termales';
    openLightbox(src, caption);
  });
});

btnCloseModal.addEventListener('click', closeLightbox);
overlay.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeLightbox();
  }
});

initReveal();
