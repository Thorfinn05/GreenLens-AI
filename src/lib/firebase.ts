
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAs3iszGjqThZYKWILC8DLXBR3c2F5j-zs",
  authDomain: "greenlens-ai-bd442.firebaseapp.com",
  projectId: "greenlens-ai-bd442",
  storageBucket: "greenlens-ai-bd442.appspot.com",
  messagingSenderId: "1045452202792",
  appId: "1:1045452202792:web:e11309e8c94218bbbda61d",
  measurementId: "G-DNLX2F101G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
