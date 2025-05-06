
import React, { useState, useEffect } from "react";
import { fetchTrending, MediaItem } from "@/services/tmdb-api";
import MediaGrid from "@/components/MediaGrid";
import Pagination from "@/components/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Trending = () => {
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week");
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all");

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTrending(mediaType, timeWindow, currentPage);
        setTrendingItems(response.results);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingContent();
  }, [currentPage, timeWindow, mediaType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTimeWindowChange = (newTimeWindow: "day" | "week") => {
    setTimeWindow(newTimeWindow);
    setCurrentPage(1); // Reset to first page
  };

  const handleMediaTypeChange = (newMediaType: "all" | "movie" | "tv") => {
    setMediaType(newMediaType);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Trending Content</h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Tabs value={timeWindow} onValueChange={(v) => handleTimeWindowChange(v as "day" | "week")}>
            <TabsList>
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs value={mediaType} onValueChange={(v) => handleMediaTypeChange(v as "all" | "movie" | "tv")}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="movie">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <MediaGrid 
        items={trendingItems} 
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

export default Trending;
