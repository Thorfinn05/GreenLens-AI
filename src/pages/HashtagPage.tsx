
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCommunity } from "@/contexts/CommunityContext";
import PostCard from "@/components/community/PostCard";
import { Button } from "@/components/ui/button";
import { Loader2, Hash } from "lucide-react";
import PostForm from "@/components/community/PostForm";
import { useAuth } from "@/contexts/AuthContext";

export default function HashtagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { posts, loading, refreshPosts } = useCommunity();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [hashtagPosts, setHashtagPosts] = useState<typeof posts>([]);

  useEffect(() => {
    refreshPosts();
  }, [tag, refreshPosts]);

  useEffect(() => {
    if (tag && posts.length > 0) {
      const filtered = posts.filter(post => 
        (post.hashtags && post.hashtags.includes(tag)) || 
        post.content.includes(`#${tag}`)
      );
      setHashtagPosts(filtered);
    }
  }, [tag, posts]);

  if (!tag) {
    return <div>Invalid hashtag</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <Hash className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">#{tag}</h1>
      </div>

      {currentUser && (
        <div className="mb-6">
          <PostForm initialHashtags={[tag]} />
        </div>
      )}

      {loading.posts ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : hashtagPosts.length > 0 ? (
        <div className="space-y-4">
          {hashtagPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No posts for #{tag} yet.</p>
          {currentUser && (
            <Button onClick={() => window.scrollTo(0, 0)} className="mt-4">
              Be the first to post
            </Button>
          )}
        </div>
      )}
    </div>
  );
}