import React from "react";
import MovieCard, { MovieCardSkeleton } from "./MovieCard";
import { Link } from "wouter";
import { Movie } from "@/lib/tmdb";

interface MovieSectionProps {
  title: string;
  viewAllLink?: string;
  movies: Movie[];
  isLoading?: boolean;
}

export default function MovieSection({ 
  title, 
  viewAllLink, 
  movies,
  isLoading = false,
}: MovieSectionProps) {
  return (
    <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-primary hover:underline">
            View All
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))
          : movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
                year={movie.release_date?.split('-')[0]}
              />
            ))}
      </div>
    </section>
  );
}
