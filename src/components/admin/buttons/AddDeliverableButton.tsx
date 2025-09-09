import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DeliverableFormData } from "@/types/deliverables";

const deliverableFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().optional(),
  is_bonus: z.boolean().default(false),
});

const mockProjects = [
  { id: 'proj-1', name: 'TechStart Solutions - CRM Implementation' },
  { id: 'proj-2', name: 'Retail Plus - Inventory System' },
  { id: 'proj-3', name: 'HealthCorp - Patient Management' },
];

interface AddDeliverableButtonProps {
  onDeliverableAdded?: (deliverable: any) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export default function AddDeliverableButton({
  onDeliverableAdded,
  variant = "default",
  size = "default",
  children = "Add Deliverable"
}: AddDeliverableButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

   const form = useForm<z.infer<typeof deliverableFormSchema>>({
     resolver: zodResolver(deliverableFormSchema),
     defaultValues: {
       projectId: "",
       name: "",
       description: "",
       priority: "medium",
       assignedTo: "",
       is_bonus: false,
     },
   });

  const onSubmit = (values: z.infer<typeof deliverableFormSchema>) => {
    const newDeliverable = {
      id: `del-${Date.now()}`,
      ...values,
      dueDate: values.dueDate.toISOString().split('T')[0],
      status: 'pending' as const,
      projectName: mockProjects.find(p => p.id === values.projectId)?.name || 'Unknown Project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating deliverable:", newDeliverable);
    
    toast({
      title: "Deliverable Created",
      description: `${values.name} has been created successfully.`,
    });

    onDeliverableAdded?.(newDeliverable);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Plus className="mr-2 h-4 w-4" />
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Deliverable</DialogTitle>
          <DialogDescription>
            Create a new deliverable for a project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deliverable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter deliverable name" {...field} />
                  </FormControl>
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
                      placeholder="Enter deliverable description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_bonus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Bonus Deliverable
                    </FormLabel>
                    <FormDescription>
                      Mark this deliverable as a bonus/extra item
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignee name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Deliverable</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}