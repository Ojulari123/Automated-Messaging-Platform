import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import RegistrationPage from "./pages/public/Registration";
import PendingPage from "./pages/public/Pending";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PendingMembers from "./pages/admin/PendingMembers";
import MembersList from "./pages/admin/MembersList";
import MemberDetail from "./pages/admin/MemberDetail";
import Templates from "./pages/admin/Templates";
import Settings from "./pages/admin/Settings";
import MessageLogs from "./pages/admin/MessageLogs";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/join/:inviteToken" element={<RegistrationPage />} />
          <Route path="/join/pending" element={<PendingPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/pending" element={<ProtectedRoute><PendingMembers /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute><MembersList /></ProtectedRoute>} />
          <Route path="/admin/members/:id" element={<ProtectedRoute><MemberDetail /></ProtectedRoute>} />
          <Route path="/admin/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><MessageLogs /></ProtectedRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
