import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit,
  Trash2,
  Filter,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const mockClients: Client[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechStart Solutions",
    email: "sarah@techstart.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    logoUrl: "",
    projects: 2,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Digital Dynamics",
    email: "michael@digitaldyn.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    logoUrl: "",
    projects: 1,
    createdAt: "2023-12-08",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Innovation Labs",
    email: "emily@innovlabs.com",
    phone: "+1 (555) 456-7890",
    status: "Completed",
    logoUrl: "",
    projects: 3,
    createdAt: "2023-10-22",
  },
  {
    id: 4,
    name: "David Kim",
    company: "Future Systems",
    email: "david@futuresys.com",
    phone: "+1 (555) 321-0987",
    status: "Inactive",
    logoUrl: "",
    projects: 1,
    createdAt: "2023-11-30",
  },
];

interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  logoUrl: string;
  status: "Active" | "Inactive";
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
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

  // Filter clients based on search and status
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    
    if (editingClient) {
      // Update existing client
      setClients(prev => prev.map(client => 
        client.id === editingClient.id 
          ? { 
              ...client, 
              ...formData,
              status: formData.status as "Active" | "Inactive" | "Completed"
            }
          : client
      ));
      toast({
        title: "Client updated successfully",
        description: `${formData.company} has been updated.`,
      });
      setIsEditDialogOpen(false);
    } else {
      // Add new client
      const newClient: Client = {
        id: Date.now(),
        ...formData,
        status: formData.status as "Active" | "Inactive" | "Completed",
        projects: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [...prev, newClient]);
      toast({
        title: "Client added successfully",
        description: `${formData.company} has been added to your client list.`,
      });
      setIsAddDialogOpen(false);
    }
    
    resetForm();
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
    setEditingClient(null);
  };

  // Handle edit
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      logoUrl: client.logoUrl || "",
      status: client.status === "Completed" ? "Active" : client.status,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (clientId: number) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    toast({
      title: "Client deleted",
      description: "The client has been removed from your list.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">
            Manage your agency's client relationships and projects
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client profile for your agency.
              </DialogDescription>
            </DialogHeader>
            <ClientForm 
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search clients by name, company, or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== "All") && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.logoUrl} alt={client.company} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {client.company.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{client.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          client.status === 'Active' ? 'default' :
                          client.status === 'Completed' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.projects}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background">
                          <DropdownMenuItem onClick={() => handleEdit(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {client.company}? 
                                  This client has {client.projects} associated project{client.projects !== 1 ? 's' : ''}. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(client.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No clients found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Active Clients</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {clients.filter(c => c.status === 'Active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Total Clients</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Total Projects</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {clients.reduce((sum, client) => sum + client.projects, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {clients.filter(c => c.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update the client information.
            </DialogDescription>
          </DialogHeader>
          <ClientForm 
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Client Form Component
interface ClientFormProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
  errors: Partial<ClientFormData>;
}

function ClientForm({ formData, setFormData, errors }: ClientFormProps) {
  return (
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
  );
}