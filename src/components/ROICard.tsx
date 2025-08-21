import { TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROICard = () => {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly ROI</CardTitle>
          <div className="flex items-center space-x-1 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">+24%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-success mb-1">$12,450</div>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Based on</span>
              <span className="text-foreground font-medium">45 employees</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hours saved</span>
              <span className="text-foreground font-medium">312 hrs/month</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Calculated from workflow automation and process optimization
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICard;