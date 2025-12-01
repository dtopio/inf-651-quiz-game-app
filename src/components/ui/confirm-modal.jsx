import { createPortal } from "react-dom";

export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-blue-600",
  confirmHover = "hover:bg-blue-700"
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-8 mx-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <h3 className="text-2xl font-semibold mb-3" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <p className="mb-6 text-base" style={{ color: "var(--text-secondary)" }}>
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-semibold border transition"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${confirmColor} ${confirmHover}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
