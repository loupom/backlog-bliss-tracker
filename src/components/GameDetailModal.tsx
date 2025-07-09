
import React, { useState } from 'react';
import { Game, GameStatus } from '@/types/Game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, Star, Clock, Calendar, Target, Plus, 
  Check, X, Play, Pause, SkipForward, Heart, Trash2 
} from 'lucide-react';

interface GameDetailModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGame: (gameId: string, updates: Partial<Game>) => void;
  onDeleteGame: (gameId: string) => void;
}

const statusOptions: { value: GameStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
  { value: 'backlog', label: 'Backlog', icon: <Target className="w-4 h-4" /> },
  { value: 'playing', label: 'Playing', icon: <Play className="w-4 h-4" /> },
  { value: 'paused', label: 'Paused', icon: <Pause className="w-4 h-4" /> },
  { value: 'finished', label: 'Finished', icon: <Check className="w-4 h-4" /> },
  { value: 'completed', label: '100% Completed', icon: <Trophy className="w-4 h-4" /> },
  { value: 'dropped', label: 'Dropped', icon: <X className="w-4 h-4" /> },
];

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  isOpen,
  onClose,
  onUpdateGame,
  onDeleteGame,
}) => {
  const [userScore, setUserScore] = useState(game?.userScore?.toString() || '');
  const [notes, setNotes] = useState(game?.notes || '');
  const [newGoal, setNewGoal] = useState('');

  if (!game) return null;

  const handleStatusChange = (status: GameStatus) => {
    onUpdateGame(game.id, { status });
  };

  const handleScoreUpdate = () => {
    const score = userScore ? parseInt(userScore) : undefined;
    if (score && (score < 1 || score > 10)) return;
    onUpdateGame(game.id, { userScore: score });
  };

  const handleNotesUpdate = () => {
    onUpdateGame(game.id, { notes: notes.trim() || undefined });
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal = {
      id: crypto.randomUUID(),
      description: newGoal.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    onUpdateGame(game.id, {
      goals: [...game.goals, goal]
    });
    
    setNewGoal('');
  };

  const handleToggleGoal = (goalId: string) => {
    const updatedGoals = game.goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    onUpdateGame(game.id, { goals: updatedGoals });
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = game.goals.filter(goal => goal.id !== goalId);
    onUpdateGame(game.id, { goals: updatedGoals });
  };

  const completedGoals = game.goals.filter(goal => goal.completed).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {game.imageUrl ? (
                <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
              ) : (
                <Trophy className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            {game.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Platform</Label>
                <Badge className="mt-1 block w-fit">
                  {game.platform.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Genres</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {game.genre.map(genre => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {game.howLongToBeat && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{game.howLongToBeat} hours to beat</span>
                </div>
              )}
              
              {game.metacriticScore && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Metacritic: {game.metacriticScore}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Added {game.dateAdded.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {statusOptions.map(option => (
                <Button
                  key={option.value}
                  variant={game.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(option.value)}
                  className="flex items-center gap-2 justify-start"
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rating Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="userScore" className="text-base font-semibold">Your Rating (1-10)</Label>
              <div className="flex gap-2">
                <Input
                  id="userScore"
                  type="number"
                  min="1"
                  max="10"
                  value={userScore}
                  onChange={(e) => setUserScore(e.target.value)}
                  placeholder="Rate this game..."
                />
                <Button onClick={handleScoreUpdate} size="sm">
                  Save
                </Button>
              </div>
              {game.userScore && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= game.userScore! / 2
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">{game.userScore}/10</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goals ({completedGoals}/{game.goals.length})
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a new goal..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <Button onClick={handleAddGoal} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {game.goals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`h-5 w-5 p-0 ${goal.completed ? 'text-green-500' : 'text-muted-foreground'}`}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <span 
                    className={`flex-1 text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {goal.description}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your thoughts about this game..."
              rows={4}
            />
            <Button onClick={handleNotesUpdate} size="sm" className="w-fit">
              Save Notes
            </Button>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button 
              onClick={() => {
                onDeleteGame(game.id);
                onClose();
              }}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
