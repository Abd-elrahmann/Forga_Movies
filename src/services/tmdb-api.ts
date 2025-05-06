
const API_KEY = "041a1f037c82deece497a317cefc5d92"; // Updated valid API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids: number[];
}

export interface MediaDetails extends MediaItem {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  status: string;
  tagline: string | null;
  vote_count: number;
  homepage: string | null;
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Helper functions for image URLs
export const getPosterUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = "original") => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API functions
export const fetchTrending = async (
  mediaType: "all" | MediaType = "all",
  timeWindow: "day" | "week" = "week",
  page: number = 1
): Promise<ApiResponse<MediaItem>> => {
  const response = await fetch(
    `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`
  );
  return response.json();
};

export const fetchPopular = async (
  mediaType: MediaType,
  page: number = 1
): Promise<ApiResponse<MediaItem>> => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&page=${page}`
  );
  return response.json();
};

export const fetchTopRated = async (
  mediaType: MediaType,
  page: number = 1
): Promise<ApiResponse<MediaItem>> => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}&page=${page}`
  );
  return response.json();
};

export const fetchMediaDetails = async (
  mediaType: MediaType,
  id: number
): Promise<MediaDetails> => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
  );
  return response.json();
};

export const fetchMediaVideos = async (
  mediaType: MediaType,
  id: number
): Promise<{ results: VideoResult[] }> => {
  const response = await fetch(
    `${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`
  );
  return response.json();
};

export const fetchGenres = async (
  mediaType: MediaType
): Promise<{ genres: Genre[] }> => {
  const response = await fetch(
    `${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`
  );
  return response.json();
};

export const searchMedia = async (
  query: string,
  page: number = 1
): Promise<ApiResponse<MediaItem>> => {
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  return response.json();
};

export const fetchByGenre = async (
  mediaType: MediaType,
  genreId: number,
  page: number = 1
): Promise<ApiResponse<MediaItem>> => {
  const response = await fetch(
    `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
  );
  return response.json();
};

export const fetchByYear = async (
  mediaType: MediaType,
  year: number,
  page: number = 1
): Promise<ApiResponse<MediaItem>> => {
  const yearParam = mediaType === "movie" ? "primary_release_year" : "first_air_date_year";
  
  const response = await fetch(
    `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&${yearParam}=${year}&page=${page}`
  );
  return response.json();
};
