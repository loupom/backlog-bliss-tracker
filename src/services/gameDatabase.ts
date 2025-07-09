
export interface GameSearchResult {
  id: number;
  name: string;
  background_image: string;
  metacritic: number;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  playtime: number;
  released: string;
  rating: number;
}

export interface GameDatabaseService {
  searchGames: (query: string) => Promise<GameSearchResult[]>;
  getGameDetails: (id: number) => Promise<GameSearchResult>;
}

class RAWGGameDatabase implements GameDatabaseService {
  private baseUrl = 'https://api.rawg.io/api';
  private apiKey = 'your-api-key-here'; // Users can get a free key from https://rawg.io/apidocs

  async searchGames(query: string): Promise<GameSearchResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  }

  async getGameDetails(id: number): Promise<GameSearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/games/${id}?key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch game details');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }
}

// For demo purposes, we'll use a mock service when API key is not available
class MockGameDatabase implements GameDatabaseService {
  private mockGames: GameSearchResult[] = [
    {
      id: 1,
      name: "The Witcher 3: Wild Hunt",
      background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
      metacritic: 93,
      genres: [{ name: "RPG" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 51,
      released: "2015-05-18",
      rating: 4.66
    },
    {
      id: 2,
      name: "Cyberpunk 2077",
      background_image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
      metacritic: 86,
      genres: [{ name: "RPG" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 22,
      released: "2020-12-10",
      rating: 4.21
    },
    {
      id: 3,
      name: "Red Dead Redemption 2",
      background_image: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
      metacritic: 97,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox" } }],
      playtime: 60,
      released: "2018-10-26",
      rating: 4.59
    },
    {
      id: 4,
      name: "Hollow Knight",
      background_image: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
      metacritic: 90,
      genres: [{ name: "Indie" }, { name: "Platformer" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "Nintendo Switch" } }],
      playtime: 27,
      released: "2017-02-24",
      rating: 4.64
    },
    {
      id: 5,
      name: "Elden Ring",
      background_image: "https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg",
      metacritic: 96,
      genres: [{ name: "RPG" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 58,
      released: "2022-02-25",
      rating: 4.53
    }
  ];

  async searchGames(query: string): Promise<GameSearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return this.mockGames.filter(game => 
      game.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getGameDetails(id: number): Promise<GameSearchResult> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const game = this.mockGames.find(g => g.id === id);
    if (!game) throw new Error('Game not found');
    return game;
  }
}

export const gameDatabase: GameDatabaseService = new MockGameDatabase();
