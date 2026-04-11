import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AdminTable } from '../ui/AdminTable';
import { FileText, Shield } from 'lucide-react';

interface AuditEntry {
  id: string;
  admin_id: string;
  action: string;
  target_user_id?: string;
  reason?: string;
  metadata?: any;
  ip_address?: string;
  created_at: string;
}

const ACTION_LABELS: Record<string, { cls: string; label: string }> = {
  suspend_account: { cls: 'text-yellow-400 bg-yellow-500/15', label: 'Suspensión' },
  ban_account: { cls: 'text-red-400 bg-red-500/15', label: 'Ban' },
  delete_account: { cls: 'text-red-400 bg-red-500/15', label: 'Eliminación' },
  reactivate_account: { cls: 'text-emerald-400 bg-emerald-500/15', label: 'Reactivación' },
  change_plan: { cls: 'text-violet-400 bg-violet-500/15', label: 'Cambio plan' },
  reply_ticket: { cls: 'text-cyan-400 bg-cyan-500/15', label: 'Respuesta ticket' },
  reset_password: { cls: 'text-orange-400 bg-orange-500/15', label: 'Reset contraseña' },
  export_data: { cls: 'text-white/40 bg-white/5', label: 'Exportación' },
  config_change: { cls: 'text-violet-400 bg-violet-500/15', label: 'Config cambio' },
};

export function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAudit(); }, []);

  async function loadAudit() {
    setLoading(true);
    const { data } = await supabase.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(500);
    setEntries(data || []);
    setLoading(false);
  }

  const columns = [
    { key: 'created_at', label: 'Fecha', sortable: true, render: (r: AuditEntry) => <span className="text-white/30 text-xs">{new Date(r.created_at).toLocaleString('es-ES')}</span> },
    { key: 'admin_id', label: 'Admin', render: (r: AuditEntry) => <span className="text-xs text-violet-400 font-mono">{r.admin_id?.slice(0, 8) || '—'}...</span> },
    {
      key: 'action', label: 'Acción',
      render: (r: AuditEntry) => {
        const a = ACTION_LABELS[r.action] || { cls: 'text-white/30 bg-white/5', label: r.action };
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.cls}`}>{a.label}</span>;
      },
    },
    { key: 'target_user_id', label: 'Usuario afectado', render: (r: AuditEntry) => <span className="text-xs text-white/30 font-mono">{r.target_user_id?.slice(0, 8) || '—'}...</span> },
    { key: 'reason', label: 'Razón', render: (r: AuditEntry) => <span className="text-xs text-white/50 truncate max-w-[200px] block">{r.reason || '—'}</span> },
    { key: 'ip_address', label: 'IP', render: (r: AuditEntry) => <span className="text-xs text-white/20 font-mono">{r.ip_address || '—'}</span> },
  ];

  const filters = [
    { key: 'action', label: 'Acción', options: Object.entries(ACTION_LABELS).map(([v, o]) => ({ value: v, label: o.label })) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-6 h-6 text-violet-400" />
          Log de Auditoría
        </h1>
        <div className="flex items-center gap-2 text-xs text-white/20">
          <Shield className="w-4 h-4" />
          Registro inmutable — {entries.length} entradas
        </div>
      </div>

      <div className="p-4 bg-violet-500/[0.05] border border-violet-500/10 rounded-xl">
        <p className="text-xs text-violet-300/60 flex items-center gap-2">
          <Shield className="w-4 h-4 flex-shrink-0" />
          Este log es inmutable. Las entradas no pueden ser editadas ni eliminadas. Todas las acciones administrativas quedan registradas permanentemente.
        </p>
      </div>

      <AdminTable columns={columns} data={entries} filters={filters} pageSize={50} searchPlaceholder="Buscar por acción o razón..." emptyMessage={loading ? 'Cargando log...' : 'No hay acciones registradas.'} emptyIcon={<FileText className="w-12 h-12 text-white/10" />} />
    </div>
  );
}
