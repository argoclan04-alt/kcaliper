import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { KPICard } from '../ui/KPICard';
import { AdminTable } from '../ui/AdminTable';
import { Users, DollarSign, TrendingDown, TicketCheck, AlertTriangle, Activity, UserPlus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data generators for when Supabase tables are empty
const generateGrowthData = () => Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - 29 + i);
  return {
    date: d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    coaches: Math.floor(Math.random() * 5) + (i > 15 ? 3 : 1),
    atletas: Math.floor(Math.random() * 12) + (i > 15 ? 6 : 2),
  };
});

const generateRevenueByPlan = () => [
  { plan: 'Atleta Pro', revenue: 1364, color: '#8B5CF6' },
  { plan: 'Atleta Legend', revenue: 137, color: '#06B6D4' },
  { plan: 'Coach Pro', revenue: 1156, color: '#F97316' },
  { plan: 'Coach Global', revenue: 358, color: '#EAB308' },
];

const generateActivityData = () => Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  registros: Math.floor(Math.random() * 20) + 2,
}));

export function OverviewDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const growthData = generateGrowthData();
  const revenueData = generateRevenueByPlan();
  const activityData = generateActivityData();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      // Total users from profiles
      const { count: profileCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setTotalUsers(profileCount || 0);

      // Recent users
      const { data: recent } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, plan, created_at, status')
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentUsers(recent || []);

      // Waitlist count
      const { count: wCount } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
      setWaitlistCount(wCount || 0);
    } catch (err) {
      console.warn('Dashboard data load error:', err);
    }
    setLoading(false);
  }

  const recentColumns = [
    {
      key: 'avatar',
      label: '',
      width: 'w-12',
      render: (row: any) => {
        const initials = row.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/50 to-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-white">
            {initials}
          </div>
        );
      },
    },
    { key: 'full_name', label: 'Nombre', render: (row: any) => <span className="font-semibold text-white">{row.full_name || '—'}</span> },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rol',
      render: (row: any) => {
        const colors: Record<string, string> = { coach: 'text-violet-400 bg-violet-500/15', client: 'text-cyan-400 bg-cyan-500/15', super_admin: 'text-orange-400 bg-orange-500/15' };
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[row.role] || 'text-white/30'}`}>{row.role || '—'}</span>;
      },
    },
    { key: 'plan', label: 'Plan', render: (row: any) => <span className="text-white/40">{row.plan || 'Sin plan'}</span> },
    {
      key: 'created_at',
      label: 'Registro',
      render: (row: any) => <span className="text-white/30 text-xs">{new Date(row.created_at).toLocaleDateString('es-ES')}</span>,
    },
  ];

  const chartTooltipStyle = {
    contentStyle: { background: '#12122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' },
    labelStyle: { color: 'rgba(255,255,255,0.5)' },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Usuarios"
          value={totalUsers}
          delta={12}
          deltaLabel="vs semana anterior"
          trend="up"
          color="violet"
          tooltip="Coaches + Atletas activos en la plataforma."
          icon={<Users className="w-4 h-4" />}
        />
        <KPICard
          title="MRR"
          value="$3,015"
          delta={8}
          deltaLabel="vs mes anterior"
          trend="up"
          color="green"
          tooltip="Monthly Recurring Revenue calculado desde suscripciones activas."
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KPICard
          title="Churn Rate"
          value="4.2%"
          delta={-1.5}
          deltaLabel="vs mes anterior"
          trend="down"
          color="yellow"
          tooltip="% de usuarios que cancelaron en los últimos 30 días."
          icon={<TrendingDown className="w-4 h-4" />}
        />
        <KPICard
          title="Tickets Abiertos"
          value={3}
          trend="neutral"
          color="cyan"
          tooltip="Tickets de soporte sin resolver."
          icon={<TicketCheck className="w-4 h-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-violet-400" />
            Crecimiento de Usuarios (30 días)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }} />
              <Line type="monotone" dataKey="coaches" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Coaches" />
              <Line type="monotone" dataKey="atletas" stroke="#06B6D4" strokeWidth={2} dot={false} name="Atletas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Revenue por Plan (30 días)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <XAxis dataKey="plan" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip {...chartTooltipStyle} formatter={(v: any) => [`$${v}`, 'Revenue']} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Actividad de la Plataforma (últimas 24h)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="registros" stroke="#8B5CF6" fill="url(#activityGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Users Table */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-400" />
          Usuarios Recientes
        </h3>
        <AdminTable
          columns={recentColumns}
          data={recentUsers}
          pageSize={10}
          searchPlaceholder="Buscar usuario..."
          emptyMessage={loading ? 'Cargando datos...' : 'No hay usuarios registrados aún.'}
        />
      </div>

      {/* Critical Alerts */}
      <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Alertas Críticas del Sistema
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] rounded-xl">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm text-white/50">0 coaches con atletas sin registro &gt; 72h</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-white/50">0 pagos fallidos en las últimas 24h</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-white/50">0 tickets sin respuesta &gt; 48h</span>
          </div>
        </div>
      </div>

      {/* Waitlist KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <KPICard title="Waitlist Total" value={waitlistCount} color="cyan" tooltip="Emails registrados en la tabla waitlist." icon={<Users className="w-4 h-4" />} />
        <KPICard title="Conversión Waitlist → Pago" value="--%" color="violet" tooltip="Porcentaje de emails en waitlist que tienen cuenta activa con plan." icon={<TrendingDown className="w-4 h-4" />} />
      </div>
    </div>
  );
}
