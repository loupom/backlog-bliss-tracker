import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GameSearchInput } from '@/components/GameSearchInput';
import { Game, Genre } from '@/types/Game';

interface AddGameModalProps {
  onAddGame: (game: Omit<Game, 'id' | 'dateAdded'>) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ onAddGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const handleGameSelect = (gameData: {
    title: string;
    genre: any[];
    imageUrl?: string;
    howLongToBeat?: number;
    metacriticScore?: number;
  }) => {
    const newGame: Omit<Game, 'id' | 'dateAdded'> = {
      title: gameData.title,
      status: 'wishlist',
      genre: gameData.genre,
      imageUrl: gameData.imageUrl,
      howLongToBeat: gameData.howLongToBeat,
      metacriticScore: gameData.metacriticScore,
      goals: [],
      notes: notes.trim() || undefined,
    };

    onAddGame(newGame);
    setIsOpen(false);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-gaming">
          <Plus className="w-4 h-4" />
          Add Game
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-gaming">
            Add Game to Library
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="game-search">Search for a game</Label>
              <GameSearchInput onGameSelect={handleGameSelect} />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this game..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};