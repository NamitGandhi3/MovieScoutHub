import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  year?: string;
}

export default function MovieCard({ id, title, posterPath, rating, year }: MovieCardProps) {
  const { isAuthenticated } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  
  const isFavorite = favorites.some(fav => fav.movieId === id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add favorites",
        variant: "destructive",
      });
      return;
    }
    
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite({
        movieId: id,
        title,
        posterPath: posterPath || "",
        rating: rating.toString(),
      });
    }
  };

  const posterUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}` 
    : '/placeholder-poster.svg';

  return (
    <Link href={`/movie/${id}`}>
      <div className="movie-card group relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
        <img 
          src={posterUrl} 
          alt={title}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-yellow-400 text-sm">{rating.toFixed(1)}</span>
            <button 
              className={`text-white hover:text-primary ${isFavorite ? 'text-primary' : ''}`}
              onClick={handleFavoriteToggle}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <Skeleton className="w-full aspect-[2/3]" />
    </div>
  );
}
