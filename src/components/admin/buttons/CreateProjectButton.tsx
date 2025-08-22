import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Plus, FolderPlus, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
  roi_config: {
    employees: number;
    hourlyRate: number;
    hoursSaved: number;
  };
}

interface CreateProjectButtonProps {
  onProjectCreated?: () => void;
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
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);

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
      client_id: "",
      description: "",
      start_date: "",
      end_date: "",
      roiConfig: {
        employees: 10,
        hourlyRate: 50,
        hoursSaved: 2
      },
      status: "active" as const,
      progress_percentage: 0
    }
  });

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

  const handleCreateProject = async (values: any) => {
    // Only allow form submission if we're on step 2
    if (dialogStep !== 2) {
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: values.name,
          client_id: values.client_id,
          description: values.description,
          start_date: values.start_date,
          end_date: values.end_date,
          status: values.status,
          progress_percentage: values.progress_percentage,
          roi_config: values.roiConfig,
          environment: 'production'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: "New project has been created successfully.",
      });

      // Call callback if provided
      if (onProjectCreated) {
        onProjectCreated();
      }

      resetDialog();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setIsOpen(false);
    setDialogStep(1);
    form.reset();
  };

  const roiValues = form.watch("roiConfig");
  const roi = calculateROI(roiValues.employees, roiValues.hoursSaved, roiValues.hourlyRate);

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
            Step {dialogStep} of 2: {
              dialogStep === 1 ? 'Basic Information' : 'ROI Configuration'
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
                  name="client_id"
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
                    name="start_date"
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
                    name="end_date"
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
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Configure ROI calculation parameters to estimate monthly savings for the client.
                </div>
                
                <FormField
                  control={form.control}
                  name="roiConfig.employees"
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
                  name="roiConfig.hoursSaved"
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
                  name="roiConfig.hourlyRate"
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
                  disabled={dialogStep === 1 || loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {dialogStep < 2 ? (
                  <Button
                    type="button"
                    onClick={() => setDialogStep(dialogStep + 1)}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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