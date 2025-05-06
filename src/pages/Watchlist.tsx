
import React, { useState } from "react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import MediaGrid from "@/components/MediaGrid";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaItem, MediaType } from "@/services/tmdb-api";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<"all" | MediaType>("all");
  
  const filteredWatchlist = activeTab === "all"
    ? watchlist
    : watchlist.filter(item => (item.media_type || (item.title ? "movie" : "tv")) === activeTab);
  
  const handleClearWatchlist = () => {
    if (confirm("Are you sure you want to clear your entire watchlist?")) {
      // Remove each item individually
      [...watchlist].forEach(item => removeFromWatchlist(item.id));
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Your Watchlist</h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | MediaType)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="movie">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {watchlist.length > 0 && (
            <Button variant="destructive" onClick={handleClearWatchlist}>
              Clear Watchlist
            </Button>
          )}
        </div>
      </div>
      
      {watchlist.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add movies and TV shows to your watchlist to keep track of what you want to watch.
          </p>
          <Button asChild>
            <a href="/">Browse Content</a>
          </Button>
        </div>
      ) : filteredWatchlist.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl mb-2">No {activeTab === "movie" ? "movies" : "TV shows"} in your watchlist</h2>
          <p className="text-muted-foreground mb-6">
            Browse and add {activeTab === "movie" ? "movies" : "TV shows"} to see them here.
          </p>
          <Button asChild>
            <a href={activeTab === "movie" ? "/movies" : "/tv"}>
              Browse {activeTab === "movie" ? "Movies" : "TV Shows"}
            </a>
          </Button>
        </div>
      ) : (
        <MediaGrid items={filteredWatchlist as MediaItem[]} />
      )}
    </div>
  );
};

export default Watchlist;
