/* =====================================================================
   PÁGINA · 09 RESERVA · PASO 3 CONFIRMACIÓN
   Muestra el código generado, datos ingresados, check animado y
   enlaces hacia Inicio y Administración.
   ===================================================================== */
import '../main.js';
import { getReservation, getLastReservation } from '../store.js';
import { formatPrice } from '../../data/services.js';
import { qs, initReveal, escapeHTML as esc } from '../ui.js';

const params = new URLSearchParams(window.location.search);
const codigo = params.get('codigo') || '';

// Obtiene la reserva recién creada o la última registrada
const r = (codigo ? getReservation(codigo) : null) || getLastReservation();

if (r) {
  const v = r.visitante || {};

  qs('#reserva-codigo').textContent = r.codigo;
  qs('#conf-visitante-nombre').textContent = `${v.nombres || 'Visitante'} ${v.apellidos || ''}`;
  qs('#conf-visitante-doc').textContent = `${v.tipoDoc || 'DNI'}: ${v.numDoc || '—'}`;
  qs('#conf-visitante-correo').textContent = v.correo || '—';
  qs('#conf-visitante-celular').textContent = v.celular || '—';

  qs('#conf-experiencia').textContent = r.experiencia || 'Circuito termal';
  qs('#conf-fecha-hora').textContent = `${r.fecha} a las ${r.hora} h`;
  qs('#conf-visitantes-qty').textContent = `${r.adultos} adulto(s)${r.ninos > 0 ? `, ${r.ninos} niño(s)` : ''}`;
  qs('#conf-total-val').textContent = formatPrice(r.total);

  // Botón hacia administración
  const btnAdmin = qs('#btn-view-admin');
  if (btnAdmin) {
    btnAdmin.href = `admin/detalle.html?codigo=${encodeURIComponent(r.codigo)}`;
  }
} else {
  // Respaldo de demostración si se entra directo
  qs('#reserva-codigo').textContent = 'YT-00128';
  qs('#conf-visitante-nombre').textContent = 'Valeria Rojas';
  qs('#conf-visitante-doc').textContent = 'DNI: 74829163';
  qs('#conf-visitante-correo').textContent = 'valeria.rojas@example.com';
  qs('#conf-visitante-celular').textContent = '999123456';
  qs('#conf-experiencia').textContent = 'Circuito termal';
  qs('#conf-fecha-hora').textContent = '18 de octubre de 2026 · 10:00 h';
  qs('#conf-visitantes-qty').textContent = '2 adultos';
  qs('#conf-total-val').textContent = formatPrice(30);
}

initReveal();
