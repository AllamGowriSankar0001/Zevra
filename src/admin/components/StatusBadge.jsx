export default function StatusBadge({ value }) {
  const v = (value || '').toLowerCase().replace(/[^a-z]/g, '');
  return <span className={`badge badge--${v}`}>{value}</span>;
}

export function StockBadge({ stock }) {
  if (stock === null || stock === undefined) return <span className="badge badge--ok">No variants</span>;
  if (stock === 0)  return <span className="badge badge--out">Out of stock</span>;
  if (stock <= 5)   return <span className="badge badge--low">Low ({stock})</span>;
  return <span className="badge badge--ok">{stock} in stock</span>;
}
