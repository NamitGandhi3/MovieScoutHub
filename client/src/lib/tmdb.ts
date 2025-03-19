import { apiRequest } from "./queryClient";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids?: number[];
  genres?: {
    id: number;
    name: string;
  }[];
  runtime?: number;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function getPopularMovies(page = 1): Promise<MovieListResponse> {
  const response = await apiRequest("GET", `/api/movies/popular?page=${page}`);
  return response.json();
}

export async function getTopRatedMovies(page = 1): Promise<MovieListResponse> {
  const response = await apiRequest("GET", `/api/movies/top_rated?page=${page}`);
  return response.json();
}

export async function searchMovies(query: string, page = 1): Promise<MovieListResponse> {
  const response = await apiRequest("GET", `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  return response.json();
}

export async function getMovieDetails(id: number): Promise<Movie> {
  const response = await apiRequest("GET", `/api/movies/${id}`);
  return response.json();
}
