
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Extract the base path if it's a nested route
  const getParentRoute = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2) {
      return `/${pathParts[1]}`;
    }
    return null;
  };

  const parentRoute = getParentRoute();

  // Check if this was a "new" route that needs to be properly redirected
  const handleSpecialRoutes = () => {
    const path = location.pathname;
    
    // Special handling for the /campaigns/new, /challenges/new, /events/new routes
    if (path === "/campaigns/new") {
      return (
        <div className="text-center mt-4">
          <p className="mb-4">Looking to create a new campaign?</p>
          <Button asChild className="w-full">
            <Link to="/campaigns/new">Go to Campaign Creation</Link>
          </Button>
        </div>
      );
    } 
    
    if (path === "/challenges/new") {
      return (
        <div className="text-center mt-4">
          <p className="mb-4">Looking to create a new challenge?</p>
          <Button asChild className="w-full">
            <Link to="/challenges/new">Go to Challenge Creation</Link>
          </Button>
        </div>
      );
    }
    
    if (path === "/events/new") {
      return (
        <div className="text-center mt-4">
          <p className="mb-4">Looking to create a new event?</p>
          <Button asChild className="w-full">
            <Link to="/events/new">Go to Event Creation</Link>
          </Button>
        </div>
      );
    }
    
    return null;
  };

  const specialRouteContent = handleSpecialRoutes();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl font-medium mb-4">Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for ({location.pathname}) might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        
        {specialRouteContent}
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          
          {parentRoute && (
            <Button asChild variant="outline" className="w-full">
              <Link to={parentRoute}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to {parentRoute.replace('/', '')}
              </Link>
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/community">Community</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/campaigns">Campaigns</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/challenges">Challenges</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/events">Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;