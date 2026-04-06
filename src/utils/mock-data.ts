import { Client, Coach, WeightEntry, Alert, User } from '../types/weight-tracker';

// Helper function to generate weight data with caloric deficit trend
function generateWeightData(
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
  const totalWeightLoss = startWeight - endWeight;
  const dailyWeightLoss = totalWeightLoss / totalDays;
  
  const notes = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Cumplí mis macros perfectamente',
    'Me sentí con mucha energía',
    'Dormí muy bien',
    'día de trampa controlado',
    'baja hidratación hoy',
    'peso después de entrenar',
    'me salté el cardio',
    'excelente día de entrenamiento',
    'no cumplí los pasos',
    'aumenté la proteína'
  ];
  
  let idCounter = 1;
  
  // Generate entries 4 times per week (more realistic)
  for (let i = 0; i <= totalDays; i++) {
    // Skip some days to make it more realistic (not every day)
    const dayOfWeek = i % 7;
    if (dayOfWeek === 2 || dayOfWeek === 5) { // Skip Tuesday and Friday
      continue;
    }
    
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    // Add daily fluctuation (±0.2 to ±0.4 kg)
    const fluctuation = (Math.random() - 0.5) * 0.6;
    
    // Gradual weight loss with weekly variations
    const weekProgress = Math.floor(i / 7);
    const weeklyVariation = Math.sin(weekProgress * 0.3) * 0.3;
    
    const currentWeight = startWeight - (dailyWeightLoss * i) + fluctuation + weeklyVariation;
    
    // Round to 1 decimal
    const weight = Math.round(currentWeight * 10) / 10;
    
    // Format date as YYYY-MM-DD
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Add note randomly (10% chance)
    const note = Math.random() < 0.1 ? notes[Math.floor(Math.random() * notes.length)] : '';
    
    entries.push({
      id: `${idPrefix}${idCounter}`,
      date: dateStr,
      weight: weight,
      notes: note,
      recordedBy: 'client'
    });
    
    idCounter++;
  }
  
  return entries.reverse(); // Most recent first
}

// Mock weight entries for Client 1 (María González)
// Started at 88 kg in July 2024, now at ~81 kg (deficit trend)
const client1Entries: WeightEntry[] = generateWeightData(
  '2024-07-01',
  '2025-11-02',
  88.0,
  81.0,
  'mg'
);

// Mock weight entries for Client 2 (John Smith) - Original short data
const client2Entries: WeightEntry[] = [
  { id: 'w1', date: '2025-10-08', weight: 166.4, notes: '', recordedBy: 'client' },
  { id: 'w2', date: '2025-10-07', weight: 165.8, notes: '', recordedBy: 'client' },
  { id: 'w3', date: '2025-10-06', weight: 166.9, notes: '', recordedBy: 'client' },
  { id: 'w4', date: '2025-10-05', weight: 166.1, notes: '', recordedBy: 'client' },
  { id: 'w5', date: '2025-10-04', weight: 165.7, notes: '', recordedBy: 'client' },
  { id: 'w6', date: '2025-10-03', weight: 166.6, notes: '', recordedBy: 'client' },
  { id: 'w7', date: '2025-10-02', weight: 166.0, notes: '', recordedBy: 'client' },
  { id: 'w8', date: '2025-10-01', weight: 165.5, notes: '', recordedBy: 'client' },
  { id: 'w9', date: '2025-09-30', weight: 167.1, notes: '', recordedBy: 'client' },
  { id: 'w10', date: '2025-09-29', weight: 166.3, notes: '', recordedBy: 'client' },
  { id: 'w11', date: '2025-09-28', weight: 165.9, notes: '', recordedBy: 'client' },
  { id: 'w12', date: '2025-09-27', weight: 166.5, notes: '', recordedBy: 'client' },
  { id: 'w13', date: '2025-09-26', weight: 166.2, notes: '', recordedBy: 'client' },
  { id: 'w14', date: '2025-09-25', weight: 165.8, notes: '', recordedBy: 'client' }
];

// Mock weight entries for Client 3 (Alex Thompson)
// Started at 98 kg in July 2024, now at ~90 kg (deficit trend)
const client3Entries: WeightEntry[] = generateWeightData(
  '2024-07-01',
  '2025-11-02',
  98.0,
  90.0,
  'at'
);

// Mock weight entries for Client 4 (Sofia Martinez)
// Started at 79 kg in July 2024, now at ~72 kg (deficit trend)
const client4Entries: WeightEntry[] = generateWeightData(
  '2024-07-01',
  '2025-11-02',
  79.0,
  72.0,
  'sm'
);

// Mock weight entries for Client 5 - 185 lbs average
const client5Entries: WeightEntry[] = [
  { id: 'e1', date: '2025-10-08', weight: 185.6, notes: '', recordedBy: 'client' },
  { id: 'e2', date: '2025-10-07', weight: 184.9, notes: '', recordedBy: 'client' },
  { id: 'e3', date: '2025-10-06', weight: 185.8, notes: 'no hice cardio', recordedBy: 'client' },
  { id: 'e4', date: '2025-10-05', weight: 185.2, notes: '', recordedBy: 'client' },
  { id: 'e5', date: '2025-10-04', weight: 184.7, notes: '', recordedBy: 'client' },
  { id: 'e6', date: '2025-10-03', weight: 185.5, notes: '', recordedBy: 'client' }
];

// Mock weight entries for Client 6 - No recent entries (inactive)
const client6Entries: WeightEntry[] = [
  { id: 'f1', date: '2025-10-03', weight: 68.5, notes: '', recordedBy: 'client' },
  { id: 'f2', date: '2025-10-02', weight: 68.3, notes: '', recordedBy: 'client' },
  { id: 'f3', date: '2025-10-01', weight: 68.7, notes: '', recordedBy: 'client' },
  { id: 'f4', date: '2025-09-30', weight: 68.4, notes: '', recordedBy: 'client' }
];

// Mock weight entries for Client 7 - 95 kg average
const client7Entries: WeightEntry[] = [
  { id: 'g1', date: '2025-10-08', weight: 95.3, notes: '', recordedBy: 'client' },
  { id: 'g2', date: '2025-10-07', weight: 94.8, notes: '', recordedBy: 'client' },
  { id: 'g3', date: '2025-10-06', weight: 95.5, notes: 'baja hidratación', recordedBy: 'client' },
  { id: 'g4', date: '2025-10-05', weight: 95.1, notes: '', recordedBy: 'client' },
  { id: 'g5', date: '2025-10-04', weight: 94.7, notes: '', recordedBy: 'client' },
  { id: 'g6', date: '2025-10-03', weight: 95.4, notes: '', recordedBy: 'client' },
  { id: 'g7', date: '2025-10-02', weight: 95.0, notes: '', recordedBy: 'client' },
  { id: 'g8', date: '2025-10-01', weight: 94.6, notes: '', recordedBy: 'client' }
];

// Mock weight entries for Client 8 - 200 lbs average
const client8Entries: WeightEntry[] = [
  { id: 'h1', date: '2025-10-08', weight: 200.4, notes: '', recordedBy: 'client' },
  { id: 'h2', date: '2025-10-07', weight: 199.8, notes: '', recordedBy: 'client' },
  { id: 'h3', date: '2025-10-06', weight: 200.7, notes: '', recordedBy: 'client' },
  { id: 'h4', date: '2025-10-05', weight: 200.2, notes: '', recordedBy: 'client' },
  { id: 'h5', date: '2025-10-04', weight: 199.6, notes: '', recordedBy: 'client' }
];

export const mockClients: Client[] = [
  {
    id: 'client1',
    name: 'María González',
    email: 'maria@example.com',
    unit: 'kg',
    country: 'Spain',
    targetWeeklyRate: -0.3,
    weightEntries: client1Entries,
    createdAt: '2024-07-01',
    notifyLowest: false,
    notifyHighest: false,
    milestone: 78.0,
    milestoneAchieved: false,
    timezone: 'Europe/Madrid',
    reminderEnabled: true,
    reminderTime: '08:00',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client2',
    name: 'John Smith',
    email: 'john@example.com',
    unit: 'lbs',
    country: 'USA',
    targetWeeklyRate: 0.5,
    weightEntries: client2Entries,
    createdAt: '2024-03-01',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'America/New_York',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client3',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    unit: 'kg',
    country: 'Canada',
    targetWeeklyRate: -0.5,
    weightEntries: client3Entries,
    createdAt: '2024-07-01',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'America/Toronto',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client4',
    name: 'Sofia Martinez',
    email: 'sofia@example.com',
    unit: 'kg',
    country: 'Mexico',
    targetWeeklyRate: -0.4,
    weightEntries: client4Entries,
    createdAt: '2024-07-01',
    notifyLowest: false,
    notifyHighest: false,
    milestone: 70.0,
    milestoneAchieved: false,
    timezone: 'America/Mexico_City',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client5',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    unit: 'lbs',
    country: 'USA',
    targetWeeklyRate: -1.0,
    weightEntries: client5Entries,
    createdAt: '2024-05-20',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'America/Los_Angeles',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client6',
    name: 'Lucas Silva',
    email: 'lucas@example.com',
    unit: 'kg',
    country: 'Brazil',
    targetWeeklyRate: -0.5,
    weightEntries: client6Entries,
    createdAt: '2024-03-15',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'America/Sao_Paulo',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client7',
    name: 'Isabella Rossi',
    email: 'isabella@example.com',
    unit: 'kg',
    country: 'Italy',
    targetWeeklyRate: -0.3,
    weightEntries: client7Entries,
    createdAt: '2024-06-01',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'Europe/Rome',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  },
  {
    id: 'client8',
    name: 'Michael Chen',
    email: 'michael@example.com',
    unit: 'lbs',
    country: 'USA',
    targetWeeklyRate: 1.5,
    weightEntries: client8Entries,
    createdAt: '2024-07-12',
    notifyLowest: false,
    notifyHighest: false,
    timezone: 'America/Chicago',
    showMovingAverage: true,
    physiquePhotos: [],
    photoRequests: []
  }
];

export const mockCoach: Coach = {
  id: 'coach1',
  name: 'Dr. Carlos Rodriguez',
  email: 'carlos@argotrainer.com',
  clients: mockClients
};

export const mockAlerts: Alert[] = [
  {
    id: 'alert1',
    clientId: 'client1',
    type: 'lowest',
    message: 'María González has reached a new lowest weight: 80.6 kg',
    date: '2025-09-28',
    isRead: false
  },
  {
    id: 'alert2',
    clientId: 'client2',
    type: 'rate_deviation',
    message: 'John Smith\'s weekly rate (0.7 lbs) exceeds target (+0.5 lbs)',
    date: '2025-10-07',
    isRead: false
  },
  {
    id: 'alert3',
    clientId: 'client6',
    type: 'no_weight_entry',
    message: 'Lucas Silva has not logged weight for 7 days',
    date: '2025-10-10',
    isRead: false
  },
  {
    id: 'alert4',
    clientId: 'client4',
    type: 'lowest',
    message: 'Sofia Martinez has reached a new lowest weight: 71.7 kg',
    date: '2025-10-01',
    isRead: false
  },
  {
    id: 'alert5',
    clientId: 'client3',
    type: 'highest',
    message: 'Alex Thompson has reached a new highest weight: 90.6 kg',
    date: '2025-09-30',
    isRead: true
  },
  {
    id: 'alert6',
    clientId: 'client7',
    type: 'rate_deviation',
    message: 'Isabella Rossi\'s weekly rate (-0.1 kg) deviates from target (-0.3 kg)',
    date: '2025-10-08',
    isRead: true
  },
  {
    id: 'alert7',
    clientId: 'client1',
    type: 'weight_modified',
    message: 'María González modified weight entry from 2025-10-05',
    date: '2025-10-08',
    isRead: true
  },
  {
    id: 'alert8',
    clientId: 'client8',
    type: 'target_streak',
    message: 'Michael Chen has maintained target rate for 7 consecutive days!',
    date: '2025-10-08',
    isRead: false
  }
];

export const mockUsers: User[] = [
  {
    id: 'coach1',
    name: 'Dr. Carlos Rodriguez',
    email: 'carlos@argotrainer.com',
    role: 'coach'
  },
  {
    id: 'client1',
    name: 'María González',
    email: 'maria@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client3',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client4',
    name: 'Sofia Martinez',
    email: 'sofia@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client5',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client6',
    name: 'Lucas Silva',
    email: 'lucas@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client7',
    name: 'Isabella Rossi',
    email: 'isabella@example.com',
    role: 'client',
    coachId: 'coach1'
  },
  {
    id: 'client8',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'client',
    coachId: 'coach1'
  }
];
