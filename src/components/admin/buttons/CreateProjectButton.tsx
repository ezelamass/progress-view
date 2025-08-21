import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Plus, FolderPlus, ArrowLeft, ArrowRight } from "lucide-react";

// Mock clients data - in real app this would come from props or context
const mockClients = [
  { id: 1, name: "TechStart Solutions" },
  { id: 2, name: "Digital Dynamics" },
  { id: 3, name: "Innovation Labs" },
  { id: 4, name: "Future Systems" },
  { id: 5, name: "Growth Partners" }
];

interface Project {
  id: number;
  name: string;
  client: string;
  clientId: number;
  clientAvatar: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  description: string;
  phases: Array<{
    name: string;
    status: string;
    duration: number;
  }>;
  roiConfig: {
    employeeCount: number;
    hoursPerEmployee: number;
    costPerHour: number;
  };
  currentPhase: string;
}

interface CreateProjectButtonProps {
  onProjectCreated?: (project: Project) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: boolean;
  children?: React.ReactNode;
}

export default function CreateProjectButton({ 
  onProjectCreated, 
  variant = "default", 
  size = "default",
  icon = true,
  children
}: CreateProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState(1);

  const form = useForm({
    defaultValues: {
      name: "",
      clientId: "",
      description: "",
      startDate: "",
      endDate: "",
      phases: [
        { name: "Week 1: Setup & Info Collection", duration: 7 },
        { name: "Week 2-3: Implementation & Development", duration: 14 },
        { name: "Week 4: Testing & Go-Live", duration: 7 }
      ],
      roiConfig: {
        employeeCount: 10,
        hoursPerEmployee: 2,
        costPerHour: 30
      },
      status: "Planning",
      progress: 0
    }
  });

  const calculateROI = (employeeCount: number, hoursPerEmployee: number, costPerHour: number) => {
    const dailyROI = employeeCount * hoursPerEmployee * costPerHour;
    const monthlyROI = dailyROI * 22; // 22 working days per month
    const yearlyROI = monthlyROI * 12;
    const monthlyROIAfterFees = monthlyROI - 1500; // Subtract implementation fee
    
    return {
      daily: dailyROI,
      monthly: monthlyROI,
      yearly: yearlyROI,
      monthlyAfterFees: monthlyROIAfterFees > 0 ? monthlyROIAfterFees : 0
    };
  };

  const handleCreateProject = (values: any) => {
    const client = mockClients.find(c => c.id.toString() === values.clientId);
    
    const newProject: Project = {
      ...values,
      id: Date.now(),
      client: client?.name || "",
      clientAvatar: "/placeholder.jpg",
      currentPhase: values.phases[0].name,
      phases: values.phases.map((phase: any, index: number) => ({
        ...phase,
        status: index === 0 ? "in-progress" : "pending"
      }))
    };
    
    // Call callback if provided
    if (onProjectCreated) {
      onProjectCreated(newProject);
    }

    toast({
      title: "Project Created",
      description: "New project has been created successfully.",
    });

    resetDialog();
  };

  const resetDialog = () => {
    setIsOpen(false);
    setDialogStep(1);
    form.reset();
  };

  const roiValues = form.watch("roiConfig");
  const roi = calculateROI(roiValues.employeeCount, roiValues.hoursPerEmployee, roiValues.costPerHour);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} onClick={() => setDialogStep(1)}>
          {icon && <FolderPlus className="mr-2 h-4 w-4" />}
          {children || "Create Project"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Step {dialogStep} of 3: {
              dialogStep === 1 ? 'Basic Information' :
              dialogStep === 2 ? 'Project Phases' : 'ROI Configuration'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateProject)}>
            {dialogStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockClients.map(client => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter project description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {dialogStep === 2 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Configure project phases and their durations. Default phases based on Client Hub standard workflow.
                </div>
                {form.watch("phases").map((phase: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <FormField
                      control={form.control}
                      name={`phases.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phase {index + 1} Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`phases.${index}.duration`}
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Duration (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}

            {dialogStep === 3 && (
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Configure ROI calculation parameters to estimate monthly savings for the client.
                </div>
                
                <FormField
                  control={form.control}
                  name="roiConfig.employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of employees who will benefit from this automation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roiConfig.hoursPerEmployee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours Saved Per Employee Daily</FormLabel>
                      <FormControl>
                        <div className="px-3">
                          <Slider
                            min={1}
                            max={8}
                            step={0.5}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>1 hour</span>
                            <span className="font-medium">{field.value} hours</span>
                            <span>8 hours</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Average hours of repetitive tasks saved per employee per day
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roiConfig.costPerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Hour Per Employee ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Average hourly cost of employee time (salary + benefits)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ROI Preview */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">ROI Calculation Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Daily Savings</p>
                      <p className="font-bold text-lg">${roi.daily.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Savings</p>
                      <p className="font-bold text-lg">${roi.monthly.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly ROI (after $1,500 fee)</p>
                      <p className="font-bold text-lg text-success">${roi.monthlyAfterFees.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Yearly Savings</p>
                      <p className="font-bold text-lg text-success">${roi.yearly.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogStep(Math.max(1, dialogStep - 1))}
                  disabled={dialogStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {dialogStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setDialogStep(dialogStep + 1)}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">
                    Create Project
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}