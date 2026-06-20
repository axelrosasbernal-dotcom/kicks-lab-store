export const isDiscountActive = (p) => {
  if (!p || !p.discount_enabled) return false;
  const now = new Date();
  if (p.discount_start && new Date(p.discount_start) > now) return false;
  if (p.discount_end && new Date(p.discount_end) < now) return false;
  return true;
};

export const effectivePrice = (p) =>
  isDiscountActive(p) && p.sale_price ? Number(p.sale_price) : Number(p.price);

export const cleanSize = (s) => String(s).replace(/\s*(euros?|EUR|Euro)\s*/gi, '').trim();

export function getStockStatus(stock) {
  const s = Number(stock);
  if (stock === '' || stock === null || stock === undefined || isNaN(s)) return null;
  if (s === 0)  return { label: 'Agotado',        color: '#ef4444', bg: 'rgba(239,68,68,0.13)' };
  if (s <= 3)   return { label: 'Pocas unidades', color: '#facc15', bg: 'rgba(250,204,21,0.13)' };
  return              { label: 'Disponible',       color: '#22c55e', bg: 'rgba(34,197,94,0.13)' };
}
