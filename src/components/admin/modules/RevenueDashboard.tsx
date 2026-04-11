import { KPICard } from '../ui/KPICard';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const planBreakdown = [
  { plan: 'Atleta Pro ($3.99)', users: 342, revenue: 1364, pct: '45%' },
  { plan: 'Atleta Legend ($1.07/mes)', users: 128, revenue: 137, pct: '5%' },
  { plan: 'Coach Pro ($12.99)', users: 89, revenue: 1156, pct: '38%' },
  { plan: 'Coach Global ($8.33/mes)', users: 43, revenue: 358, pct: '12%' },
];

const mrrHistory = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(); d.setMonth(d.getMonth() - 11 + i);
  return { month: d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }), mrr: 800 + Math.floor(Math.random() * 400) + i * 200 };
});

const churnHistory = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(); d.setMonth(d.getMonth() - 11 + i);
  return { month: d.toLocaleDateString('es-ES', { month: 'short' }), churn: (Math.random() * 5 + 1).toFixed(1) };
});

const tooltipStyle = { contentStyle: { background: '#12122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' } };

export function RevenueDashboard() {
  const totalMRR = planBreakdown.reduce((s, p) => s + p.revenue, 0);
  const totalUsers = planBreakdown.reduce((s, p) => s + p.users, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <DollarSign className="w-6 h-6 text-emerald-400" />
        Revenue & Finanzas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="MRR Total" value={`$${totalMRR.toLocaleString()}`} delta={8} deltaLabel="vs mes anterior" trend="up" color="green" icon={<DollarSign className="w-4 h-4" />} />
        <KPICard title="Suscriptores Activos" value={totalUsers} delta={15} deltaLabel="nuevos este mes" trend="up" color="violet" icon={<Users className="w-4 h-4" />} />
        <KPICard title="Cancelaciones" value={12} delta={-3} deltaLabel="vs mes anterior" trend="down" color="red" icon={<TrendingDown className="w-4 h-4" />} />
        <KPICard title="ARPU" value={`$${(totalMRR / totalUsers).toFixed(2)}`} trend="neutral" color="cyan" tooltip="Average Revenue Per User" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Plan Breakdown */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-bold text-white">Desglose por Plan</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Usuarios</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Revenue/mes</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">% Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {planBreakdown.map((p, i) => (
              <tr key={i} className="hover:bg-[rgba(108,92,231,0.04)] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-white">{p.plan}</td>
                <td className="px-6 py-4 text-sm text-white/60">{p.users.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-emerald-400 font-bold">${p.revenue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: p.pct }} />
                    </div>
                    <span className="text-xs text-white/30">{p.pct}</span>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-white/[0.02]">
              <td className="px-6 py-4 text-sm font-bold text-white">TOTAL</td>
              <td className="px-6 py-4 text-sm font-bold text-white">{totalUsers.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm font-bold text-emerald-400">${totalMRR.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm font-bold text-white/30">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">MRR Histórico (12 meses)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mrrHistory}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => [`$${v}`, 'MRR']} />
              <Line type="monotone" dataKey="mrr" stroke="#10B981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Churn Mensual (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={churnHistory}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => [`${v}%`, 'Churn']} />
              <Bar dataKey="churn" fill="#EF4444" radius={[6, 6, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
