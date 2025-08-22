import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import ProjectFormDialog from "../ProjectFormDialog";

interface CreateProjectButtonProps {
  onProjectCreated?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: boolean;
  children?: React.ReactNode;
}

export default function CreateProjectButton({ 
  onProjectCreated, 
  variant = "default", 
  size = "default",
  icon = true,
  children
}: CreateProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsOpen(true)}>
        {icon && <FolderPlus className="mr-2 h-4 w-4" />}
        {children || "Create Project"}
      </Button>
      
      <ProjectFormDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onProjectSaved={onProjectCreated}
        title="Create New Project"
        description="Add a new project to your client hub"
      />
    </>
  );
}