
import React, { useState, useEffect } from "react";
import { fetchTrending, fetchPopular, MediaItem } from "@/services/tmdb-api";
import Hero from "@/components/Hero";
import MediaGrid from "@/components/MediaGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<MediaItem[]>([]);
  const [featuredItem, setFeaturedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trending content
        const trendingData = await fetchTrending("all", "week");
        setTrendingItems(trendingData.results.slice(0, 12));
        
        // Set the first trending item as the featured item for the hero
        if (trendingData.results.length > 0) {
          setFeaturedItem(trendingData.results[0]);
        }
        
        // Fetch popular movies
        const moviesData = await fetchPopular("movie");
        setPopularMovies(moviesData.results.slice(0, 12));
        
        // Fetch popular TV shows
        const tvData = await fetchPopular("tv");
        setPopularTVShows(tvData.results.slice(0, 12));
        
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomePageData();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      {featuredItem && <Hero item={featuredItem} />}
      
      <div className="container mx-auto px-4 pb-12">
        {/* Trending Section */}
        <MediaGrid 
          items={trendingItems} 
          title="Trending This Week" 
          isLoading={isLoading} 
        />
        
        {/* Tabs for Popular Content */}
        <Tabs defaultValue="movies" className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Popular Content</h2>
            <TabsList>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="movies">
            <MediaGrid 
              items={popularMovies} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="tv">
            <MediaGrid 
              items={popularTVShows} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
