export interface Deliverable {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliverableFormData {
  projectId: string;
  name: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    projectId: 'proj-1',
    projectName: 'TechStart Solutions - CRM Implementation',
    name: 'User Requirements Analysis',
    description: 'Complete analysis of user requirements and system specifications',
    dueDate: '2024-01-15',
    status: 'completed',
    priority: 'high',
    assignedTo: 'John Smith',
    completedAt: '2024-01-12',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
  },
  {
    id: '2',
    projectId: 'proj-1',
    projectName: 'TechStart Solutions - CRM Implementation',
    name: 'System Architecture Design',
    description: 'Design system architecture and create technical documentation',
    dueDate: '2024-01-25',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    projectId: 'proj-1',
    projectName: 'TechStart Solutions - CRM Implementation',
    name: 'Database Setup',
    description: 'Configure database and implement initial data structure',
    dueDate: '2024-02-01',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Mike Davis',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    projectId: 'proj-1',
    projectName: 'TechStart Solutions - CRM Implementation',
    name: 'User Training Materials',
    description: 'Create comprehensive training materials and user guides',
    dueDate: '2024-01-20',
    status: 'overdue',
    priority: 'medium',
    assignedTo: 'Emma Wilson',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    projectId: 'proj-2',
    projectName: 'Retail Plus - Inventory System',
    name: 'API Development',
    description: 'Develop REST API for inventory management system',
    dueDate: '2024-02-10',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Alex Chen',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '6',
    projectId: 'proj-2',
    projectName: 'Retail Plus - Inventory System',
    name: 'Frontend Interface',
    description: 'Build responsive frontend interface for inventory management',
    dueDate: '2024-02-20',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Lisa Park',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];