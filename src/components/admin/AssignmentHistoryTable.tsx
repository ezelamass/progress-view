import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, UserCheck, UserX, Calendar, Building, User } from 'lucide-react';
import { useAssignmentHistory } from '@/hooks/useAssignmentHistory';
import { format } from 'date-fns';

export const AssignmentHistoryTable: React.FC = () => {
  const { history, loading } = useAssignmentHistory();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'team': return 'secondary'; 
      case 'client': return 'default';
      default: return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    return action === 'assigned' ? (
      <UserCheck className="h-4 w-4 text-green-600" />
    ) : (
      <UserX className="h-4 w-4 text-red-600" />
    );
  };

  const getActionBadge = (action: string) => {
    return action === 'assigned' ? (
      <Badge variant="outline" className="text-green-600 border-green-600">
        Assigned
      </Badge>
    ) : (
      <Badge variant="outline" className="text-red-600 border-red-600">
        Unassigned
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Assignment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Assignment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No assignment history</h3>
            <p className="text-muted-foreground">Assignment changes will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Assignment History
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track all user-project assignment changes and activities.
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(record.action)}
                      <span className="capitalize">{record.action}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{record.user_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>{record.user_email}</span>
                          <Badge variant={getRoleBadgeVariant(record.user_role)} className="text-xs">
                            {record.user_role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.project_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {record.client_company}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(record.assigned_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getActionBadge(record.action)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <span>Showing {history.length} assignment record{history.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-4">
            <span>Active: {history.filter(h => h.action === 'assigned').length}</span>
            <span>Total Changes: {history.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};