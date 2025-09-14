import { useNavigate } from "react-router-dom";
import { ProjectsView } from "../modules/projects";

export default function ProjectsNew() {
  const navigate = useNavigate();

  const handleViewProject = (project: any) => {
    navigate(`/projekt/${project.id}`);
  };

  const handleEditProject = (project: any) => {
    // Open edit modal or navigate to edit page
    console.log("Edit project:", project);
  };

  const handleAddProject = () => {
    navigate("/projekty/nowy");
  };

  return (
    <ProjectsView
      onViewProject={handleViewProject}
      onEditProject={handleEditProject}
      onAddProject={handleAddProject}
    />
  );
}
