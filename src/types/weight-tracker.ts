export interface NutritionData {
  id: string;
  startDate: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  pdfUrl?: string;
  notes?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes: string;
  recordedBy: 'coach' | 'client';
  isLowest?: boolean;
  isHighest?: boolean;
  movingAverage?: number;
  weeklyRate?: number;
  excludeFromCalculations?: boolean;
  nutritionId?: string; // Reference to active nutrition data at this weight entry
  photos?: PhysiquePhoto[]; // Photos associated with this date
}

export interface PhysiquePhoto {
  id: string;
  date: string;
  photoUrl: string;
  uploadedAt: string;
  notes?: string;
  viewType?: 'front' | 'side' | 'back';
  isExample?: boolean;
  fileName?: string; // Format: dd-mm-yyyy_viewType.jpg for "fotos extra" folder
}

export interface PhotoRequest {
  id: string;
  requestedDate: string;
  targetDate: string;
  status: 'pending' | 'completed' | 'overdue' | 'declined';
  completedAt?: string;
  photoId?: string;
  viewType: 'front' | 'side' | 'back';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  unit: 'kg' | 'lbs';
  country: string;
  targetWeeklyRate: number; // Coach configured target
  weightEntries: WeightEntry[];
  createdAt: string;
  notifyLowest?: boolean;
  notifyHighest?: boolean;
  notifyRateDeviation?: boolean;
  notifyWeightModified?: boolean;
  milestone?: number;
  milestoneAchieved?: boolean;
  timezone?: string;
  reminderEnabled?: boolean;
  reminderTime?: string; // Format: "HH:MM"
  showMovingAverage?: boolean;
  physiquePhotos?: PhysiquePhoto[];
  photoRequests?: PhotoRequest[];
  nutritionData?: NutritionData[];
  notifications?: ClientNotification[];
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  clients: Client[];
}

export interface Alert {
  id: string;
  clientId: string;
  type: 'lowest' | 'highest' | 'rate_deviation' | 'weight_modified' | 'no_weight_entry' | 'milestone_achieved' | 'target_streak' | 'photo_uploaded';
  message: string;
  date: string;
  isRead: boolean;
  entryId?: string;
  photoUrl?: string;
}

export interface ClientNotification {
  id: string;
  type: 'weight_modified' | 'target_rate_changed' | 'photo_requested' | 'milestone_set' | 'reminder_updated' | 'nutrition_updated' | 'coach_message';
  message: string;
  date: string;
  isRead: boolean;
  data?: any;
}

export type UserRole = 'coach' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  coachId?: string; // If client, reference to their coach
}