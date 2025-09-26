import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import DashboardHeader from "./components/DashboardHeader";
import AdminLayout from "./layouts/AdminLayout";
import TeamLayout from "./layouts/TeamLayout";
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
import PhaseManagement from "./pages/admin/PhaseManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import TeamPaymentManagement from "./pages/admin/TeamPaymentManagement";
import DeliverableManagement from "./pages/admin/DeliverableManagement";
import MeetingManagement from "./pages/admin/MeetingManagement";
import TeamPaymentRateManagement from "./pages/admin/TeamPaymentRateManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import UserManagement from "./pages/admin/UserManagement";
import AdminCalendar from "./pages/admin/AdminCalendar";
import TeamPayments from "./pages/team/TeamPayments";
import TeamCalendar from "./pages/team/TeamCalendar";
import AdminPageGuard from "./components/AdminPageGuard";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Show header on main app routes (but not admin routes)
  const showHeader = ['/', '/calendar', '/deliverables', '/payments', '/help', '/team/payments', '/team/calendar'].includes(location.pathname);
  
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
                  
                  {/* Client and Team Routes - Protected for client and team roles */}
                  <Route path="/" element={
                    <ProtectedRoute requiredRole={['client', 'team']}>
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
                  
                  {/* Team Routes - Protected for team role with dedicated layout */}
                  <Route path="/team" element={
                    <ProtectedRoute requiredRole="team">
                      <TeamLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<TeamCalendar />} />
                    <Route path="calendar" element={<TeamCalendar />} />
                    <Route path="payments" element={<TeamPayments />} />
                  </Route>
                  
                  <Route path="/help" element={
                    <ProtectedRoute requiredRole={['client', 'team']}>
                      <MainLayout><Help /></MainLayout>
                    </ProtectedRoute>
                  } />
                  
  {/* Admin Routes - Protected for admin and team roles */}
  <Route path="/admin" element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }>
    <Route index element={
      <AdminPageGuard allowedRoles={['admin']}>
        <AdminDashboard />
      </AdminPageGuard>
    } />
    <Route path="users" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <UserManagement />
      </AdminPageGuard>
    } />
    <Route path="clients" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <ClientManagement />
      </AdminPageGuard>
    } />
    <Route path="projects" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <ProjectManagement />
      </AdminPageGuard>
    } />
    <Route path="calendar" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <AdminCalendar />
      </AdminPageGuard>
    } />
    <Route path="phases" element={
      <AdminPageGuard allowedRoles={['admin', 'team']}>
        <PhaseManagement />
      </AdminPageGuard>
    } />
    <Route path="deliverables" element={
      <AdminPageGuard allowedRoles={['admin', 'team']}>
        <DeliverableManagement />
      </AdminPageGuard>
    } />
    <Route path="payments" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <PaymentManagement />
      </AdminPageGuard>
    } />
    <Route path="team-payments" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <TeamPaymentManagement />
      </AdminPageGuard>
    } />
    <Route path="team-rates" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <TeamPaymentRateManagement />
      </AdminPageGuard>
    } />
    <Route path="meetings" element={
      <AdminPageGuard allowedRoles={['admin', 'team']}>
        <MeetingManagement />
      </AdminPageGuard>
    } />
    <Route path="settings" element={
      <AdminPageGuard allowedRoles={['admin']}>
        <AdminSettings />
      </AdminPageGuard>
    } />
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
