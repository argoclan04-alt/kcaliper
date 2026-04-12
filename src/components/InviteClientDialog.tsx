import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { UserPlus, Send, Loader2 } from 'lucide-react';

interface InviteClientDialogProps {
  coachId: string;
  coachName: string;
}

export function InviteClientDialog({ coachId, coachName }: InviteClientDialogProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Construct the invitation link
      const signupLink = `${window.location.origin}/signup?role=athlete&coach_id=${coachId}`;
      
      // 2. Prepare the HTML template (Premium Design)
      const emailHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #000000; color: #ffffff; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #ffffff;">KCALIPER<span style="color: #00D2FF;">.AI</span></h1>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 32px; border-radius: 20px; text-align: center;">
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">¡Hola ${name || 'Atleta'}! 👋</h2>
            <p style="color: #999999; line-height: 1.6; margin-bottom: 32px;">
              <strong>${coachName}</strong> te ha invitado a unirte a su equipo en kCaliper, la plataforma de seguimiento de peso impulsada por IA para atletas de alto rendimiento.
            </p>
            
            <a href="${signupLink}" style="display: inline-block; background-color: #00D2FF; color: #000000; padding: 16px 32px; border-radius: 100px; font-weight: 900; text-decoration: none; text-transform: uppercase; font-size: 14px; letter-spacing: 0.1em;">
              Aceptar Invitación →
            </a>
          </div>
          
          <p style="color: #444444; font-size: 12px; text-align: center; margin-top: 40px; line-height: 1.5;">
            Si no esperabas esta invitación, puedes ignorar este correo.<br/>
            © 2026 kCaliper AI · Intelligence for Athletes
          </p>
        </div>
      `;

      // 3. Invoke the resend-email-handler edge function
      const { error } = await supabase.functions.invoke('resend-email-handler', {
        body: {
          to: email.trim(),
          subject: `Invitación de ${coachName} a kCaliper.ai 🎯`,
          html: emailHtml
        }
      });

      if (error) throw error;

      toast.success('¡Invitación enviada!', {
        description: `Se ha enviado un correo a ${email}`
      });
      
      setOpen(false);
      setEmail('');
      setName('');
    } catch (error: any) {
      console.error('Invite error:', error);
      toast.error('Error al enviar invitación', {
        description: error.message || 'Inténtalo de nuevo más tarde'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00D2FF] hover:bg-[#33DBFF] text-black font-black uppercase tracking-widest gap-2 rounded-full px-6 py-6 shadow-lg shadow-[#00D2FF]/20 group">
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Invitar Atleta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/10 backdrop-blur-2xl text-white rounded-[32px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Nuevo Atleta</DialogTitle>
          <DialogDescription className="text-white/50">
            Envía una invitación personalizada para que se unan a tu equipo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest text-[#00D2FF]">Nombre del Atleta</Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-[#00D2FF]/50 transition-all text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-[#00D2FF]">Email de Invitación</Label>
            <Input
              id="email"
              type="email"
              placeholder="atleta@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-[#00D2FF]/50 transition-all text-white"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 font-black h-14 rounded-2xl uppercase tracking-widest transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <span className="flex items-center gap-2 justify-center">
                Enviar Invitación <Send className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
