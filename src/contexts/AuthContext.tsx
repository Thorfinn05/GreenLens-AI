// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; // Assuming your Firebase config is here
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider, // Import GoogleAuthProvider
  signInWithPopup, // Import signInWithPopup
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router-dom

interface AuthContextType {
  currentUser: any; // Firebase Auth user
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignup: () => Promise<void>; // New function for Google signup
  googleLogin: () => Promise<void>; // New function for Google login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function signup(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      navigate("/profile");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/profile");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function googleSignup() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Account created",
        description: "Your account has been created successfully with Google.",
      });
      navigate("/profile");
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast({
        title: "Google signup failed",
        description: error instanceof Error ? error.message : "An error occurred during Google signup.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Login successful",
        description: "Logged in successfully with Google.",
      });
      navigate("/profile");
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "An error occurred during Google login.",
        variant: "destructive",
      });
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    googleSignup, // Add to the value
    googleLogin, // Add to the value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}