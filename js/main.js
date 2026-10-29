/* Arranque común: cada página lo importa con `import '../main.js';` */
import { mountHeader } from './components/header.js';
import { mountFooter } from './components/footer.js';
import { initUI } from './ui.js';
mountHeader(); mountFooter(); initUI();
