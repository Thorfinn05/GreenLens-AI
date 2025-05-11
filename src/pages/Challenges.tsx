
import React from "react";
import { useCommunity } from "@/contexts/CommunityContext";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Calendar, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function Challenges() {
  const { challenges, loading, joinChallenge, leaveChallenge } = useCommunity();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
          <p className="mb-6 text-muted-foreground">
            Sign in to view and participate in environmental challenges.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleJoinChallenge = async (challengeId: string) => {
    await joinChallenge(challengeId);
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    await leaveChallenge(challengeId);
  };

  // Calculate challenge progress
  const calculateProgress = (startDate: number, endDate: number) => {
    const now = Date.now();
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    
    const total = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / total) * 100);
  };

  // Check if challenge is active
  const isActive = (startDate: number, endDate: number) => {
    const now = Date.now();
    return now >= startDate && now <= endDate;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Environmental Challenges</h1>
        <Button onClick={() => navigate("/challenges/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Challenge
        </Button>
      </div>

      {loading.challenges ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const progress = calculateProgress(challenge.startDate, challenge.endDate);
            const active = isActive(challenge.startDate, challenge.endDate);
            
            return (
              <Card key={challenge.id} className="overflow-hidden">
                {challenge.imageURL && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={challenge.imageURL}
                      alt={challenge.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{challenge.title}</CardTitle>
                    {active && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>}
                    {!active && challenge.startDate > Date.now() && 
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Upcoming</span>
                    }
                    {!active && challenge.endDate < Date.now() && 
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    }
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(challenge.startDate, "MMM d")} - {format(challenge.endDate, "MMM d, yyyy")}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="line-clamp-2 mb-3">{challenge.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                      #{challenge.hashtag}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    {challenge.participants.length} participant{challenge.participants.length !== 1 ? 's' : ''}
                  </div>
                  
                  {challenge.participants.includes(currentUser.uid) ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleLeaveChallenge(challenge.id)}
                    >
                      Leave Challenge
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      Join Challenge
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">No challenges yet.</p>
          <Button onClick={() => navigate("/challenges/new")}>
            Create First Challenge
          </Button>
        </div>
      )}
    </div>
  );
}