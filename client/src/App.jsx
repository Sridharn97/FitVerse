import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FitnessProvider } from "@/contexts/FitnessContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import ProgressPage from "./pages/ProgressPage";
import Diet from "./pages/Diet";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FitnessProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />}/>
              <Route path="/auth" element={<Auth />}/>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/workouts" element={<Workouts />}/>
                <Route path="/progress" element={<ProgressPage />}/>
                <Route path="/diet" element={<Diet />}/>
                <Route path="/community" element={<Community />}/>
                <Route path="/profile" element={<Profile />}/>
              </Route>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </BrowserRouter>
        </FitnessProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
