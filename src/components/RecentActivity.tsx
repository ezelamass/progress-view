import { CheckCircle, CreditCard, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActivities } from "@/hooks/useActivities";
import { ProjectWithClient } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  project?: ProjectWithClient | null;
}

const RecentActivity = ({ project }: RecentActivityProps) => {
  const { activities, loading } = useActivities(project?.id, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment_created':
      case 'payment_updated': return CreditCard;
      case 'deliverable_created':
      case 'deliverable_updated': return FileText;
      default: return Clock;
    }
  };

  const getActivityStatus = (type: string) => {
    switch (type) {
      case 'payment_created':
      case 'payment_updated': return 'success';
      case 'deliverable_created':
      case 'deliverable_updated': return 'info';
      default: return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-success/20 text-success border-success/30";
      case "pending": return "bg-warning/20 text-warning border-warning/30";
      case "info": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success": return "Completed";
      case "pending": return "Pending";
      case "info": return "Updated";
      default: return "Active";
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📋</div>
              <p className="text-sm text-muted-foreground">
                No recent activity found
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.activity_type);
              const status = getActivityStatus(activity.activity_type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/20 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ActivityIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {(activity.activity_type === 'payment_created' || activity.activity_type === 'payment_updated') && 'Payment Activity'}
                          {(activity.activity_type === 'deliverable_created' || activity.activity_type === 'deliverable_updated') && 'Deliverable Update'}
                          {(activity.activity_type === 'project_created' || activity.activity_type === 'project_updated') && 'Project Update'}
                          {(activity.activity_type === 'client_created' || activity.activity_type === 'client_updated') && 'Client Update'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs flex-shrink-0 ml-2 ${getStatusColor(status)}`}
                      >
                        {getStatusLabel(status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;