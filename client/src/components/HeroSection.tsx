import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, Info, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface HeroSectionProps {
  movie: {
    id: number;
    title: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    runtime?: number;
    overview: string;
  };
  isLoading?: boolean;
}

export default function HeroSection({ movie, isLoading = false }: HeroSectionProps) {
  const { isAuthenticated } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  
  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  const isFavorite = favorites.some(fav => fav.movieId === movie.id);
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`;
  
  const releaseYear = movie.release_date?.split('-')[0] || '';
  const runtime = movie.runtime 
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` 
    : '';

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add favorites",
        variant: "destructive",
      });
      return;
    }
    
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path || "",
        rating: movie.vote_average.toString(),
      });
    }
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <img 
        src={backdropUrl} 
        alt={movie.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
          <div className="flex items-center mb-4">
            <span className="bg-primary text-white px-2 py-1 rounded text-sm mr-3">
              {movie.vote_average.toFixed(1)}
            </span>
            {releaseYear && <span className="text-white text-sm mr-3">{releaseYear}</span>}
            {runtime && <span className="text-white text-sm">{runtime}</span>}
          </div>
          <p className="text-white text-sm md:text-base max-w-2xl mb-6">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="bg-white text-black hover:bg-gray-200">
              <PlayCircle className="mr-2 h-4 w-4" /> Watch Trailer
            </Button>
            <Link href={`/movie/${movie.id}`}>
              <Button className="bg-primary hover:bg-red-700 text-white">
                <Info className="mr-2 h-4 w-4" /> More Info
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:bg-opacity-20"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSectionSkeleton() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="max-w-5xl">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <div className="flex items-center mb-4">
            <Skeleton className="h-6 w-12 mr-3" />
            <Skeleton className="h-6 w-10 mr-3" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-20 w-full max-w-2xl mb-6" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
