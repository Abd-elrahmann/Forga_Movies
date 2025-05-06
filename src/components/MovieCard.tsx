
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem, getPosterUrl } from "@/services/tmdb-api";
import { Star } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  item: MediaItem;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, className = "" }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isWatchlisted = isInWatchlist(item.id);

  // Determine if it's a movie or TV show
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  const title = item.title || item.name || "Unknown Title";
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWatchlisted) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({
        ...item,
        media_type: mediaType as "movie" | "tv",
      });
    }
  };

  return (
    <Link to={`/${mediaType}/${item.id}`}>
      <Card className={`overflow-hidden movie-card-hover h-full ${className}`}>
        <div className="relative">
          <img
            src={getPosterUrl(item.poster_path)}
            alt={title}
            className="w-full h-[300px] object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full backdrop-blur-sm ${isWatchlisted ? 'bg-primary text-primary-foreground' : 'bg-black/40 text-white'}`}
              onClick={toggleWatchlist}
            >
              {isWatchlisted ? (
                <span className="text-xs">★</span>
              ) : (
                <span className="text-xs">☆</span>
              )}
            </Button>
          </div>
          {item.vote_average > 0 && (
            <div className="absolute bottom-0 left-0 bg-black/70 px-2 py-1 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              <span className="text-xs">{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <div className="truncate font-medium">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {releaseYear ? releaseYear : "Unknown Year"} • {mediaType === "movie" ? "Movie" : "TV Series"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
