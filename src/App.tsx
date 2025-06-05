
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TopPerformers from "./pages/TopPerformers";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SetupProfile from "./pages/SetupProfile";
import Settings from "./pages/Settings";
import TextArena from "./pages/overview/TextArena";
import WebDevArena from "./pages/overview/WebDevArena";
import VisionArena from "./pages/overview/VisionArena";
import TextToImageArena from "./pages/overview/TextToImageArena";
import SearchArena from "./pages/overview/SearchArena";
import CopilotArena from "./pages/overview/CopilotArena";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/top-performers" element={<TopPerformers />} />
            <Route path="/about" element={<About />} />
            <Route path="/overview/text" element={<TextArena />} />
            <Route path="/overview/webdev" element={<WebDevArena />} />
            <Route path="/overview/vision" element={<VisionArena />} />
            <Route path="/overview/text-to-image" element={<TextToImageArena />} />
            <Route path="/overview/search" element={<SearchArena />} />
            <Route path="/overview/copilot" element={<CopilotArena />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/setup-profile" element={<SetupProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
