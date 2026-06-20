export const fmt = (price) =>
  `$${Number(price).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;
