import { X, Shield, Mail, MapPin, Calendar, Clock, CreditCard, UserCog, Ban, Trash2, KeyRound, Send, Eye } from 'lucide-react';

interface UserData {
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

interface UserDetailPanelProps {
  user: UserData | null;
  onClose: () => void;
  onSuspend: (user: UserData) => void;
  onBan: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}

const ROLE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  coach: { bg: 'bg-violet-500/15', text: 'text-violet-400', label: 'Coach' },
  client: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', label: 'Atleta' },
  super_admin: { bg: 'bg-orange-500/15', text: 'text-orange-400', label: 'Admin' },
};

const STATUS_BADGE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Activo' },
  suspended: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Suspendido' },
  banned: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', label: 'Baneado' },
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return 'Nunca';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

export function UserDetailPanel({ user, onClose, onSuspend, onBan, onDelete }: UserDetailPanelProps) {
  if (!user) return null;

  const role = ROLE_BADGE[user.role] || ROLE_BADGE.client;
  const status = STATUS_BADGE[user.status] || STATUS_BADGE.active;
  const initials = user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0f0f25] border-l border-white/[0.08] h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f0f25]/95 backdrop-blur-xl border-b border-white/[0.05] p-5 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-violet-400" />
            Detalle de Usuario
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Profile Card */}
          <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white truncate">{user.full_name}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${role.bg} ${role.text}`}>{role.label}</span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Información</h4>
            <div className="space-y-2">
              {[
                { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user.email },
                { icon: <Shield className="w-4 h-4" />, label: 'Rol', value: role.label },
                { icon: <CreditCard className="w-4 h-4" />, label: 'Plan', value: user.plan || 'Sin plan' },
                { icon: <MapPin className="w-4 h-4" />, label: 'País', value: user.country || 'No registrado' },
                { icon: <Calendar className="w-4 h-4" />, label: 'Registro', value: new Date(user.created_at).toLocaleDateString('es-ES') },
                { icon: <Clock className="w-4 h-4" />, label: 'Último acceso', value: timeAgo(user.last_login) },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.02] rounded-lg">
                  <span className="text-white/20">{item.icon}</span>
                  <span className="text-xs text-white/30 w-24">{item.label}</span>
                  <span className="text-sm text-white/70 flex-1 truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coach-specific info */}
          {user.role === 'coach' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Coach</h4>
              <div className="px-3 py-2.5 bg-white/[0.02] rounded-lg flex items-center gap-3">
                <span className="text-white/20"><UserCog className="w-4 h-4" /></span>
                <span className="text-xs text-white/30 w-24">Atletas</span>
                <span className="text-sm text-violet-400 font-bold">{user.athletes_count ?? 0}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Acciones</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs font-medium text-white/50 hover:text-white hover:border-white/[0.12] transition-all">
                <Send className="w-3.5 h-3.5" /> Enviar Mensaje
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs font-medium text-white/50 hover:text-white hover:border-white/[0.12] transition-all">
                <KeyRound className="w-3.5 h-3.5" /> Reset Contraseña
              </button>
            </div>

            <div className="h-px bg-white/[0.05] my-2" />

            {user.status !== 'suspended' && (
              <button
                onClick={() => onSuspend(user)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs font-bold text-yellow-400 hover:bg-yellow-500/20 transition-all"
              >
                <Ban className="w-3.5 h-3.5" /> Suspender Cuenta
              </button>
            )}

            {user.status !== 'banned' && (
              <button
                onClick={() => onBan(user)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Ban className="w-3.5 h-3.5" /> Bannear Cuenta
              </button>
            )}

            <button
              onClick={() => onDelete(user)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/5 border border-red-500/10 rounded-xl text-xs font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
