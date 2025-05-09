
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!currentUser) return null;

  // Get initials for avatar
  const getInitials = () => {
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase();
    }
    return currentUser.email ? currentUser.email[0].toUpperCase() : "U";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-6 mb-8 border-b">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <h1 className="text-2xl font-bold">
            {currentUser.displayName || "User"}
          </h1>
          <p className="text-muted-foreground">{currentUser.email}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}