import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Calendar } from 'lucide-react';
import { UserProjectAssignment } from '@/hooks/useUserProjectAssignments';
import { format } from 'date-fns';

interface AssignmentsTableProps {
  assignments: UserProjectAssignment[];
  onDeleteAssignment: (assignmentId: string) => Promise<void>;
  loading: boolean;
}

export const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  onDeleteAssignment,
  loading,
}) => {
  const getUserDisplayName = (assignment: UserProjectAssignment) => {
    const profile = assignment.profiles;
    const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    return name || profile.email;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading assignments...</span>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium">No assignments found</p>
        <p className="text-sm">Start by assigning users to projects above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">
                {getUserDisplayName(assignment)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assignment.profiles.email}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium">
                  {assignment.projects.name}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assignment.projects.clients.company}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(assignment.assigned_at)}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Assignment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove{' '}
                        <strong>{assignment.profiles.email}</strong> from{' '}
                        <strong>{assignment.projects.name}</strong>?
                        <br />
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => onDeleteAssignment(assignment.id)}
                      >
                        Remove Assignment
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};