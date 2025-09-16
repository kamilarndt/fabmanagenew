import { BrandedSidebar, PageLayout } from "../design-system/layouts";
import { ProjectsView } from "../modules/projects/views/ProjectsView";

export function ProjectsPage() {
  return (
    <PageLayout>
      <div style={{ display: "flex", height: "100vh" }}>
        <BrandedSidebar collapsed={false} onCollapse={() => {}} />
        <div style={{ flex: 1, overflow: "hidden", padding: "24px" }}>
          <ProjectsView />
        </div>
      </div>
    </PageLayout>
  );
}
