
import { useState, useEffect } from "react";

/**
 * A hook that delays updating a value until a specified delay has passed
 * Useful for search inputs to avoid making API calls on every keystroke
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value changes before the delay has passed
    // This ensures we only update for the most recent value
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}