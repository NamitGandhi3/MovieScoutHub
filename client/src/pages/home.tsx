import React from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection, { HeroSectionSkeleton } from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import { getPopularMovies, getTopRatedMovies } from "@/lib/tmdb";

export default function Home() {
  // Fetch popular movies
  const { data: popularMoviesData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["/api/movies/popular"],
    queryFn: () => getPopularMovies(),
  });

  // Fetch top rated movies
  const { data: topRatedMoviesData, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["/api/movies/top_rated"],
    queryFn: () => getTopRatedMovies(),
  });

  // Get featured movie (first from popular)
  const featuredMovie = popularMoviesData?.results[0];

  return (
    <main className="flex-grow">
      {/* Hero/Featured Section */}
      {isLoadingPopular || !featuredMovie ? (
        <HeroSectionSkeleton />
      ) : (
        <HeroSection movie={featuredMovie} />
      )}

      {/* Popular Movies Section */}
      <MovieSection
        title="Popular Movies"
        viewAllLink="/discover?category=popular"
        movies={popularMoviesData?.results.slice(1, 7) || []}
        isLoading={isLoadingPopular}
      />

      {/* Top Rated Movies Section */}
      <MovieSection
        title="Top Rated"
        viewAllLink="/discover?category=top_rated"
        movies={topRatedMoviesData?.results.slice(0, 6) || []}
        isLoading={isLoadingTopRated}
      />
    </main>
  );
}
