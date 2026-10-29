/* =====================================================================
   PÁGINA · 10 ADMINISTRACIÓN - ACCESO
   Validación demostrativa de login, autocompletado y redirección.
   ===================================================================== */
import '../main.js';
import { DEMO_ADMIN, loginAdmin, isAdmin } from '../store.js';
import { qs, setFieldError, setFieldValid, toast, initReveal } from '../ui.js';

// Si ya tiene sesión activa, redirige a la lista de reservas
if (isAdmin()) {
  window.location.replace('reservas.html');
}

const form = qs('#admin-login-form');
const emailInput = qs('#admin-email');
const passwordInput = qs('#admin-password');
const fieldEmail = qs('#field-email');
const fieldPassword = qs('#field-password');
const btnTogglePwd = qs('#btn-toggle-pwd');
const btnAutofill = qs('#btn-autofill');

/* Alternar visibilidad de contraseña */
btnTogglePwd.addEventListener('click', () => {
  const isPwd = passwordInput.type === 'password';
  passwordInput.type = isPwd ? 'text' : 'password';
  btnTogglePwd.textContent = isPwd ? 'Ocultar' : 'Mostrar';
});

/* Autocompletar credenciales demo */
btnAutofill.addEventListener('click', () => {
  emailInput.value = DEMO_ADMIN.email;
  passwordInput.value = DEMO_ADMIN.password;
  setFieldValid(fieldEmail);
  setFieldValid(fieldPassword);
  toast({
    type: 'info',
    title: 'Credenciales cargadas',
    message: 'Se han ingresado los datos de demostración.',
    duration: 2500,
  });
});

/* Envío y validación */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  let isValid = true;

  // Validación de campo email
  if (!email) {
    setFieldError(fieldEmail, 'Ingresa el correo de administración.');
    isValid = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    setFieldError(fieldEmail, 'Ingresa un correo electrónico válido.');
    isValid = false;
  } else {
    setFieldValid(fieldEmail);
  }

  // Validación de campo contraseña
  if (!password) {
    setFieldError(fieldPassword, 'Ingresa tu contraseña.');
    isValid = false;
  } else {
    setFieldValid(fieldPassword);
  }

  if (!isValid) return;

  // Comprobación demostrativa con store.js
  const success = loginAdmin(email, password);

  if (!success) {
    setFieldError(fieldPassword, 'Credenciales incorrectas. Usa admin@yanasara.example / Demo2026');
    toast({
      type: 'error',
      title: 'Acceso denegado',
      message: 'Las credenciales ingresadas no coinciden con la cuenta de ejemplo.',
    });
    return;
  }

  // Éxito: aviso y redirección al panel de reservas
  toast({
    type: 'success',
    title: 'Sesión iniciada',
    message: 'Bienvenido al panel administrativo de Yanasara.',
    duration: 1500,
  });

  const submitBtn = qs('#btn-login');
  submitBtn.classList.add('is-loading');

  setTimeout(() => {
    window.location.href = 'reservas.html';
  }, 400);
});

initReveal();
