import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit as fsLimit, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, serverTimestamp, Timestamp, increment as firestoreIncrement } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "@/lib/firebase";
import { UserProfile, Post, Campaign, Challenge, Event, Message, PlasticDetection } from "@/types/firestore";

// User Profile Functions
export const createUserProfile = async (userData: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const userRef = doc(db, "users", user.uid);
  const profile: UserProfile = {
    uid: user.uid,
    displayName: userData.displayName || user.displayName || "Anonymous",
    email: user.email || "",
    photoURL: userData.photoURL || user.photoURL || "",
    bio: userData.bio || "",
    username: userData.username || "",
    createdAt: Date.now(),
    following: [],
    followers: []
  };
  
  await setDoc(userRef, profile);
  return profile;
};

export const updateUserProfile = async (userData: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, userData);
  return userData;
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const getCurrentUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  return getUserProfile(user.uid);
};

export const followUser = async (userIdToFollow: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  // Add to current user's following
  const currentUserRef = doc(db, "users", user.uid);
  await updateDoc(currentUserRef, {
    following: arrayUnion(userIdToFollow)
  });
  
  // Add to target user's followers
  const targetUserRef = doc(db, "users", userIdToFollow);
  await updateDoc(targetUserRef, {
    followers: arrayUnion(user.uid)
  });
};

export const unfollowUser = async (userIdToUnfollow: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  // Remove from current user's following
  const currentUserRef = doc(db, "users", user.uid);
  await updateDoc(currentUserRef, {
    following: arrayRemove(userIdToUnfollow)
  });
  
  // Remove from target user's followers
  const targetUserRef = doc(db, "users", userIdToUnfollow);
  await updateDoc(targetUserRef, {
    followers: arrayRemove(user.uid)
  });
};

// Post Functions
export const createPost = async (postData: { content: string; imageFile?: File; hashtags?: string[]; mentions?: string[]; campaignId: string | null; challengeId: string | null }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  let imageURL = "";
  if (postData.imageFile) {
    const imageRef = ref(storage, `post_images/${user.uid}/${Date.now()}`);
    await uploadBytes(imageRef, postData.imageFile);
    imageURL = await getDownloadURL(imageRef);
  }
  
  // Extract hashtags and mentions
  const hashtags = postData.hashtags || extractHashtags(postData.content);
  const mentions = postData.mentions || extractMentions(postData.content);
  
  const postRef = collection(db, "posts");
  
  // Create post object
  const newPost = {
    authorId: user.uid,
    authorName: user.displayName || "Anonymous",
    authorPhotoURL: user.photoURL || "",
    content: postData.content,
    imageURL,
    hashtags,
    mentions,
    likes: 0,
    createdAt: Date.now(),
    campaignId: postData.campaignId,
    challengeId: postData.challengeId,
    comments: []
  };
  
  const docRef = await addDoc(postRef, newPost);
  return { id: docRef.id, ...newPost } as Post;
};

export const getPosts = async (limit = 20) => {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    fsLimit(limit)
  );
  
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const getUserPosts = async (userId: string, limit = 20) => {
  // Fixed query to avoid index issues - we create a compound index on authorId and createdAt
  const postsQuery = query(
    collection(db, "posts"),
    where("authorId", "==", userId),
    orderBy("createdAt", "desc"),
    fsLimit(limit)
  );
  
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

// New Comment Function
export const createComment = async (commentData: { content: string; postId: string }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const comment = {
    authorId: user.uid,
    authorName: user.displayName || "Anonymous",
    authorPhotoURL: user.photoURL || "",
    content: commentData.content,
    createdAt: Date.now()
  };
  
  const postRef = doc(db, "posts", commentData.postId);
  await updateDoc(postRef, {
    comments: arrayUnion(comment)
  });
  
  return comment;
};

export const likePost = async (postId: string) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: firestoreIncrement(1)
  });
};

// Campaign Functions
export const createCampaign = async (campaignData: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate?: number }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  let imageURL = "";
  if (campaignData.imageFile) {
    const imageRef = ref(storage, `campaign_images/${user.uid}/${Date.now()}`);
    await uploadBytes(imageRef, campaignData.imageFile);
    imageURL = await getDownloadURL(imageRef);
  }
  
  const campaignRef = collection(db, "campaigns");
  const newCampaign: Omit<Campaign, "id"> = {
    title: campaignData.title,
    description: campaignData.description,
    imageURL,
    creatorId: user.uid,
    creatorName: user.displayName || "Anonymous",
    hashtag: campaignData.hashtag,
    startDate: campaignData.startDate,
    endDate: campaignData.endDate,
    participants: [user.uid],
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(campaignRef, newCampaign);
  return { id: docRef.id, ...newCampaign };
};

export const getCampaigns = async (limit = 20) => {
  const campaignsQuery = query(
    collection(db, "campaigns"),
    orderBy("createdAt", "desc"),
    fsLimit(limit)
  );
  
  const snapshot = await getDocs(campaignsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
};

export const getCampaign = async (campaignId: string) => {
  const campaignRef = doc(db, "campaigns", campaignId);
  const campaignSnap = await getDoc(campaignRef);
  
  if (campaignSnap.exists()) {
    return { id: campaignSnap.id, ...campaignSnap.data() } as Campaign;
  }
  return null;
};

export const joinCampaign = async (campaignId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const campaignRef = doc(db, "campaigns", campaignId);
  await updateDoc(campaignRef, {
    participants: arrayUnion(user.uid)
  });
};

export const leaveCampaign = async (campaignId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const campaignRef = doc(db, "campaigns", campaignId);
  await updateDoc(campaignRef, {
    participants: arrayRemove(user.uid)
  });
};

// Challenge Functions
export const createChallenge = async (challengeData: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate: number; tips?: string[] }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  let imageURL = "";
  if (challengeData.imageFile) {
    const imageRef = ref(storage, `challenge_images/${user.uid}/${Date.now()}`);
    await uploadBytes(imageRef, challengeData.imageFile);
    imageURL = await getDownloadURL(imageRef);
  }
  
  const challengeRef = collection(db, "challenges");
  const newChallenge: Omit<Challenge, "id"> = {
    title: challengeData.title,
    description: challengeData.description,
    imageURL,
    creatorId: user.uid,
    creatorName: user.displayName || "Anonymous",
    hashtag: challengeData.hashtag,
    startDate: challengeData.startDate,
    endDate: challengeData.endDate,
    participants: [user.uid],
    createdAt: Date.now(),
    tips: challengeData.tips || []
  };
  
  const docRef = await addDoc(challengeRef, newChallenge);
  return { id: docRef.id, ...newChallenge };
};

export const getChallenges = async (limit = 20) => {
  const challengesQuery = query(
    collection(db, "challenges"),
    orderBy("createdAt", "desc"),
    fsLimit(limit)
  );
  
  const snapshot = await getDocs(challengesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
};

export const getChallenge = async (challengeId: string) => {
  const challengeRef = doc(db, "challenges", challengeId);
  const challengeSnap = await getDoc(challengeRef);
  
  if (challengeSnap.exists()) {
    return { id: challengeSnap.id, ...challengeSnap.data() } as Challenge;
  }
  return null;
};

export const joinChallenge = async (challengeId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const challengeRef = doc(db, "challenges", challengeId);
  await updateDoc(challengeRef, {
    participants: arrayUnion(user.uid)
  });
};

export const leaveChallenge = async (challengeId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const challengeRef = doc(db, "challenges", challengeId);
  await updateDoc(challengeRef, {
    participants: arrayRemove(user.uid)
  });
};

// Event Functions
export const createEvent = async (eventData: { title: string; description: string; imageFile?: File; location: { address: string; lat?: number; lng?: number }; date: number; endDate?: number }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  let imageURL = "";
  if (eventData.imageFile) {
    const imageRef = ref(storage, `event_images/${user.uid}/${Date.now()}`);
    await uploadBytes(imageRef, eventData.imageFile);
    imageURL = await getDownloadURL(imageRef);
  }
  
  const eventRef = collection(db, "events");
  const newEvent: Omit<Event, "id"> = {
    title: eventData.title,
    description: eventData.description,
    imageURL,
    location: eventData.location,
    creatorId: user.uid,
    creatorName: user.displayName || "Anonymous",
    date: eventData.date,
    endDate: eventData.endDate,
    attendees: [user.uid],
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(eventRef, newEvent);
  return { id: docRef.id, ...newEvent };
};

export const getEvents = async (limit = 20) => {
  const eventsQuery = query(
    collection(db, "events"),
    orderBy("date", "asc"),
    fsLimit(limit)
  );
  
  const snapshot = await getDocs(eventsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
};

export const getEvent = async (eventId: string) => {
  const eventRef = doc(db, "events", eventId);
  const eventSnap = await getDoc(eventRef);
  
  if (eventSnap.exists()) {
    return { id: eventSnap.id, ...eventSnap.data() } as Event;
  }
  return null;
};

export const attendEvent = async (eventId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    attendees: arrayUnion(user.uid)
  });
};

export const leaveEvent = async (eventId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    attendees: arrayRemove(user.uid)
  });
};

// Message Functions
export const sendMessage = async (receiverId: string, content: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const messageRef = collection(db, "messages");
  const newMessage = {
    senderId: user.uid,
    senderName: user.displayName || "Anonymous",
    receiverId,
    content,
    read: false,
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(messageRef, newMessage);
  return { id: docRef.id, ...newMessage };
};

export const getMessages = async (userId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const messagesQuery = query(
    collection(db, "messages"),
    where("senderId", "in", [user.uid, userId]),
    where("receiverId", "in", [user.uid, userId]),
    orderBy("createdAt", "asc")
  );
  
  const snapshot = await getDocs(messagesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
};

export const markMessageAsRead = async (messageId: string) => {
  const messageRef = doc(db, "messages", messageId);
  await updateDoc(messageRef, {
    read: true
  });
};

// Plastic Detection Functions
export const createDetection = async (detectionData: { type: string; confidence: string; imageFile?: File }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  let imageUrl = "";
  if (detectionData.imageFile) {
    const imageRef = ref(storage, `detection_images/${user.uid}/${Date.now()}`);
    await uploadBytes(imageRef, detectionData.imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }
  
  const detectionRef = collection(db, "plasticDetections");
  const newDetection = {
    userId: user.uid,
    type: detectionData.type,
    confidence: detectionData.confidence,
    imageUrl,
    date: Date.now(),
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(detectionRef, newDetection);
  return { id: docRef.id, ...newDetection };
};

export const getUserDetections = async (userId: string, limit = 20) => {
  const user = auth.currentUser;
  if (!user && !userId) throw new Error("No user specified");
  
  const targetUserId = userId || user?.uid;
  
  const detectionsQuery = query(
    collection(db, "plasticDetections"),
    where("userId", "==", targetUserId),
    orderBy("createdAt", "desc"),
    fsLimit(limit)
  );
  
  const snapshot = await getDocs(detectionsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlasticDetection));
};

// Utility functions
const extractHashtags = (content: string): string[] => {
  const hashtags = content.match(/#[a-zA-Z0-9_]+/g);
  return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
};

const extractMentions = (content: string): string[] => {
  const mentions = content.match(/@[a-zA-Z0-9_]+/g);
  return mentions ? mentions.map(mention => mention.slice(1)) : [];
};