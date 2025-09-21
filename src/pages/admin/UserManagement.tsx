import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Settings } from 'lucide-react';
import { UserCreateForm } from '@/components/admin/UserCreateForm';
import { UsersTable } from '@/components/admin/UsersTable';
import { useUsers } from '@/hooks/useUsers';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const { users, loading, refetch } = useUsers();

  const handleUserCreated = () => {
    refetch();
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage users, assign roles, and control system access.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users List
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Role Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage all users in the system. You can update roles and status here.
              </p>
            </CardHeader>
            <CardContent>
              <UsersTable users={users} loading={loading} onUpdate={refetch} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add a new user to the system with specific role and access permissions.
              </p>
            </CardHeader>
            <CardContent>
              <UserCreateForm onUserCreated={handleUserCreated} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bulk role updates and permission management.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-destructive">Admin</h3>
                    <p className="text-sm text-muted-foreground">Full system access</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {users.filter(u => u.role === 'admin').length} users
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-warning">Team</h3>
                    <p className="text-sm text-muted-foreground">Project management access</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {users.filter(u => u.role === 'team').length} users
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-primary">Client</h3>
                    <p className="text-sm text-muted-foreground">Project view access</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {users.filter(u => u.role === 'client').length} users
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}