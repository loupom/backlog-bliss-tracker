
import React from 'react';
import { Game } from '@/types/Game';
import { Clock, Star, Target, Calendar, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  game: Game;
  onStatusChange: (gameId: string, status: Game['status']) => void;
  onEdit: (game: Game) => void;
  compact?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  onStatusChange, 
  onEdit, 
  compact = false 
}) => {
  const getStatusColor = (status: Game['status']) => {
    const colors = {
      wishlist: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      backlog: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      playing: 'bg-green-500/20 text-green-300 border-green-500/30',
      finished: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      completed: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      paused: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      dropped: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return colors[status];
  };

  const getPlatformColor = (platform: Game['platform']) => {
    const colors = {
      steam: 'bg-[hsl(var(--steam))]/20 text-[hsl(var(--steam))] border-[hsl(var(--steam))]/30',
      epic: 'bg-[hsl(var(--epic))]/20 text-[hsl(var(--epic))] border-[hsl(var(--epic))]/30',
      gog: 'bg-[hsl(var(--gog))]/20 text-[hsl(var(--gog))] border-[hsl(var(--gog))]/30',
    };
    return colors[platform];
  };

  const completedGoals = game.goals.filter(goal => goal.completed).length;

  if (compact) {
    return (
      <div className="game-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {game.imageUrl ? (
              <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
            ) : (
              <Trophy className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{game.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getPlatformColor(game.platform)} text-xs`}>
                {game.platform.toUpperCase()}
              </Badge>
              <Badge className={`${getStatusColor(game.status)} text-xs`}>
                {game.status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(game)}>
            <Target className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-card p-6">
      <div className="flex gap-4">
        <div className="w-20 h-28 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {game.imageUrl ? (
            <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
          ) : (
            <Trophy className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight">{game.title}</h3>
            <Button variant="ghost" size="sm" onClick={() => onEdit(game)}>
              <Target className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getPlatformColor(game.platform)}>
              {game.platform.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(game.status)}>
              {game.status}
            </Badge>
            {game.genre.slice(0, 2).map(genre => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            {game.howLongToBeat && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{game.howLongToBeat}h to beat</span>
              </div>
            )}
            
            {game.metacriticScore && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Meta: {game.metacriticScore}</span>
              </div>
            )}
            
            {game.goals.length > 0 && (
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{completedGoals}/{game.goals.length} goals</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Added {game.dateAdded.toLocaleDateString()}</span>
            </div>
          </div>
          
          {game.userScore && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Your rating:</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (game.userScore || 0) / 2
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{game.userScore}/10</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
