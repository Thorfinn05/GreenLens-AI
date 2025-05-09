
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/ProfileHeader";
import DetectionHistory from "@/components/DetectionHistory";

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ProfileHeader />
      <DetectionHistory />
    </div>
  );
}