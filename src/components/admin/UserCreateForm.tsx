import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, Mail, Lock, Shield } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';

interface UserCreateFormProps {
  onUserCreated: () => void;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'client' as 'admin' | 'client' | 'team'
  });
  const [submitting, setSubmitting] = useState(false);
  const { createUser } = useUsers();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      await createUser(formData);
      toast({
        title: "User Created",
        description: `User ${formData.email} has been created successfully.`,
      });
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'client'
      });
      
      onUserCreated();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create user.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter password (min. 6 characters)"
              minLength={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              User Role *
            </Label>
            <Select value={formData.role} onValueChange={(value: 'admin' | 'client' | 'team') => handleInputChange('role', value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Client - Project view access</span>
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span>Team - Project management access</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <span>Admin - Full system access</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            Create User Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};