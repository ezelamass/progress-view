import { CheckCircle, CreditCard, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentActivity = () => {
  const activities = [
    {
      type: "payment",
      icon: CreditCard,
      title: "Payment Received",
      description: "$5,000 monthly retainer",
      time: "2 hours ago",
      status: "success",
    },
    {
      type: "update",
      icon: FileText,
      title: "Project Update",
      description: "API integration testing completed",
      time: "1 day ago",
      status: "info",
    },
    {
      type: "milestone",
      icon: CheckCircle,
      title: "Milestone Completed",
      description: "Backend development phase finished",
      time: "3 days ago",
      status: "success",
    },
    {
      type: "payment",
      icon: CreditCard,
      title: "Invoice Generated",
      description: "February 2024 billing cycle",
      time: "5 days ago",
      status: "pending",
    },
    {
      type: "update",
      icon: Clock,
      title: "Schedule Update",
      description: "Next review meeting set for Feb 20",
      time: "1 week ago",
      status: "info",
    },
  ];

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
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/20 transition-colors">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs flex-shrink-0 ml-2 ${getStatusColor(activity.status)}`}
                  >
                    {getStatusLabel(activity.status)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;