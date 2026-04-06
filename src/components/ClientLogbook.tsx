import React, { useState } from 'react';
import { WeightEntry } from '../types/weight-tracker';
import { Logbook } from './Logbook';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Plus } from 'lucide-react';

interface ClientLogbookProps {
  entries: WeightEntry[];
  onAddEntry: (weight: number, date: string, notes: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<WeightEntry>) => void;
  clientName: string;
}

export function ClientLogbook({ entries, onAddEntry, onUpdateEntry, clientName }: ClientLogbookProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAddWeight = () => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      const today = new Date().toISOString().split('T')[0];
      onAddEntry(parseFloat(newWeight), today, newNotes);
      setNewWeight('');
      setNewNotes('');
      setShowAddForm(false);
    }
  };

  const handleQuickAdd = () => {
    const weight = prompt('Enter your weight:');
    if (weight && !isNaN(parseFloat(weight))) {
      const notes = prompt('Add notes (optional):') || '';
      const today = new Date().toISOString().split('T')[0];
      onAddEntry(parseFloat(weight), today, notes);
    }
  };

  return (
    <div className="relative">
      <Logbook
        entries={entries}
        onAddEntry={onAddEntry}
        onUpdateEntry={onUpdateEntry}
        isCoachView={false}
        clientName={clientName}
      />

      {/* Quick Add Weight Button */}
      <div className="fixed bottom-24 right-4 z-10 md:hidden">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 shadow-lg"
          onClick={handleQuickAdd}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Add Weight Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6 bg-white">
            <h3 className="text-lg mb-4">Add Weight Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Weight</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter weight"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Notes (optional)</label>
                <Input
                  placeholder="Add notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddWeight} className="flex-1">
                  Add Weight
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewWeight('');
                    setNewNotes('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}