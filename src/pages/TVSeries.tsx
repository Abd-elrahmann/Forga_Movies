
import React, { useState, useEffect } from "react";
import { 
  fetchPopular, 
  fetchByGenre, 
  fetchByYear, 
  MediaItem 
} from "@/services/tmdb-api";
import MediaGrid from "@/components/MediaGrid";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";

const TVSeries = () => {
  const [tvShows, setTVShows] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: undefined as number | undefined,
    sortBy: "popularity.desc",
    year: undefined as number | undefined,
  });

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setIsLoading(true);
        
        let response;
        
        if (filters.genre) {
          response = await fetchByGenre("tv", filters.genre, currentPage);
        } else if (filters.year) {
          response = await fetchByYear("tv", filters.year, currentPage);
        } else {
          response = await fetchPopular("tv", currentPage);
        }
        
        setTVShows(response.results);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTVShows();
  }, [currentPage, filters.genre, filters.year, filters.sortBy]);

  const handleFilterChange = (newFilters: {
    genre?: number;
    sortBy?: string;
    year?: number;
  }) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Filters mediaType="tv" onFilterChange={handleFilterChange} />
      
      <MediaGrid 
        items={tvShows} 
        isLoading={isLoading} 
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TVSeries;
