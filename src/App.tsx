import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import DashboardHeader from "./components/DashboardHeader";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider } from "./hooks/useAuth";
import { ProjectProvider } from "./contexts/ProjectContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Payments from "./pages/Payments";
import Help from "./pages/Help";
import Deliverables from "./pages/Deliverables";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientManagement from "./pages/admin/ClientManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import DeliverableManagement from "./pages/admin/DeliverableManagement";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Show header on main app routes (but not admin routes)
  const showHeader = ['/', '/calendar', '/deliverables', '/help'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <DashboardHeader />}
      <main>
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
            <AuthProvider>
              <ProjectProvider>
                <Routes>
                  {/* Auth Route - No protection needed */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Client Routes - Protected for client role */}
                  <Route path="/" element={
                    <ProtectedRoute requiredRole="client">
                      <MainLayout><Index /></MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute requiredRole="client">
                      <MainLayout><Calendar /></MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/deliverables" element={
                    <ProtectedRoute requiredRole="client">
                      <MainLayout><Deliverables /></MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/payments" element={
                    <ProtectedRoute requiredRole="client">
                      <MainLayout><Payments /></MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/help" element={
                    <ProtectedRoute requiredRole="client">
                      <MainLayout><Help /></MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes - Protected for admin role */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="clients" element={<ClientManagement />} />
                    <Route path="projects" element={<ProjectManagement />} />
                    <Route path="deliverables" element={<DeliverableManagement />} />
                    <Route path="payments" element={<PaymentManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProjectProvider>
            </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
