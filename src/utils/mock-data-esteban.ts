import { Client, Coach, WeightEntry, Alert, User, ClientNotification } from '../types/weight-tracker';

// =====================================================
// ESTEBAN ALBAN — Coach Account (Influencer Demo)
// All data is near April 8, 2026
// =====================================================

function generateRecentWeightData(
  startDate: string,
  endDate: string,
  startWeight: number,
  endWeight: number,
  idPrefix: string
): WeightEntry[] {
  const entries: WeightEntry[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeightChange = startWeight - endWeight;
  const dailyChange = totalWeightChange / totalDays;

  const spanishNotes = [
    '', '', '', '', '', '', '',
    'Cumplí mis macros perfectamente 💪',
    'Me sentí con mucha energía hoy',
    'Dormí 8 horas, me siento increíble',
    'Día de trampa controlado — pizza con amigos',
    'Baja hidratación, tomé poca agua',
    'Peso después de entrenar piernas',
    'Cardio en ayunas, 40 min',
    'Excelente día de entrenamiento',
    'No cumplí los pasos hoy',
    'Aumenté la proteína a 160g',
    'Me siento más liviano esta semana',
    'Almorcé fuera pero elegí bien',
    'Entrené a las 6am, mejor sesión del mes',
    'Estresado con el trabajo, comí de más',
    'Refeed controlado — carbos altos',
    'Check-in semanal con Esteban ✅',
    'Bajé 2cm de cintura esta quincena',
    'Me siento fuerte en sentadilla',
  ];

  let idCounter = 1;

  for (let i = 0; i <= totalDays; i++) {
    const dayOfWeek = i % 7;
    // Skip some days randomly for realism
    if (dayOfWeek === 2 || (dayOfWeek === 5 && Math.random() > 0.5)) continue;

    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const fluctuation = (Math.random() - 0.5) * 0.6;
    const weekProgress = Math.floor(i / 7);
    const weeklyVariation = Math.sin(weekProgress * 0.3) * 0.25;
    const currentWeight = startWeight - (dailyChange * i) + fluctuation + weeklyVariation;
    const weight = Math.round(currentWeight * 10) / 10;
    const dateStr = currentDate.toISOString().split('T')[0];

    // Higher note frequency for demo realism (25%)
    const note = Math.random() < 0.25 ? spanishNotes[Math.floor(Math.random() * spanishNotes.length)] : '';

    entries.push({
      id: `${idPrefix}${idCounter}`,
      date: dateStr,
      weight,
      notes: note,
      recordedBy: 'client'
    });

    idCounter++;
  }

  return entries.reverse();
}

// ─── Client 1: Valentina Torres ───
const valentinaEntries = generateRecentWeightData(
  '2025-11-01', '2026-04-08',
  72.0, 65.8,
  'vt'
);

// ─── Client 2: Diego Morales ───
const diegoEntries = generateRecentWeightData(
  '2025-12-15', '2026-04-08',
  95.0, 89.2,
  'dm'
);

// ─── Client 3: Camila Herrera ───
const camilaEntries = generateRecentWeightData(
  '2026-01-10', '2026-04-08',
  68.5, 63.1,
  'ch'
);

// ─── Client 4: Andrés Pacheco ───
const andresEntries = generateRecentWeightData(
  '2025-10-01', '2026-04-08',
  105.0, 94.6,
  'ap'
);

// ─── Client 5: Isabella Mendoza (new, short history) ───
const isabellaEntries = generateRecentWeightData(
  '2026-03-15', '2026-04-08',
  78.0, 76.8,
  'im'
);

// ─── Client 6: Sebastián Ríos (bulk / gaining) ───
const sebastianEntries = generateRecentWeightData(
  '2026-01-01', '2026-04-08',
  74.0, 78.5,
  'sr'
);

// ─── Client 7: Mariana López (cutting lento ~55 kg) ───
const marianaEntries = generateRecentWeightData(
  '2025-11-01', '2026-04-08',
  57.2, 54.8,
  'ml'
);

// ─── Client 8: Sofía Petrov (buen progreso ~61 kg) ───
const sofiaEntries = generateRecentWeightData(
  '2025-10-15', '2026-04-08',
  64.0, 60.5,
  'sp'
);

// ─── Client 9: Lucía Ramírez (mantenimiento ~47 kg) ───
const luciaEntries = generateRecentWeightData(
  '2025-11-10', '2026-04-08',
  48.5, 47.2,
  'lr'
);

// ─── Client 10: Ana García (plateau reciente ~58 kg) ───
const anaEntries = generateRecentWeightData(
  '2025-09-15', '2026-04-08',
  62.0, 57.8,
  'ag'
);

// ─── Client 11: Natalia Díaz (progreso rápido ~63 kg) ───
const nataliaEntries = generateRecentWeightData(
  '2025-11-05', '2026-04-08',
  67.0, 62.4,
  'nd'
);

// ─── Client 12: Fernanda Castillo (oscilando ~52 kg) ───
const fernandaEntries = generateRecentWeightData(
  '2025-10-20', '2026-04-08',
  54.0, 52.1,
  'fc'
);

export const estebanClients: Client[] = [
  {
    id: 'ea-client1',
    name: 'Valentina Torres',
    email: 'valentina@kcaliper.com',
    unit: 'kg',
    country: 'Colombia',
    targetWeeklyRate: -0.4,
    weightEntries: valentinaEntries,
    createdAt: '2025-11-01',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 64.0,
    milestoneAchieved: false,
    timezone: 'America/Bogota',
    reminderEnabled: true,
    reminderTime: '07:30',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn1',
        type: 'milestone_set',
        message: 'Coach Esteban configuró tu milestone: 64.0 kg 🎯',
        date: '2026-04-01',
        isRead: true,
      },
      {
        id: 'cn2',
        type: 'coach_message',
        message: '¡Increíble progreso Valentina! Solo 1.8 kg para tu milestone. Mantén el ritmo 🔥',
        date: '2026-04-06',
        isRead: false,
      },
      {
        id: 'cn3',
        type: 'target_rate_changed',
        message: 'Coach Esteban ajustó tu meta semanal a -0.4 kg/sem',
        date: '2026-03-20',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client2',
    name: 'Diego Morales',
    email: 'diego@kcaliper.com',
    unit: 'kg',
    country: 'Ecuador',
    targetWeeklyRate: -0.5,
    weightEntries: diegoEntries,
    createdAt: '2025-12-15',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 85.0,
    milestoneAchieved: false,
    timezone: 'America/Guayaquil',
    reminderEnabled: true,
    reminderTime: '06:00',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn4',
        type: 'nutrition_updated',
        message: 'Coach Esteban actualizó tu plan nutricional: 2200 kcal / 175g proteína',
        date: '2026-03-25',
        isRead: true,
      },
      {
        id: 'cn5',
        type: 'coach_message',
        message: 'Diego, vas bajando a buen ritmo. Cuidado con los fines de semana 💪',
        date: '2026-04-07',
        isRead: false,
      }
    ]
  },
  {
    id: 'ea-client3',
    name: 'Camila Herrera',
    email: 'camila@kcaliper.com',
    unit: 'kg',
    country: 'México',
    targetWeeklyRate: -0.5,
    weightEntries: camilaEntries,
    createdAt: '2026-01-10',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 60.0,
    milestoneAchieved: false,
    timezone: 'America/Mexico_City',
    reminderEnabled: true,
    reminderTime: '07:00',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn6',
        type: 'milestone_set',
        message: 'Coach Esteban configuró tu milestone: 60.0 kg 🎯',
        date: '2026-02-01',
        isRead: true,
      },
      {
        id: 'cn7',
        type: 'reminder_updated',
        message: 'Recordatorio diario actualizado: 7:00 AM',
        date: '2026-03-01',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client4',
    name: 'Andrés Pacheco',
    email: 'andres@kcaliper.com',
    unit: 'kg',
    country: 'Venezuela',
    targetWeeklyRate: -0.6,
    weightEntries: andresEntries,
    createdAt: '2025-10-01',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    notifyWeightModified: true,
    milestone: 90.0,
    milestoneAchieved: false,
    timezone: 'America/Caracas',
    reminderEnabled: true,
    reminderTime: '06:30',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn8',
        type: 'coach_message',
        message: 'Andrés, ya superaste los 95 kg. Estás a 4.6 kg de tu milestone. ¡Imparable! 🔥',
        date: '2026-04-05',
        isRead: false,
      },
      {
        id: 'cn9',
        type: 'nutrition_updated',
        message: 'Coach Esteban actualizó tu plan: 2500 kcal / 200g proteína / 250g carbs',
        date: '2026-03-15',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client5',
    name: 'Isabella Mendoza',
    email: 'isabella.m@kcaliper.com',
    unit: 'kg',
    country: 'Perú',
    targetWeeklyRate: -0.3,
    weightEntries: isabellaEntries,
    createdAt: '2026-03-15',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'America/Lima',
    reminderEnabled: false,
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn10',
        type: 'coach_message',
        message: '¡Bienvenida Isabella! Empezamos con un déficit suave. Confía en el proceso 🙌',
        date: '2026-03-15',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client6',
    name: 'Sebastián Ríos',
    email: 'sebastian@kcaliper.com',
    unit: 'kg',
    country: 'Argentina',
    targetWeeklyRate: 0.3,
    weightEntries: sebastianEntries,
    createdAt: '2026-01-01',
    notifyLowest: false,
    notifyHighest: true,
    notifyRateDeviation: true,
    milestone: 80.0,
    milestoneAchieved: false,
    timezone: 'America/Argentina/Buenos_Aires',
    reminderEnabled: true,
    reminderTime: '08:00',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn11',
        type: 'coach_message',
        message: 'Seba, fase de volumen limpio va genial. 4.5 kg ganados. ¡Vamos por esos 80! 💪',
        date: '2026-04-03',
        isRead: false,
      },
      {
        id: 'cn12',
        type: 'target_rate_changed',
        message: 'Coach Esteban ajustó tu meta semanal a +0.3 kg/sem (volumen)',
        date: '2026-02-10',
        isRead: true,
      }
    ]
  },
  // ─── NEW FEMALE CLIENTS (7-12) ───
  {
    id: 'ea-client7',
    name: 'Mariana López',
    email: 'mariana@kcaliper.com',
    unit: 'kg',
    country: 'Colombia',
    targetWeeklyRate: -0.25,
    weightEntries: marianaEntries,
    createdAt: '2025-11-01',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 53.0,
    milestoneAchieved: false,
    timezone: 'America/Bogota',
    reminderEnabled: true,
    reminderTime: '06:45',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn13',
        type: 'milestone_set',
        message: 'Coach Esteban configuró tu milestone: 53.0 kg 🎯',
        date: '2025-11-05',
        isRead: true,
      },
      {
        id: 'cn14',
        type: 'coach_message',
        message: 'Mariana, tu adherencia esta semana fue impecable. Mantén la proteína alta para proteger músculo.',
        date: '2026-04-06',
        isRead: false,
      },
      {
        id: 'cn15',
        type: 'nutrition_updated',
        message: 'Coach Esteban actualizó tu plan: 1650 kcal / 130g proteína',
        date: '2026-03-10',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client8',
    name: 'Sofía Petrov',
    email: 'sofia.petrov@kcaliper.com',
    unit: 'kg',
    country: 'Argentina',
    targetWeeklyRate: -0.35,
    weightEntries: sofiaEntries,
    createdAt: '2025-10-15',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 58.0,
    milestoneAchieved: false,
    timezone: 'America/Argentina/Buenos_Aires',
    reminderEnabled: true,
    reminderTime: '07:15',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn16',
        type: 'coach_message',
        message: 'Sofía, llevas 6 meses increíbles. Tu consistencia es ejemplo para todo el equipo.',
        date: '2026-04-07',
        isRead: false,
      },
      {
        id: 'cn17',
        type: 'target_rate_changed',
        message: 'Coach Esteban ajustó tu meta semanal a -0.35 kg/sem (fase final)',
        date: '2026-03-20',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client9',
    name: 'Lucía Ramírez',
    email: 'lucia.ramirez@kcaliper.com',
    unit: 'kg',
    country: 'México',
    targetWeeklyRate: -0.15,
    weightEntries: luciaEntries,
    createdAt: '2025-11-10',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: false,
    milestone: 46.0,
    milestoneAchieved: false,
    timezone: 'America/Mexico_City',
    reminderEnabled: true,
    reminderTime: '06:30',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn18',
        type: 'milestone_set',
        message: 'Coach Esteban configuró tu milestone: 46.0 kg 🎯',
        date: '2025-12-01',
        isRead: true,
      },
      {
        id: 'cn19',
        type: 'coach_message',
        message: 'Lucía, estás en mantenimiento perfecto. Solo ajustamos los carbos post-entreno.',
        date: '2026-04-04',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client10',
    name: 'Ana García',
    email: 'ana.garcia@kcaliper.com',
    unit: 'kg',
    country: 'España',
    targetWeeklyRate: -0.4,
    weightEntries: anaEntries,
    createdAt: '2025-09-15',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    notifyWeightModified: true,
    milestone: 55.0,
    milestoneAchieved: false,
    timezone: 'Europe/Madrid',
    reminderEnabled: true,
    reminderTime: '07:00',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn20',
        type: 'coach_message',
        message: 'Ana, llevas 7 meses de dedicación. El plateau es temporal, no toques calorías aún.',
        date: '2026-04-08',
        isRead: false,
      },
      {
        id: 'cn21',
        type: 'nutrition_updated',
        message: 'Coach Esteban actualizó tu plan: 1800 kcal / 140g proteína / refeed sábados',
        date: '2026-03-25',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client11',
    name: 'Natalia Díaz',
    email: 'natalia.diaz@kcaliper.com',
    unit: 'kg',
    country: 'Chile',
    targetWeeklyRate: -0.45,
    weightEntries: nataliaEntries,
    createdAt: '2025-11-05',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 60.0,
    milestoneAchieved: false,
    timezone: 'America/Santiago',
    reminderEnabled: true,
    reminderTime: '06:00',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn22',
        type: 'coach_message',
        message: 'Natalia, tu progreso es de los más rápidos. Vamos a bajar el ritmo un poco para proteger masa muscular.',
        date: '2026-04-05',
        isRead: false,
      },
      {
        id: 'cn23',
        type: 'target_rate_changed',
        message: 'Coach Esteban ajustó tu meta semanal a -0.45 kg/sem (desaceleración controlada)',
        date: '2026-03-15',
        isRead: true,
      }
    ]
  },
  {
    id: 'ea-client12',
    name: 'Fernanda Castillo',
    email: 'fernanda.c@kcaliper.com',
    unit: 'kg',
    country: 'Perú',
    targetWeeklyRate: -0.2,
    weightEntries: fernandaEntries,
    createdAt: '2025-10-20',
    notifyLowest: true,
    notifyHighest: false,
    notifyRateDeviation: true,
    milestone: 50.0,
    milestoneAchieved: false,
    timezone: 'America/Lima',
    reminderEnabled: true,
    reminderTime: '07:30',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: [],
    notifications: [
      {
        id: 'cn24',
        type: 'milestone_set',
        message: 'Coach Esteban configuró tu milestone: 50.0 kg 🎯',
        date: '2025-11-01',
        isRead: true,
      },
      {
        id: 'cn25',
        type: 'coach_message',
        message: 'Fernanda, las oscilaciones son normales en tu rango. Confía en la tendencia DEMA.',
        date: '2026-04-07',
        isRead: false,
      }
    ]
  }
];

export const estebanCoach: Coach = {
  id: 'coach-esteban',
  name: 'Esteban Alban',
  email: 'esteban@kcaliper.com',
  clients: estebanClients
};

export const estebanAlerts: Alert[] = [
  {
    id: 'ea-alert1',
    clientId: 'ea-client1',
    type: 'lowest',
    message: 'Valentina Torres alcanzó un nuevo peso mínimo: 65.8 kg 🎉',
    date: '2026-04-08',
    isRead: false
  },
  {
    id: 'ea-alert2',
    clientId: 'ea-client2',
    type: 'rate_deviation',
    message: 'Diego Morales — su ritmo semanal (-0.8 kg) excede la meta (-0.5 kg). Posible déficit excesivo.',
    date: '2026-04-07',
    isRead: false
  },
  {
    id: 'ea-alert3',
    clientId: 'ea-client4',
    type: 'lowest',
    message: 'Andrés Pacheco alcanzó un nuevo peso mínimo: 94.6 kg 🔥',
    date: '2026-04-08',
    isRead: false
  },
  {
    id: 'ea-alert4',
    clientId: 'ea-client3',
    type: 'target_streak',
    message: 'Camila Herrera ha mantenido su ritmo objetivo por 14 días consecutivos 🏆',
    date: '2026-04-06',
    isRead: false
  },
  {
    id: 'ea-alert5',
    clientId: 'ea-client6',
    type: 'highest',
    message: 'Sebastián Ríos alcanzó un nuevo peso máximo: 78.5 kg (volumen) 💪',
    date: '2026-04-07',
    isRead: false
  },
  {
    id: 'ea-alert6',
    clientId: 'ea-client5',
    type: 'no_weight_entry',
    message: 'Isabella Mendoza no ha registrado peso por 3 días',
    date: '2026-04-08',
    isRead: false
  },
  {
    id: 'ea-alert7',
    clientId: 'ea-client1',
    type: 'weight_modified',
    message: 'Valentina Torres modificó su entrada del 2026-04-03',
    date: '2026-04-04',
    isRead: true
  },
  {
    id: 'ea-alert8',
    clientId: 'ea-client2',
    type: 'lowest',
    message: 'Diego Morales alcanzó un nuevo peso mínimo: 89.2 kg',
    date: '2026-04-06',
    isRead: true
  },
  {
    id: 'ea-alert9',
    clientId: 'ea-client4',
    type: 'rate_deviation',
    message: 'Andrés Pacheco — ritmo semanal (-0.9 kg) excede meta (-0.6 kg). Revisar adherencia.',
    date: '2026-04-02',
    isRead: true
  },
  {
    id: 'ea-alert10',
    clientId: 'ea-client3',
    type: 'milestone_achieved',
    message: 'Camila Herrera superó el milestone de 63.5 kg. ¡A re-configurar! 🎯',
    date: '2026-04-05',
    isRead: true
  },
  // ─── NEW ALERTS FOR CLIENTS 7-12 ───
  {
    id: 'ea-alert11',
    clientId: 'ea-client7',
    type: 'lowest',
    message: 'Mariana López alcanzó un nuevo peso mínimo: 54.8 kg',
    date: '2026-04-08',
    isRead: false
  },
  {
    id: 'ea-alert12',
    clientId: 'ea-client8',
    type: 'lowest',
    message: 'Sofía Petrov alcanzó un nuevo peso mínimo: 60.5 kg 🎉',
    date: '2026-04-07',
    isRead: false
  },
  {
    id: 'ea-alert13',
    clientId: 'ea-client10',
    type: 'rate_deviation',
    message: 'Ana García — ritmo semanal (-0.1 kg) por debajo de meta (-0.4 kg). Posible plateau.',
    date: '2026-04-08',
    isRead: false
  },
  {
    id: 'ea-alert14',
    clientId: 'ea-client11',
    type: 'rate_deviation',
    message: 'Natalia Díaz — ritmo semanal (-0.7 kg) excede meta (-0.45 kg). Revisar déficit.',
    date: '2026-04-06',
    isRead: false
  },
  {
    id: 'ea-alert15',
    clientId: 'ea-client9',
    type: 'target_streak',
    message: 'Lucía Ramírez ha mantenido su ritmo objetivo por 21 días consecutivos 🏆',
    date: '2026-04-07',
    isRead: false
  },
  {
    id: 'ea-alert16',
    clientId: 'ea-client12',
    type: 'lowest',
    message: 'Fernanda Castillo alcanzó un nuevo peso mínimo: 52.1 kg',
    date: '2026-04-08',
    isRead: false
  }
];

export const estebanUsers: User[] = [
  {
    id: 'coach-esteban',
    name: 'Esteban Alban',
    email: 'esteban@kcaliper.com',
    role: 'coach'
  },
  {
    id: 'ea-client1',
    name: 'Valentina Torres',
    email: 'valentina@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client2',
    name: 'Diego Morales',
    email: 'diego@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client3',
    name: 'Camila Herrera',
    email: 'camila@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client4',
    name: 'Andrés Pacheco',
    email: 'andres@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client5',
    name: 'Isabella Mendoza',
    email: 'isabella.m@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client6',
    name: 'Sebastián Ríos',
    email: 'sebastian@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client7',
    name: 'Mariana López',
    email: 'mariana@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client8',
    name: 'Sofía Petrov',
    email: 'sofia.petrov@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client9',
    name: 'Lucía Ramírez',
    email: 'lucia.ramirez@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client10',
    name: 'Ana García',
    email: 'ana.garcia@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client11',
    name: 'Natalia Díaz',
    email: 'natalia.diaz@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  },
  {
    id: 'ea-client12',
    name: 'Fernanda Castillo',
    email: 'fernanda.c@kcaliper.com',
    role: 'client',
    coachId: 'coach-esteban'
  }
];
