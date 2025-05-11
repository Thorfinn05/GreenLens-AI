
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Profile from "./pages/Profile";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/profile" element={<Profile />} />
//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Login from "@/pages/Login";
// import Signup from "@/pages/Signup";
// import Profile from "@/pages/Profile";
// import Layout from "@/components/Layout"; // <-- new

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route index element={<Index />} />
//               <Route path="login" element={<Login />} />
//               <Route path="signup" element={<Signup />} />
//               <Route path="profile" element={<Profile />} />
//               <Route path="*" element={<NotFound />} />
//             </Route>
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;


// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { CommunityProvider } from "@/contexts/CommunityContext";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Profile from "./pages/Profile";
// import ProfileSettings from "./pages/ProfileSettings";
// import Layout from "@/components/Layout";
// import Community from "./pages/Community";
// import Campaigns from "./pages/Campaigns";
// import Challenges from "./pages/Challenges";
// import Events from "./pages/Events";
// import HashtagPage from "./pages/HashtagPage";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <CommunityProvider>
//           <BrowserRouter>
//             <Routes>
//               <Route path="/" element={<Layout />}>
//                 <Route index element={<Index />} />
//                 <Route path="login" element={<Login />} />
//                 <Route path="signup" element={<Signup />} />
//                 <Route path="profile" element={<Profile />} />
//                 <Route path="profile/:userId" element={<Profile />} />
//                 <Route path="settings/profile" element={<ProfileSettings />} />
//                 <Route path="community" element={<Community />} />
//                 <Route path="campaigns" element={<Campaigns />} />
//                 <Route path="challenges" element={<Challenges />} />
//                 <Route path="events" element={<Events />} />
//                 <Route path="hashtag/:tag" element={<HashtagPage />} />
//                 <Route path="*" element={<NotFound />} />
//               </Route>
//             </Routes>
//           </BrowserRouter>
//         </CommunityProvider>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Layout from "@/components/Layout";
import Community from "./pages/Community";
import Campaigns from "./pages/Campaigns";
import Challenges from "./pages/Challenges";
import Events from "./pages/Events";
import HashtagPage from "./pages/HashtagPage";
import CreateCampaign from "./pages/CreateCampaign";
import CreateChallenge from "./pages/CreateChallenge";
import CreateEvent from "./pages/CreateEvent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CommunityProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="settings/profile" element={<ProfileSettings />} />
                <Route path="community" element={<Community />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="campaigns/new" element={<CreateCampaign />} />
                <Route path="challenges" element={<Challenges />} />
                <Route path="challenges/new" element={<CreateChallenge />} />
                <Route path="events" element={<Events />} />
                <Route path="events/new" element={<CreateEvent />} />
                <Route path="hashtag/:tag" element={<HashtagPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CommunityProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;