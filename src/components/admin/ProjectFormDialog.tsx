import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Loader2, TestTube, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  company: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  client_id: string;
  status: string;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  description: string;
  drive_folder_url?: string;
  environment: string;
  roi_config: {
    employees: number;
    hourlyRate: number;
    hoursSaved: number;
  };
}

interface ProjectFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onProjectSaved?: () => void;
  title: string;
  description: string;
}

export default function ProjectFormDialog({
  isOpen,
  onOpenChange,
  project,
  onProjectSaved,
  title,
  description
}: ProjectFormDialogProps) {
  const [dialogStep, setDialogStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);

  const isEditing = !!project;

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, company, name, email')
          .eq('status', 'active')
          .order('company', { ascending: true });

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetchingClients(false);
      }
    };

    fetchClients();
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      clientId: "",
      description: "",
      startDate: "",
      endDate: "",
      driveFolderUrl: "",
      environment: "production",
      status: "active",
      progress: 0,
      roiConfig: {
        employeeCount: 10,
        hoursPerEmployee: 2,
        costPerHour: 50
      }
    }
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (project && isOpen) {
      form.reset({
        name: project.name || "",
        clientId: project.client_id || "",
        description: project.description || "",
        startDate: project.start_date || "",
        endDate: project.end_date || "",
        driveFolderUrl: project.drive_folder_url || "",
        environment: project.environment || "production",
        status: project.status || "active",
        progress: project.progress_percentage || 0,
        roiConfig: {
          employeeCount: project.roi_config?.employees || 10,
          hoursPerEmployee: project.roi_config?.hoursSaved || 2,
          costPerHour: project.roi_config?.hourlyRate || 50
        }
      });
    }
  }, [project, isOpen, form]);

  const calculateROI = (employees: number, hoursSaved: number, hourlyRate: number) => {
    const dailyROI = employees * hoursSaved * hourlyRate;
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

  const handleFormSubmit = async (values: any) => {
    // Only allow form submission if we're on step 2 
    if (dialogStep !== 2) {
      return;
    }
    
    // Validate required fields
    if (!values.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.clientId) {
      toast({
        title: "Validation Error", 
        description: "Client selection is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.startDate) {
      toast({
        title: "Validation Error",
        description: "Start date is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.endDate) {
      toast({
        title: "Validation Error",
        description: "End date is required.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const projectData = {
        name: values.name.trim(),
        client_id: values.clientId,
        description: values.description?.trim() || '',
        start_date: values.startDate,
        end_date: values.endDate,
        drive_folder_url: values.driveFolderUrl?.trim() || null,
        environment: values.environment,
        status: values.status.toLowerCase(), // Fix: ensure lowercase for enum
        progress_percentage: values.progress,
        roi_config: {
          employees: values.roiConfig.employeeCount,
          hourlyRate: values.roiConfig.costPerHour,
          hoursSaved: values.roiConfig.hoursPerEmployee
        }
      };

      if (isEditing) {
        // Only send modified fields for updates
        const dirtyFields = form.formState.dirtyFields;
        const updateData: any = {};
        
        if (dirtyFields.name) updateData.name = projectData.name;
        if (dirtyFields.clientId) updateData.client_id = projectData.client_id;
        if (dirtyFields.description) updateData.description = projectData.description;
        if (dirtyFields.startDate) updateData.start_date = projectData.start_date;
        if (dirtyFields.endDate) updateData.end_date = projectData.end_date;
        if (dirtyFields.driveFolderUrl) updateData.drive_folder_url = projectData.drive_folder_url;
        if (dirtyFields.environment) updateData.environment = projectData.environment;
        if (dirtyFields.status) updateData.status = projectData.status;
        if (dirtyFields.progress) updateData.progress_percentage = projectData.progress_percentage;
        if (dirtyFields.roiConfig) updateData.roi_config = projectData.roi_config;

        const { error } = await supabase
          .from('projects')
          .update(updateData)
          .eq('id', project.id);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        toast({
          title: "Project Updated",
          description: "Project has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        toast({
          title: "Project Created",
          description: "New project has been created successfully.",
        });
      }

      if (onProjectSaved) {
        onProjectSaved();
      }

      resetDialog();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} project. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    onOpenChange(false);
    setDialogStep(1);
    if (!isEditing) {
      form.reset();
    }
  };

  const roiValues = form.watch("roiConfig");
  const roi = calculateROI(roiValues.employeeCount, roiValues.hoursPerEmployee, roiValues.costPerHour);

  const handleStepNavigation = (direction: 'next' | 'prev', e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (direction === 'next' && dialogStep < 2) {
      // Validate step 1 fields before proceeding
      const values = form.getValues();
      
      if (!values.name?.trim()) {
        toast({
          title: "Validation Error",
          description: "Project name is required.",
          variant: "destructive",
        });
        return;
      }
      
      if (!values.clientId) {
        toast({
          title: "Validation Error", 
          description: "Client selection is required.",
          variant: "destructive",
        });
        return;
      }
      
      if (!values.startDate) {
        toast({
          title: "Validation Error",
          description: "Start date is required.",
          variant: "destructive",
        });
        return;
      }
      
      if (!values.endDate) {
        toast({
          title: "Validation Error",
          description: "End date is required.",
          variant: "destructive",
        });
        return;
      }
      
      setDialogStep(dialogStep + 1);
    } else if (direction === 'prev' && dialogStep > 1) {
      setDialogStep(dialogStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Step {dialogStep} of 2: {
              dialogStep === 1 ? 'Basic Information' : 'ROI Configuration'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            // Only allow form submission on step 2
            if (dialogStep === 2) {
              form.handleSubmit(handleFormSubmit)(e);
            }
          }} onKeyDown={(e) => {
            // Prevent Enter key from submitting form on step 1
            if (e.key === 'Enter' && dialogStep === 1) {
              e.preventDefault();
            }
          }}>
            {dialogStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project name" 
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={fetchingClients}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={fetchingClients ? "Loading clients..." : "Select a client"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company} - {client.name}
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
                          <Input 
                            type="date" 
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                          />
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
                          <Input 
                            type="date" 
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="driveFolderUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Drive Folder URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://drive.google.com/drive/folders/..."
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Shared Google Drive folder for project files (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Environment</FormLabel>
                        <FormDescription>
                          Set project to Test (development) or Production (live)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <TestTube className="h-4 w-4 text-warning" />
                          <Switch
                            checked={field.value === "production"}
                            onCheckedChange={(checked) => 
                              field.onChange(checked ? "production" : "test")
                            }
                          />
                          <Globe className="h-4 w-4 text-success" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress Percentage</FormLabel>
                      <FormControl>
                        <div className="px-3">
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>0%</span>
                            <span className="font-medium">{field.value}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {dialogStep === 2 && (
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
                  onClick={(e) => handleStepNavigation('prev', e)}
                  disabled={dialogStep === 1 || loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {dialogStep < 2 ? (
                  <Button
                    type="button"
                    onClick={(e) => handleStepNavigation('next', e)}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Project' : 'Create Project'}
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