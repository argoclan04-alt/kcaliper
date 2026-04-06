import React from 'react';
import { WeightEntry } from '../types/weight-tracker';
import { Logbook } from './Logbook';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface CoachLogbookProps {
  entries: WeightEntry[];
  onUpdateEntry: (entryId: string, updates: Partial<WeightEntry>) => void;
  clientName: string;
  onBack: () => void;
}

export function CoachLogbook({ entries, onUpdateEntry, clientName, onBack }: CoachLogbookProps) {
  return (
    <div>
      {/* Header */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-medium">{clientName} - Weight Log</h2>
            <p className="text-sm text-gray-600">View-only mode - Client can modify notes</p>
          </div>
        </div>
      </Card>

      {/* Logbook Component */}
      <Logbook
        entries={entries}
        onAddEntry={() => {}} // Coach cannot add entries
        onUpdateEntry={onUpdateEntry}
        isCoachView={true}
        clientName={clientName}
      />
    </div>
  );
}