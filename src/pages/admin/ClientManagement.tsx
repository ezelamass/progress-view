import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone,
  Calendar,
  DollarSign,
  Building
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clients = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechStart Solutions",
    email: "sarah@techstart.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    projects: 2,
    totalRevenue: "$24,500",
    lastContact: "2 days ago",
    joinDate: "Jan 15, 2024",
    avatar: "/client-1.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Digital Dynamics",
    email: "michael@digitaldyn.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    projects: 1,
    totalRevenue: "$15,750",
    lastContact: "1 week ago",
    joinDate: "Dec 8, 2023",
    avatar: "/client-2.jpg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Innovation Labs",
    email: "emily@innovlabs.com",
    phone: "+1 (555) 456-7890",
    status: "Completed",
    projects: 3,
    totalRevenue: "$45,200",
    lastContact: "3 days ago",
    joinDate: "Oct 22, 2023",
    avatar: "/client-3.jpg",
  },
  {
    id: 4,
    name: "David Kim",
    company: "Future Systems",
    email: "david@futuresys.com",
    phone: "+1 (555) 321-0987",
    status: "On Hold",
    projects: 1,
    totalRevenue: "$8,900",
    lastContact: "2 weeks ago",
    joinDate: "Nov 30, 2023",
    avatar: "/client-4.jpg",
  },
];

export default function ClientManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">
            Manage your agency's client relationships and projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search clients by name, company, or email..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="bg-gradient-card hover:shadow-hover transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-foreground">{client.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Building className="h-3 w-3 mr-1" />
                      {client.company}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Client</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Archive Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge 
                variant={
                  client.status === 'Active' ? 'default' :
                  client.status === 'Completed' ? 'secondary' :
                  'destructive'
                }
                className="w-fit"
              >
                {client.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 mr-2" />
                  {client.phone}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{client.projects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-success">{client.totalRevenue}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>Joined {client.joinDate}</span>
                <span>Last contact: {client.lastContact}</span>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Active Clients</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">16</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">$94,350</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Avg Project Value</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">$15,725</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Retention Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">94%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}