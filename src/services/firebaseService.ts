// import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit as fsLimit, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, serverTimestamp, Timestamp, increment as firestoreIncrement } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage, auth } from "@/lib/firebase";
// import { UserProfile, Post, Campaign, Challenge, Event, Message, PlasticDetection } from "@/types/firestore";

// // User Profile Functions
// export const createUserProfile = async (userData: Partial<UserProfile>) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const userRef = doc(db, "users", user.uid);
//   const profile: UserProfile = {
//     uid: user.uid,
//     displayName: userData.displayName || user.displayName || "Anonymous",
//     email: user.email || "",
//     photoURL: userData.photoURL || user.photoURL || "",
//     bio: userData.bio || "",
//     username: userData.username || "",
//     createdAt: Date.now(),
//     following: [],
//     followers: []
//   };
  
//   await setDoc(userRef, profile);
//   return profile;
// };

// export const updateUserProfile = async (userData: Partial<UserProfile>) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const userRef = doc(db, "users", user.uid);
//   await updateDoc(userRef, userData);
//   return userData;
// };

// export const getUserProfile = async (userId: string) => {
//   const userRef = doc(db, "users", userId);
//   const userSnap = await getDoc(userRef);
  
//   if (userSnap.exists()) {
//     return userSnap.data() as UserProfile;
//   }
//   return null;
// };

// export const getCurrentUserProfile = async () => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
//   return getUserProfile(user.uid);
// };

// export const followUser = async (userIdToFollow: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   // Add to current user's following
//   const currentUserRef = doc(db, "users", user.uid);
//   await updateDoc(currentUserRef, {
//     following: arrayUnion(userIdToFollow)
//   });
  
//   // Add to target user's followers
//   const targetUserRef = doc(db, "users", userIdToFollow);
//   await updateDoc(targetUserRef, {
//     followers: arrayUnion(user.uid)
//   });
// };

// export const unfollowUser = async (userIdToUnfollow: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   // Remove from current user's following
//   const currentUserRef = doc(db, "users", user.uid);
//   await updateDoc(currentUserRef, {
//     following: arrayRemove(userIdToUnfollow)
//   });
  
//   // Remove from target user's followers
//   const targetUserRef = doc(db, "users", userIdToUnfollow);
//   await updateDoc(targetUserRef, {
//     followers: arrayRemove(user.uid)
//   });
// };

// // Post Functions
// export const createPost = async (postData: { content: string; imageFile?: File; hashtags?: string[]; mentions?: string[]; campaignId: string | null; challengeId: string | null }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   let imageURL = "";
//   if (postData.imageFile) {
//     const imageRef = ref(storage, `post_images/${user.uid}/${Date.now()}`);
//     await uploadBytes(imageRef, postData.imageFile);
//     imageURL = await getDownloadURL(imageRef);
//   }
  
//   // Extract hashtags and mentions
//   const hashtags = postData.hashtags || extractHashtags(postData.content);
//   const mentions = postData.mentions || extractMentions(postData.content);
  
//   const postRef = collection(db, "posts");
  
//   // Create post object
//   const newPost = {
//     authorId: user.uid,
//     authorName: user.displayName || "Anonymous",
//     authorPhotoURL: user.photoURL || "",
//     content: postData.content,
//     imageURL,
//     hashtags,
//     mentions,
//     likes: 0,
//     createdAt: Date.now(),
//     campaignId: postData.campaignId,
//     challengeId: postData.challengeId,
//     comments: []
//   };
  
//   const docRef = await addDoc(postRef, newPost);
//   return { id: docRef.id, ...newPost } as Post;
// };

// export const getPosts = async (limit = 20) => {
//   const postsQuery = query(
//     collection(db, "posts"),
//     orderBy("createdAt", "desc"),
//     fsLimit(limit)
//   );
  
//   const snapshot = await getDocs(postsQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
// };

// export const getUserPosts = async (userId: string, limit = 20) => {
//   // Fixed query to avoid index issues - we create a compound index on authorId and createdAt
//   const postsQuery = query(
//     collection(db, "posts"),
//     where("authorId", "==", userId),
//     orderBy("createdAt", "desc"),
//     fsLimit(limit)
//   );
  
//   const snapshot = await getDocs(postsQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
// };

// // New Comment Function
// export const createComment = async (commentData: { content: string; postId: string }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const comment = {
//     authorId: user.uid,
//     authorName: user.displayName || "Anonymous",
//     authorPhotoURL: user.photoURL || "",
//     content: commentData.content,
//     createdAt: Date.now()
//   };
  
//   const postRef = doc(db, "posts", commentData.postId);
//   await updateDoc(postRef, {
//     comments: arrayUnion(comment)
//   });
  
//   return comment;
// };

// export const likePost = async (postId: string) => {
//   const postRef = doc(db, "posts", postId);
//   await updateDoc(postRef, {
//     likes: firestoreIncrement(1)
//   });
// };

//  // Campaign Functions
//  export const createCampaign = async (campaignData: {
//    title: string;
//    description: string;
//    hashtag: string;
//    startDate: number;
//    endDate?: number;
//    base64Image?: string | null; // Accept the Base64 string
//  }) => {
//    const user = auth.currentUser;
//    if (!user) throw new Error("No authenticated user");

//    const campaignRef = collection(db, "campaigns");
//    const newCampaign: Omit<Campaign, "id"> = {
//      title: campaignData.title,
//      description: campaignData.description,
//      imageURL: campaignData.base64Image || "", // Store the Base64 string as imageURL
//      creatorId: user.uid,
//      creatorName: user.displayName || "Anonymous",
//      hashtag: campaignData.hashtag,
//      startDate: campaignData.startDate,
//      endDate: campaignData.endDate,
//      participants: [user.uid],
//      createdAt: Date.now(),
//    };

//    const docRef = await addDoc(campaignRef, newCampaign);
//    return { id: docRef.id, ...newCampaign };
//  };

// export const getCampaigns = async (limit = 20) => {
//   const campaignsQuery = query(
//     collection(db, "campaigns"),
//     orderBy("createdAt", "desc"),
//     fsLimit(limit)
//   );
  
//   const snapshot = await getDocs(campaignsQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
// };

// export const getCampaign = async (campaignId: string) => {
//   const campaignRef = doc(db, "campaigns", campaignId);
//   const campaignSnap = await getDoc(campaignRef);
  
//   if (campaignSnap.exists()) {
//     return { id: campaignSnap.id, ...campaignSnap.data() } as Campaign;
//   }
//   return null;
// };

// export const joinCampaign = async (campaignId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const campaignRef = doc(db, "campaigns", campaignId);
//   await updateDoc(campaignRef, {
//     participants: arrayUnion(user.uid)
//   });
// };

// export const leaveCampaign = async (campaignId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const campaignRef = doc(db, "campaigns", campaignId);
//   await updateDoc(campaignRef, {
//     participants: arrayRemove(user.uid)
//   });
// };

// // Challenge Functions
// // export const createChallenge = async (challengeData: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate: number; tips?: string[] }) => {
// //   const user = auth.currentUser;
// //   if (!user) throw new Error("No authenticated user");
  
// //   let imageURL = "";
// //   if (challengeData.imageFile) {
// //     const imageRef = ref(storage, `challenge_images/${user.uid}/${Date.now()}`);
// //     await uploadBytes(imageRef, challengeData.imageFile);
// //     imageURL = await getDownloadURL(imageRef);
// //   }
  
// //   const challengeRef = collection(db, "challenges");
// //   const newChallenge: Omit<Challenge, "id"> = {
// //     title: challengeData.title,
// //     description: challengeData.description,
// //     imageURL,
// //     creatorId: user.uid,
// //     creatorName: user.displayName || "Anonymous",
// //     hashtag: challengeData.hashtag,
// //     startDate: challengeData.startDate,
// //     endDate: challengeData.endDate,
// //     participants: [user.uid],
// //     createdAt: Date.now(),
// //     tips: challengeData.tips || []
// //   };
  
// //   const docRef = await addDoc(challengeRef, newChallenge);
// //   return { id: docRef.id, ...newChallenge };
// // };

// export const createChallenge = async (challengeData: {
//   title: string;
//   description: string;
//   base64Image?: string | null;
//   hashtag: string;
//   startDate: number;
//   endDate: number;
//   tips?: string[];
// }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");

//   const challengeRef = collection(db, "challenges");
//   const newChallenge: Omit<Challenge, "id"> = {
//     title: challengeData.title,
//     description: challengeData.description,
//     imageURL: challengeData.base64Image || "",
//     creatorId: user.uid,
//     creatorName: user.displayName || "Anonymous",
//     hashtag: challengeData.hashtag,
//     startDate: challengeData.startDate,
//     endDate: challengeData.endDate,
//     participants: [user.uid],
//     createdAt: Date.now(),
//     tips: challengeData.tips || []
//   };

//   const docRef = await addDoc(challengeRef, newChallenge);
//   return { id: docRef.id, ...newChallenge };
// };


// export const getChallenges = async (limit = 20) => {
//   const challengesQuery = query(
//     collection(db, "challenges"),
//     orderBy("createdAt", "desc"),
//     fsLimit(limit)
//   );
  
//   const snapshot = await getDocs(challengesQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
// };

// export const getChallenge = async (challengeId: string) => {
//   const challengeRef = doc(db, "challenges", challengeId);
//   const challengeSnap = await getDoc(challengeRef);
  
//   if (challengeSnap.exists()) {
//     return { id: challengeSnap.id, ...challengeSnap.data() } as Challenge;
//   }
//   return null;
// };

// export const joinChallenge = async (challengeId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const challengeRef = doc(db, "challenges", challengeId);
//   await updateDoc(challengeRef, {
//     participants: arrayUnion(user.uid)
//   });
// };

// export const leaveChallenge = async (challengeId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const challengeRef = doc(db, "challenges", challengeId);
//   await updateDoc(challengeRef, {
//     participants: arrayRemove(user.uid)
//   });
// };

// // Event Functions
// // export const createEvent = async (eventData: { title: string; description: string; imageFile?: File; location: { address: string; lat?: number; lng?: number }; date: number; endDate?: number }) => {
// //   const user = auth.currentUser;
// //   if (!user) throw new Error("No authenticated user");
  
// //   let imageURL = "";
// //   if (eventData.imageFile) {
// //     const imageRef = ref(storage, `event_images/${user.uid}/${Date.now()}`);
// //     await uploadBytes(imageRef, eventData.imageFile);
// //     imageURL = await getDownloadURL(imageRef);
// //   }
  
// //   const eventRef = collection(db, "events");
// //   const newEvent: Omit<Event, "id"> = {
// //     title: eventData.title,
// //     description: eventData.description,
// //     imageURL,
// //     location: eventData.location,
// //     creatorId: user.uid,
// //     creatorName: user.displayName || "Anonymous",
// //     date: eventData.date,
// //     endDate: eventData.endDate,
// //     attendees: [user.uid],
// //     createdAt: Date.now()
// //   };
  
// //   const docRef = await addDoc(eventRef, newEvent);
// //   return { id: docRef.id, ...newEvent };
// // };

// export const createEvent = async (eventData: {
//   title: string;
//   description: string;
//   base64Image?: string | null;
//   location: { address: string; lat?: number; lng?: number };
//   date: number;
//   endDate?: number;
// }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");

//   const eventRef = collection(db, "events");
//   const newEvent: Omit<Event, "id"> = {
//     title: eventData.title,
//     description: eventData.description,
//     imageURL: eventData.base64Image || "",
//     location: eventData.location,
//     creatorId: user.uid,
//     creatorName: user.displayName || "Anonymous",
//     date: eventData.date,
//     endDate: eventData.endDate,
//     attendees: [user.uid],
//     createdAt: Date.now()
//   };

//   const docRef = await addDoc(eventRef, newEvent);
//   return { id: docRef.id, ...newEvent };
// };


// export const getEvents = async (limit = 20) => {
//   const eventsQuery = query(
//     collection(db, "events"),
//     orderBy("date", "asc"),
//     fsLimit(limit)
//   );
  
//   const snapshot = await getDocs(eventsQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
// };

// export const getEvent = async (eventId: string) => {
//   const eventRef = doc(db, "events", eventId);
//   const eventSnap = await getDoc(eventRef);
  
//   if (eventSnap.exists()) {
//     return { id: eventSnap.id, ...eventSnap.data() } as Event;
//   }
//   return null;
// };

// export const attendEvent = async (eventId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const eventRef = doc(db, "events", eventId);
//   await updateDoc(eventRef, {
//     attendees: arrayUnion(user.uid)
//   });
// };

// export const leaveEvent = async (eventId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const eventRef = doc(db, "events", eventId);
//   await updateDoc(eventRef, {
//     attendees: arrayRemove(user.uid)
//   });
// };

// // Message Functions
// export const sendMessage = async (receiverId: string, content: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const messageRef = collection(db, "messages");
//   const newMessage = {
//     senderId: user.uid,
//     senderName: user.displayName || "Anonymous",
//     receiverId,
//     content,
//     read: false,
//     createdAt: Date.now()
//   };
  
//   const docRef = await addDoc(messageRef, newMessage);
//   return { id: docRef.id, ...newMessage };
// };

// export const getMessages = async (userId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   const messagesQuery = query(
//     collection(db, "messages"),
//     where("senderId", "in", [user.uid, userId]),
//     where("receiverId", "in", [user.uid, userId]),
//     orderBy("createdAt", "asc")
//   );
  
//   const snapshot = await getDocs(messagesQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
// };

// export const markMessageAsRead = async (messageId: string) => {
//   const messageRef = doc(db, "messages", messageId);
//   await updateDoc(messageRef, {
//     read: true
//   });
// };

// // Plastic Detection Functions
// export const createDetection = async (detectionData: { type: string; confidence: string; imageFile?: File }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   let imageUrl = "";
//   if (detectionData.imageFile) {
//     const imageRef = ref(storage, `detection_images/${user.uid}/${Date.now()}`);
//     await uploadBytes(imageRef, detectionData.imageFile);
//     imageUrl = await getDownloadURL(imageRef);
//   }
  
//   const detectionRef = collection(db, "plasticDetections");
//   const newDetection = {
//     userId: user.uid,
//     type: detectionData.type,
//     confidence: detectionData.confidence,
//     imageUrl,
//     date: Date.now(),
//     createdAt: Date.now()
//   };
  
//   const docRef = await addDoc(detectionRef, newDetection);
//   return { id: docRef.id, ...newDetection };
// };

// export const getUserDetections = async (userId: string, limit = 20) => {
//   const user = auth.currentUser;
//   if (!user && !userId) throw new Error("No user specified");
  
//   const targetUserId = userId || user?.uid;
  
//   const detectionsQuery = query(
//     collection(db, "plasticDetections"),
//     where("userId", "==", targetUserId),
//     orderBy("createdAt", "desc"),
//     fsLimit(limit)
//   );
  
//   const snapshot = await getDocs(detectionsQuery);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlasticDetection));
// };

// // Add this new function for searching users by username
// export const searchUsersByUsername = async (username: string) => {
//   const usersRef = collection(db, "users");
//   const q = query(usersRef, where("username", "==", username));
  
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
// };

// // For extracting mentions, update this function to work better with usernames
// const extractMentions = (content: string): string[] => {
//   const mentions = content.match(/@(\w+)/g);
//   return mentions ? mentions.map(mention => mention.slice(1)) : [];
// };

// // Utility functions
// const extractHashtags = (content: string): string[] => {
//   const hashtags = content.match(/#[a-zA-Z0-9_]+/g);
//   return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
// };

import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit as fsLimit, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, serverTimestamp, Timestamp, increment as firestoreIncrement } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "@/lib/firebase";
import { UserProfile, Post, Campaign, Challenge, Event, Message, PlasticDetection, Product, Cart, Order } from "@/types/firestore";

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
 export const createCampaign = async (campaignData: {
   title: string;
   description: string;
   hashtag: string;
   startDate: number;
   endDate?: number;
   base64Image?: string | null; // Accept the Base64 string
 }) => {
   const user = auth.currentUser;
   if (!user) throw new Error("No authenticated user");

   const campaignRef = collection(db, "campaigns");
   const newCampaign: Omit<Campaign, "id"> = {
     title: campaignData.title,
     description: campaignData.description,
     imageURL: campaignData.base64Image || "", // Store the Base64 string as imageURL
     creatorId: user.uid,
     creatorName: user.displayName || "Anonymous",
     hashtag: campaignData.hashtag,
     startDate: campaignData.startDate,
     endDate: campaignData.endDate,
     participants: [user.uid],
     createdAt: Date.now(),
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
// export const createChallenge = async (challengeData: { title: string; description: string; imageFile?: File; hashtag: string; startDate: number; endDate: number; tips?: string[] }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   let imageURL = "";
//   if (challengeData.imageFile) {
//     const imageRef = ref(storage, `challenge_images/${user.uid}/${Date.now()}`);
//     await uploadBytes(imageRef, challengeData.imageFile);
//     imageURL = await getDownloadURL(imageRef);
//   }
  
//   const challengeRef = collection(db, "challenges");
//   const newChallenge: Omit<Challenge, "id"> = {
//     title: challengeData.title,
//     description: challengeData.description,
//     imageURL,
//     creatorId: user.uid,
//     creatorName: user.displayName || "Anonymous",
//     hashtag: challengeData.hashtag,
//     startDate: challengeData.startDate,
//     endDate: challengeData.endDate,
//     participants: [user.uid],
//     createdAt: Date.now(),
//     tips: challengeData.tips || []
//   };
  
//   const docRef = await addDoc(challengeRef, newChallenge);
//   return { id: docRef.id, ...newChallenge };
// };

export const createChallenge = async (challengeData: {
  title: string;
  description: string;
  base64Image?: string | null;
  hashtag: string;
  startDate: number;
  endDate: number;
  tips?: string[];
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const challengeRef = collection(db, "challenges");
  const newChallenge: Omit<Challenge, "id"> = {
    title: challengeData.title,
    description: challengeData.description,
    imageURL: challengeData.base64Image || "",
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
// export const createEvent = async (eventData: { title: string; description: string; imageFile?: File; location: { address: string; lat?: number; lng?: number }; date: number; endDate?: number }) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");
  
//   let imageURL = "";
//   if (eventData.imageFile) {
//     const imageRef = ref(storage, `event_images/${user.uid}/${Date.now()}`);
//     await uploadBytes(imageRef, eventData.imageFile);
//     imageURL = await getDownloadURL(imageRef);
//   }
  
//   const eventRef = collection(db, "events");
//   const newEvent: Omit<Event, "id"> = {
//     title: eventData.title,
//     description: eventData.description,
//     imageURL,
//     location: eventData.location,
//     creatorId: user.uid,
//     creatorName: user.displayName || "Anonymous",
//     date: eventData.date,
//     endDate: eventData.endDate,
//     attendees: [user.uid],
//     createdAt: Date.now()
//   };
  
//   const docRef = await addDoc(eventRef, newEvent);
//   return { id: docRef.id, ...newEvent };
// };

export const createEvent = async (eventData: {
  title: string;
  description: string;
  base64Image?: string | null;
  location: { address: string; lat?: number; lng?: number };
  date: number;
  endDate?: number;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const eventRef = collection(db, "events");
  const newEvent: Omit<Event, "id"> = {
    title: eventData.title,
    description: eventData.description,
    imageURL: eventData.base64Image || "",
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

// Add this new function for searching users by username
export const searchUsersByUsername = async (username: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
};

// For extracting mentions, update this function to work better with usernames
const extractMentions = (content: string): string[] => {
  const mentions = content.match(/@(\w+)/g);
  return mentions ? mentions.map(mention => mention.slice(1)) : [];
};

// Utility functions
const extractHashtags = (content: string): string[] => {
  const hashtags = content.match(/#[a-zA-Z0-9_]+/g);
  return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
};

// Marketplace Functions
export const getProducts = async (limit?: number): Promise<Product[]> => {
  const productsRef = collection(db, "products");
  const productsQuery = limit 
    ? query(productsRef, orderBy("createdAt", "desc"), fsLimit(limit))
    : query(productsRef, orderBy("createdAt", "desc"));
  
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const addToCart = async (productId: string, quantity: number): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const existingCart = cartDoc.data() as Cart;
    const existingItemIndex = existingCart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      existingCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.items.push({ productId, quantity });
    }
    
    await updateDoc(cartRef, {
      items: existingCart.items,
      updatedAt: Date.now()
    });
  } else {
    // Create new cart
    await setDoc(cartRef, {
      id: user.uid,
      userId: user.uid,
      items: [{ productId, quantity }],
      updatedAt: Date.now()
    });
  }
};

export const getCart = async (): Promise<Cart | null> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (!cartDoc.exists()) return null;

  const cart = { id: cartDoc.id, ...cartDoc.data() } as Cart;
  
  // Populate product details for each cart item
  const itemsWithProducts = await Promise.all(
    cart.items.map(async (item) => {
      const productRef = doc(db, "products", item.productId);
      const productDoc = await getDoc(productRef);
      const product = productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } as Product : undefined;
      return { ...item, product };
    })
  );

  return { ...cart, items: itemsWithProducts };
};

export const updateCartItem = async (productId: string, quantity: number): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (!cartDoc.exists()) throw new Error("Cart not found");

  const cart = cartDoc.data() as Cart;
  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity = quantity;
    await updateDoc(cartRef, {
      items: cart.items,
      updatedAt: Date.now()
    });
  }
};

export const removeFromCart = async (productId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (!cartDoc.exists()) throw new Error("Cart not found");

  const cart = cartDoc.data() as Cart;
  cart.items = cart.items.filter(item => item.productId !== productId);
  
  await updateDoc(cartRef, {
    items: cart.items,
    updatedAt: Date.now()
  });
};

export const createOrder = async (orderData: {
  items: {
    productId: string;
    quantity: number;
    price: number;
    product: Product;
  }[];
  total: number;
  shippingInfo: any;
}): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const orderRef = doc(collection(db, "orders"));
  const order: Omit<Order, "id"> = {
    userId: user.uid,
    items: orderData.items,
    total: orderData.total,
    status: "pending",
    createdAt: Date.now()
  };

  await setDoc(orderRef, order);

  // Clear the user's cart
  const cartRef = doc(db, "carts", user.uid);
  await setDoc(cartRef, {
    id: user.uid,
    userId: user.uid,
    items: [],
    updatedAt: Date.now()
  });

  return orderRef.id;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) return null;

  const order = { id: orderDoc.id, ...orderDoc.data() } as Order;
  
  // Only return the order if it belongs to the current user
  if (order.userId !== user.uid) return null;

  return order;
};

// Seed Products Function - Call once to populate the database with mock products
export const seedProducts = async (): Promise<void> => {
  const { mockProducts } = await import("@/data/mockProducts");
  
  for (const product of mockProducts) {
    const productRef = doc(db, "products", product.id);
    const productDoc = await getDoc(productRef);
    
    // Only add if product doesn't exist
    if (!productDoc.exists()) {
      await setDoc(productRef, product);
    }
  }
};