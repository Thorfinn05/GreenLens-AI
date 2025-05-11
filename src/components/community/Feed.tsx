
import React from "react";
import { useCommunity } from "@/contexts/CommunityContext";
import { Post } from "@/types/firestore";
import PostCard from "@/components/community/PostCard";
import PostForm from "@/components/community/PostForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Feed() {
  const { posts, loading } = useCommunity();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
        <p className="mb-6 text-muted-foreground">
          Sign in to view and participate in our environmental community.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/login")}>Sign In</Button>
          <Button variant="outline" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <PostForm />
          
          {loading.posts ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Button onClick={() => navigate("/campaigns/new")} className="w-full">
            Create New Campaign
          </Button>
          
          {loading.posts ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.filter(post => post.campaignId).length > 0 ? (
            posts
              .filter(post => post.campaignId)
              .map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No campaign posts yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a campaign or join an existing one to get started!
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="challenges" className="space-y-4">
          <Button onClick={() => navigate("/challenges/new")} className="w-full">
            Create New Challenge
          </Button>
          
          {loading.posts ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.filter(post => post.challengeId).length > 0 ? (
            posts
              .filter(post => post.challengeId)
              .map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No challenge posts yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a challenge or join an existing one to get started!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}