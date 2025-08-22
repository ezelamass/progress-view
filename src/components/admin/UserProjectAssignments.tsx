import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Link } from 'lucide-react';
import { useUserProjectAssignments } from '@/hooks/useUserProjectAssignments';
import { AssignmentForm } from './AssignmentForm';
import { AssignmentsTable } from './AssignmentsTable';

export const UserProjectAssignments: React.FC = () => {
  const {
    assignments,
    users,
    projects,
    loading,
    submitting,
    createAssignment,
    deleteAssignment,
  } = useUserProjectAssignments();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          User-Project Assignments
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage which users have access to specific projects. This controls client dashboard visibility and permissions.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assignment Form */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4" />
            <h3 className="text-lg font-medium">Create New Assignment</h3>
          </div>
          <AssignmentForm
            users={users}
            projects={projects}
            onCreateAssignment={createAssignment}
            submitting={submitting}
          />
        </div>

        <Separator />

        {/* Assignments Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Current Assignments</h3>
            <div className="text-sm text-muted-foreground">
              {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
            </div>
          </div>
          <AssignmentsTable
            assignments={assignments}
            onDeleteAssignment={deleteAssignment}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};