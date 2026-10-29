# Catálogo de interacciones y animaciones

Se completa con cada pantalla. Todos los tiempos y curvas salen de `css/tokens.css`.

| ID | Tipo | Dónde | Descripción | Duración | Curva |
|---|---|---|---|---|---|
| I-01 | Transición | Entre páginas | Fundido al salir y al entrar | 300 ms | ease-in-out |
| I-02 | Microinteracción | Botones | Color en hover; escala 0,98 al presionar | 150 ms | ease-out |
| I-03 | Microinteracción | Enlaces del encabezado | Subrayado terracota que crece (50 % en hover, 100 % en página activa) | 300 ms | ease-out |
| I-04 | Microinteracción | Casilla | El check se dibuja al marcar | 150 ms | ease-out |
| I-05 | Microinteracción | Contador del carrito | Rebote al aumentar | 300 ms | spring |
| I-06 | Microinteracción | Tarjeta de servicio | Se eleva 4 px en hover; foto con zoom 1,04 | 300 / 500 ms | ease-out |
| I-07 | Estado | Tarjeta de servicio | Pasa a "Agregado" (borde esmeralda, etiqueta y botón) | 300 ms | spring |
| I-08 | Transición | Menú móvil | Panel que se desliza desde la derecha | 300 ms | ease-out |
| I-09 | Microinteracción | Toast | Entra con rebote y sale deslizándose | 300 ms | spring / ease-in-out |
| I-10 | Microinteracción | Campo con error | Vibración horizontal corta | 300 ms | ease-in-out |
| I-11 | Transición | Secciones al hacer scroll | Revelado escalonado (80 ms entre elementos) | 500 ms | ease-out |
| I-12 | Estado | Indicador de pasos | La línea se llena al avanzar | 500 ms | ease-out |
| I-13 | Estado | Botón | Cargando (spinner) | 700 ms | linear |

Con `prefers-reduced-motion` todas las duraciones pasan a 1 ms.
