
import React, { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommunity } from "@/contexts/CommunityContext";
import { Camera, X, Image, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface PostFormProps {
  initialHashtags?: string[];
  campaignId?: string;
  challengeId?: string;
}

export default function PostForm({ initialHashtags = [], campaignId, challengeId }: PostFormProps = {}) {
  const { createPost } = useCommunity();
  const { currentUser } = useAuth();
  
  // Add hashtags to the initial content if provided
  const hashtagsStr = initialHashtags.length > 0 ? initialHashtags.map(tag => `#${tag}`).join(' ') + ' ' : '';
  const [content, setContent] = useState(hashtagsStr);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage) return;
    
    setIsSubmitting(true);
    try {
      await createPost({
        content: content.trim(),
        imageFile: selectedImage || undefined,
        hashtags: initialHashtags.length > 0 ? initialHashtags : undefined,
        campaignId,
        challengeId
      });
      
      // Clear form after successful submission
      setContent(hashtagsStr); // Reset but keep initial hashtags if any
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    }
    return currentUser?.email ? currentUser.email[0].toUpperCase() : "U";
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar>
            {currentUser?.photoURL ? (
              <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || ""} />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="Share your environmental thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            
            {imagePreview && (
              <div className="relative mt-2 rounded-md overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto max-h-56 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex gap-2">
          <label htmlFor="image-upload" className="sr-only">
            Upload an image
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
            title="Upload an image"
          />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-4 w-4 mr-1" />
            <span>Image</span>
          </Button>
          
          <Button type="button" variant="ghost" size="sm">
            <Camera className="h-4 w-4 mr-1" />
            <span>Capture</span>
          </Button>
        </div>
        
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={(!content.trim() && !selectedImage) || isSubmitting}
        >
          {isSubmitting ? (
            "Posting..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              <span>Post</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}