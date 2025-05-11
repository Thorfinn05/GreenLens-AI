
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Feed from "@/components/community/Feed";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Earth, CalendarDays, Users, Award } from "lucide-react";

export default function Community() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar for navigation within community */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-20 bg-card rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Earth className="h-5 w-5 text-primary" />
              <span>Community</span>
            </h2>
            
            <nav className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/community")}
              >
                <Users className="mr-2 h-4 w-4" />
                Feed
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/campaigns")}
              >
                <Award className="mr-2 h-4 w-4" />
                Campaigns
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/challenges")}
              >
                <Award className="mr-2 h-4 w-4" />
                Challenges
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/events")}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Events
              </Button>
            </nav>
            
            <hr className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Trending Hashtags</h3>
              <div className="space-y-1">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="w-full justify-start p-0 h-auto text-primary"
                  onClick={() => navigate("/hashtag/plasticfree")}
                >
                  #plasticfree
                </Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="w-full justify-start p-0 h-auto text-primary"
                  onClick={() => navigate("/hashtag/beachcleanup")}
                >
                  #beachcleanup
                </Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="w-full justify-start p-0 h-auto text-primary"
                  onClick={() => navigate("/hashtag/zerowaste")}
                >
                  #zerowaste
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
          
          {currentUser ? (
            <Feed />
          ) : (
            <div className="bg-card p-8 rounded-lg text-center shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
              <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                Connect with other environmental activists, share your eco-friendly journey, and participate in campaigns and challenges.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/login")}>Sign In</Button>
                <Button variant="outline" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}