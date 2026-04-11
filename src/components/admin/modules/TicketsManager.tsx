import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AdminTable } from '../ui/AdminTable';
import { TicketCheck, MessageSquare, Send, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

interface Message {
  id: string;
  message: string;
  is_admin: boolean;
  internal_note: boolean;
  created_at: string;
  sender_name?: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-400 bg-red-500/15',
  high: 'text-orange-400 bg-orange-500/15',
  medium: 'text-yellow-400 bg-yellow-500/15',
  low: 'text-emerald-400 bg-emerald-500/15',
};

const STATUS_COLORS: Record<string, { cls: string; label: string }> = {
  open: { cls: 'text-blue-400 bg-blue-500/15', label: 'Abierto' },
  in_progress: { cls: 'text-yellow-400 bg-yellow-500/15', label: 'En progreso' },
  resolved: { cls: 'text-emerald-400 bg-emerald-500/15', label: 'Resuelto' },
  closed: { cls: 'text-white/30 bg-white/5', label: 'Cerrado' },
};

const SLA_HOURS: Record<string, number> = { billing: 4, bug_critical: 2, bug_general: 24, feature: 120, account: 6, general: 48 };

export function TicketsManager() {
  const { profile } = useAdminAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => { loadTickets(); }, []);

  async function loadTickets() {
    setLoading(true);
    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    setTickets(data || []);
    setLoading(false);
  }

  async function openTicket(ticket: Ticket) {
    setActiveTicket(ticket);
    const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
    setMessages(data || []);
  }

  async function sendReply() {
    if (!activeTicket || !newMessage.trim()) return;
    await supabase.from('ticket_messages').insert({
      ticket_id: activeTicket.id,
      sender_id: profile?.id,
      is_admin: true,
      message: newMessage,
      internal_note: isInternal,
    });
    if (activeTicket.status === 'open') {
      await supabase.from('support_tickets').update({ status: 'in_progress', updated_at: new Date().toISOString() }).eq('id', activeTicket.id);
    }
    toast.success(isInternal ? 'Nota interna guardada.' : 'Respuesta enviada.');
    setNewMessage('');
    openTicket(activeTicket);
    loadTickets();
  }

  async function resolveTicket() {
    if (!activeTicket) return;
    await supabase.from('support_tickets').update({ status: 'resolved', updated_at: new Date().toISOString() }).eq('id', activeTicket.id);
    toast.success('Ticket resuelto y cerrado.');
    setActiveTicket(null);
    loadTickets();
  }

  function getTimeSinceResponse(ticket: Ticket): string {
    const hrs = Math.floor((Date.now() - new Date(ticket.updated_at).getTime()) / 3600000);
    if (hrs < 1) return '<1h';
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  const columns = [
    { key: 'id', label: 'ID', render: (r: Ticket) => <span className="text-white/20 text-xs font-mono">#{r.id.slice(0, 8)}</span> },
    { key: 'subject', label: 'Asunto', render: (r: Ticket) => <span className="font-medium text-white">{r.subject}</span> },
    { key: 'category', label: 'Categoría', render: (r: Ticket) => <span className="text-white/40 text-xs uppercase">{r.category}</span> },
    {
      key: 'priority', label: 'Prioridad',
      render: (r: Ticket) => <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${PRIORITY_COLORS[r.priority] || ''}`}>{r.priority}</span>,
    },
    {
      key: 'status', label: 'Estado',
      render: (r: Ticket) => {
        const s = STATUS_COLORS[r.status] || STATUS_COLORS.open;
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}>{s.label}</span>;
      },
    },
    { key: 'created_at', label: 'Fecha', render: (r: Ticket) => <span className="text-white/30 text-xs">{new Date(r.created_at).toLocaleDateString('es-ES')}</span> },
    {
      key: 'wait', label: 'Sin respuesta',
      render: (r: Ticket) => {
        const t = getTimeSinceResponse(r);
        const hrs = Math.floor((Date.now() - new Date(r.updated_at).getTime()) / 3600000);
        const color = hrs > 24 ? 'text-red-400' : hrs > 12 ? 'text-yellow-400' : 'text-white/30';
        return <span className={`text-xs font-bold ${color}`}>{t}</span>;
      },
    },
  ];

  const filters = [
    { key: 'status', label: 'Estado', options: Object.entries(STATUS_COLORS).map(([v, o]) => ({ value: v, label: o.label })) },
    { key: 'priority', label: 'Prioridad', options: ['urgent', 'high', 'medium', 'low'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })) },
    { key: 'category', label: 'Categoría', options: ['billing', 'bug', 'feature', 'account', 'general'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })) },
  ];

  if (activeTicket) {
    return (
      <div className="space-y-6">
        <button onClick={() => setActiveTicket(null)} className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors">
          ← Volver a tickets
        </button>

        {/* Ticket Header */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-white/20 text-xs font-mono">#{activeTicket.id.slice(0, 8)}</span>
              <h2 className="text-xl font-bold text-white mt-1">{activeTicket.subject}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${PRIORITY_COLORS[activeTicket.priority]}`}>{activeTicket.priority}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[activeTicket.status]?.cls}`}>{STATUS_COLORS[activeTicket.status]?.label}</span>
                <span className="text-xs text-white/30">{activeTicket.category}</span>
              </div>
            </div>
            {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && (
              <button onClick={resolveTicket} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors">
                <CheckCircle className="w-4 h-4" /> Resolver y Cerrar
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-white/20 text-sm">No hay mensajes en este ticket.</div>
          ) : messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg px-5 py-3 rounded-2xl text-sm ${msg.internal_note
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 italic'
                  : msg.is_admin
                    ? 'bg-violet-600/20 border border-violet-500/20 text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/70'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                    {msg.internal_note ? '🔒 Nota interna' : msg.is_admin ? '🛡️ Admin' : '👤 Usuario'}
                  </span>
                  <span className="text-[10px] text-white/20">{new Date(msg.created_at).toLocaleString('es-ES')}</span>
                </div>
                <p className="leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        {activeTicket.status !== 'closed' && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={3}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500/30 resize-none mb-3"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-white/30 cursor-pointer">
                <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} className="rounded accent-violet-600" />
                Nota interna (no visible para el usuario)
              </label>
              <button onClick={sendReply} disabled={!newMessage.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-30">
                <Send className="w-4 h-4" /> Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <TicketCheck className="w-6 h-6 text-violet-400" />
        Sistema de Soporte
      </h1>
      <AdminTable columns={columns} data={tickets} filters={filters} onRowClick={openTicket} pageSize={25} searchPlaceholder="Buscar tickets..." emptyMessage={loading ? 'Cargando tickets...' : 'No hay tickets de soporte.'} emptyIcon={<MessageSquare className="w-12 h-12 text-white/10" />} />
    </div>
  );
}
