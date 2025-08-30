import { DollarSign, TrendingUp, Calendar, Percent, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProjectWithClient } from "@/hooks/useProjects";
import { useTheme } from "@/contexts/ThemeContext";

interface ROICardProps {
  project?: ProjectWithClient | null;
}

const ROICard = ({ project }: ROICardProps) => {
  const { language } = useTheme();
  if (!project) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {language === 'es' ? 'Visualizador de ROI' : 'ROI Visualizer'}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {language === 'es' ? 'Análisis de rendimiento y retornos' : 'Performance analytics and returns'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📊</div>
              <p className="text-sm text-muted-foreground">
                {language === 'es' ? 'Selecciona un proyecto para ver los datos de ROI' : 'Select a project to view ROI data'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract ROI configuration from project
  const roiConfig = typeof project.roi_config === 'object' && project.roi_config !== null
    ? project.roi_config as { employees: number; hourlyRate: number; hoursSaved: number }
    : { employees: 10, hourlyRate: 50, hoursSaved: 20 };
  const isProjectCompleted = project.status === 'completed';
  const isProductionMode = project.environment === 'production';
  
  // Calculate costs and savings
  const implementationCost = 25000; // This could be stored in project data
  const monthlySavings = roiConfig.employees * roiConfig.hourlyRate * roiConfig.hoursSaved * 4.33; // 4.33 weeks per month
  const dailySavings = monthlySavings / 30;
  const projectStartDate = new Date(project.start_date);
  const currentDate = new Date();
  
  // Calculate days since project started
  const daysSinceStart = Math.floor((currentDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalRecovered = Math.min(dailySavings * daysSinceStart, implementationCost);
  const recoveryPercentage = Math.min((totalRecovered / implementationCost) * 100, 100);
  const isFullyRecovered = recoveryPercentage >= 100;

  // Show ROI data only if project is completed or in production mode
  const showROIData = isProjectCompleted || isProductionMode;

  const annualSavings = monthlySavings * 12;
  const annualROI = ((annualSavings - implementationCost) / implementationCost) * 100;
  const paybackMonths = Math.ceil(implementationCost / monthlySavings);

  const roiMetrics = [
    {
      title: language === 'es' ? "Ahorros Mensuales" : "Monthly Savings",
      value: `$${monthlySavings.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4" />,
      bgColor: "bg-success/10",
      textColor: "text-success",
      iconColor: "text-success"
    },
    {
      title: language === 'es' ? "Ahorros Anuales" : "Annual Savings", 
      value: `$${annualSavings.toLocaleString()}`,
      icon: <TrendingUp className="h-4 w-4" />,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      iconColor: "text-primary"
    },
    {
      title: language === 'es' ? "ROI Anual" : "Annual ROI",
      value: `${annualROI.toFixed(0)}%`,
      icon: <Percent className="h-4 w-4" />,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      iconColor: "text-purple-400"
    },
    {
      title: language === 'es' ? "Período de Recuperación" : "Payback Period",
      value: language === 'es' 
        ? `${paybackMonths} mes${paybackMonths !== 1 ? 'es' : ''}`
        : `${paybackMonths} month${paybackMonths !== 1 ? 's' : ''}`, 
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
            {language === 'es' ? 'Visualizador de ROI' : 'ROI Visualizer'}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {language === 'es' ? 'Análisis de rendimiento y retornos' : 'Performance analytics and returns'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📊</div>
              <p className="text-sm text-muted-foreground">
                {language === 'es' 
                  ? 'Los datos de ROI estarán disponibles una vez que el proyecto esté en producción'
                  : 'ROI data will be available once project is in production'
                }
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
            {language === 'es' ? 'Visualizador de ROI' : 'ROI Visualizer'}
          </CardTitle>
          {isFullyRecovered && (
            <Badge className="bg-success/20 text-success border-success/30">
              <Trophy className="h-3 w-3 mr-1" />
              {language === 'es' ? 'Inversión Recuperada' : 'Investment Recovered'}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {language === 'es' ? 'Análisis de rendimiento y retornos' : 'Performance analytics and returns'}
        </p>
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
              <h4 className="text-sm font-medium text-foreground">
                {language === 'es' ? 'Recuperación de Inversión' : 'Investment Recovery'}
              </h4>
              <span className="text-xs text-muted-foreground">
                ${totalRecovered.toLocaleString()} / ${implementationCost.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={recoveryPercentage} 
              className="h-2 bg-muted"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{language === 'es' ? `Día ${daysSinceStart}` : `Day ${daysSinceStart}`}</span>
              <span>
                {language === 'es' 
                  ? `${recoveryPercentage.toFixed(1)}% recuperado`
                  : `${recoveryPercentage.toFixed(1)}% recovered`
                }
              </span>
            </div>
          </div>

          {/* Net Annual Benefit */}
          <div className="text-center pt-2 border-t border-border/30">
            <div className="text-2xl font-bold text-primary mb-1">
              ${(annualSavings - implementationCost).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'es' ? 'Beneficio Anual Neto' : 'Net Annual Benefit'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'es' 
                ? `Basado en ${roiConfig.employees} empleados, ${roiConfig.hoursSaved}h ahorradas/semana`
                : `Based on ${roiConfig.employees} employees, ${roiConfig.hoursSaved}h saved/week`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICard;