import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  fetchMediaDetails, 
  fetchMediaVideos, 
  MediaDetails as MediaDetailsType, 
  VideoResult, 
  getPosterUrl, 
  getBackdropUrl, 
  MediaType 
} from "@/services/tmdb-api";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Star, Play, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const MediaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const mediaType = window.location.pathname.includes("/movie/") ? "movie" : "tv";
  
  const [details, setDetails] = useState<MediaDetailsType | null>(null);
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        console.log(`Fetching details for ${mediaType} with ID ${id}`);
        
        // Fetch details
        const mediaDetails = await fetchMediaDetails(mediaType as MediaType, parseInt(id));
        setDetails(mediaDetails);
        
        // Fetch videos
        const videoData = await fetchMediaVideos(mediaType as MediaType, parseInt(id));
        setVideos(videoData.results);
        
      } catch (error) {
        console.error("Error fetching media details:", error);
        toast({
          title: "Error",
          description: "Failed to load media details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [mediaType, id, toast]);
  
  const getTrailerUrl = () => {
    const trailer = videos.find(
      (video) => 
        video.site === "YouTube" && 
        (video.type === "Trailer" || video.type === "Teaser")
    );
    
    return trailer 
      ? `https://www.youtube.com/embed/${trailer.key}` 
      : null;
  };
  
  const toggleWatchlist = () => {
    if (!details) return;
    
    if (isInWatchlist(details.id)) {
      removeFromWatchlist(details.id);
    } else {
      addToWatchlist({
        ...details,
        media_type: mediaType as MediaType,
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!details) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground">Unable to load details. Please try again later.</p>
      </div>
    );
  }
  
  const title = details.title || details.name || "Unknown Title";
  const releaseDate = details.release_date || details.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const trailerUrl = getTrailerUrl();
  const isWatchlisted = isInWatchlist(details.id);
  
  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: details.backdrop_path 
              ? `url(${getBackdropUrl(details.backdrop_path)})` 
              : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img 
              src={getPosterUrl(details.poster_path, "w500")} 
              alt={title}
              className="w-full rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          
          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4">
              {releaseYear && (
                <span className="mr-3">{releaseYear}</span>
              )}
              {details.genres && details.genres.length > 0 && (
                <span className="mr-3">
                  {details.genres.map(g => g.name).join(', ')}
                </span>
              )}
              {(details.runtime || (details.episode_run_time && details.episode_run_time.length > 0)) && (
                <span className="mr-3">
                  {details.runtime 
                    ? `${details.runtime} min` 
                    : `${details.episode_run_time![0]} min per episode`
                  }
                </span>
              )}
              {details.vote_average > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{details.vote_average.toFixed(1)}</span>
                  {details.vote_count > 0 && (
                    <span className="text-xs ml-1">({details.vote_count} votes)</span>
                  )}
                </div>
              )}
            </div>
            
            {details.tagline && (
              <p className="text-lg italic mb-4 text-muted-foreground">
                "{details.tagline}"
              </p>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">
                {details.overview || "No overview available."}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                onClick={toggleWatchlist}
                variant={isWatchlisted ? "default" : "outline"}
                className="rounded-full"
              >
                {isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
              
              {details.homepage && (
                <Button asChild variant="outline" className="rounded-full">
                  <a href={details.homepage} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Official Website
                  </a>
                </Button>
              )}
            </div>
            
            {/* Trailer */}
            {trailerUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                <div className="aspect-video">
                  <iframe
                    src={trailerUrl}
                    title={`${title} Trailer`}
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Production Companies */}
            {details.production_companies && details.production_companies.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Production</h2>
                <div className="flex flex-wrap gap-4">
                  {details.production_companies.map((company) => (
                    <div key={company.id} className="text-center">
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                          alt={company.name}
                          className="h-10 object-contain mx-auto mb-2 bg-white p-1 rounded"
                        />
                      ) : (
                        <div className="h-10 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{company.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;