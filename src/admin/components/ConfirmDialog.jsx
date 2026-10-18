export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger }) {
  return (
    <div className="admin-dialog-overlay" onClick={onCancel}>
      <div className="admin-dialog" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-dialog__actions">
          <button className="a-btn a-btn--secondary" onClick={onCancel}>Cancel</button>
          <button
            className={`a-btn ${danger ? 'a-btn--danger' : 'a-btn--primary'}`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
