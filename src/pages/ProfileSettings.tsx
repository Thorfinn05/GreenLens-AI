
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunity } from "@/contexts/CommunityContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettings() {
  const { currentUser } = useAuth();
  const { userProfile, updateUserProfile } = useCommunity();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setUsername(userProfile.username || "");
      setBio(userProfile.bio || "");
      setPhotoURL(userProfile.photoURL || "");
    }
  }, [currentUser, userProfile, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      await updateUserProfile({
        displayName,
        username,
        bio,
        photoURL
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase();
    }
    return currentUser?.email ? currentUser.email[0].toUpperCase() : "U";
  };
  
  if (!currentUser || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                {photoURL ? (
                  <AvatarImage src={photoURL} alt={displayName} />
                ) : (
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="w-full">
                <Label htmlFor="photoURL">Profile Photo URL</Label>
                <Input
                  id="photoURL"
                  placeholder="https://example.com/photo.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a URL for your profile picture
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be used for @mentions
              </p>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}