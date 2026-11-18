/** Prices are stored as numbers or numeric strings; blank/0 means "not set". */
export const formatAmount = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(n)) return String(value);
  if (n === 0) return null;
  return n.toLocaleString();
};
