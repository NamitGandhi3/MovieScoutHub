import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MovieCard, { MovieCardSkeleton } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getPopularMovies, getTopRatedMovies, searchMovies } from "@/lib/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DiscoverPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [category, setCategory] = useState(searchParams.get('category') || 'popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (searchQuery) params.set('query', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const newUrl = `/discover${params.toString() ? `?${params.toString()}` : ''}`;
    setLocation(newUrl);
  }, [category, debouncedQuery, currentPage, setLocation]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch movies based on category or search
  const { data, isLoading } = useQuery({
    queryKey: [
      debouncedQuery 
        ? `/api/movies/search?query=${encodeURIComponent(debouncedQuery)}&page=${currentPage}` 
        : `/api/movies/${category}?page=${currentPage}`
    ],
    queryFn: () => {
      if (debouncedQuery) {
        return searchMovies(debouncedQuery, currentPage);
      } else if (category === 'top_rated') {
        return getTopRatedMovies(currentPage);
      } else {
        return getPopularMovies(currentPage);
      }
    },
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Discover Movies</h1>
        
        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <Select 
              value={category} 
              onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1); // Reset to page 1 when category changes
                setSearchQuery(''); // Clear search when changing category
              }}
              disabled={!!debouncedQuery}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="top_rated">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Results count */}
        {!isLoading && data && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {movies.length} of {data.total_results} results
            {debouncedQuery && ` for "${debouncedQuery}"`}
          </p>
        )}
        
        {/* Movies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
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
        
        {/* Pagination */}
        {!isLoading && totalPages > 0 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
