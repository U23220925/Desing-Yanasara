/* =====================================================================
   COMPONENTE · Footer global
   Uso: <div id="site-footer" data-component="footer"></div>
   ===================================================================== */
import { url } from '../paths.js';
import { LOGO } from './header.js';

const ICON = {
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
};

export function mountFooter(target = document.getElementById('site-footer')) {
  if (!target) return;
  target.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="${url('index.html')}" aria-label="YANASARA TERMALES, ir al inicio">${LOGO}<span><span class="brand__name">YANASARA</span><span class="brand__sub">TERMALES</span></span></a>
            <p>Bienestar natural en el corazón de los Andes.</p>
            <div class="social" aria-label="Redes sociales (ilustrativas)">
              <span role="img" aria-label="Facebook (ilustrativo)">FB</span><span role="img" aria-label="Instagram (ilustrativo)">IG</span>
              <span role="img" aria-label="WhatsApp (ilustrativo)">WA</span><span role="img" aria-label="YouTube (ilustrativo)">YT</span>
            </div>
          </div>
          <nav aria-label="Navegación del sitio">
            <h2 class="footer-title">Navegación</h2>
            <ul class="footer-list">
              <li><a href="${url('index.html')}">Inicio</a></li><li><a href="${url('servicios.html')}">Servicios</a></li>
              <li><a href="${url('tarifas.html')}">Tarifas</a></li><li><a href="${url('historia.html')}">Historia</a></li>
              <li><a href="${url('admin/acceso.html')}">Administración</a></li>
            </ul>
          </nav>
          <div>
            <h2 class="footer-title">Contacto (demostrativo)</h2>
            <ul class="footer-list">
              <li>${ICON.mail}<span>reservas@yanasara.example</span></li>
              <li>${ICON.phone}<span>+51 000 000 000</span></li>
              <li>${ICON.clock}<span>Todos los días · 9:00 a 18:00 h</span></li>
            </ul>
          </div>
          <div>
            <h2 class="footer-title">Ubicación</h2>
            <ul class="footer-list"><li>${ICON.pin}<span>Yanasara, Huamachuco<br>La Libertad · Perú</span></li></ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>Demostración académica · Tarifas, fechas y reservas referenciales. Sin pagos ni disponibilidad real.</span>
          <span>Diseñado para una pausa consciente.</span>
        </div>
      </div>
    </footer>`;
}
