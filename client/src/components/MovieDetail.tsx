import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Play, Share2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieDetailProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    runtime: number;
    genres: Genre[];
    credits?: {
      cast: Cast[];
      crew: {
        id: number;
        name: string;
        job: string;
      }[];
    };
  };
  isLoading?: boolean;
}

export default function MovieDetail({ movie, isLoading = false }: MovieDetailProps) {
  const { isAuthenticated } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  
  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  const isFavorite = favorites.some(fav => fav.movieId === movie.id);
  
  const director = movie.credits?.crew.find(person => person.job === "Director");
  const cast = movie.credits?.cast.slice(0, 5) || [];
  const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/placeholder-poster.svg';

  return (
    <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      <Card className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Movie Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Movie Info */}
          <CardContent className="p-6 md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
              <button 
                className={`text-2xl ${isFavorite ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                onClick={handleFavoriteToggle}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="px-2 py-1">
                {movie.release_date?.split('-')[0] || 'Unknown'}
              </Badge>
              <Badge variant="outline" className="px-2 py-1">
                {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown'}
              </Badge>
              <Badge className="bg-primary text-white px-2 py-1">
                {movie.vote_average.toFixed(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(genre => (
                <Badge 
                  key={genre.id} 
                  variant="secondary" 
                  className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {movie.overview}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {director && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Director</h3>
                  <p className="text-gray-700 dark:text-gray-300">{director.name}</p>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2">Release Date</h3>
                <p className="text-gray-700 dark:text-gray-300">{releaseDate}</p>
              </div>
            </div>

            {cast.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cast</h3>
                <div className="flex overflow-x-auto space-x-4 pb-2">
                  {cast.map(person => (
                    <div key={person.id} className="flex-shrink-0 w-20">
                      <img 
                        src={person.profile_path 
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}` 
                          : '/placeholder-person.svg'
                        } 
                        alt={person.name} 
                        className="w-full h-24 object-cover rounded-md mb-1"
                        loading="lazy"
                      />
                      <p className="text-xs text-center">{person.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary hover:bg-red-700 text-white">
                <Play className="mr-2 h-4 w-4" /> Watch Trailer
              </Button>
              <Button variant="secondary">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}

export function MovieDetailSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Movie Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <Skeleton className="w-full aspect-[2/3]" />
          </div>

          {/* Movie Info */}
          <div className="p-6 md:w-2/3 lg:w-3/4 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>

            <Skeleton className="h-32 w-full" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="flex space-x-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-20">
                    <Skeleton className="h-24 w-full mb-1" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
