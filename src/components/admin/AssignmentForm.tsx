import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { User, Project } from '@/hooks/useUserProjectAssignments';

interface AssignmentFormProps {
  users: User[];
  projects: Project[];
  onCreateAssignment: (userId: string, projectId: string) => Promise<boolean>;
  submitting: boolean;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  users,
  projects,
  onCreateAssignment,
  submitting,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !selectedProjectId) {
      return;
    }

    const success = await onCreateAssignment(selectedUserId, selectedProjectId);
    if (success) {
      setSelectedUserId('');
      setSelectedProjectId('');
    }
  };

  const getUserDisplayName = (user: User) => {
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    return name ? `${name} (${roleLabel}) - ${user.email}` : `${user.email} (${roleLabel})`;
  };

  const getProjectDisplayName = (project: Project) => {
    return `${project.name} - ${project.clients.company}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="user-select">Select User</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id="user-select">
              <SelectValue placeholder="Choose a user..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.user_id} value={user.user_id}>
                  {getUserDisplayName(user)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-select">Select Project</Label>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger id="project-select">
              <SelectValue placeholder="Choose a project..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {getProjectDisplayName(project)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!selectedUserId || !selectedProjectId || submitting}
        className="w-full md:w-auto"
      >
        {submitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Assign User to Project
      </Button>
    </form>
  );
};