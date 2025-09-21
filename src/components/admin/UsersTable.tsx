import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Shield, Mail, Calendar, UserCheck, UserX } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface User {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'client' | 'team';
  created_at: string;
  updated_at: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onUpdate: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, loading, onUpdate }) => {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const { updateUserRole } = useUsers();
  const { toast } = useToast();

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'client' | 'team') => {
    setUpdatingRole(true);
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
      });
      setEditingUser(null);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user role.",
        variant: "destructive"
      });
    } finally {
      setUpdatingRole(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'team': return 'secondary';
      case 'client': return 'default';
      default: return 'outline';
    }
  };

  const getUserDisplayName = (user: User) => {
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.email;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserX className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No users found</h3>
        <p className="text-muted-foreground">Get started by creating your first user.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{getUserDisplayName(user)}</div>
                      {user.first_name && (
                        <div className="text-sm text-muted-foreground">
                          {user.first_name} {user.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                
                <TableCell>
                  {editingUser === user.id ? (
                    <Select 
                      defaultValue={user.role} 
                      onValueChange={(value: 'admin' | 'client' | 'team') => handleRoleUpdate(user.id, value)}
                      disabled={updatingRole}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(user.created_at), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingUser === user.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(null)}
                        disabled={updatingRole}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={user.role === 'admin'}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Disable User</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will prevent {user.email} from accessing the system. 
                            This action can be reversed later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Disable User</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {users.length} user{users.length !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-4">
          <span>Admin: {users.filter(u => u.role === 'admin').length}</span>
          <span>Team: {users.filter(u => u.role === 'team').length}</span>
          <span>Client: {users.filter(u => u.role === 'client').length}</span>
        </div>
      </div>
    </div>
  );
};