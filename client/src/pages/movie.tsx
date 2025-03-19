import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import MovieDetail, { MovieDetailSkeleton } from "@/components/MovieDetail";
import { getMovieDetails } from "@/lib/tmdb";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id);

  const { data: movie, isLoading } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    queryFn: () => getMovieDetails(movieId),
    enabled: !isNaN(movieId),
  });

  if (isNaN(movieId)) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Invalid Movie ID</h1>
          <p>The movie ID provided is not valid.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow pt-8">
      {isLoading || !movie ? <MovieDetailSkeleton /> : <MovieDetail movie={movie} />}
    </main>
  );
}
