export type CaliBotEventType = 
  | 'lowest' 
  | 'highest' 
  | 'deviation_positive' 
  | 'deviation_negative' 
  | 'milestone' 
  | 'plateau' 
  | 'anomaly_up' 
  | 'anomaly_down' 
  | 'no_data';

export interface CaliBotAnalysis {
  eventId: string;
  eventType: CaliBotEventType;
  title: string;
  message: string;
  educationModule?: {
    title: string;
    content: string;
  };
  coachNote?: string;
  timestamp: string;
}

export type ModuleID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
