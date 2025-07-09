
import React, { useState } from 'react';
import { Game, Platform } from '@/types/Game';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import { GameSearchInput } from './GameSearchInput';

interface AddGameModalProps {
  onAddGame: (game: Omit<Game, 'id' | 'dateAdded'>) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ onAddGame }) => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>('steam');
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
      platform: platform,
      status: 'backlog',
      genre: gameData.genre,
      imageUrl: gameData.imageUrl,
      howLongToBeat: gameData.howLongToBeat,
      metacriticScore: gameData.metacriticScore,
      goals: [],
      notes: notes.trim() || undefined,
    };

    onAddGame(newGame);
    
    // Reset form
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-gaming">
          <Plus className="w-4 h-4" />
          Add Game
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-gaming">
            <Search className="w-5 h-5" />
            Add Game to Library
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Search & Add Game</Label>
            <GameSearchInput 
              onGameSelect={handleGameSelect}
            />
            <p className="text-xs text-muted-foreground">
              Start typing to search for games. Game details will be automatically filled.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steam">Steam</SelectItem>
                <SelectItem value="epic">Epic Games</SelectItem>
                <SelectItem value="gog">GOG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this game..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
