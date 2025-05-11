
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/firestore";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Share } from "lucide-react";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { likePost, createComment, currentUser } = useCommunity();
  const { currentUser: authUser } = useAuth();
  const [comment, setComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const formattedContent = post.content.replace(/#(\w+)/g, '<a href="/hashtag/$1" class="text-primary hover:underline">#$1</a>');

  const handleLike = async () => {
    try {
      await likePost(post.id);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.authorName}`,
          text: post.content,
          url: window.location.href
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard"
      });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await createComment(post.id, comment);
      setComment("");
      setShowCommentInput(false);
      toast({
        title: "Comment added",
        description: "Your comment was added successfully"
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar 
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${post.authorId}`)}
          >
            {post.authorPhotoURL ? (
              <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
            ) : (
              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 
                  className="font-medium hover:underline cursor-pointer"
                  onClick={() => navigate(`/profile/${post.authorId}`)}
                >
                  {post.authorName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div 
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            
            {post.imageURL && (
              <div className="mt-3">
                <img 
                  src={post.imageURL} 
                  alt="Post attachment" 
                  className="rounded-md max-h-96 w-auto object-contain"
                />
              </div>
            )}

            {post.comments && post.comments.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium">Comments ({post.comments.length})</h4>
                {post.comments.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                    <Avatar className="h-6 w-6">
                      {comment.authorPhotoURL ? (
                        <AvatarImage src={comment.authorPhotoURL} alt={comment.authorName} />
                      ) : (
                        <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="bg-muted/50 rounded-md p-2 text-sm flex-1">
                      <div className="font-medium">{comment.authorName}</div>
                      <div>{comment.content}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showCommentInput && authUser && (
              <div className="mt-4 space-y-2">
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-24"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCommentInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleComment}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <Heart className="mr-1 h-4 w-4" />
            {post.likes || 0}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => authUser ? setShowCommentInput(!showCommentInput) : navigate("/login")}
          >
            <MessageSquare className="mr-1 h-4 w-4" />
            {post.comments?.length || 0}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}