import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game, GameStatus } from '@/types/Game';

const statusConfig = {
  wishlist: { label: 'Wishlist', color: 'bg-slate-500', next: 'backlog' },
  backlog: { label: 'Pile of Shame', color: 'bg-orange-500', next: 'playing' },
  playing: { label: 'Playing', color: 'bg-green-500', next: 'paused' },
  paused: { label: 'Paused', color: 'bg-yellow-500', next: 'playing' },
  finished: { label: 'Finished', color: 'bg-blue-500', next: 'completed' },
  completed: { label: '100% Completed', color: 'bg-purple-500', next: 'wishlist' },
  dropped: { label: 'Dropped', color: 'bg-red-500', next: 'wishlist' },
} as const;

interface GameCardProps {
  game: Game;
  onStatusChange: (gameId: string, status: GameStatus) => void;
  compact?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onStatusChange, compact = false }) => {
  const [currentStatus, setCurrentStatus] = useState<GameStatus>(game.status);

  useEffect(() => {
    setCurrentStatus(game.status);
  }, [game.status]);

  const handleStatusClick = () => {
    const nextStatus = statusConfig[currentStatus].next as GameStatus;
    setCurrentStatus(nextStatus);
    onStatusChange(game.id, nextStatus);
  };

  const completedGoals = game.goals.filter(goal => goal.completed).length;
  const totalGoals = game.goals.length;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="flex">
        {/* Game Image */}
        <div className="w-16 h-20 flex-shrink-0">
          {game.imageUrl ? (
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        {/* Game Info */}
        <CardContent className="flex-1 p-3">
          <div className="space-y-2">
            {/* Title and Status */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {game.title}
              </h3>
              <Badge 
                className={`${statusConfig[currentStatus].color} text-white cursor-pointer hover:opacity-80 transition-opacity text-xs px-2 py-1 flex-shrink-0`}
                onClick={handleStatusClick}
              >
                {statusConfig[currentStatus].label}
              </Badge>
            </div>

            {/* Genres */}
            {game.genre.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {game.genre.slice(0, 2).map((genre, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {genre}
                  </Badge>
                ))}
                {game.genre.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{game.genre.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Goals Progress (if any) */}
            {totalGoals > 0 && (
              <div className="text-xs text-muted-foreground">
                Goals: {completedGoals}/{totalGoals}
              </div>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {game.metacriticScore && (
                <span>★ {game.metacriticScore}</span>
              )}
              {game.howLongToBeat && (
                <span>{game.howLongToBeat}h</span>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};