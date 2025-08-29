import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, CheckCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePhases } from "@/hooks/usePhases";
import { useProjects } from "@/hooks/useProjects";
import PhaseFormDialog from "@/components/admin/PhaseFormDialog";
import { format } from "date-fns";

export default function PhaseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [deletePhase, setDeletePhase] = useState<any>(null);

  const { phases, loading, deletePhase: performDelete, refetch } = usePhases(
    selectedProject === "all" ? undefined : selectedProject
  );
  const { projects } = useProjects();

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

  const handleDeletePhase = async () => {
    if (deletePhase) {
      await performDelete(deletePhase.id);
      setDeletePhase(null);
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phase Management</h1>
          <p className="text-muted-foreground">Manage project phases and their timelines</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Phase
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search phases
              </label>
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Project
              </label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedProject !== "all" 
                    ? "Try adjusting your filters to see more phases."
                    : "Get started by creating your first phase."
                  }
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Phase
                </Button>
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
                        {getProjectName(phase.project_id)}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPhase(phase)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletePhase(phase)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      {/* Create/Edit Phase Dialog */}
      <PhaseFormDialog
        isOpen={isCreateDialogOpen || !!editingPhase}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingPhase(null);
          }
        }}
        phase={editingPhase}
        onPhaseSaved={() => {
          setIsCreateDialogOpen(false);
          setEditingPhase(null);
          refetch();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePhase} onOpenChange={() => setDeletePhase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Phase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete the phase "{deletePhase?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeletePhase(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePhase}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}