import ROICard from "@/components/ROICard";
import ProjectProgress from "@/components/ProjectProgress";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";

const Index = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, John
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your project progress and recent updates.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* ROI Card */}
          <ROICard />
          
          {/* Project Progress */}
          <ProjectProgress />
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-card border border-border/50 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold text-foreground">$47,250</p>
            </div>
            <div className="text-success text-sm font-medium">+15.2%</div>
          </div>
        </div>
        
        <div className="bg-gradient-card border border-border/50 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Efficiency Gain</p>
              <p className="text-2xl font-bold text-foreground">78%</p>
            </div>
            <div className="text-success text-sm font-medium">+8.1%</div>
          </div>
        </div>
        
        <div className="bg-gradient-card border border-border/50 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Next Milestone</p>
              <p className="text-2xl font-bold text-foreground">Feb 28</p>
            </div>
            <div className="text-primary text-sm font-medium">12 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;