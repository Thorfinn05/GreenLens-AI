
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Post, Campaign, Challenge, Event, UserProfile, Comment } from "@/types/firestore";
import * as firebaseService from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";

interface CommunityContextType {
  posts: Post[];
  campaigns: Campaign[];
  challenges: Challenge[];
  events: Event[];
  userProfile: UserProfile | null;
  currentUser: any; // Firebase Auth user
  loading: {
    posts: boolean;
    campaigns: boolean;
    challenges: boolean;
    events: boolean;
    profile: boolean;
  };
  createPost: (data: { content: string; imageFile?: File; hashtags?: string[]; mentions?: string[]; campaignId?: string; challengeId?: string }) => Promise<Post>;
  likePost: (postId: string) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<Comment>;
  createCampaign: (data: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate?: number }) => Promise<Campaign>;
  joinCampaign: (campaignId: string) => Promise<void>;
  leaveCampaign: (campaignId: string) => Promise<void>;
  createChallenge: (data: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate: number; tips?: string[] }) => Promise<Challenge>;
  joinChallenge: (challengeId: string) => Promise<void>;
  leaveChallenge: (challengeId: string) => Promise<void>;
  createEvent: (data: { title: string; description: string; imageFile?: File; location: { address: string; lat?: number; lng?: number }; date: number; endDate?: number }) => Promise<Event>;
  attendEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<Partial<UserProfile>>;
  refreshUserProfile: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  refreshCampaigns: () => Promise<void>;
  refreshChallenges: () => Promise<void>;
  refreshEvents: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [loading, setLoading] = useState({
    posts: true,
    campaigns: true,
    challenges: true,
    events: true,
    profile: true
  });

  useEffect(() => {
    if (currentUser) {
      refreshUserProfile();
      refreshPosts();
      refreshCampaigns();
      refreshChallenges();
      refreshEvents();
    } else {
      // Reset state when user logs out
      setPosts([]);
      setCampaigns([]);
      setChallenges([]);
      setEvents([]);
      setUserProfile(null);
    }
  }, [currentUser]);

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const profile = await firebaseService.getCurrentUserProfile();
      if (profile) {
        setUserProfile(profile);
      } else {
        // Create profile if it doesn't exist
        const newProfile = await firebaseService.createUserProfile({});
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const refreshPosts = async () => {
    setLoading(prev => ({ ...prev, posts: true }));
    try {
      const fetchedPosts = await firebaseService.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  const refreshCampaigns = async () => {
    setLoading(prev => ({ ...prev, campaigns: true }));
    try {
      const fetchedCampaigns = await firebaseService.getCampaigns();
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, campaigns: false }));
    }
  };

  const refreshChallenges = async () => {
    setLoading(prev => ({ ...prev, challenges: true }));
    try {
      const fetchedChallenges = await firebaseService.getChallenges();
      setChallenges(fetchedChallenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, challenges: false }));
    }
  };

  const refreshEvents = async () => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const fetchedEvents = await firebaseService.getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const createPost = async (data: { content: string; imageFile?: File; hashtags?: string[]; mentions?: string[]; campaignId?: string; challengeId?: string }) => {
    try {
      // Make sure campaignId and challengeId are null if they're undefined to prevent Firestore errors
      const postData = {
        ...data,
        campaignId: data.campaignId || null,
        challengeId: data.challengeId || null
      };
      
      const newPost = await firebaseService.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      toast({
        title: "Success",
        description: "Post created successfully"
      });
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      await firebaseService.likePost(postId);
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createComment = async (postId: string, content: string) => {
    if (!currentUser) throw new Error("Must be logged in to comment");
    
    try {
      const commentData = {
        content,
        postId
      };
      
      const newComment = await firebaseService.createComment(commentData);
      
      setPosts(prev => 
        prev.map(post => {
          if (post.id === postId) {
            const comments = post.comments || [];
            return { 
              ...post, 
              comments: [...comments, newComment]
            };
          }
          return post;
        })
      );
      
      return newComment;
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createCampaign = async (data: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate?: number }) => {
    try {
      const newCampaign = await firebaseService.createCampaign(data);
      setCampaigns(prev => [newCampaign, ...prev]);
      toast({
        title: "Success",
        description: "Campaign created successfully"
      });
      return newCampaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
      throw error;
    }
  };

  const joinCampaign = async (campaignId: string) => {
    try {
      await firebaseService.joinCampaign(campaignId);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId ? 
          { ...campaign, participants: [...campaign.participants, currentUser!.uid] } : 
          campaign
        )
      );
      toast({
        title: "Success",
        description: "Joined campaign successfully"
      });
    } catch (error) {
      console.error("Error joining campaign:", error);
      toast({
        title: "Error",
        description: "Failed to join campaign",
        variant: "destructive"
      });
      throw error;
    }
  };

  const leaveCampaign = async (campaignId: string) => {
    try {
      await firebaseService.leaveCampaign(campaignId);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId ? 
          { ...campaign, participants: campaign.participants.filter(id => id !== currentUser!.uid) } : 
          campaign
        )
      );
      toast({
        title: "Success",
        description: "Left campaign successfully"
      });
    } catch (error) {
      console.error("Error leaving campaign:", error);
      toast({
        title: "Error",
        description: "Failed to leave campaign",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createChallenge = async (data: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate: number; tips?: string[] }) => {
    try {
      const newChallenge = await firebaseService.createChallenge(data);
      setChallenges(prev => [newChallenge, ...prev]);
      toast({
        title: "Success",
        description: "Challenge created successfully"
      });
      return newChallenge;
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive"
      });
      throw error;
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      await firebaseService.joinChallenge(challengeId);
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId ? 
          { ...challenge, participants: [...challenge.participants, currentUser!.uid] } : 
          challenge
        )
      );
      toast({
        title: "Success",
        description: "Joined challenge successfully"
      });
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge",
        variant: "destructive"
      });
      throw error;
    }
  };

  const leaveChallenge = async (challengeId: string) => {
    try {
      await firebaseService.leaveChallenge(challengeId);
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId ? 
          { ...challenge, participants: challenge.participants.filter(id => id !== currentUser!.uid) } : 
          challenge
        )
      );
      toast({
        title: "Success",
        description: "Left challenge successfully"
      });
    } catch (error) {
      console.error("Error leaving challenge:", error);
      toast({
        title: "Error",
        description: "Failed to leave challenge",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createEvent = async (data: { title: string; description: string; imageFile?: File; location: { address: string; lat?: number; lng?: number }; date: number; endDate?: number }) => {
    try {
      const newEvent = await firebaseService.createEvent(data);
      setEvents(prev => [newEvent, ...prev]);
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
      throw error;
    }
  };

  const attendEvent = async (eventId: string) => {
    try {
      await firebaseService.attendEvent(eventId);
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? 
          { ...event, attendees: [...event.attendees, currentUser!.uid] } : 
          event
        )
      );
      toast({
        title: "Success",
        description: "RSVP'd to event successfully"
      });
    } catch (error) {
      console.error("Error attending event:", error);
      toast({
        title: "Error",
        description: "Failed to RSVP to event",
        variant: "destructive"
      });
      throw error;
    }
  };

  const leaveEvent = async (eventId: string) => {
    try {
      await firebaseService.leaveEvent(eventId);
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? 
          { ...event, attendees: event.attendees.filter(id => id !== currentUser!.uid) } : 
          event
        )
      );
      toast({
        title: "Success",
        description: "Cancelled RSVP successfully"
      });
    } catch (error) {
      console.error("Error leaving event:", error);
      toast({
        title: "Error",
        description: "Failed to cancel RSVP",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const updatedProfile = await firebaseService.updateUserProfile(data);
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    posts,
    campaigns,
    challenges,
    events,
    userProfile,
    currentUser,
    loading,
    createPost,
    likePost,
    createComment,
    createCampaign,
    joinCampaign,
    leaveCampaign,
    createChallenge,
    joinChallenge,
    leaveChallenge,
    createEvent,
    attendEvent,
    leaveEvent,
    updateUserProfile,
    refreshUserProfile,
    refreshPosts,
    refreshCampaigns,
    refreshChallenges,
    refreshEvents
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}