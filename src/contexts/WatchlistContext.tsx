
import React, { createContext, useContext, useState, useEffect } from "react";
import { MediaItem, MediaType } from "@/services/tmdb-api";
import { toast } from "@/components/ui/use-toast";

interface WatchlistItem extends MediaItem {
  addedAt: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem("watchlist");
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (error) {
      console.error("Error loading watchlist from localStorage:", error);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    } catch (error) {
      console.error("Error saving watchlist to localStorage:", error);
    }
  }, [watchlist]);

  const addToWatchlist = (item: MediaItem) => {
    if (!isInWatchlist(item.id)) {
      const watchlistItem: WatchlistItem = {
        ...item,
        addedAt: Date.now(),
      };
      
      setWatchlist((prev) => [...prev, watchlistItem]);
      
      toast({
        title: "Added to Watchlist",
        description: `${item.title || item.name} has been added to your watchlist.`,
        duration: 3000,
      });
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
    
    toast({
      title: "Removed from Watchlist",
      description: "The item has been removed from your watchlist.",
      duration: 3000,
    });
  };

  const isInWatchlist = (id: number): boolean => {
    return watchlist.some((item) => item.id === id);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
