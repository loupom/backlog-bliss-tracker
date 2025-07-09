
import React, { useState } from 'react';
import { Game, Platform, Genre } from '@/types/Game';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AddGameModalProps {
  onAddGame: (game: Omit<Game, 'id' | 'dateAdded'>) => void;
}

const genres: Genre[] = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 
  'Sports', 'Racing', 'Puzzle', 'Horror', 'Indie', 'MMO', 'FPS', 'Platformer'
];

export const AddGameModal: React.FC<AddGameModalProps> = ({ onAddGame }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('steam');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [howLongToBeat, setHowLongToBeat] = useState('');
  const [metacriticScore, setMetacriticScore] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGame: Omit<Game, 'id' | 'dateAdded'> = {
      title: title.trim(),
      platform,
      status: 'backlog',
      genre: selectedGenres,
      imageUrl: imageUrl.trim() || undefined,
      howLongToBeat: howLongToBeat ? parseInt(howLongToBeat) : undefined,
      metacriticScore: metacriticScore ? parseInt(metacriticScore) : undefined,
      goals: [],
      notes: notes.trim() || undefined,
    };

    onAddGame(newGame);
    
    // Reset form
    setTitle('');
    setPlatform('steam');
    setSelectedGenres([]);
    setImageUrl('');
    setHowLongToBeat('');
    setMetacriticScore('');
    setNotes('');
    setOpen(false);
  };

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Game
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Add Game to Library
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Game Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter game title..."
              required
            />
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
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="howLongToBeat">Hours to Beat</Label>
              <Input
                id="howLongToBeat"
                type="number"
                value={howLongToBeat}
                onChange={(e) => setHowLongToBeat(e.target.value)}
                placeholder="25"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metacriticScore">Metacritic Score</Label>
              <Input
                id="metacriticScore"
                type="number"
                value={metacriticScore}
                onChange={(e) => setMetacriticScore(e.target.value)}
                placeholder="85"
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Cover Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/game-cover.jpg"
              type="url"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this game..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add to Backlog
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
