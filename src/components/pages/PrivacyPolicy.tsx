import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen fp-dark-bg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-5 py-16 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-[#6C5CE7]" />
          <h1 className="text-3xl font-extrabold text-white">Política de Privacidad</h1>
        </div>
        <p className="text-white/40 text-sm mb-10">Última actualización: Abril 2026</p>
        <div className="space-y-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Información que Recopilamos</h2>
            <p>En kCaliper.ai recopilamos la siguiente información para proveer nuestro servicio:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-white/60">
              <li><strong className="text-white/80">Datos de cuenta:</strong> nombre, correo electrónico, país</li>
              <li><strong className="text-white/80">Datos biométricos:</strong> peso corporal, fotos de progreso (si las proporcionas)</li>
              <li><strong className="text-white/80">Datos de uso:</strong> interacciones con CaliBot, frecuencia de registros, preferencias</li>
              <li><strong className="text-white/80">Datos técnicos:</strong> dirección IP, tipo de navegador, dispositivo (para soporte técnico)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Cómo Usamos tu Información</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Proveer y mejorar el servicio de seguimiento de peso y análisis DEMA</li>
              <li>Personalizar las respuestas de CaliBot IA para tu perfil específico</li>
              <li>Enviar recordatorios y alertas configuradas por ti o tu coach</li>
              <li>Generar análisis de tendencias y reportes de progreso</li>
              <li>Mejorar nuestros algoritmos de IA (usando datos anonimizados y agregados)</li>
              <li>Comunicaciones importantes sobre el servicio</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Compartición de Datos</h2>
            <p><strong className="text-white/80">Con tu Coach:</strong> Si estás vinculado a un coach, este podrá ver tu historial de peso, fotos de progreso y métricas. Solo tú puedes vincular tu cuenta.</p>
            <p className="mt-2"><strong className="text-white/80">Con terceros:</strong> NO vendemos, alquilamos ni compartimos tus datos personales con terceros con fines de marketing. Utilizamos proveedores de infraestructura (Supabase para base de datos, proveedores de IA para CaliBot) que procesan datos bajo acuerdos estrictos de confidencialidad.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Almacenamiento y Seguridad</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Todos los datos se transmiten con encriptación TLS/SSL</li>
              <li>Las contraseñas se almacenan con hash bcrypt</li>
              <li>Los datos biométricos se almacenan en servidores seguros en la nube</li>
              <li>Acceso restringido mediante permisos por rol (Row Level Security)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Tus Derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-white/60">
              <li><strong className="text-white/80">Acceso:</strong> Solicitar una copia de todos tus datos</li>
              <li><strong className="text-white/80">Rectificación:</strong> Corregir datos incorrectos</li>
              <li><strong className="text-white/80">Eliminación:</strong> Solicitar la eliminación completa de tu cuenta y datos</li>
              <li><strong className="text-white/80">Portabilidad:</strong> Exportar tus datos en formato estándar</li>
              <li><strong className="text-white/80">Oposición:</strong> Oponerte al procesamiento de tus datos</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Cookies</h2>
            <p>Utilizamos cookies esenciales para el funcionamiento del servicio (sesión de autenticación, preferencias de idioma y modo oscuro). No utilizamos cookies de terceros con fines publicitarios.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Retención de Datos</h2>
            <p>Conservamos tus datos mientras tu cuenta esté activa. Si solicitas la eliminación de tu cuenta, eliminaremos todos tus datos personales en un plazo máximo de 30 días. Los datos anonimizados utilizados para mejora de algoritmos podrán ser retenidos indefinidamente.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Contacto</h2>
            <p>Para cualquier consulta sobre privacidad, contáctanos en: <a href="mailto:privacidad@kcaliper.ai" className="text-[#6C5CE7] hover:underline">privacidad@kcaliper.ai</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
