import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema, insertFavoriteMovieSchema } from "@shared/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";

// Configuration from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "local_development_jwt_secret_key_change_in_production";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Check if TMDB API key is available
if (!TMDB_API_KEY) {
  console.warn("Warning: TMDB_API_KEY environment variable is not set. Movie API requests will fail.");
}

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.body.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      // Return user data and token
      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      
      // Find user by username
      const user = await storage.getUserByUsername(loginData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      // Return user data and token
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error during login" });
    }
  });

  // Favorites routes
  app.get("/api/favorites", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const favorites = await storage.getFavoriteMovies(userId);
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const favoriteData = insertFavoriteMovieSchema.parse({
        ...req.body,
        userId,
      });

      // Check if movie is already in favorites
      const existing = await storage.getFavoriteMovie(userId, favoriteData.movieId);
      if (existing) {
        return res.status(400).json({ message: "Movie already in favorites" });
      }

      const favorite = await storage.addFavoriteMovie(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete("/api/favorites/:movieId", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const movieId = Number(req.params.movieId);
      
      const result = await storage.removeFavoriteMovie(userId, movieId);
      if (!result) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.status(200).json({ message: "Movie removed from favorites" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  // TMDB API Proxy routes
  app.get("/api/movies/popular", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });

  app.get("/api/movies/top_rated", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top rated movies" });
    }
  });

  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.query;
      const page = req.query.page || 1;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: "credits,videos",
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie details" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
