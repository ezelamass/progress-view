import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePhases } from "@/hooks/usePhases";
import { useProjects } from "@/hooks/useProjects";

interface PhaseFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  phase?: any;
  onPhaseSaved?: () => void;
}

export default function PhaseFormDialog({
  isOpen,
  onOpenChange,
  phase,
  onPhaseSaved,
}: PhaseFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phase_type: "",
    project_id: "",
    start_date: null as Date | null,
    end_date: null as Date | null,
    order_index: 0,
  });

  const [loading, setLoading] = useState(false);
  const { createPhase, updatePhase } = usePhases();
  const { projects } = useProjects();

  useEffect(() => {
    if (phase) {
      setFormData({
        name: phase.name || "",
        description: phase.description || "",
        phase_type: phase.phase_type || "",
        project_id: phase.project_id || "",
        start_date: phase.start_date ? new Date(phase.start_date) : null,
        end_date: phase.end_date ? new Date(phase.end_date) : null,
        order_index: phase.order_index || 0,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        phase_type: "",
        project_id: "",
        start_date: null,
        end_date: null,
        order_index: 0,
      });
    }
  }, [phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phase_type || !formData.project_id || !formData.start_date || !formData.end_date) {
      return;
    }

    setLoading(true);
    try {
      const phaseData = {
        name: formData.name,
        description: formData.description,
        phase_type: formData.phase_type as any,
        project_id: formData.project_id,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0],
        order_index: formData.order_index,
      };

      if (phase) {
        await updatePhase(phase.id, phaseData);
      } else {
        await createPhase(phaseData);
      }

      onPhaseSaved?.();
    } catch (error) {
      console.error("Error saving phase:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {phase ? "Edit Phase" : "Create New Phase"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.project_id}
              onValueChange={(value) => setFormData({ ...formData, project_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Phase Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter phase name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter phase description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phase_type">Phase Type</Label>
            <Select
              value={formData.phase_type}
              onValueChange={(value) => setFormData({ ...formData, phase_type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select phase type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="descubrimiento">Descubrimiento</SelectItem>
                <SelectItem value="desarrollo">Desarrollo</SelectItem>
                <SelectItem value="testing_implementacion">Testing e Implementación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? (
                      format(formData.start_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData({ ...formData, start_date: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? (
                      format(formData.end_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => setFormData({ ...formData, end_date: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Order Index</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : phase ? "Update Phase" : "Create Phase"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}