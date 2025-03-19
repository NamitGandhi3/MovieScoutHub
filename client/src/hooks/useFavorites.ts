import { useState, useEffect, createContext, useContext } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FavoriteMovie {
  movieId: number;
  title: string;
  posterPath: string;
  rating: string;
}

interface FavoritesContextType {
  favorites: FavoriteMovie[];
  addFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (movieId: number) => void;
  isLoading: boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isLoading: false,
});

export function useFavoritesProvider() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [localFavorites, setLocalFavorites] = useState<FavoriteMovie[]>([]);

  // Load local favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setLocalFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
        localStorage.removeItem("favorites");
      }
    }
  }, []);

  // Save local favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(localFavorites));
  }, [localFavorites]);

  // Fetch server favorites if authenticated
  const { data: serverFavorites = [], isLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  // Combine local and server favorites
  const favorites = isAuthenticated && serverFavorites 
    ? (serverFavorites as any[]).map((fav) => ({
        movieId: fav.movieId,
        title: fav.title,
        posterPath: fav.posterPath,
        rating: fav.rating,
      }))
    : localFavorites;

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async (movie: FavoriteMovie) => {
      if (isAuthenticated) {
        return apiRequest("POST", "/api/favorites", movie);
      } else {
        // Just return the movie for local storage
        return new Response(JSON.stringify(movie));
      }
    },
    onSuccess: async (response, movie) => {
      if (isAuthenticated) {
        // Refresh server favorites
        queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      } else {
        // Update local favorites
        setLocalFavorites(prev => [...prev, movie]);
      }
      
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add favorite",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (movieId: number) => {
      if (isAuthenticated) {
        return apiRequest("DELETE", `/api/favorites/${movieId}`);
      } else {
        // Just return the movieId for local storage
        return new Response(JSON.stringify({ movieId }));
      }
    },
    onSuccess: async (_, movieId) => {
      if (isAuthenticated) {
        // Refresh server favorites
        queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      } else {
        // Update local favorites
        setLocalFavorites(prev => prev.filter(movie => movie.movieId !== movieId));
      }
      
      const movieTitle = favorites.find((f: FavoriteMovie) => f.movieId === movieId)?.title || "Movie";
      toast({
        title: "Removed from favorites",
        description: `${movieTitle} has been removed from your favorites`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove favorite",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    favorites,
    addFavorite: (movie: FavoriteMovie) => addFavoriteMutation.mutate(movie),
    removeFavorite: (movieId: number) => removeFavoriteMutation.mutate(movieId),
    isLoading: isLoading || addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
