import { Card, Typography } from "antd";

const { Title } = Typography;

interface ProjectGanttChartProps {
  project?: any;
  tasks?: any[];
  onUpdate?: (values: any) => void;
  projectId?: string;
}

export default function ProjectGanttChart({}: ProjectGanttChartProps) {
  return (
    <Card>
      <Title level={4}>Project Timeline</Title>
      <div
        style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text type="secondary">
          Gantt Chart will be implemented here
        </Typography.Text>
      </div>
    </Card>
  );
}
