import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

interface SearchBarProps {
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function SearchBar({ onClose, inputRef }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: [`/api/movies/search?query=${encodeURIComponent(debouncedSearchTerm)}`],
    enabled: debouncedSearchTerm.length > 2,
  });

  const searchResults: SearchResult[] = data?.results || [];
  const hasResults = searchResults.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="max-w-2xl mx-auto relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 bg-gray-100 dark:bg-gray-700"
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {(isLoading || hasResults) && debouncedSearchTerm.length > 2 && (
        <div 
          ref={resultsRef} 
          className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            // Loading state
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-14 w-10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasResults ? (
            // Results
            searchResults.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <a 
                  className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={onClose}
                >
                  <div className="flex items-center">
                    <img 
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` 
                        : '/placeholder-poster.svg'
                      } 
                      className="w-10 h-15 object-cover rounded mr-3" 
                      alt={`${movie.title} poster`}
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {movie.release_date?.split('-')[0] || 'Unknown year'}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))
          ) : null}
        </div>
      )}
    </div>
  );
}
