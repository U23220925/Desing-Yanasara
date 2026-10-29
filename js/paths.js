/* Ruta raíz del sitio. Las páginas dentro de /admin declaran <html data-root="../"> */
export const ROOT = document.documentElement.dataset.root || '';
export const url = (path) => ROOT + path;
