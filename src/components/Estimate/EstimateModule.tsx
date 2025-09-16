import { Card, Col, Row, Statistic, Typography } from "antd";

const { Title } = Typography;

interface EstimateModuleProps {
  project?: any;
  onUpdate?: (values: any) => void;
  projectId?: string;
}

export default function EstimateModule({ project }: EstimateModuleProps) {
  return (
    <div>
      <Title level={3}>Project Estimate</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Cost"
              value={project?.budget || 0}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Materials"
              value={project?.materialsCost || 0}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Labor"
              value={project?.laborCost || 0}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Overhead"
              value={project?.overheadCost || 0}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
