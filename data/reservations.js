/* Reservas FICTICIAS para el panel de administración (datos inventados). */
const v = (nombres, apellidos, numDoc, correo, celular) => ({ nombres, apellidos, tipoDoc: 'DNI', numDoc, correo, celular });
export const SEED_RESERVATIONS = [
  { codigo: 'YT-00128', visitante: v('Valeria', 'Rojas', '74829163', 'valeria.rojas@example.com', '999123456'), experiencia: 'Circuito termal', fecha: '2026-10-18', hora: '10:00', adultos: 2, ninos: 0, total: 30, estado: 'Confirmada' },
  { codigo: 'YT-00127', visitante: v('Mateo', 'Salazar', '70112233', 'mateo.salazar@example.com', '988111222'), experiencia: 'Circuito termal', fecha: '2026-10-18', hora: '10:00', adultos: 1, ninos: 0, total: 15, estado: 'Pendiente' },
  { codigo: 'YT-00126', visitante: v('Lucía', 'Torres', '71223344', 'lucia.torres@example.com', '977333444'), experiencia: 'Circuito termal', fecha: '2026-10-18', hora: '10:00', adultos: 2, ninos: 0, total: 30, estado: 'Confirmada' },
  { codigo: 'YT-00125', visitante: v('Diego', 'Flores', '72334455', 'diego.flores@example.com', '966555666'), experiencia: 'Circuito termal', fecha: '2026-10-18', hora: '10:00', adultos: 3, ninos: 0, total: 45, estado: 'Cancelada' },
  { codigo: 'YT-00124', visitante: v('Ana', 'Quispe', '73445566', 'ana.quispe@example.com', '955777888'), experiencia: 'Circuito termal', fecha: '2026-10-18', hora: '10:00', adultos: 2, ninos: 0, total: 30, estado: 'Confirmada' },
  { codigo: 'YT-00123', visitante: v('Sofía', 'Paredes', '74556677', 'sofia.paredes@example.com', '944999000'), experiencia: 'Circuito termal', fecha: '2026-10-18', hora: '10:00', adultos: 1, ninos: 0, total: 15, estado: 'Pendiente' },
];
