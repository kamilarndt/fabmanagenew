import { useState } from "react";
import { ProjectForm } from "../../../components/shared/BaseForm";
import { useProjectsStore } from "../../../stores/projectsStore";

type Props = {
  open: boolean;
  projectId: string | null;
  onClose: () => void;
};

export default function EditProjectModal({ open, projectId, onClose }: Props) {
  const { projects, update } = useProjectsStore();
  const project = projects.find((p) => p.id === projectId);
  const [loading, setLoading] = useState(false);

  if (!open || !project) return null;

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await update(project.id, values);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error; // Re-throw to let BaseForm handle the error display
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectForm
      project={project}
      open={open}
      onClose={onClose}
      onSave={handleSave}
      loading={loading}
    />
  );
}
