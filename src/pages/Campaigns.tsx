
import React from "react";
import { useCommunity } from "@/contexts/CommunityContext";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function Campaigns() {
  const { campaigns, loading, joinCampaign, leaveCampaign } = useCommunity();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
          <p className="mb-6 text-muted-foreground">
            Sign in to view and participate in environmental campaigns.
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

  const handleJoinCampaign = async (campaignId: string) => {
    await joinCampaign(campaignId);
  };

  const handleLeaveCampaign = async (campaignId: string) => {
    await leaveCampaign(campaignId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Environmental Campaigns</h1>
        <Button onClick={() => navigate("/campaigns/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>

      {loading.campaigns ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              {campaign.imageURL && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={campaign.imageURL}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{campaign.title}</CardTitle>
                <CardDescription>
                  Created by {campaign.creatorName} • {formatDistanceToNow(campaign.createdAt, { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="line-clamp-3">{campaign.description}</p>
                <div className="mt-2">
                  <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                    #{campaign.hashtag}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {campaign.participants.length} participant{campaign.participants.length !== 1 ? 's' : ''}
                </div>
                
                {campaign.participants.includes(currentUser.uid) ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleLeaveCampaign(campaign.id)}
                  >
                    Leave Campaign
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleJoinCampaign(campaign.id)}
                  >
                    Join Campaign
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">No campaigns yet.</p>
          <Button onClick={() => navigate("/campaigns/new")}>
            Create First Campaign
          </Button>
        </div>
      )}
    </div>
  );
}