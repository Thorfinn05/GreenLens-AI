import { Link, Outlet, useNavigate } from "react-router-dom";
import { RecycleIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // redirect to home after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b shadow-sm bg-glass backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/cat.png" alt="Recycle Icon" className="h-7 w-7 animate-float"/>
            <h1 className="text-2xl font-bold text-gradient">GreenLens AI</h1>
          </Link>

          <nav className="flex gap-4 items-center">
            <Link
              to="/profile"
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-eco-green-light text-white hover:bg-eco-green-medium transition duration-200"
            >
              Profile
            </Link>

            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-md text-sm font-medium bg-eco-blue-light text-white hover:bg-eco-blue transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-eco-orange-dark transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            )}

            {/* <span className="bg-eco-gradient text-white px-3 py-1 rounded-full text-xs animate-pulse-subtle">
              Powered by Gemini 2.5
            </span> */}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}