import { useState, useEffect } from 'react';
import {
  Activity, LayoutDashboard, Users, TicketCheck, Megaphone, Handshake,
  DollarSign, Wrench, Search, Bell, LogOut, ChevronRight, Shield,
  FileText
} from 'lucide-react';

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface AdminLayoutProps {
  activeModule: string;
  profile: AdminProfile | null;
  onSignOut: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { id: 'accounts', label: 'Cuentas', icon: Users, path: '/admin/accounts' },
  { id: 'tickets', label: 'Soporte', icon: TicketCheck, path: '/admin/tickets' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, path: '/admin/marketing' },
  { id: 'influencers', label: 'Influencers', icon: Handshake, path: '/admin/influencers' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/admin/revenue' },
  { id: 'audit', label: 'Auditoría', icon: FileText, path: '/admin/audit' },
  { id: 'system', label: 'Sistema', icon: Wrench, path: '/admin/system' },
];

const MODULE_LABELS: Record<string, string> = {
  overview: 'Overview',
  accounts: 'Gestión de Cuentas',
  tickets: 'Soporte',
  marketing: 'Marketing',
  influencers: 'Influencers',
  revenue: 'Revenue',
  audit: 'Auditoría',
  system: 'Sistema',
};

export function AdminLayout({ activeModule, profile, onSignOut, children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SA';

  return (
    <div className="min-h-screen bg-[#0A0A1A] flex">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'} 
          fixed top-0 left-0 h-screen bg-[#0A0A1A] border-r border-[rgba(108,92,231,0.15)] 
          flex flex-col transition-all duration-300 z-50`}
      >
        {/* Logo */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-2.5 px-5 h-16 border-b border-white/[0.05]`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-9 h-9 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0 hover:scale-105 transition-transform"
          >
            <Activity className="text-white w-5 h-5" />
          </button>
          {!sidebarCollapsed && (
            <span className="text-lg font-black tracking-tighter text-white whitespace-nowrap">
              kCaliper<span className="text-violet-500">.admin</span>
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-[rgba(108,92,231,0.2)] text-white border-l-[3px] border-l-violet-500 pl-[9px]'
                    : 'text-white/40 hover:text-white/70 hover:bg-[rgba(108,92,231,0.08)] border-l-[3px] border-l-transparent pl-[9px]'
                  }
                  ${sidebarCollapsed ? 'justify-center !px-2 !pl-2 !border-l-0' : ''}
                `}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-violet-400' : ''}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section - Admin Profile */}
        <div className={`border-t border-white/[0.05] p-4 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {sidebarCollapsed ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'Super Admin'}</p>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-violet-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Super Admin</span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ===== CONTENT AREA ===== */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-[#0A0A1A]/80 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/30">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            <span className="text-white font-semibold">{MODULE_LABELS[activeModule] || 'Overview'}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Buscar usuarios, coaches, tickets..."
                className="w-64 pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                3
              </span>
            </button>

            {/* Last update */}
            <span className="text-xs text-white/20 hidden lg:block">
              Actualizado: {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
