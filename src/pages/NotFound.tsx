
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <div className="flex flex-col items-center gap-4">
          <a href="/" className="text-primary hover:text-primary/80 underline">
            Return to Home
          </a>
          <div className="mt-4">
            <p className="text-muted-foreground mb-2">Toggle Theme:</p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
