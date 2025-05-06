
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon } from "lucide-react";
import { MediaType, Genre, fetchGenres } from "@/services/tmdb-api";

interface FiltersProps {
  mediaType: MediaType;
  onFilterChange: (filters: {
    genre?: number;
    sortBy?: string;
    year?: number;
  }) => void;
}

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "vote_average.asc", label: "Lowest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
];

const Filters: React.FC<FiltersProps> = ({ mediaType, onFilterChange }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedSortBy, setSelectedSortBy] = useState<string>("popularity.desc");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Prepare year options: current year down to 1990
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const { genres: genreList } = await fetchGenres(mediaType);
        setGenres(genreList);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };

    loadGenres();
  }, [mediaType]);

  const handleApplyFilters = () => {
    onFilterChange({
      genre: selectedGenre ? parseInt(selectedGenre) : undefined,
      sortBy: selectedSortBy,
      year: selectedYear ? parseInt(selectedYear) : undefined,
    });
  };

  const handleReset = () => {
    setSelectedGenre("");
    setSelectedSortBy("popularity.desc");
    setSelectedYear("");
    
    onFilterChange({
      genre: undefined,
      sortBy: "popularity.desc",
      year: undefined,
    });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {mediaType === "movie" ? "Movies" : "TV Series"}
        </h2>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isOpen && (
        <div className="bg-card p-4 rounded-lg border border-border mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={selectedGenre}
                onValueChange={setSelectedGenre}
              >
                <SelectTrigger id="genre">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select
                value={selectedSortBy}
                onValueChange={setSelectedSortBy}
              >
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
