/* =====================================================================
   PÁGINA · 04 TARIFAS
   Interacción de selección de planes, precarga en el Paso 1 de reserva
   y animaciones de revelado.
   ===================================================================== */
import '../main.js';
import { PLANS, getPlan } from '../../data/services.js';
import { setPlan } from '../store.js';
import { initReveal, toast } from '../ui.js';

/* Delegación de eventos para los botones "Reservar plan" */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-book-plan');
  if (!btn) return;

  const planId = btn.dataset.plan;
  const plan = getPlan(planId);

  if (!plan) return;

  // Precarga el plan en el store compartido (requerimiento del README)
  setPlan(planId);

  // Notificación breve y navegación inmediata al Paso 1 de reserva
  toast({
    type: 'success',
    title: 'Plan seleccionado',
    message: `${plan.nombre} se ha cargado en tu reserva.`,
    duration: 1800,
  });

  // Redirige al paso 1 con el parámetro del plan
  setTimeout(() => {
    window.location.href = `reserva-1.html?plan=${encodeURIComponent(planId)}`;
  }, 350);
});

/* Inicializa animaciones de revelado al scroll */
initReveal();
