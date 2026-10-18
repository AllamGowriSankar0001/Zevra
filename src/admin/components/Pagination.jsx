export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  const pageNums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 2) pageNums.push(i);
    else if (pageNums[pageNums.length - 1] !== '…') pageNums.push('…');
  }

  return (
    <div className="admin-pagination">
      <span>Showing {start}–{end} of {total}</span>
      <div className="admin-pagination__pages">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)}>‹</button>
        {pageNums.map((p, i) =>
          p === '…'
            ? <span key={i} style={{ padding:'0 4px', color:'#999' }}>…</span>
            : <button key={p} className={p === page ? 'active' : ''} onClick={() => onPage(p)}>{p}</button>
        )}
        <button disabled={page >= pages} onClick={() => onPage(page + 1)}>›</button>
      </div>
    </div>
  );
}
