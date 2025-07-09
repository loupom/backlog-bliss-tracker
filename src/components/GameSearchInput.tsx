
import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameDatabase, GameSearchResult } from '@/services/gameDatabase';
import { Platform, Genre } from '@/types/Game';

interface GameSearchInputProps {
  onGameSelect: (gameData: {
    title: string;
    platform: Platform;
    genre: Genre[];
    imageUrl?: string;
    howLongToBeat?: number;
    metacriticScore?: number;
  }) => void;
  selectedPlatform: Platform;
}

export const GameSearchInput: React.FC<GameSearchInputProps> = ({
  onGameSelect,
  selectedPlatform,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchGames = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await gameDatabase.searchGames(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchGames, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const mapGenres = (genres: Array<{ name: string }>): Genre[] => {
    const genreMap: Record<string, Genre> = {
      'Action': 'Action',
      'Adventure': 'Adventure',
      'RPG': 'RPG',
      'Role-playing': 'RPG',
      'Strategy': 'Strategy',
      'Simulation': 'Simulation',
      'Sports': 'Sports',
      'Racing': 'Racing',
      'Puzzle': 'Puzzle',
      'Horror': 'Horror',
      'Indie': 'Indie',
      'MMO': 'MMO',
      'Massively Multiplayer': 'MMO',
      'Shooter': 'FPS',
      'Platformer': 'Platformer'
    };

    return genres
      .map(g => genreMap[g.name] || 'Indie')
      .filter((genre, index, self) => self.indexOf(genre) === index)
      .slice(0, 3) as Genre[];
  };

  const handleGameSelect = (game: GameSearchResult) => {
    const gameData = {
      title: game.name,
      platform: selectedPlatform,
      genre: mapGenres(game.genres),
      imageUrl: game.background_image,
      howLongToBeat: game.playtime > 0 ? game.playtime : undefined,
      metacriticScore: game.metacritic || undefined,
    };

    onGameSelect(gameData);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((game) => (
              <div
                key={game.id}
                className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 last:border-b-0 flex gap-3"
                onClick={() => handleGameSelect(game)}
              >
                {game.background_image && (
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{game.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {game.metacritic && (
                      <Badge variant="outline" className="text-xs">
                        {game.metacritic}
                      </Badge>
                    )}
                    {game.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre.name} variant="secondary" className="text-xs">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                  {game.released && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(game.released).getFullYear()}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="ghost" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-4 text-center text-muted-foreground">
            No games found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};
