import { useState } from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePhases } from "@/hooks/usePhases";
import { useProject } from "@/contexts/ProjectContext";
import { format } from "date-fns";
import ProjectBreadcrumb from "@/components/ProjectBreadcrumb";

export default function TeamPhases() {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedProject } = useProject();
  
  const { phases, loading } = usePhases(selectedProject?.id);

  const filteredPhases = phases.filter(phase => {
    const matchesSearch = phase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phase.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/20 text-success border-success/30";
      case "in_progress": return "bg-primary/20 text-primary border-primary/30";
      case "not_started": return "bg-muted/50 text-muted-foreground border-border";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-3 w-3" />;
      case "in_progress": return <Clock className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const getPhaseTypeLabel = (type: string) => {
    switch (type) {
      case "descubrimiento": return "Descubrimiento";
      case "desarrollo": return "Desarrollo";
      case "testing_implementacion": return "Testing e Implementación";
      default: return type;
    }
  };

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <ProjectBreadcrumb pageName="Phases" />
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Project Selected</h3>
              <p className="text-muted-foreground">
                Please select a project to view phases.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectBreadcrumb pageName="Phases" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Phases</h1>
          <p className="text-muted-foreground">View phases for {selectedProject.name}</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Phases Grid */}
      <div className="grid gap-6">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : filteredPhases.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No phases found</h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "Try adjusting your search to see more phases."
                    : "No phases have been created for this project yet."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPhases.map((phase) => (
              <Card key={phase.id} className="bg-gradient-card border-border/50 shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {getPhaseTypeLabel(phase.phase_type)}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`text-xs flex items-center space-x-1 ${getStatusColor(phase.status)}`}
                    >
                      {getStatusIcon(phase.status)}
                      <span className="capitalize">{phase.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  {phase.description && (
                    <p className="text-sm text-muted-foreground">
                      {phase.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">
                        {format(new Date(phase.start_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Date:</span>
                      <span className="font-medium">
                        {format(new Date(phase.end_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>

                  {phase.deliverables && phase.deliverables.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Deliverables ({phase.deliverables.length})
                      </p>
                      <div className="space-y-1">
                        {phase.deliverables.slice(0, 3).map((deliverable) => (
                          <div key={deliverable.id} className="text-xs text-muted-foreground">
                            • {deliverable.name}
                          </div>
                        ))}
                        {phase.deliverables.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            • And {phase.deliverables.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}