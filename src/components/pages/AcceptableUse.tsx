import { ArrowLeft, AlertTriangle } from 'lucide-react';

export function AcceptableUse({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen fp-dark-bg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-5 py-16 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-[#FFD93D]" />
          <h1 className="text-3xl font-extrabold text-white">Política de Uso Aceptable</h1>
        </div>
        <p className="text-white/40 text-sm mb-10">Última actualización: Abril 2026</p>
        <div className="space-y-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Propósito</h2>
            <p>Esta política define las reglas de uso aceptable de kcaliper.com para garantizar una experiencia segura y positiva para todos los usuarios.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Usos Prohibidos</h2>
            <p className="mb-2">Está prohibido utilizar kcaliper.com para:</p>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Promover trastornos alimenticios o prácticas de pérdida de peso peligrosas</li>
              <li>Compartir contenido inapropiado, ofensivo o ilegal a través de fotos o mensajes</li>
              <li>Hacerse pasar por un profesional médico o de salud sin las credenciales apropiadas</li>
              <li>Realizar scraping, minería de datos o acceso automatizado no autorizado</li>
              <li>Intentar acceder a datos de otros usuarios sin autorización</li>
              <li>Usar la plataforma para spam, phishing o actividades fraudulentas</li>
              <li>Crear múltiples cuentas para evadir restricciones del plan</li>
              <li>Distribuir o revender el acceso al servicio sin autorización</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Contenido de Fotos</h2>
            <p>Las fotos de progreso deben ser exclusivamente de seguimiento de physique/composición corporal. Contenido que no esté relacionado con el seguimiento de progreso físico será eliminado. Fotos que contengan contenido sexual explícito, violento o de menores resultarán en la terminación inmediata de la cuenta y reporte a las autoridades.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Uso de la API y CaliBot</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Las interacciones con CaliBot deben estar relacionadas con seguimiento de peso y fitness</li>
              <li>No se permite usar CaliBot para generar contenido no relacionado con el servicio</li>
              <li>Los límites de interacción por plan deben respetarse; manipular los contadores es una violación</li>
              <li>El acceso a la API (plan Coach Pro) es para integración personal, no para redistribución</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Responsabilidades del Coach</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/60">
              <li>Los coaches son responsables del contenido que comparten con sus atletas</li>
              <li>Deben mantener la confidencialidad de los datos de sus clientes</li>
              <li>No deben utilizar los datos para fines distintos al coaching acordado</li>
              <li>Deben informar a sus clientes sobre el uso de kcaliper.com para seguimiento</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Cumplimiento</h2>
            <p>Las violaciones de esta política pueden resultar en:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-white/60">
              <li><strong className="text-white/80">Primera violación:</strong> Advertencia por escrito</li>
              <li><strong className="text-white/80">Segunda violación:</strong> Suspensión temporal (7 días)</li>
              <li><strong className="text-white/80">Tercera violación:</strong> Terminación permanente de la cuenta</li>
              <li><strong className="text-white/80">Violaciones graves:</strong> Terminación inmediata y reporte a autoridades si aplica</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Reportar Violaciones</h2>
            <p>Si detectas una violación de esta política, contáctanos en: <a href="mailto:abuso@kcaliper.com" className="text-[#6C5CE7] hover:underline">abuso@kcaliper.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
