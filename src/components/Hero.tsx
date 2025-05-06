
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MediaItem, getBackdropUrl } from "@/services/tmdb-api";
import { Star, Play } from "lucide-react";

interface HeroProps {
  item: MediaItem;
}

const Hero: React.FC<HeroProps> = ({ item }) => {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  const title = item.title || item.name || "Unknown Title";
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const backdropUrl = getBackdropUrl(item.backdrop_path);

  return (
    <div className="relative w-full h-[60vh] mb-12">
      {/* Backdrop Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundPosition: 'center 20%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
        <div className="max-w-3xl animate-slide-up">
          <div className="flex items-center text-sm text-primary mb-2">
            <span>{mediaType === "movie" ? "Movie" : "TV Series"}</span>
            {releaseYear && (
              <>
                <span className="mx-2">•</span>
                <span>{releaseYear}</span>
              </>
            )}
            {item.vote_average > 0 && (
              <>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  <span>{item.vote_average.toFixed(1)}</span>
                </div>
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{title}</h1>
          
          <p className="text-muted-foreground mb-6 line-clamp-3">
            {item.overview || "No overview available."}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full" size="lg">
              <Link to={`/${mediaType}/${item.id}`}>
                <Play className="mr-2 h-4 w-4" /> Watch Trailer
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full" size="lg">
              <Link to={`/${mediaType}/${item.id}`}>
                More Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
