import { CaliBotEventType } from './types';

interface TemplateData {
  weight?: number;
  lastWeight?: number;
  diff?: number;
  weeklyRate?: number;
  targetRate?: number;
  entriesCount?: number;
  milestone?: number;
  weeksTaken?: number;
  clientName?: string;
  daysMissing?: number;
}

export const getTemplate = (type: CaliBotEventType, data: TemplateData): string => {
  const diffAbs = Math.abs(data.diff || 0).toFixed(1);
  const weeklyRateAbs = Math.abs(data.weeklyRate || 0).toFixed(2);
  const targetRateAbs = Math.abs(data.targetRate || 0).toFixed(2);
  const deviation = Math.abs((data.weeklyRate || 0) - (data.targetRate || 0)).toFixed(2);

  switch (type) {
    case 'lowest':
      return `Peso de hoy: ${data.weight} kg — tu punto más bajo desde que empezaste a registrar.

Llevas ${data.entriesCount} registros con una tendencia de ${data.weeklyRate} kg por semana. En términos concretos, eso representa un progreso real y documentado.

Tu coach fue notificado automáticamente. Si tienen configurado un milestone, verifica si ya lo alcanzaste.

Sigue registrando con la misma consistencia.`;

    case 'highest':
      return `Peso de hoy: ${data.weight} kg.

Tu tendencia actual es de ${data.weeklyRate} kg por semana. Ese es el número que refleja lo que está pasando. Los pesos individuales fluctúan por docenas de razones que no tienen que ver con grasa corporal.

Un solo registro elevado no cambia la dirección de tu progreso a menos que la tendencia también lo refleje de forma sostenida.

Si hay algo relevante sobre estas últimas 48 horas, añade una nota para que tu coach pueda contextualizarlo.`;

    case 'anomaly_up':
      return `Peso de hoy: ${data.weight} kg — +${diffAbs} kg respecto al último registro.

Un cambio de esta magnitud en un solo día es prácticamente siempre temporal. Para acumular ${diffAbs} kg de grasa, necesitarías haber consumido aproximadamente ${Math.round((data.diff || 0) * 7700)} calorías en exceso ese día.

Las causas más probables son retención de agua por sodio, contenido digestivo, o inflamación si entrenaste fuerte las últimas horas.

Tu tendencia de las últimas semanas sigue en ${data.weeklyRate} kg por semana. Ese es el dato que importa. Si tienes contexto adicional, puedes agregarlo como nota.`;

    case 'deviation_negative': // Perdiendo más rápido
      return `Tu tendencia actual muestra ${data.weeklyRate} kg por semana. Tu objetivo configurado es ${data.targetRate} kg por semana. La diferencia es de ${deviation} kg.

Una pérdida más rápida de lo planificado puede indicar que el déficit es más agresivo de lo previsto, o que hay factores que elevan tu gasto energético.

Perder más rápido no siempre es mejor. Un déficit muy agresivo puede aumentar el catabolismo muscular. Tu coach fue notificado para revisar si hay algo que ajustar. No cambies nada por tu cuenta hasta que te confirme.`;

    case 'deviation_positive': // Perdiendo más lento (o ganando)
      return `Tu tendencia actual muestra ${data.weeklyRate} kg por semana. Tu objetivo es ${data.targetRate} kg por semana.

La diferencia puede explicarse por adaptación metabólica después de semanas de déficit, retención de agua temporal, o un balance calórico más cercano a mantenimiento de lo planeado.

Tu coach fue notificado. Antes de su respuesta, si quieres aportarle contexto, una nota sobre tus últimas semanas en términos de alimentación o entrenamiento puede ser útil.`;

    case 'milestone':
      return `Peso de hoy: ${data.weight} kg — alcanzaste el milestone de ${data.milestone} kg que configuró tu coach.

Tardaste ${data.weeksTaken} semanas desde que se configuró ese objetivo. Tu tasa promedio durante ese período fue de ${data.weeklyRate} kg por semana.

Tu coach ya fue notificado. El siguiente paso, si corresponde, es que configuren un nuevo objetivo o ajusten tu plan según tus metas actuales.`;

    case 'no_data':
      return `No hemos visto un registro tuyo en los últimos ${data.daysMissing} días.

El análisis de tendencia funciona mejor con datos frecuentes. A más registros, menos peso tiene cada número individual y más preciso es el cálculo.

Cuando quieras registrar, hazlo. No es necesario compensar ni ajustar nada por los días que no registraste.`;

    case 'plateau':
      return `Tu tendencia lleva aproximadamente 14 días sin un cambio significativo. La tasa calculada está en ${data.weeklyRate} kg por semana, cerca de cero.

Esto puede tener varias causas: adaptación calórica después de semanas de déficit, estimación del balance calórico que necesita ajuste, o retención de agua que está enmascarando pérdida real de grasa.

Tu coach tiene visibilidad sobre esta situación. Si aún no han hablado de ello, puede ser un buen momento para revisarlo con tus datos en mano.

¿Hay algo que haya cambiado en tu dieta, entrenamiento o rutina en las últimas dos semanas?`;

    default:
      return `Peso registrado: ${data.weight} kg.

Tu tendencia de las últimas ${data.entriesCount} entradas muestra un cambio de ${data.weeklyRate} kg por semana, dentro de tu objetivo de ${data.targetRate} kg por semana.

El cambio de hoy (${data.diff ? (data.diff > 0 ? '+' : '') + data.diff.toFixed(1) : '0'} kg respecto al último registro) está dentro del rango de variación normal. No hay ajustes necesarios.`;
  }
};

export const getCoachTemplate = (type: CaliBotEventType, data: TemplateData): string => {
  switch (type) {
    case 'lowest':
      return `Alerta: Nuevo peso mínimo registrado\nCliente: ${data.clientName}\nPeso nuevo: ${data.weight} kg\nTasa actual: ${data.weeklyRate} kg/semana\nObjetivo: ${data.targetRate} kg/semana`;
    case 'milestone':
      return `Alerta: Milestone alcanzado\nCliente: ${data.clientName}\nMilestone: ${data.milestone} kg\nTiempo: ${data.weeksTaken} semanas\nTasa promedio: ${data.weeklyRate} kg/semana`;
    case 'deviation_positive':
    case 'deviation_negative':
      return `Alerta: Desviación de tasa semanal\nCliente: ${data.clientName}\nTasa actual: ${data.weeklyRate} kg/semana\nTasa objetivo: ${data.targetRate} kg/semana\nDesviación: ${Math.abs((data.weeklyRate || 0) - (data.targetRate || 0)).toFixed(2)} kg/semana`;
    default:
      return `Alerta de CaliBot: ${type}\nCliente: ${data.clientName}\nPeso: ${data.weight} kg`;
  }
};
