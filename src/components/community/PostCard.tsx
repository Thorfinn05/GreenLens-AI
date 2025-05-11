
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunity } from "@/contexts/CommunityContext";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ThumbsUp, MessageCircle, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { Post, UserProfile } from "@/types/firestore";
import * as firebaseService from "@/services/firebaseService";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser } = useAuth();
  const { likePost, createComment } = useCommunity();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);
  const [mentionedUsers, setMentionedUsers] = useState<Map<string, UserProfile>>(new Map());

  // Get the author's profile
  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const profile = await firebaseService.getUserProfile(post.authorId);
        if (profile) {
          setAuthorProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching author profile:", error);
      }
    };

    fetchAuthorProfile();
  }, [post.authorId]);

  // Find and fetch mentioned users
  useEffect(() => {
    const fetchMentionedUsers = async () => {
      const mentions = post.content.match(/@(\w+)/g) || [];
      if (mentions.length === 0) return;

      const usernameMap = new Map<string, UserProfile>();
      
      for (const mention of mentions) {
        const username = mention.substring(1); // Remove @ symbol
        try {
          const users = await firebaseService.searchUsersByUsername(username);
          if (users.length > 0) {
            usernameMap.set(username, users[0]);
          }
        } catch (error) {
          console.error(`Error fetching user ${username}:`, error);
        }
      }
      
      setMentionedUsers(usernameMap);
    };

    fetchMentionedUsers();
  }, [post.content]);

  const handleLikePost = async () => {
    if (!currentUser) return;
    try {
      await likePost(post.id);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment(post.id, comment);
      setComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format post content with clickable hashtags and mentions
  const formatContent = (content: string) => {
    // First, replace hashtags with links
    let formattedContent = content.replace(
      /#(\w+)/g, 
      '<a href="/hashtag/$1" class="text-primary hover:underline">#$1</a>'
    );
    
    // Then replace mentions with links if the user exists
    formattedContent = formattedContent.replace(
      /@(\w+)/g, 
      (match, username) => {
        const user = mentionedUsers.get(username);
        if (user) {
          return `<a href="/profile/${user.uid}" class="text-primary font-medium hover:underline">@${username}</a>`;
        }
        return match;
      }
    );
    
    return { __html: formattedContent };
  };

  // Get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.authorId}`}>
              <Avatar>
                <AvatarImage 
                  src={authorProfile?.photoURL || post.authorPhotoURL} 
                  alt={authorProfile?.displayName || post.authorName} 
                />
                <AvatarFallback>{getInitials(authorProfile?.displayName || post.authorName)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/profile/${post.authorId}`} className="font-medium hover:underline">
                {authorProfile?.displayName || post.authorName}
              </Link>
              {authorProfile?.username && (
                <p className="text-sm text-muted-foreground">@{authorProfile.username}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {post.campaignId && (
            <Link to={`/campaigns/${post.campaignId}`} className="text-sm text-primary">
              Campaign Post
            </Link>
          )}
          {post.challengeId && (
            <Link to={`/challenges/${post.challengeId}`} className="text-sm text-primary">
              Challenge Post
            </Link>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          dangerouslySetInnerHTML={formatContent(post.content)} 
          className="whitespace-pre-line mb-3"
        />
        
        {post.imageURL && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img
              src={post.imageURL}
              alt="Post attachment"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map(tag => (
              <Link
                key={tag}
                to={`/hashtag/${tag}`}
                className="flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20"
              >
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col">
        <div className="flex justify-between items-center w-full py-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={handleLikePost}
          >
            <ThumbsUp className="mr-1 h-4 w-4" /> {post.likes || 0}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
          >
            <MessageCircle className="mr-1 h-4 w-4" /> {post.comments?.length || 0}
          </Button>
        </div>
        
        {post.comments && post.comments.length > 0 && (
          <div className="w-full mt-2 space-y-2">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <Link to={`/profile/${comment.authorId}`}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage 
                      src={comment.authorPhotoURL} 
                      alt={comment.authorName} 
                    />
                    <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Link to={`/profile/${comment.authorId}`} className="font-medium mr-2 hover:underline">
                      {comment.authorName}
                    </Link>
                    <span>{comment.content}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {currentUser && (
          <form onSubmit={handleSubmitComment} className="flex items-center space-x-2 w-full mt-2">
            <Input
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={isSubmitting || !comment.trim()}>
              Post
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;