import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RefreshCw, Send, Search, Users, ExternalLink, Trash2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

interface WaitlistEntry {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  source: string;
  created_at: string;
}

export function WaitlistManager() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  async function fetchWaitlist() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      toast.error('Error al cargar la waitlist: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleBulkEmail = async () => {
    if (!emailSubject || !emailBody) {
      toast.error('Por favor completa el asunto y el mensaje');
      return;
    }

    if (!confirm(`¿Estás seguro de enviar este correo a ${entries.length} personas?`)) return;

    setSendingEmail(true);
    let successCount = 0;
    
    try {
      // Loop through all entries and trigger email via Edge Function
      for (const entry of entries) {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-email-handler`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            to: entry.email,
            subject: emailSubject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050508; color: #ffffff; border-radius: 12px; border: 1px solid #333;">
                <h2 style="color: #00D2FF;">kCaliper.ai Update</h2>
                <div style="color: #eee; font-size: 16px; line-height: 1.6;">
                  ${emailBody.replace(/\n/g, '<br/>')}
                </div>
                <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;"/>
                <p style="color: #666; font-size: 11px; text-transform: uppercase;">© 2026 kCaliper AI · Founder Edition</p>
              </div>
            `
          })
        });
        
        if (response.ok) successCount++;
      }
      
      toast.success(`¡Campaña finalizada! ${successCount} correos enviados.`);
      setIsBulkEmailModalOpen(false);
      setEmailSubject('');
      setEmailBody('');
    } catch (err: any) {
      toast.error('Ocurrió un error parcial: ' + err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Total en Waitlist</p>
              <h3 className="text-2xl font-bold text-white">{entries.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Tasa de Conversión</p>
              <h3 className="text-2xl font-bold text-white">-- %</h3>
            </div>
          </div>
        </motion.div>

        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <button 
            onClick={fetchWaitlist}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setIsBulkEmailModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold font-plus-jakarta transition-all shadow-lg shadow-violet-500/20"
          >
            <Mail className="w-5 h-5" />
            Enviar Correo Masivo
          </button>
        </div>
      </div>

      {/* Database View Overlay */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white">Todos los Registros</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Buscar por email, nombre o fuente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01]">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase">Nombre</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase">País</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase">Fuente</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredEntries.map((entry) => (
                  <motion.tr 
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{entry.first_name} {entry.last_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{entry.email}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{entry.country || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                        entry.source === 'instagram' ? 'bg-pink-500/20 text-pink-500' :
                        entry.source === 'tiktok' ? 'bg-cyan-500/20 text-cyan-500' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {entry.source || 'Directo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-white/20 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-white/20 font-medium">
                    {loading ? 'Cargando datos...' : 'No se encontraron registros'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Email Modal */}
      <AnimatePresence>
        {isBulkEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !sendingEmail && setIsBulkEmailModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-[#0A0A1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Redactar Correo Masivo</h2>
                    <p className="text-white/40 text-sm">Se enviará a los {entries.length} miembros de la waitlist.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-2 tracking-widest">Asunto del Correo</label>
                    <input 
                      type="text" 
                      placeholder="Ej. ¡Nueva actualización en kCaliper! 📲"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-2 tracking-widest">Mensaje (HTML permitido)</label>
                    <textarea 
                      rows={6}
                      placeholder="Escribe tu mensaje aquí..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500/50 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={() => setIsBulkEmailModalOpen(false)}
                    disabled={sendingEmail}
                    className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleBulkEmail}
                    disabled={sendingEmail}
                    className="flex-[2] py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendingEmail ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Ahora
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
