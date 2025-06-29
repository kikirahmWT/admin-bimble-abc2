export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-box">
        <p>Yakin ingin logout?</p>
        <button onClick={onConfirm}>Ya</button>
        <button onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}
