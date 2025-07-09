
import React, { useState, useEffect } from 'react';
import { Game, GameStatus } from '@/types/Game';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Star, Trophy, Play, Pause, Target, Heart, X, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface GameCardProps {
  game: Game;
  onStatusChange: (gameId: string, status: GameStatus) => void;
  onEdit: (game: Game) => void;
  compact?: boolean;
}

const statusConfig = {
  wishlist: { label: 'Wishlist', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50', icon: Heart },
  backlog: { label: 'Backlog', color: 'bg-blue-500/20 text-blue-300 border-blue-500/50', icon: Target },
  playing: { label: 'Playing', color: 'bg-green-500/20 text-green-300 border-green-500/50', icon: Play },
  paused: { label: 'Paused', color: 'bg-orange-500/20 text-orange-300 border-orange-500/50', icon: Pause },
  finished: { label: 'Finished', color: 'bg-purple-500/20 text-purple-300 border-purple-500/50', icon: Trophy },
  completed: { label: '100%', color: 'bg-pink-500/20 text-pink-300 border-pink-500/50', icon: Star },
  dropped: { label: 'Dropped', color: 'bg-red-500/20 text-red-300 border-red-500/50', icon: X },
};

const platformColors = {
  steam: 'bg-blue-600',
  epic: 'bg-purple-600',
  gog: 'bg-pink-600',
};

export const GameCard: React.FC<GameCardProps> = ({ game, onStatusChange, onEdit, compact = false }) => {
  const [currentStatus, setCurrentStatus] = useState<GameStatus>(game.status);
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  // Update local status when game prop changes
  useEffect(() => {
    setCurrentStatus(game.status);
  }, [game.status]);

  const statusInfo = statusConfig[currentStatus];
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (newStatus === currentStatus) return;
    
    setIsStatusChanging(true);
    setCurrentStatus(newStatus); // Update UI immediately
    
    // Add a small delay to ensure visual feedback
    setTimeout(() => {
      onStatusChange(game.id, newStatus);
      setIsStatusChanging(false);
    }, 100);
  };

  const completedGoals = game.goals.filter(goal => goal.completed).length;
  const totalGoals = game.goals.length;

  return (
    <Card className={`game-card ${compact ? 'flex flex-row' : ''} ${isStatusChanging ? 'opacity-50' : ''}`}>
      {game.imageUrl && (
        <div className={`${compact ? 'w-24 h-16' : 'h-48'} overflow-hidden ${compact ? 'rounded-l-xl' : 'rounded-t-xl'}`}>
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className={`${compact ? 'flex-1' : ''}`}>
        <CardHeader className={`${compact ? 'pb-2' : 'pb-3'}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-gaming font-semibold ${compact ? 'text-sm' : 'text-lg'} truncate`}>
                {game.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className={`${platformColors[game.platform]} text-white text-xs`}>
                  {game.platform.toUpperCase()}
                </Badge>
                <Badge 
                  className={`status-badge ${statusInfo.color} transition-all duration-200`}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(game)}>
                  Edit Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className={`${compact ? 'pt-0' : ''}`}>
          <div className="space-y-3">
            {game.genre.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {game.genre.slice(0, 3).map(genre => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {game.howLongToBeat && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {game.howLongToBeat}h
                  </div>
                )}
                {game.metacriticScore && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {game.metacriticScore}
                  </div>
                )}
                {totalGoals > 0 && (
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {completedGoals}/{totalGoals}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Change Status</label>
              <Select 
                value={currentStatus} 
                onValueChange={handleStatusChange}
                disabled={isStatusChanging}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wishlist">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3" />
                      Wishlist
                    </div>
                  </SelectItem>
                  <SelectItem value="backlog">
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      Backlog
                    </div>
                  </SelectItem>
                  <SelectItem value="playing">
                    <div className="flex items-center gap-2">
                      <Play className="w-3 h-3" />
                      Playing
                    </div>
                  </SelectItem>
                  <SelectItem value="paused">
                    <div className="flex items-center gap-2">
                      <Pause className="w-3 h-3" />
                      Paused
                    </div>
                  </SelectItem>
                  <SelectItem value="finished">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3 h-3" />
                      Finished
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      100% Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="dropped">
                    <div className="flex items-center gap-2">
                      <X className="w-3 h-3" />
                      Dropped
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
