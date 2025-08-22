
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import ProfileHeader from "@/components/ProfileHeader";
// import DetectionHistory from "@/components/DetectionHistory";

// export default function Profile() {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//     }
//   }, [currentUser, navigate]);

//   if (!currentUser) return null;

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <ProfileHeader />
//       <DetectionHistory />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunity } from "@/contexts/CommunityContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/firestore";
import { User, LogOut, CalendarDays, Image as ImageIcon, Edit, UserPlus } from "lucide-react";
import * as firebaseService from "@/services/firebaseService";
import PostCard from "@/components/community/PostCard";
import { Loader2 } from "lucide-react";
import DetectionHistory from "@/components/DetectionHistory";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { userProfile } = useCommunity();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // If userId is provided and it's not the current user, fetch that user's profile
        if (userId && userId !== currentUser.uid) {
          setIsCurrentUser(false);
          const fetchedProfile = await firebaseService.getUserProfile(userId);
          setProfile(fetchedProfile);
          
          // Check if current user is following this user
          const isCurrentlyFollowing = userProfile?.following?.includes(userId) || false;
          setIsFollowing(isCurrentlyFollowing);
          
          // Get the user's posts sorted by createdAt in descending order
          const posts = await firebaseService.getUserPosts(userId);
          setUserPosts(posts);
        } else {
          // Otherwise, use the current user's profile
          setIsCurrentUser(true);
          setProfile(userProfile);
          
          // Get the current user's posts sorted by createdAt in descending order
          const posts = await firebaseService.getUserPosts(currentUser.uid);
          setUserPosts(posts);
          
          // Get the current user's orders
          const orders = await firebaseService.getUserOrders(currentUser.uid, 20);
          setUserOrders(orders);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading the profile data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, navigate, userId, userProfile, toast]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const handleEditProfile = () => {
    navigate("/settings/profile");
  };

  const handleFollowUser = async () => {
    if (!userId) return;
    
    try {
      await firebaseService.followUser(userId);
      setIsFollowing(true);
      toast({
        title: "Success",
        description: `You are now following ${profile?.displayName || "this user"}`
      });
    } catch (error) {
      console.error("Follow error:", error);
      toast({
        title: "Error",
        description: "There was a problem following this user",
        variant: "destructive"
      });
    }
  };
  
  const handleUnfollowUser = async () => {
    if (!userId) return;
    
    try {
      await firebaseService.unfollowUser(userId);
      setIsFollowing(false);
      toast({
        title: "Success",
        description: `You have unfollowed ${profile?.displayName || "this user"}`
      });
    } catch (error) {
      console.error("Unfollow error:", error);
      toast({
        title: "Error",
        description: "There was a problem unfollowing this user",
        variant: "destructive"
      });
    }
  };
  
  if (!currentUser) return null;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Get initials for avatar
  const getInitials = () => {
    if (profile?.displayName) {
      return profile.displayName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase();
    }
    return profile?.email ? profile.email[0].toUpperCase() : "U";
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-center py-6 mb-8 border-b">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Avatar className="h-24 w-24 border-2 border-primary">
            {profile?.photoURL ? (
              <AvatarImage src={profile.photoURL} alt={profile.displayName} />
            ) : (
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {profile?.displayName || "User"}
            </h1>
            {profile?.username && (
              <p className="text-muted-foreground">@{profile.username}</p>
            )}
            {profile?.bio && (
              <p className="mt-2 text-sm md:text-base max-w-md">{profile.bio}</p>
            )}
            <div className="flex gap-4 mt-2">
              <div>
                <span className="font-semibold">{profile?.following?.length || 0}</span>{" "}
                <span className="text-muted-foreground text-sm">Following</span>
              </div>
              <div>
                <span className="font-semibold">{profile?.followers?.length || 0}</span>{" "}
                <span className="text-muted-foreground text-sm">Followers</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isCurrentUser ? (
            <>
              <Button variant="outline" onClick={handleEditProfile}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            isFollowing ? (
              <Button variant="outline" onClick={handleUnfollowUser}>
                Unfollow
              </Button>
            ) : (
              <Button onClick={handleFollowUser}>
                <UserPlus className="mr-2 h-4 w-4" />
                Follow
              </Button>
            )
          )}
        </div>
      </div>
      
      {/* Profile Content Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className={`grid ${isCurrentUser ? 'grid-cols-4' : 'grid-cols-3'} max-w-lg mb-8`}>
          <TabsTrigger value="posts">
            <User className="mr-2 h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="detections">
            <ImageIcon className="mr-2 h-4 w-4" />
            Detections
          </TabsTrigger>
          <TabsTrigger value="events">
            <CalendarDays className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          {isCurrentUser && (
            <TabsTrigger value="orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-0">
          {userPosts.length > 0 ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {userPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No posts yet.</p>
              {isCurrentUser && (
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate("/community")}
                >
                  Create your first post
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Detections Tab - modified to make public */}
        <TabsContent value="detections" className="mt-0">
          <DetectionHistory userId={isCurrentUser ? undefined : userId} />
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events" className="mt-0">
          <div className="text-center py-8 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">
              No events yet.
            </p>
            {isCurrentUser && (
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => navigate("/events/new")}
              >
                Create an event
              </Button>
            )}
          </div>
        </TabsContent>
        
        {/* Orders Tab - Only for current user */}
        {isCurrentUser && (
          <TabsContent value="orders" className="mt-0">
            {userOrders.length > 0 ? (
              <div className="space-y-4 max-w-3xl mx-auto">
                {userOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.product.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No orders yet.</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate("/marketplace")}
                >
                  Start shopping in the marketplace
                </Button>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}