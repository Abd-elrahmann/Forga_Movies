
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchMedia, MediaItem } from "@/services/tmdb-api";
import MediaGrid from "@/components/MediaGrid";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        
        if (query) {
          const response = await searchMedia(query, currentPage);
          setResults(response.results);
          setTotalPages(response.total_pages);
          setSearchInput(query);
        } else {
          setResults([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl mx-auto">
          <Input 
            ref={searchInputRef}
            type="text" 
            value={searchInput} 
            onChange={handleSearchInputChange}
            placeholder="Search for movies, TV shows, actors..."
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        {query ? (
          <>
            Search Results for "{query}" 
            {!isLoading && (
              <span className="text-muted-foreground text-lg font-normal ml-2">
                ({results.length === 0 ? 'No results' : `${results.length} results`})
              </span>
            )}
          </>
        ) : (
          "Search Results"
        )}
      </h1>
      
      {!query && (
        <p className="text-muted-foreground text-center my-12">
          Please enter a search term to find movies and TV shows.
        </p>
      )}
      
      <MediaGrid 
        items={results} 
        isLoading={isLoading} 
      />
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchResults;