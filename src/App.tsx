import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import DashboardHeader from "./components/DashboardHeader";
import AdminLayout from "./layouts/AdminLayout";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Payments from "./pages/Payments";
import Help from "./pages/Help";
import Deliverables from "./pages/Deliverables";
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
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
          <Route path="/deliverables" element={<MainLayout><Deliverables /></MainLayout>} />
          <Route path="/payments" element={<MainLayout><Payments /></MainLayout>} />
          <Route path="/help" element={<MainLayout><Help /></MainLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
