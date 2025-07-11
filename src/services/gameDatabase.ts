
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

class MockGameDatabase implements GameDatabaseService {
  private mockGames: GameSearchResult[] = [
    {
      id: 1,
      name: "The Witcher 3: Wild Hunt",
      background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
      metacritic: 93,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 4" } }],
      playtime: 51,
      released: "2015-05-18",
      rating: 4.66
    },
    {
      id: 2,
      name: "Kingdom Come: Deliverance",
      background_image: "https://media.rawg.io/media/games/e80/e80f1f8b5c2cdb76b04e5db7b7c0a793.jpg",
      metacritic: 76,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 4" } }],
      playtime: 40,
      released: "2018-02-13",
      rating: 4.1
    },
    {
      id: 3,
      name: "Cyberpunk 2077",
      background_image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
      metacritic: 86,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 4" } }],
      playtime: 22,
      released: "2020-12-10",
      rating: 4.1
    },
    {
      id: 4,
      name: "Red Dead Redemption 2",
      background_image: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
      metacritic: 97,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 4" } }],
      playtime: 21,
      released: "2018-10-26",
      rating: 4.59
    },
    {
      id: 5,
      name: "God of War",
      background_image: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
      metacritic: 94,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 4" } }],
      playtime: 11,
      released: "2018-04-20",
      rating: 4.57
    },
    {
      id: 6,
      name: "Horizon Zero Dawn",
      background_image: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg",
      metacritic: 89,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 4" } }],
      playtime: 12,
      released: "2017-02-28",
      rating: 4.3
    },
    {
      id: 7,
      name: "Elden Ring",
      background_image: "https://media.rawg.io/media/games/5ec/5ecac5cb026ac26a56efcc546364e348.jpg",
      metacritic: 96,
      genres: [{ name: "Action" }, { name: "RPG" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 5" } }],
      playtime: 58,
      released: "2022-02-25",
      rating: 4.4
    },
    {
      id: 8,
      name: "Spider-Man Remastered",
      background_image: "https://media.rawg.io/media/games/9aa/9aa42d16d425fa6f179fc9dc2f763647.jpg",
      metacritic: 87,
      genres: [{ name: "Action" }, { name: "Adventure" }],
      platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 5" } }],
      playtime: 17,
      released: "2022-08-12",
      rating: 4.5
    }
  ];

  async searchGames(query: string): Promise<GameSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      return [];
    }

    return this.mockGames.filter(game =>
      game.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getGameDetails(id: number): Promise<GameSearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const game = this.mockGames.find(g => g.id === id);
    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }
    return game;
  }
}

export const gameDatabase: GameDatabaseService = new MockGameDatabase();
