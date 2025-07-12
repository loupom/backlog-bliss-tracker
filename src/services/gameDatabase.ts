import { Genre } from '@/types/Game';

export interface GameSearchResult {
  id: number;
  name: string;
  background_image?: string;
  metacritic?: number;
  genres: Array<{ name: string }>;
  playtime?: number;
  released?: string;
  rating?: number;
}

export interface GameDatabaseService {
  searchGames(query: string): Promise<GameSearchResult[]>;
  getGameDetails(id: number): Promise<GameSearchResult>;
}

class IGDBService implements GameDatabaseService {
  private clientId = 'qr1gv7m98u1exk3hcfaj4eyxfi07ot';
  private clientSecret = 'm8yd5px5ulzhhys7lk51c7r5zh7x0q';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with IGDB');
    }
  }

  private async makeIGDBRequest(endpoint: string, query: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.status}`);
    }

    return response.json();
  }

  private mapIGDBToGameResult(igdbGame: any): GameSearchResult {
    return {
      id: igdbGame.id,
      name: igdbGame.name,
      background_image: igdbGame.cover?.image_id 
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbGame.cover.image_id}.jpg`
        : undefined,
      metacritic: igdbGame.aggregated_rating ? Math.round(igdbGame.aggregated_rating) : undefined,
      genres: igdbGame.genres ? igdbGame.genres.map((g: any) => ({ name: g.name })) : [],
      playtime: igdbGame.time_to_beat?.hastly || undefined,
      released: igdbGame.first_release_date 
        ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0]
        : undefined,
      rating: igdbGame.rating ? igdbGame.rating / 20 : undefined, // Convert 0-100 to 0-5
    };
  }

  async searchGames(query: string): Promise<GameSearchResult[]> {
    try {
      if (!query.trim()) {
        // Return popular games if no query
        const igdbQuery = `
          fields name, cover.image_id, aggregated_rating, genres.name, first_release_date, rating, time_to_beat.hastly;
          where rating > 80;
          sort rating desc;
          limit 20;
        `;
        
        const results = await this.makeIGDBRequest('games', igdbQuery);
        return results.map(this.mapIGDBToGameResult);
      }

      const igdbQuery = `
        search "${query}";
        fields name, cover.image_id, aggregated_rating, genres.name, first_release_date, rating, time_to_beat.hastly;
        where category = 0;
        limit 20;
      `;

      const results = await this.makeIGDBRequest('games', igdbQuery);
      return results.map(this.mapIGDBToGameResult);
    } catch (error) {
      console.error('Error searching games:', error);
      // Fallback to empty array on error
      return [];
    }
  }

  async getGameDetails(id: number): Promise<GameSearchResult> {
    try {
      const igdbQuery = `
        fields name, cover.image_id, aggregated_rating, genres.name, first_release_date, rating, time_to_beat.hastly, summary;
        where id = ${id};
      `;

      const results = await this.makeIGDBRequest('games', igdbQuery);
      
      if (!results || results.length === 0) {
        throw new Error(`Game with id ${id} not found`);
      }

      return this.mapIGDBToGameResult(results[0]);
    } catch (error) {
      console.error('Error getting game details:', error);
      throw new Error(`Failed to get game details for id ${id}`);
    }
  }
}

export const gameDatabase: GameDatabaseService = new IGDBService();