import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, ChevronDown, ChevronRight, Brain, Calculator, MessageSquare, Users } from 'lucide-react';
import { modules } from '../lib/calibot/modules';

interface TrainingModulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: 'coach' | 'athlete';
}

// ─── Coach-specific documentation sections ───
const coachSections = [
  {
    id: 'formulas',
    title: 'Fórmulas Matemáticas',
    icon: Calculator,
    content: [
      {
        subtitle: 'EMA (Exponential Moving Average)',
        text: 'EMA_t = (Peso_hoy × α) + (EMA_ayer × (1 - α)) donde α = 2 / (n + 1) con n = 10.\n\nPondera el peso reciente más que el histórico. Los últimos 10 registros tienen la mayor influencia.'
      },
      {
        subtitle: 'DEMA (Double Exponential Moving Average)',
        text: 'DEMA = (2 × EMA) - EMA(EMA)\n\nReduce el "lag" del EMA simple. Responde más rápido a cambios reales de tendencia. Es el valor que el sistema muestra como "tendencia real".'
      },
      {
        subtitle: 'Weekly Rate (Tasa Semanal)',
        text: 'Se calcula como la diferencia entre el DEMA actual y el DEMA de hace 7 días.\n\nTasa positiva = ganancia de masa. Tasa negativa = pérdida de masa. Tolerancia por defecto: ±0.3 kg del target configurado.'
      }
    ]
  },
  {
    id: 'decision-tree',
    title: 'Árbol de Decisiones CaliBot',
    icon: Brain,
    content: [
      {
        subtitle: 'Entrada de Peso Normal',
        text: '1. Calcular DEMA actualizado\n2. Calcular tasa semanal\n3. Comparar con target del coach\n4. Si desviación > ±0.3 → Alerta de desviación\n5. Si peso < mínimo histórico → Alerta de lowest\n6. Si peso > máximo histórico → Alerta de highest'
      },
      {
        subtitle: 'Detección de Plateau',
        text: 'Se activa cuando la tasa semanal se mantiene entre -0.05 y +0.05 durante más de 3 semanas consecutivas en contexto de déficit calórico confirmado.'
      },
      {
        subtitle: 'Detección de Milestone',
        text: 'Se compara el DEMA actual contra el milestone configurado por el coach. Si el DEMA cruza el milestone, se genera notificación automática y se marca como alcanzado.'
      }
    ]
  },
  {
    id: 'templates',
    title: 'Plantillas de Mensajes',
    icon: MessageSquare,
    content: [
      {
        subtitle: 'Reporte Semanal Automático',
        text: '- Resumen de tendencia (DEMA inicio vs fin de semana)\n- Tasa semanal vs target\n- Días registrados / días esperados\n- Comentario contextual según estado (on-track, desviation, plateau)'
      },
      {
        subtitle: 'Mensaje de Bienvenida',
        text: 'Se envía al atleta cuando es asignado a un coach. Incluye: presentación del sistema, qué esperar, frecuencia de pesaje recomendada.'
      },
      {
        subtitle: 'Alerta de Inactividad',
        text: 'Se envía después de 3 días sin registro. Tono neutral, sin culpa. Recuerda la importancia de la consistencia para la precisión del DEMA.'
      }
    ]
  },
  {
    id: 'coach-tools',
    title: 'Herramientas del Coach',
    icon: Users,
    content: [
      {
        subtitle: 'Configuración de Target Rate',
        text: 'El coach configura la tasa semanal objetivo para cada atleta. Valores típicos:\n- Pérdida suave: -0.2 a -0.3 kg/sem\n- Pérdida moderada: -0.4 a -0.5 kg/sem\n- Pérdida agresiva: -0.6 a -0.8 kg/sem\n- Volumen limpio: +0.2 a +0.3 kg/sem'
      },
      {
        subtitle: 'Sistema de Alertas',
        text: 'Las alertas se generan automáticamente por:\n- Nuevo peso mínimo (lowest)\n- Nuevo peso máximo (highest)\n- Desviación significativa del target\n- Inactividad prolongada\n- Achievement de milestone\n- Rachas de consistencia'
      },
      {
        subtitle: 'Fotos de Progreso',
        text: 'El coach puede solicitar fotos en 3 vistas: frontal, lateral y posterior. Las fotos se organizan por fecha y revisión, permitiendo comparaciones visuales entre periodos.'
      }
    ]
  }
];

export function TrainingModulesModal({ open, onOpenChange, role }: TrainingModulesModalProps) {
  const [expandedModule, setExpandedModule] = useState<number | string | null>(null);

  const toggleModule = (id: number | string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            {role === 'coach' ? 'Documentación CaliBot — Coach' : 'Módulos Educativos'}
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {role === 'coach'
              ? 'Referencia técnica del motor de inteligencia artificial de Kcaliper'
              : 'Aprende cómo funciona tu cuerpo y por qué la báscula fluctúa'}
          </p>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {role === 'athlete' ? (
            // ─── ATHLETE VIEW: Educational modules ───
            modules.map((mod) => (
              <Card
                key={mod.id}
                className="border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:shadow-sm"
                onClick={() => toggleModule(mod.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-7 h-7 flex items-center justify-center p-0 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                        {mod.id}
                      </Badge>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{mod.title}</h4>
                    </div>
                    {expandedModule === mod.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  {expandedModule === mod.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {mod.content}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            // ─── COACH VIEW: Technical documentation ───
            coachSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card
                  key={section.id}
                  className="border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:shadow-sm"
                  onClick={() => toggleModule(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                          <SectionIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{section.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {section.content.length} temas
                        </Badge>
                        {expandedModule === section.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {expandedModule === section.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-4">
                        {section.content.map((item, idx) => (
                          <div key={idx}>
                            <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                              {item.subtitle}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed font-mono text-xs">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
