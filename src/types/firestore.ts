
// // src/types/firestore.ts
// // Add comment type to existing types file

// export interface Comment {
//   authorId: string;
//   authorName: string;
//   authorPhotoURL?: string;
//   content: string;
//   createdAt: number;
// }

// export interface PlasticDetection {
//   id: string;
//   userId: string;
//   type: string;
//   confidence: string;
//   imageUrl: string;
//   date: number;
//   createdAt: number;
// }

// export interface Detection {
//   id: string;
//   userId: string;
//   plasticType: string;
//   detectedItems: string[];
//   confidence: number;
//   timestamp: number | Date;
//   nonPlasticDetected?: boolean;
//   imageDataBase64?: string;
// }

// export interface Post {
//   id: string;
//   authorId: string;
//   authorName: string;
//   authorPhotoURL?: string;
//   content: string;
//   imageURL?: string;
//   hashtags: string[];
//   mentions: string[];
//   likes: number;
//   createdAt: number;
//   campaignId: string | null;
//   challengeId: string | null;
//   comments?: Comment[];
// }

// export interface UserProfile {
//   uid: string;
//   displayName: string;
//   email: string;
//   photoURL?: string;
//   bio?: string;
//   username?: string;
//   createdAt: number;
//   following: string[];
//   followers: string[];
// }

// export interface CampaignData {
//   title: string;
//   description: string;
//   hashtag: string;
//   startDate: Date | undefined;
//   endDate: Date | undefined;
//   base64Image?: string | null; // Optional Base64 image data
//  }

// export interface Campaign {
//   id: string;
//   title: string;
//   description: string;
//   imageURL?: string;
//   creatorId: string;
//   creatorName: string;
//   hashtag: string;
//   startDate: number;
//   endDate?: number;
//   participants: string[];
//   createdAt: number;
// }

// export interface Challenge {
//   id: string;
//   title: string;
//   description: string;
//   imageURL?: string;
//   creatorId: string;
//   creatorName: string;
//   hashtag: string;
//   startDate: number;
//   endDate: number;
//   participants: string[];
//   createdAt: number;
//   tips: string[];
// }

// export interface Event {
//   id: string;
//   title: string;
//   description: string;
//   imageURL?: string;
//   location: {
//     address: string;
//     lat?: number;
//     lng?: number;
//   };
//   creatorId: string;
//   creatorName: string;
//   date: number;
//   endDate?: number;
//   attendees: string[];
//   createdAt: number;
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   senderName: string;
//   receiverId: string;
//   content: string;
//   read: boolean;
//   createdAt: number;
// }


// src/types/firestore.ts
// Add comment type to existing types file

export interface Comment {
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: number;
}

export interface PlasticDetection {
  id: string;
  userId: string;
  type: string;
  confidence: string;
  imageUrl: string;
  date: number;
  createdAt: number;
}

export interface Detection {
  id: string;
  userId: string;
  plasticType: string;
  detectedItems: string[];
  confidence: number;
  timestamp: number | Date;
  nonPlasticDetected?: boolean;
  imageDataBase64?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  imageURL?: string;
  hashtags: string[];
  mentions: string[];
  likes: number;
  createdAt: number;
  campaignId: string | null;
  challengeId: string | null;
  comments?: Comment[];
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  username?: string;
  createdAt: number;
  following: string[];
  followers: string[];
}

export interface CampaignData {
  title: string;
  description: string;
  hashtag: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  base64Image?: string | null; // Optional Base64 image data
 }

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageURL?: string;
  creatorId: string;
  creatorName: string;
  hashtag: string;
  startDate: number;
  endDate?: number;
  participants: string[];
  createdAt: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageURL?: string;
  creatorId: string;
  creatorName: string;
  hashtag: string;
  startDate: number;
  endDate: number;
  participants: string[];
  createdAt: number;
  tips: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageURL?: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  creatorId: string;
  creatorName: string;
  date: number;
  endDate?: number;
  attendees: string[];
  createdAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ecoType: string; // "recycled", "biodegradable", "sustainable", etc.
  imageURL?: string;
  stock: number;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product; // populated when fetching cart
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    product: Product;
  }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: number;
}