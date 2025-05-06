
import React from "react";
import MovieCard from "./MovieCard";
import { MediaItem } from "@/services/tmdb-api";
import { Skeleton } from "./ui/skeleton";

interface MediaGridProps {
  items: MediaItem[];
  title?: string;
  isLoading?: boolean;
}

const LoadingSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="shimmer w-full h-[300px]"></div>
      <div className="p-3 space-y-2">
        <div className="shimmer h-4 w-3/4 rounded"></div>
        <div className="shimmer h-3 w-1/2 rounded"></div>
      </div>
    </div>
  );
};

const MediaGrid: React.FC<MediaGridProps> = ({ 
  items = [], // Add default empty array here
  title, 
  isLoading = false 
}) => {
  // Create 12 skeleton items for loading state
  const skeletonArray = Array.from({ length: 12 }).map((_, index) => index);

  return (
    <div className="mb-10">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
        {isLoading
          ? skeletonArray.map((index) => (
              <div key={`skeleton-${index}`} className="animate-pulse">
                <LoadingSkeleton />
              </div>
            ))
          : items && items.map((item) => (
              <MovieCard key={`${item.id}-${item.media_type || 'unknown'}`} item={item} />
            ))}
      </div>
      
      {!isLoading && items && items.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No results found.</p>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
