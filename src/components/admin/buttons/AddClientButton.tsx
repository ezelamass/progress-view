import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserPlus } from "lucide-react";

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Completed";
  logoUrl?: string;
  projects: number;
  createdAt: string;
}

interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  logoUrl: string;
  status: "Active" | "Inactive";
}

interface AddClientButtonProps {
  onClientAdded?: (client: Client) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: boolean;
  children?: React.ReactNode;
}

export default function AddClientButton({ 
  onClientAdded, 
  variant = "default", 
  size = "default",
  icon = true,
  children
}: AddClientButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    logoUrl: "",
    status: "Active",
  });
  const [errors, setErrors] = useState<Partial<ClientFormData>>({});
  const { toast } = useToast();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = "Contact person is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newClient: Client = {
      id: Date.now(),
      ...formData,
      status: formData.status as "Active" | "Inactive" | "Completed",
      projects: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Call callback if provided
    if (onClientAdded) {
      onClientAdded(newClient);
    }

    toast({
      title: "Client added successfully",
      description: `${formData.company} has been added to your client list.`,
    });

    resetForm();
    setIsOpen(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      logoUrl: "",
      status: "Active",
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} onClick={resetForm}>
          {icon && <UserPlus className="mr-2 h-4 w-4" />}
          {children || "Add New Client"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client profile for your agency.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className={errors.company ? "border-destructive" : ""}
            />
            {errors.company && (
              <p className="text-sm text-destructive">{errors.company}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Contact Person *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={formData.logoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
            {formData.logoUrl && (
              <div className="mt-2">
                <img 
                  src={formData.logoUrl} 
                  alt="Logo preview" 
                  className="h-12 w-12 object-cover rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "Active"}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, status: checked ? "Active" : "Inactive" }))
              }
            />
            <Label htmlFor="status">Active Status</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}