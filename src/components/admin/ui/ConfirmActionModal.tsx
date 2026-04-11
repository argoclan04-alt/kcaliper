import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  confirmText?: string; // Text user must type to confirm
  dangerLevel?: 'warning' | 'danger';
  loading?: boolean;
}

export function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'CONFIRMAR',
  dangerLevel = 'danger',
  loading = false,
}: ConfirmActionModalProps) {
  const [reason, setReason] = useState('');
  const [typedConfirm, setTypedConfirm] = useState('');

  if (!open) return null;

  const canConfirm = typedConfirm === confirmText && reason.trim().length > 5;
  const isDanger = dangerLevel === 'danger';

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(reason);
      setReason('');
      setTypedConfirm('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#12122A] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className={`flex items-center gap-3 p-5 border-b ${isDanger ? 'border-red-500/20' : 'border-yellow-500/20'}`}>
          <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
            <AlertTriangle className={`w-5 h-5 ${isDanger ? 'text-red-400' : 'text-yellow-400'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-white/50 leading-relaxed">{description}</p>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Razón (obligatorio)
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Explica la razón de esta acción..."
              rows={3}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500/30 resize-none"
            />
          </div>

          {/* Confirmation text */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Escribe <span className={isDanger ? 'text-red-400' : 'text-yellow-400'}>{confirmText}</span> para continuar
            </label>
            <input
              type="text"
              value={typedConfirm}
              onChange={e => setTypedConfirm(e.target.value)}
              placeholder={confirmText}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500/30 font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed
              ${isDanger ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20' : 'bg-yellow-600 hover:bg-yellow-500 shadow-lg shadow-yellow-600/20'}
            `}
          >
            {loading ? 'Procesando...' : title}
          </button>
        </div>
      </div>
    </div>
  );
}
