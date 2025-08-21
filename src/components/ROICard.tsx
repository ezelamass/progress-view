import { DollarSign, TrendingUp, Calendar, Percent, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ROICard = () => {
  // Mock data - in real app this would come from props or context
  const isProjectCompleted = true; // Mock: project status is "completed"  
  const isProductionMode = false; // Mock: environment toggle
  const implementationCost = 25000; // Mock: total implementation cost
  const dailySavings = 41.06; // Mock: daily savings ($1,232/30 days)
  const projectStartDate = new Date('2024-10-01'); // Mock: project start date
  const currentDate = new Date();
  
  // Calculate days since project started
  const daysSinceStart = Math.floor((currentDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalRecovered = Math.min(dailySavings * daysSinceStart, implementationCost);
  const recoveryPercentage = Math.min((totalRecovered / implementationCost) * 100, 100);
  const isFullyRecovered = recoveryPercentage >= 100;

  // Show ROI data only if project is completed or in production mode
  const showROIData = isProjectCompleted || isProductionMode;

  const roiMetrics = [
    {
      title: "Monthly Savings",
      value: "$1,232",
      icon: <DollarSign className="h-4 w-4" />,
      bgColor: "bg-success/10",
      textColor: "text-success",
      iconColor: "text-success"
    },
    {
      title: "Annual Savings", 
      value: "$14,784",
      icon: <TrendingUp className="h-4 w-4" />,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      iconColor: "text-primary"
    },
    {
      title: "Annual ROI",
      value: "1258%",
      icon: <Percent className="h-4 w-4" />,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      iconColor: "text-purple-400"
    },
    {
      title: "Payback Period",
      value: "1 month", 
      icon: <Calendar className="h-4 w-4" />,
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      iconColor: "text-orange-400"
    }
  ];

  if (!showROIData) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            ROI Visualizer
          </CardTitle>
          <p className="text-xs text-muted-foreground">Performance analytics and returns</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📊</div>
              <p className="text-sm text-muted-foreground">
                ROI data will be available once project is in production
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            ROI Visualizer
          </CardTitle>
          {isFullyRecovered && (
            <Badge className="bg-success/20 text-success border-success/30">
              <Trophy className="h-3 w-3 mr-1" />
              Investment Recovered
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Performance analytics and returns</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ROI Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {roiMetrics.map((metric, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border border-border/30 ${metric.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`${metric.iconColor}`}>
                    {metric.icon}
                  </div>
                </div>
                <div className={`text-lg font-bold ${metric.textColor}`}>
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground">{metric.title}</p>
              </div>
            ))}
          </div>

          {/* Investment Recovery Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Investment Recovery</h4>
              <span className="text-xs text-muted-foreground">
                ${totalRecovered.toLocaleString()} / ${implementationCost.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={recoveryPercentage} 
              className="h-2 bg-muted"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Day {daysSinceStart}</span>
              <span>{recoveryPercentage.toFixed(1)}% recovered</span>
            </div>
          </div>

          {/* Net Annual Benefit */}
          <div className="text-center pt-2 border-t border-border/30">
            <div className="text-2xl font-bold text-primary mb-1">$12,584</div>
            <p className="text-xs text-muted-foreground">
              Net Annual Benefit
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              After implementation and maintenance costs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICard;