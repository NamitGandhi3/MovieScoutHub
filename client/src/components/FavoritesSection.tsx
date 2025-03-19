import React from "react";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/MovieCard";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesSection() {
  const { favorites, isLoading } = useFavorites();
  const hasFavorites = favorites.length > 0;

  if (isLoading) {
    return (
      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading favorites...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Favorites</h2>

      {!hasFavorites ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding movies to your favorites to see them here.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-red-700 text-white">
              Explore Movies
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.movieId}
              id={movie.movieId}
              title={movie.title}
              posterPath={movie.posterPath}
              rating={parseFloat(movie.rating)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
