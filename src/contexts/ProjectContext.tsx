import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects, ProjectWithClient } from '@/hooks/useProjects';

interface ProjectContextType {
  selectedProject: ProjectWithClient | null;
  projects: ProjectWithClient[];
  loading: boolean;
  setSelectedProject: (project: ProjectWithClient | null) => void;
  refetch: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  const { projects, loading, refetch } = useProjects();
  const [selectedProject, setSelectedProjectState] = useState<ProjectWithClient | null>(null);

  // Auto-select first project for clients, or use stored selection
  useEffect(() => {
    if (!loading && projects.length > 0 && !selectedProject) {
      const storedProjectId = localStorage.getItem('selectedProjectId');
      
      if (storedProjectId) {
        const storedProject = projects.find(p => p.id === storedProjectId);
        if (storedProject) {
          setSelectedProjectState(storedProject);
          return;
        }
      }
      
      // Default to first project
      setSelectedProjectState(projects[0]);
    }
  }, [loading, projects, selectedProject]);

  // Persist selected project to localStorage
  const setSelectedProject = (project: ProjectWithClient | null) => {
    setSelectedProjectState(project);
    if (project) {
      localStorage.setItem('selectedProjectId', project.id);
    } else {
      localStorage.removeItem('selectedProjectId');
    }
  };

  // Only provide context if user is a client
  if (profile?.role !== 'client') {
    return <>{children}</>;
  }

  return (
    <ProjectContext.Provider value={{
      selectedProject,
      projects,
      loading,
      setSelectedProject,
      refetch,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

// Hook for components that might be used by both admin and client
export const useProjectOptional = () => {
  return useContext(ProjectContext);
};