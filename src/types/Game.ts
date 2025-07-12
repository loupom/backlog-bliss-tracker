
export type GameStatus = 'wishlist' | 'backlog' | 'playing' | 'finished' | 'completed' | 'paused' | 'dropped';
export type Genre = 'Action' | 'Adventure' | 'RPG' | 'Strategy' | 'Simulation' | 'Sports' | 'Racing' | 'Puzzle' | 'Horror' | 'Indie' | 'MMO' | 'FPS' | 'Platformer';

export interface GameGoal {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export interface Game {
  id: string;
  title: string;
  status: GameStatus;
  genre: Genre[];
  imageUrl?: string;
  howLongToBeat?: number; // hours
  metacriticScore?: number;
  userScore?: number; // 1-10
  goals: GameGoal[];
  dateAdded: Date;
  dateStarted?: Date;
  dateCompleted?: Date;
  notes?: string;
}
