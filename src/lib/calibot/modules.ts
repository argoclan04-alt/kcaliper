export interface EducationModule {
  id: number;
  title: string;
  content: string;
}

export const modules: EducationModule[] = [
  {
    id: 1,
    title: "Por qué el número de la báscula no es tu progreso",
    content: "El peso corporal total no mide grasa. Mide todo: agua, músculo, hueso, órganos, contenido digestivo. Una báscula convencional no puede distinguir entre un kilo de grasa y un kilo de agua.\n\nPor eso, Kcaliper no muestra solo el peso de hoy. Muestra la tendencia matematicamente calculada de las últimas semanas, eliminando las fluctuaciones que no reflejan cambios reales en composición corporal."
  },
  {
    id: 2,
    title: "Cómo funciona la tendencia real (DEMA)",
    content: "La gráfica muestra dos líneas: el peso real diario y una línea suavizada llamada DEMA. El DEMA pondera más los registros recientes y filtra el ruido generado por retención de agua, digestión y otras fuentes de variación.\n\nEs la respuesta a la pregunta: si ignoramos las fluctuaciones de corto plazo, ¿hacia dónde va realmente mi cuerpo?\n\nUn DEMA que desciende de forma consistente indica pérdida de masa. Un DEMA que asciende de forma controlada indica ganancia. Un DEMA plano indica mantenimiento o estancamiento real."
  },
  {
    id: 3,
    title: "Qué es la tasa semanal y cómo interpretarla",
    content: "La tasa semanal es el ritmo al que está cambiando la masa corporal según la tendencia matemática. No es lo que se ganó o perdió en la báscula esta semana. Es la velocidad de cambio calculada sobre las últimas entradas.\n\nEl coach configura una tasa objetivo específica. Si la tasa actual se desvía más de 0.2 kg por semana de la objetivo, el sistema notifica automáticamente. Una desviación no es automáticamente un problema — puede tener causas conocidas y legítimas."
  },
  {
    id: 4,
    title: "El ciclo menstrual y el peso corporal",
    content: "El ciclo menstrual tiene un efecto directo y predecible en el peso que no refleja cambios reales en composición corporal.\n\n- Fase folicular (días 1-14): Peso más estable.\n- Ovulación (día 14 aprox.): Pequeño aumento de 0.2-0.5 kg.\n- Fase lútea (días 15-28): Retención de 0.5 a 3 kg por progesterona.\n- Menstruación (días 1-5): Pérdida rápida del peso retenido."
  },
  {
    id: 5,
    title: "La retención de agua por sodio",
    content: "Cuando se consume sodio en cantidades elevadas, el cuerpo retiene agua para mantener la concentración osmótica. Una comida alta en sodio puede generar retención de 0.5-2 kg en la báscula.\n\nEste peso desaparece en 12 a 48 horas conforme los riñones excretan el exceso."
  },
  {
    id: 6,
    title: "Por qué se pierde tanto peso en los primeros días de un déficit",
    content: "Al inicio de un déficit calórico, el cuerpo agota primero sus reservas de glucógeno. Cada gramo de glucógeno está asociado con 3-4 gramos de agua. Al vaciar estas reservas se libera toda esa agua, generando pérdidas de 1.5 a 4 kg iniciales que no son grasa."
  },
  {
    id: 7,
    title: "El estancamiento real vs la fluctuación aparente",
    content: "Un estancamiento real ocurre cuando la tasa semanal se mantiene cerca de cero durante más de 3-4 semanas en contexto de déficit calórico confirmado. Un estancamiento aparente ocurre cuando el peso sube y baja pero el DEMA no desciende significativamente durante 1-2 semanas."
  },
  {
    id: 8,
    title: "La inflamación por ejercicio y el peso",
    content: "El entrenamiento de fuerza genera microlesiones musculares que el cuerpo repara durante la recuperación. Este proceso incluye retención de fluidos en el tejido muscular (inflamación). Es normal ver un aumento de 0.3 a 1 kg en las siguientes 24-48 horas después de una sesión intensa."
  },
  {
    id: 9,
    title: "El sueño y su efecto en el peso",
    content: "La falta de sueño eleva el cortisol (promueve retención de agua), aumenta el hambre (ghrelina) y disminuye la saciedad (leptina). Un atleta cansado puede pesar 0.3-0.8 kg más independientemente de su dieta."
  },
  {
    id: 10,
    title: "Déficit calórico y matemáticas básicas",
    content: "Un déficit de 500 calorías por día produce aproximadamente 0.45 kg de pérdida de grasa por semana teórica. En la práctica varía por adaptación metabólica y composición de lo perdido."
  },
  {
    id: 11,
    title: "La importancia de las fotos sobre el número",
    content: "El peso no captura la composición corporal. Es posible pesar lo mismo pero verse mejor si se perdió grasa y se ganó músculo simultáneamente. Las fotos de progreso son el indicador visual más confiable."
  },
  {
    id: 12,
    title: "Suplementos y su efecto en el peso",
    content: "Creatina monohidratada genera retención de agua intracelular de 0.5 a 3 kg. La cafeína tiene efecto diurético leve. Ninguno indica ganancia o pérdida de grasa real en el corto plazo."
  }
];
