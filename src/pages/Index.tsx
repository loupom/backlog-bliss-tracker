
import React, { useState, useMemo } from 'react';
import { Search, Filter, Play, Trophy, Target, Heart, List, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameCard } from '@/components/GameCard';
import { AddGameModal } from '@/components/AddGameModal';
import { GameDetailModal } from '@/components/GameDetailModal';
import { useGameLibrary } from '@/hooks/useGameLibrary';
import { Game, GameStatus, Platform } from '@/types/Game';

const Index = () => {
  const {
    games,
    loading,
    addGame,
    updateGameStatus,
    updateGame,
    deleteGame,
    getGamesByStatus,
    currentlyPlaying,
    backlogCount,
    completedCount,
  } = useGameLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = selectedStatus === 'all' || game.status === selectedStatus;
      const matchesPlatform = selectedPlatform === 'all' || game.platform === selectedPlatform;

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [games, searchTerm, selectedStatus, selectedPlatform]);

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading your game library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Game Backlog</h1>
              <p className="text-xs text-muted-foreground">Conquer your library</p>
            </div>
          </div>
          <AddGameModal onAddGame={addGame} />
        </div>
      </header>

      <div className="container px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{games.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Playing</CardTitle>
              <Play className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{currentlyPlaying.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backlog</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{backlogCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Playing Section */}
        {currentlyPlaying.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              Currently Playing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentlyPlaying.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onStatusChange={updateGameStatus}
                  onEdit={handleEditGame}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={(value: GameStatus | 'all') => setSelectedStatus(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="wishlist">Wishlist</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="playing">Playing</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
              <SelectItem value="completed">100% Completed</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPlatform} onValueChange={(value: Platform | 'all') => setSelectedPlatform(value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="steam">Steam</SelectItem>
              <SelectItem value="epic">Epic Games</SelectItem>
              <SelectItem value="gog">GOG</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground mb-4">
              {games.length === 0 
                ? "Start building your game library by adding some games!"
                : "Try adjusting your search or filters."
              }
            </p>
            {games.length === 0 && <AddGameModal onAddGame={addGame} />}
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onStatusChange={updateGameStatus}
                onEdit={handleEditGame}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Game Detail Modal */}
      <GameDetailModal
        game={selectedGame}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        onUpdateGame={updateGame}
        onDeleteGame={deleteGame}
      />
    </div>
  );
};

export default Index;
