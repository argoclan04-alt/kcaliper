import { Client, WeightEntry } from '../../types/weight-tracker';
import { CaliBotAnalysis, CaliBotEventType } from './types';
import { getTemplate, getCoachTemplate } from './templates';
import { modules } from './modules';

export class CaliBotEngine {
  static analyzeProgress(client: Client, newEntry: WeightEntry): CaliBotAnalysis {
    const historicalEntries = client.weightEntries || [];
    const entriesCount = historicalEntries.length + 1;
    const lastEntry = historicalEntries[0]; // Entries are usually sorted by date desc
    
    let eventType: CaliBotEventType = 'plateau';
    let moduleIds: number[] = [1, 2]; // Default modules

    // 1. Check for anomalies
    if (lastEntry) {
      const diff = newEntry.weight - lastEntry.weight;
      if (Math.abs(diff) > 0.8) {
        eventType = diff > 0 ? 'anomaly_up' : 'anomaly_down';
        if (diff > 0) moduleIds.push(5, 8); // Salt/Exercise inflammation
      }
    }

    // 2. Check for historical peaks (Lowest/Highest)
    const weights = historicalEntries.map(e => e.weight);
    if (weights.length > 5) {
      if (newEntry.weight < Math.min(...weights)) {
        eventType = 'lowest';
        moduleIds.push(11);
      } else if (newEntry.weight > Math.max(...weights)) {
        eventType = 'highest';
        moduleIds.push(7);
      }
    }

    // 3. Check for Rate Deviation
    if (newEntry.weeklyRate !== undefined && client.targetWeeklyRate !== undefined) {
      const deviation = newEntry.weeklyRate - client.targetWeeklyRate;
      if (Math.abs(deviation) > 0.2) {
        eventType = deviation > 0 ? 'deviation_positive' : 'deviation_negative';
        moduleIds.push(3, 10);
      }
    }

    // 4. Milestone Detection
    if (client.milestone && !client.milestoneAchieved) {
      const reached = client.targetWeeklyRate && client.targetWeeklyRate < 0 
        ? newEntry.weight <= client.milestone 
        : newEntry.weight >= client.milestone;
        
      if (reached) {
        eventType = 'milestone';
      }
    }

    // 5. Basic mode if not enough data
    if (entriesCount < 5) {
       eventType = 'no_data'; // We use no_data as "not enough data for trend"
    }

    // Prepare response
    const diff = lastEntry ? newEntry.weight - lastEntry.weight : 0;
    const templateData = {
      weight: newEntry.weight,
      diff,
      weeklyRate: newEntry.weeklyRate,
      targetRate: client.targetWeeklyRate,
      entriesCount,
      milestone: client.milestone,
      weeksTaken: Math.ceil(entriesCount / 7), // Rough estimate
      clientName: client.name,
      daysMissing: 0
    };

    const message = getTemplate(eventType, templateData);
    const coachNote = getCoachTemplate(eventType, templateData);
    
    // Select one relevant module (the last one added is usually specific)
    const selectedModuleId = moduleIds[moduleIds.length - 1];
    const educationModule = modules.find(m => m.id === selectedModuleId);

    return {
      eventId: `cb-${Date.now()}`,
      eventType,
      title: this.getEventTitle(eventType),
      message,
      educationModule,
      coachNote,
      timestamp: new Date().toISOString()
    };
  }

  private static getEventTitle(type: CaliBotEventType): string {
    switch (type) {
      case 'lowest': return '¡Nuevo Mínimo Registrado!';
      case 'highest': return 'Nuevo Máximo Histórico';
      case 'milestone': return '¡Milestone Alcanzado!';
      case 'deviation_positive':
      case 'deviation_negative': return 'Desviación de Tasa Detectada';
      case 'anomaly_up':
      case 'anomaly_down': return 'Variación Significativa Detectada';
      case 'plateau': return 'Análisis de Tendencia';
      default: return 'Registro Confirmado';
    }
  }
}
