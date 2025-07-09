
import { useState, useEffect } from 'react';
import { Game, GameStatus, Platform } from '@/types/Game';

const STORAGE_KEY = 'game-library';

export const useGameLibrary = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Load games from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedGames = JSON.parse(stored).map((game: any) => ({
          ...game,
          dateAdded: new Date(game.dateAdded),
          dateStarted: game.dateStarted ? new Date(game.dateStarted) : undefined,
          dateCompleted: game.dateCompleted ? new Date(game.dateCompleted) : undefined,
          goals: game.goals.map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt)
          }))
        }));
        setGames(parsedGames);
      } catch (error) {
        console.error('Error loading games from storage:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save games to localStorage whenever games change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    }
  }, [games, loading]);

  const addGame = (game: Omit<Game, 'id' | 'dateAdded'>) => {
    const newGame: Game = {
      ...game,
      id: crypto.randomUUID(),
      dateAdded: new Date(),
    };
    setGames(prev => [...prev, newGame]);
  };

  const updateGameStatus = (gameId: string, status: GameStatus) => {
    setGames(prev => prev.map(game => {
      if (game.id === gameId) {
        const updates: Partial<Game> = { status };
        
        if (status === 'playing' && !game.dateStarted) {
          updates.dateStarted = new Date();
        }
        
        if ((status === 'finished' || status === 'completed') && !game.dateCompleted) {
          updates.dateCompleted = new Date();
        }
        
        return { ...game, ...updates };
      }
      return game;
    }));
  };

  const updateGame = (gameId: string, updates: Partial<Game>) => {
    setGames(prev => prev.map(game => 
      game.id === gameId ? { ...game, ...updates } : game
    ));
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(game => game.id !== gameId));
  };

  const getGamesByStatus = (status: GameStatus) => {
    return games.filter(game => game.status === status);
  };

  const getGamesByPlatform = (platform: Platform) => {
    return games.filter(game => game.platform === platform);
  };

  const currentlyPlaying = games.filter(game => game.status === 'playing');
  const backlogCount = games.filter(game => game.status === 'backlog').length;
  const completedCount = games.filter(game => game.status === 'finished' || game.status === 'completed').length;

  return {
    games,
    loading,
    addGame,
    updateGameStatus,
    updateGame,
    deleteGame,
    getGamesByStatus,
    getGamesByPlatform,
    currentlyPlaying,
    backlogCount,
    completedCount,
  };
};
