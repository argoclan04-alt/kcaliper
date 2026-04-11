import { ArrowLeft, FileText } from 'lucide-react';

export function TermsConditions({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen fp-dark-bg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-5 py-16 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#6C5CE7]" />
          <h1 className="text-3xl font-extrabold text-white">Términos y Condiciones</h1>
        </div>
        <p className="text-white/40 text-sm mb-10">Última actualización: Abril 2026</p>
        <div className="space-y-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar kcaliper.com ("el Servicio"), aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar el Servicio.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Descripción del Servicio</h2>
            <p>kcaliper.com es una plataforma de seguimiento de peso corporal y composición corporal que utiliza inteligencia artificial (CaliBot) para análisis de tendencias, alertas inteligentes y seguimiento automatizado. El servicio está disponible como aplicación web y a través de integraciones de mensajería.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Cuentas de Usuario</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Debes proporcionar información precisa y actualizada al crear tu cuenta</li>
              <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
              <li>Debes ser mayor de 16 años para utilizar el servicio</li>
              <li>Una persona no puede mantener más de una cuenta</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Planes y Pagos</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Los precios de fundador se mantienen mientras la suscripción esté activa</li>
              <li>Los pagos se procesan mensualmente de forma automática</li>
              <li>Los precios regulares pueden ser modificados con 30 días de aviso previo</li>
              <li>No hay reembolsos por períodos parciales de suscripción</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Uso Aceptable</h2>
            <p>Te comprometes a utilizar el servicio de manera responsable. Consulta nuestra Política de Uso Aceptable para detalles específicos sobre conductas prohibidas.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Propiedad Intelectual</h2>
            <p>Todo el contenido, diseño, código, algoritmos (incluyendo DEMA y CaliBot), logotipos y marcas de kcaliper.com son propiedad exclusiva de kcaliper.com. No se autoriza su reproducción, distribución o uso sin consentimiento previo por escrito.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Limitación de Responsabilidad</h2>
            <p>kcaliper.com es una herramienta de seguimiento y análisis. <strong className="text-white/80">NO es un sustituto de consejo médico profesional.</strong> No nos hacemos responsables de decisiones de salud tomadas basándose en los datos o análisis proporcionados por nuestro servicio. Consulta siempre con un profesional de salud cualificado.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Relación Coach-Cliente</h2>
            <p>kcaliper.com facilita la conexión entre coaches y clientes, pero no es responsable de la relación profesional entre ambos. Los coaches son responsables de la calidad de su asesoramiento.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Cancelación</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Puedes cancelar tu suscripción en cualquier momento</li>
              <li>La cancelación toma efecto al final del período de facturación actual</li>
              <li>Puedes exportar tus datos antes de cancelar</li>
              <li>Nos reservamos el derecho de suspender cuentas que violen estos términos</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Resolución de Disputas</h2>
            <p>Cualquier disputa será resuelta mediante arbitraje vinculante. Antes de iniciar cualquier procedimiento formal, las partes intentarán resolver la disputa de manera amistosa durante un período mínimo de 30 días.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos. Notificaremos cambios significativos por correo electrónico con al menos 15 días de anticipación. El uso continuado del servicio después de los cambios constituye aceptación.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">12. Contacto</h2>
            <p>Para consultas sobre estos términos: <a href="mailto:legal@kcaliper.com" className="text-[#6C5CE7] hover:underline">legal@kcaliper.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
