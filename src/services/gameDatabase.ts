
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
  private apiKey = ''; // Will work without API key for basic searches

  async searchGames(query: string): Promise<GameSearchResult[]> {
    try {
      const url = this.apiKey 
        ? `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=20`
        : `${this.baseUrl}/games?search=${encodeURIComponent(query)}&page_size=20`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`RAWG API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching games via RAWG:', error);
      // Return empty array on error instead of falling back to mock
      return [];
    }
  }

  async getGameDetails(id: number): Promise<GameSearchResult> {
    try {
      const url = this.apiKey
        ? `${this.baseUrl}/games/${id}?key=${this.apiKey}`
        : `${this.baseUrl}/games/${id}`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`RAWG API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching game details from RAWG:', error);
      throw error;
    }
  }
}

export const gameDatabase: GameDatabaseService = new RAWGGameDatabase();
