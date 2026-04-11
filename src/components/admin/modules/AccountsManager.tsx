import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AdminTable } from '../ui/AdminTable';
import { UserDetailPanel } from '../ui/UserDetailPanel';
import { ConfirmActionModal } from '../ui/ConfirmActionModal';
import { Users, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  plan?: string;
  country?: string;
  created_at: string;
  last_login?: string;
  athletes_count?: number;
}

export function AccountsManager() {
  const { profile } = useAdminAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // Moderation modals
  const [suspendTarget, setSuspendTarget] = useState<UserRow | null>(null);
  const [banTarget, setBanTarget] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, status, plan, country, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error loading users:', error);
    }
    setUsers(data || []);
    setLoading(false);
  }

  async function logAuditAction(action: string, targetUserId: string, reason: string) {
    await supabase.from('admin_audit_log').insert({
      admin_id: profile?.id,
      action,
      target_user_id: targetUserId,
      reason,
      metadata: {},
    });
  }

  async function handleSuspend(reason: string) {
    if (!suspendTarget) return;
    setActionLoading(true);
    await supabase.from('profiles').update({ status: 'suspended' }).eq('id', suspendTarget.id);
    await logAuditAction('suspend_account', suspendTarget.id, reason);
    toast.success(`Cuenta de ${suspendTarget.full_name} suspendida.`);
    setSuspendTarget(null);
    setSelectedUser(null);
    setActionLoading(false);
    loadUsers();
  }

  async function handleBan(reason: string) {
    if (!banTarget) return;
    setActionLoading(true);
    await supabase.from('profiles').update({ status: 'banned' }).eq('id', banTarget.id);
    await supabase.from('banned_emails').insert({ email: banTarget.email, reason, banned_by: profile?.id });
    await logAuditAction('ban_account', banTarget.id, reason);
    toast.success(`Cuenta de ${banTarget.full_name} baneada.`);
    setBanTarget(null);
    setSelectedUser(null);
    setActionLoading(false);
    loadUsers();
  }

  async function handleDelete(reason: string) {
    if (!deleteTarget) return;
    setActionLoading(true);
    await logAuditAction('delete_account', deleteTarget.id, reason);
    // Cascade delete weights/photos (profile deletion will cascade if FK set up)
    await supabase.from('profiles').delete().eq('id', deleteTarget.id);
    toast.success(`Cuenta de ${deleteTarget.full_name} eliminada.`);
    setDeleteTarget(null);
    setSelectedUser(null);
    setActionLoading(false);
    loadUsers();
  }

  const ROLE_BADGE: Record<string, { cls: string; label: string }> = {
    coach: { cls: 'text-violet-400 bg-violet-500/15', label: 'Coach' },
    client: { cls: 'text-cyan-400 bg-cyan-500/15', label: 'Atleta' },
    super_admin: { cls: 'text-orange-400 bg-orange-500/15', label: 'Admin' },
  };

  const STATUS_BADGE: Record<string, { cls: string; dot: string; label: string }> = {
    active: { cls: 'text-emerald-400 bg-emerald-500/10', dot: 'bg-emerald-400', label: 'Activo' },
    suspended: { cls: 'text-yellow-400 bg-yellow-500/10', dot: 'bg-yellow-400', label: 'Suspendido' },
    banned: { cls: 'text-red-400 bg-red-500/10', dot: 'bg-red-400', label: 'Baneado' },
  };

  const columns = [
    {
      key: 'avatar', label: '', width: 'w-12',
      render: (row: UserRow) => {
        const initials = row.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
        return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/50 to-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-white">{initials}</div>;
      },
    },
    { key: 'full_name', label: 'Nombre', sortable: true, render: (row: UserRow) => <span className="font-semibold text-white cursor-pointer hover:text-violet-400 transition-colors">{row.full_name || '—'}</span> },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role', label: 'Rol',
      render: (row: UserRow) => {
        const r = ROLE_BADGE[row.role] || ROLE_BADGE.client;
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.cls}`}>{r.label}</span>;
      },
    },
    { key: 'plan', label: 'Plan', render: (row: UserRow) => <span className="text-white/40 text-xs">{row.plan || 'Sin plan'}</span> },
    {
      key: 'status', label: 'Estado',
      render: (row: UserRow) => {
        const s = STATUS_BADGE[row.status] || STATUS_BADGE.active;
        return <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}><span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}</span>;
      },
    },
    {
      key: 'created_at', label: 'Registro', sortable: true,
      render: (row: UserRow) => <span className="text-white/30 text-xs">{new Date(row.created_at).toLocaleDateString('es-ES')}</span>,
    },
  ];

  const filters = [
    { key: 'role', label: 'Rol', options: [{ label: 'Coach', value: 'coach' }, { label: 'Atleta', value: 'client' }, { label: 'Admin', value: 'super_admin' }] },
    { key: 'status', label: 'Estado', options: [{ label: 'Activo', value: 'active' }, { label: 'Suspendido', value: 'suspended' }, { label: 'Baneado', value: 'banned' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-6 h-6 text-violet-400" />
          Gestión de Cuentas
        </h1>
        <span className="text-sm text-white/30">{users.length} cuentas registradas</span>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        pageSize={50}
        searchPlaceholder="Buscar por nombre o email..."
        filters={filters}
        onRowClick={setSelectedUser}
        emptyMessage={loading ? 'Cargando cuentas...' : 'No hay cuentas registradas.'}
        emptyIcon={<Users className="w-12 h-12 text-white/10" />}
      />

      {/* Detail Panel */}
      <UserDetailPanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSuspend={setSuspendTarget}
        onBan={setBanTarget}
        onDelete={setDeleteTarget}
      />

      {/* Moderation Modals */}
      <ConfirmActionModal
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspend}
        title="Suspender Cuenta"
        description={`Estás a punto de suspender la cuenta de ${suspendTarget?.full_name}. El usuario no podrá hacer login pero sus datos quedarán intactos.`}
        confirmText="SUSPENDER"
        dangerLevel="warning"
        loading={actionLoading}
      />

      <ConfirmActionModal
        open={!!banTarget}
        onClose={() => setBanTarget(null)}
        onConfirm={handleBan}
        title="Bannear Cuenta"
        description={`Estás a punto de bannear permanentemente la cuenta de ${banTarget?.full_name}. Su email será bloqueado y no podrá registrarse de nuevo.`}
        confirmText="BANNEAR"
        dangerLevel="danger"
        loading={actionLoading}
      />

      <ConfirmActionModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Cuenta"
        description={`ACCIÓN IRREVERSIBLE. Todos los datos de ${deleteTarget?.full_name} serán eliminados permanentemente (pesos, fotos, alertas). Esta acción queda registrada en el log de auditoría.`}
        confirmText={deleteTarget?.email || 'CONFIRMAR'}
        dangerLevel="danger"
        loading={actionLoading}
      />
    </div>
  );
}
