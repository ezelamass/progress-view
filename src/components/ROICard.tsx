import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const ROICard = () => {
  const chartData = [
    { month: 'Sep', value: 8200 },
    { month: 'Oct', value: 11800 },
    { month: 'Nov', value: 15420 },
  ];

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            ROI Visualizer
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">Money saved and accumulated returns</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={false}
                  fill="url(#colorGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">$15,420</div>
              <p className="text-xs text-muted-foreground">Saved This Month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">$89,750</div>
              <p className="text-xs text-muted-foreground">Total Accumulated</p>
            </div>
          </div>

          {/* ROI Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success">
              <span className="text-sm font-medium">↗ 23.5% ROI</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICard;