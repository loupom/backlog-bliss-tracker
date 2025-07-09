
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
    },
    {
      id: 6,
      name: "Kingdom Come: Deliverance",
      background_image: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
      metacritic: 76,
      genres: [{ name: "RPG" }, { name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 41,
      released: "2018-02-13",
      rating: 4.1
    },
    {
      id: 7,
      name: "God of War",
      background_image: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
      metacritic: 94,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 21,
      released: "2018-04-20",
      rating: 4.6
    },
    {
      id: 8,
      name: "Horizon Zero Dawn",
      background_image: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg",
      metacritic: 89,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 22,
      released: "2017-02-28",
      rating: 4.33
    },
    {
      id: 9,
      name: "Dark Souls III",
      background_image: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg",
      metacritic: 89,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 32,
      released: "2016-04-12",
      rating: 4.35
    },
    {
      id: 10,
      name: "Assassin's Creed Valhalla",
      background_image: "https://media.rawg.io/media/games/a32/a32c9c299488ca99afc3fcea605a7718.jpg",
      metacritic: 82,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 59,
      released: "2020-11-10",
      rating: 3.9
    },
    {
      id: 11,
      name: "Sekiro: Shadows Die Twice",
      background_image: "https://media.rawg.io/media/games/67f/67f62d1f062a6164f57575e0604ee9f6.jpg",
      metacritic: 90,
      genres: [{ name: "Action" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 30,
      released: "2019-03-22",
      rating: 4.4
    },
    {
      id: 12,
      name: "Disco Elysium",
      background_image: "https://media.rawg.io/media/games/840/8408ad3811289a6a5830cae60fb0b62a.jpg",
      metacritic: 91,
      genres: [{ name: "RPG" }, { name: "Indie" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 21,
      released: "2019-10-15",
      rating: 4.56
    },
    {
      id: 13,
      name: "Baldur's Gate 3",
      background_image: "https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg",
      metacritic: 96,
      genres: [{ name: "RPG" }, { name: "Strategy" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 75,
      released: "2023-08-03",
      rating: 4.7
    },
    {
      id: 14,
      name: "Hades",
      background_image: "https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg",
      metacritic: 93,
      genres: [{ name: "Action" }, { name: "Indie" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "Nintendo Switch" } }],
      playtime: 22,
      released: "2020-09-17",
      rating: 4.59
    },
    {
      id: 15,
      name: "Stardew Valley",
      background_image: "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
      metacritic: 89,
      genres: [{ name: "Simulation" }, { name: "Indie" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "Nintendo Switch" } }],
      playtime: 52,
      released: "2016-02-26",
      rating: 4.47
    },
    {
      id: 16,
      name: "Subnautica",
      background_image: "https://media.rawg.io/media/games/480/480f5f2cf0aaedb5e33c0d6c75fd8815.jpg",
      metacritic: 78,
      genres: [{ name: "Adventure" }, { name: "Indie" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 30,
      released: "2018-01-23",
      rating: 4.41
    },
    {
      id: 17,
      name: "Control",
      background_image: "https://media.rawg.io/media/games/253/2532aa2a208012cc6ec0b21b34d0c126.jpg",
      metacritic: 82,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 11,
      released: "2019-08-27",
      rating: 4.05
    },
    {
      id: 18,
      name: "Death Stranding",
      background_image: "https://media.rawg.io/media/games/618/618b2fed5404ad9b30bb84b2fbfdb29e.jpg",
      metacritic: 82,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation" } }],
      playtime: 46,
      released: "2019-11-08",
      rating: 3.95
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
