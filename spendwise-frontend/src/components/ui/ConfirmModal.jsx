// src/components/ui/ConfirmModal.jsx
// Reusable confirmation modal for destructive delete actions across SpendWise.

import { useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}) {
  const { tokens: t } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in-bg"
      onClick={onCancel}
    >
      <div
        className={`${t.card} ${t.border} border rounded-3xl w-full max-w-sm p-5 sm:p-6 shadow-2xl space-y-4 animate-slide-up-modal`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              danger
                ? "bg-[#FF5C5C]/15 text-[#FF5C5C] border border-[#FF5C5C]/30"
                : "bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30"
            }`}
          >
            <AlertTriangle size={20} strokeWidth={2.2} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className={`text-base font-extrabold ${t.text} leading-snug`}>
              {title}
            </h3>
            <p className={`text-xs font-medium ${t.muted} leading-relaxed`}>
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className={`${t.btn.secondary} flex-1 py-2.5 rounded-xl text-xs font-bold active:scale-98 transition-all`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold active:scale-98 transition-all shadow-md ${
              danger
                ? "bg-[#FF5C5C] hover:bg-[#ff4545] text-white"
                : t.btn.primary
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
