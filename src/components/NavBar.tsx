import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Tv, TrendingUp, Search, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { searchMedia, MediaItem } from "@/services/tmdb-api";
import { useDebounce } from "@/hooks/use-debounce";
import { getPosterUrl } from "@/services/tmdb-api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      fetchSearchResults(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await searchMedia(query);
      setSearchResults(response.results.slice(0, 5));
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
      setIsPopoverOpen(false);
    }
  };

  const handleItemClick = (item: MediaItem) => {
    const mediaType = item.media_type || (item.title ? "movie" : "tv");
    navigate(`/${mediaType}/${item.id}`);
    setSearchQuery("");
    setIsPopoverOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Only open popover if there's content to show
    if (value.length >= 2) {
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
    }
  };

  // Modified to prevent losing focus
  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    
    // If popover is closing and input should have focus, restore it
    if (!open && document.activeElement !== searchInputRef.current) {
      // Use a small timeout to ensure the DOM has settled
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  // This effect helps maintain focus when the component re-renders
  useEffect(() => {
    const activeElement = document.activeElement;
    if (searchInputRef.current && activeElement === searchInputRef.current) {
      const cursorPosition = searchInputRef.current.selectionStart;
      // Use requestAnimationFrame to ensure focus is set after rendering
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
        if (cursorPosition !== null) {
          searchInputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
        }
      });
    }
  });

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FORGA</span>
        </Link>

        {/* Mobile Toggle Button */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        )}

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/movies" className={`hover:text-primary ${isActive("/movies") ? "text-primary font-medium" : ""}`}>
              <div className="flex items-center space-x-1">
                <Film className="h-4 w-4" />
                <span>Movies</span>
              </div>
            </Link>
            <Link to="/tv" className={`hover:text-primary ${isActive("/tv") ? "text-primary font-medium" : ""}`}>
              <div className="flex items-center space-x-1">
                <Tv className="h-4 w-4" />
                <span>TV Series</span>
              </div>
            </Link>
            <Link to="/trending" className={`hover:text-primary ${isActive("/trending") ? "text-primary font-medium" : ""}`}>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </div>
            </Link>
            <Link to="/watchlist" className={`hover:text-primary ${isActive("/watchlist") ? "text-primary font-medium" : ""}`}>
              <span>Watchlist</span>
            </Link>
          </div>
        )}

        {/* Search Bar & Theme Toggle - Desktop */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-2">
            <Popover 
              open={isPopoverOpen} 
              onOpenChange={handlePopoverOpenChange}
            >
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search movies & series..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="w-64"
                    />
                  </div>
                </PopoverTrigger>
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <PopoverContent 
                className="p-0 w-[300px] border-border shadow-md" 
                align="start" 
                sideOffset={5}
                side="bottom"
              >
                <Command>
                  <CommandList>
                    {isSearching ? (
                      <CommandEmpty>Searching...</CommandEmpty>
                    ) : searchResults.length === 0 ? (
                      <CommandEmpty>No results found</CommandEmpty>
                    ) : (
                      <CommandGroup heading="Search Results">
                        {searchResults.map((item) => (
                          <CommandItem
                            key={`${item.id}-${item.media_type || (item.title ? "movie" : "tv")}`}
                            onSelect={() => handleItemClick(item)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-10 h-14 overflow-hidden rounded">
                                {item.poster_path ? (
                                  <img 
                                    src={getPosterUrl(item.poster_path, "w92")} 
                                    alt={item.title || item.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Film className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium truncate max-w-[200px]">
                                  {item.title || item.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {item.media_type === "movie" || item.title 
                                    ? `Movie • ${item.release_date?.substring(0, 4) || "N/A"}` 
                                    : `TV • ${item.first_air_date?.substring(0, 4) || "N/A"}`}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <ThemeToggle />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden container mx-auto px-4 py-4 bg-background/95 border-b border-border animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/movies" 
              className={`p-2 rounded ${isActive("/movies") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Film className="h-5 w-5" />
                <span>Movies</span>
              </div>
            </Link>
            <Link 
              to="/tv" 
              className={`p-2 rounded ${isActive("/tv") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Tv className="h-5 w-5" />
                <span>TV Series</span>
              </div>
            </Link>
            <Link 
              to="/trending" 
              className={`p-2 rounded ${isActive("/trending") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending</span>
              </div>
            </Link>
            <Link 
              to="/watchlist" 
              className={`p-2 rounded ${isActive("/watchlist") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Watchlist</span>
            </Link>
            <Popover 
              open={isPopoverOpen} 
              onOpenChange={handlePopoverOpenChange}
            >
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <PopoverTrigger asChild>
                  <div className="relative flex-1">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search movies & series..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="flex-1"
                    />
                  </div>
                </PopoverTrigger>
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <PopoverContent 
                className="p-0 w-[calc(100vw-4rem)] border-border shadow-md" 
                align="start" 
                sideOffset={5}
                side="bottom"
              >
                <Command>
                  <CommandList>
                    {isSearching ? (
                      <CommandEmpty>Searching...</CommandEmpty>
                    ) : searchResults.length === 0 ? (
                      <CommandEmpty>No results found</CommandEmpty>
                    ) : (
                      <CommandGroup heading="Search Results">
                        {searchResults.map((item) => (
                          <CommandItem
                            key={`${item.id}-${item.media_type || (item.title ? "movie" : "tv")}`}
                            onSelect={() => handleItemClick(item)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-10 h-14 overflow-hidden rounded">
                                {item.poster_path ? (
                                  <img 
                                    src={getPosterUrl(item.poster_path, "w92")} 
                                    alt={item.title || item.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Film className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium truncate max-w-[200px]">
                                  {item.title || item.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {item.media_type === "movie" || item.title 
                                    ? `Movie • ${item.release_date?.substring(0, 4) || "N/A"}` 
                                    : `TV • ${item.first_air_date?.substring(0, 4) || "N/A"}`}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;