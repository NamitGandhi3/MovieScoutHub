import { 
  users, 
  type User, 
  type InsertUser, 
  favoriteMovies, 
  type FavoriteMovie, 
  type InsertFavoriteMovie 
} from "@shared/schema";

// Storage interface for users and favorites
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Favorite movie operations
  getFavoriteMovies(userId: number): Promise<FavoriteMovie[]>;
  getFavoriteMovie(userId: number, movieId: number): Promise<FavoriteMovie | undefined>;
  addFavoriteMovie(favorite: InsertFavoriteMovie): Promise<FavoriteMovie>;
  removeFavoriteMovie(userId: number, movieId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private favorites: Map<number, FavoriteMovie>;
  private userIdCounter: number;
  private favoriteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.favorites = new Map();
    this.userIdCounter = 1;
    this.favoriteIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Favorite movie methods
  async getFavoriteMovies(userId: number): Promise<FavoriteMovie[]> {
    return Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
  }

  async getFavoriteMovie(userId: number, movieId: number): Promise<FavoriteMovie | undefined> {
    return Array.from(this.favorites.values()).find(
      (favorite) => favorite.userId === userId && favorite.movieId === movieId
    );
  }

  async addFavoriteMovie(insertFavorite: InsertFavoriteMovie): Promise<FavoriteMovie> {
    const id = this.favoriteIdCounter++;
    const now = new Date();
    const favorite: FavoriteMovie = { ...insertFavorite, id, createdAt: now };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavoriteMovie(userId: number, movieId: number): Promise<boolean> {
    const favorite = await this.getFavoriteMovie(userId, movieId);
    if (favorite) {
      this.favorites.delete(favorite.id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
