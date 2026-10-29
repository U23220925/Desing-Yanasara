/* =====================================================================
   PÁGINA · SUS Y MODO PRUEBA
   10 preguntas estándar SUS (Brooke, 1996), cálculo automático (0-100),
   interpretación Sauro & Lewis, modo prueba (?test=1) y exportación CSV.
   ===================================================================== */
import '../main.js';
import { qs, qsa, countUp, toast, initReveal, escapeHTML as esc } from '../ui.js';

/* ---------------- Las 10 Preguntas Estándar SUS ---------------- */
const QUESTIONS = [
  { id: 1, text: 'Creo que me gustaría usar este sistema con frecuencia.', type: 'pos' },
  { id: 2, text: 'Encontré el sistema innecesariamente complejo.', type: 'neg' },
  { id: 3, text: 'Pensé que el sistema era fácil de usar.', type: 'pos' },
  { id: 4, text: 'Creo que necesitaría el apoyo de una persona técnica para poder usar este sistema.', type: 'neg' },
  { id: 5, text: 'Encontré que las diversas funciones de este sistema estaban bien integradas.', type: 'pos' },
  { id: 6, text: 'Pensé que había demasiada inconsistencia en este sistema.', type: 'neg' },
  { id: 7, text: 'Imagino que la mayoría de la gente aprendería a usar este sistema muy rápidamente.', type: 'pos' },
  { id: 8, text: 'Encontré el sistema muy engorroso o pesado de usar.', type: 'neg' },
  { id: 9, text: 'Me sentí muy seguro y confiado usando el sistema.', type: 'pos' },
  { id: 10, text: 'Necesité aprender muchas cosas antes de poder seguir adelante con este sistema.', type: 'neg' },
];

/* ---------------- Renderizado de las 10 Preguntas ---------------- */
const questionsContainer = qs('#sus-questions-container');

function renderQuestions() {
  questionsContainer.innerHTML = QUESTIONS.map((q) => `
    <article class="sus-q-card" data-q="${q.id}">
      <p class="sus-q-text"><strong>${q.id}.</strong> ${esc(q.text)}</p>
      <div class="sus-q-scale" role="radiogroup" aria-label="Pregunta ${q.id}: ${esc(q.text)}">
        ${[1, 2, 3, 4, 5].map((val) => `
          <label class="sus-opt">
            <input type="radio" name="sus_q_${q.id}" value="${val}" required>
            <span class="sus-opt__val">${val}</span>
          </label>
        `).join('')}
      </div>
    </article>
  `).join('');
}

renderQuestions();

/* ---------------- Cálculo e Interpretación del Puntaje SUS ---------------- */
const susForm = qs('#sus-form');
const resultsCard = qs('#sus-results-card');
const scoreValEl = qs('#sus-score-val');
const gradeBadgeEl = qs('#sus-grade-badge');
const interpTitleEl = qs('#sus-interp-title');
const interpDescEl = qs('#sus-interp-desc');
const barFillEl = qs('#sus-bar-fill');
const btnFillDemo = qs('#btn-fill-sus-demo');
const btnResetSus = qs('#btn-reset-sus');

let lastCalculatedScore = null;

function calculateSUS() {
  let scoreSum = 0;
  let allAnswered = true;

  for (let i = 1; i <= 10; i++) {
    const radio = qs(`input[name="sus_q_${i}"]:checked`, susForm);
    if (!radio) {
      allAnswered = false;
      const card = qs(`.sus-q-card[data-q="${i}"]`);
      if (card) {
        card.style.borderColor = 'var(--color-error)';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      break;
    } else {
      const card = qs(`.sus-q-card[data-q="${i}"]`);
      if (card) card.style.borderColor = 'var(--color-border)';
      const val = Number(radio.value);
      // Fórmulas estándar de Brooke:
      // Ítems impares (1, 3, 5, 7, 9): val - 1
      // Ítems pares (2, 4, 6, 8, 10): 5 - val
      if (i % 2 !== 0) {
        scoreSum += (val - 1);
      } else {
        scoreSum += (5 - val);
      }
    }
  }

  if (!allAnswered) {
    toast({
      type: 'warning',
      title: 'Cuestionario incompleto',
      message: 'Por favor responde a las 10 preguntas para calcular el puntaje.',
    });
    return null;
  }

  // Multiplicador estándar x 2.5 para escalar a 0 - 100
  const susScore = Number((scoreSum * 2.5).toFixed(1));
  lastCalculatedScore = susScore;
  displayResults(susScore);
  return susScore;
}

function displayResults(score) {
  resultsCard.hidden = false;
  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Animación del número
  countUp(scoreValEl, score, {
    format: (n) => n.toFixed(1),
  });

  // Interpretación según Sauro & Lewis (2012)
  let grade = '';
  let badgeClass = '';
  let title = '';
  let desc = '';

  if (score >= 80.3) {
    grade = 'Grado A · Excelente';
    badgeClass = 'badge--success';
    title = 'Usabilidad Sobresaliente (Grado A)';
    desc = 'El prototipo supera ampliamente el promedio histórico de la industria (68 pts). Los evaluadores perciben el sistema como altamente intuitivo, fluido y confiable.';
  } else if (score >= 68.0) {
    grade = 'Grado B · Bueno';
    badgeClass = 'badge--success';
    title = 'Buena Usabilidad (Grado B)';
    desc = 'El sistema se ubica por encima del promedio estándar (68 pts). Las funciones principales son accesibles, aunque existen oportunidades menores de refinamiento.';
  } else if (score >= 51.0) {
    grade = 'Grado C / D · Aceptable marginal';
    badgeClass = 'badge--warning';
    title = 'Usabilidad Marginal (Grado C)';
    desc = 'El puntaje se encuentra por debajo del estándar de la industria. Se detectan barreras que demandan ajustes en navegación y retroalimentación.';
  } else {
    grade = 'Grado F · Crítico';
    badgeClass = 'badge--error';
    title = 'Problemas Críticos de Usabilidad (Grado F)';
    desc = 'El prototipo genera confusión o excesiva fricción. Se requiere una revisión estructural de los flujos de navegación.';
  }

  gradeBadgeEl.innerHTML = `<span class="badge ${badgeClass}" style="font-size: var(--fs-ui); padding: 6px 14px;">${grade}</span>`;
  interpTitleEl.textContent = title;
  interpDescEl.textContent = desc;

  // Barra de progreso visual
  barFillEl.style.width = `${Math.min(100, Math.max(0, score))}%`;
  if (score >= 68) {
    barFillEl.style.background = 'var(--color-secondary)';
  } else {
    barFillEl.style.background = 'var(--color-accent)';
  }

  toast({
    type: 'success',
    title: `Puntaje SUS: ${score} pts`,
    message: grade,
  });
}

susForm.addEventListener('submit', (e) => {
  e.preventDefault();
  calculateSUS();
});

/* Llenar ejemplo con puntaje alto demostrativo */
btnFillDemo.addEventListener('click', () => {
  // Positivas: 4 o 5; Negativas: 1 o 2
  const demoAnswers = [5, 1, 5, 1, 4, 1, 5, 1, 5, 2];
  demoAnswers.forEach((val, idx) => {
    const radio = qs(`input[name="sus_q_${idx + 1}"][value="${val}"]`, susForm);
    if (radio) radio.checked = true;
  });
  toast({
    type: 'info',
    title: 'Respuestas de ejemplo cargadas',
    message: 'Calculando puntaje SUS ilustrativo...',
    duration: 1500,
  });
  calculateSUS();
});

btnResetSus.addEventListener('click', () => {
  susForm.reset();
  resultsCard.hidden = true;
  lastCalculatedScore = null;
  qsa('.sus-q-card', susForm).forEach((c) => (c.style.borderColor = 'var(--color-border)'));
});

/* ---------------- MODO PRUEBA DE TAREAS (?test=1) ---------------- */
const testSection = qs('#testmode-section');
const btnToggleTest = qs('#btn-toggle-testmode');
const metricClicksEl = qs('#metric-clicks');
const metricTimerEl = qs('#metric-timer');
const metricActiveTaskEl = qs('#metric-active-task');
const btnExportCSV = qs('#btn-export-csv');

let totalClicks = 0;
let activeTaskId = null;
let taskStartTime = null;
let timerInterval = null;

const tasksData = {
  1: { desc: 'Explorar catálogo y filtrar por aguas termales (≤ S/ 10)', seconds: 0, clicks: 0, done: false },
  2: { desc: 'Agregar 2 servicios a la reserva y revisar el carrito', seconds: 0, clicks: 0, done: false },
  3: { desc: 'Seleccionar plan Circuito termal e iniciar reserva', seconds: 0, clicks: 0, done: false },
  4: { desc: 'Ingresar al panel administrativo y consultar reservas', seconds: 0, clicks: 0, done: false },
};

function formatTimer(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Contador global de clics
document.addEventListener('click', () => {
  if (!testSection.hidden) {
    totalClicks++;
    metricClicksEl.textContent = totalClicks;
    if (activeTaskId) {
      tasksData[activeTaskId].clicks++;
    }
  }
});

// Comprueba parámetro URL ?test=1
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('test') === '1') {
  setTestMode(true);
}

function setTestMode(active) {
  testSection.hidden = !active;
  btnToggleTest.textContent = active ? 'Desactivar Modo Prueba' : 'Activar Modo Prueba (?test=1)';
  if (active) {
    toast({
      type: 'info',
      title: 'Modo Prueba de Usabilidad activado',
      message: 'Puedes cronometrar las tareas y exportar los resultados en CSV.',
    });
  }
}

btnToggleTest.addEventListener('click', () => {
  const isHidden = testSection.hidden;
  setTestMode(isHidden);
});

// Control de botones de tareas
qsa('.btn-task-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const taskId = Number(btn.dataset.task);

    if (activeTaskId === taskId) {
      // Finalizar tarea
      clearInterval(timerInterval);
      const elapsed = Math.round((performance.now() - taskStartTime) / 1000);
      tasksData[taskId].seconds = elapsed;
      tasksData[taskId].done = true;

      btn.textContent = 'Rehacer';
      btn.classList.remove('btn--primary');
      btn.classList.add('btn--outline');

      const item = btn.closest('.task-item');
      item.classList.remove('is-running');
      item.classList.add('is-completed');

      qs(`#task-time-${taskId}`).textContent = `${formatTimer(elapsed)} (${tasksData[taskId].clicks} clics)`;

      toast({
        type: 'success',
        title: `Tarea ${taskId} completada`,
        message: `Tiempo: ${formatTimer(elapsed)} | Clics: ${tasksData[taskId].clicks}`,
      });

      activeTaskId = null;
      metricActiveTaskEl.textContent = 'Ninguna';
      metricTimerEl.textContent = '00:00';
    } else {
      // Iniciar tarea
      if (activeTaskId) {
        clearInterval(timerInterval);
        const prevBtn = qs(`.btn-task-toggle[data-task="${activeTaskId}"]`);
        if (prevBtn) prevBtn.textContent = 'Iniciar';
      }

      activeTaskId = taskId;
      taskStartTime = performance.now();
      tasksData[taskId].clicks = 0;
      metricActiveTaskEl.textContent = `Tarea ${taskId}`;

      const item = btn.closest('.task-item');
      qsa('.task-item').forEach((t) => t.classList.remove('is-running'));
      item.classList.add('is-running');

      btn.textContent = 'Finalizar tarea';
      btn.classList.remove('btn--outline');
      btn.classList.add('btn--primary');

      timerInterval = setInterval(() => {
        const now = Math.round((performance.now() - taskStartTime) / 1000);
        metricTimerEl.textContent = formatTimer(now);
      }, 500);
    }
  });
});

/* ---------------- Exportación a CSV ---------------- */
btnExportCSV.addEventListener('click', () => {
  const score = lastCalculatedScore !== null ? lastCalculatedScore : 'No calculado';
  const nowIso = new Date().toLocaleString('es-PE');

  const rows = [
    ['Id Tarea', 'Descripcion de la Tarea', 'Tiempo (segundos)', 'Tiempo (formato)', 'Clics', 'Puntaje SUS', 'Fecha y Hora'],
  ];

  Object.entries(tasksData).forEach(([id, t]) => {
    rows.push([
      `Tarea ${id}`,
      `"${t.desc}"`,
      t.seconds,
      formatTimer(t.seconds),
      t.clicks,
      score,
      `"${nowIso}"`,
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `yanasara_reporte_usabilidad_sus_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  toast({
    type: 'success',
    title: 'Reporte CSV descargado',
    message: 'Se ha guardado el informe de tiempos, clics y puntaje SUS.',
  });
});

initReveal();
