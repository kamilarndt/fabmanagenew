import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Typography } from "antd";

const { Title } = Typography;

interface SubcontractorProfileProps {
  subcontractor?: any;
  onEdit?: (subcontractor: any) => void;
}

export default function SubcontractorProfile({
  subcontractor,
  onEdit,
}: SubcontractorProfileProps) {
  if (!subcontractor) {
    return (
      <Card>
        <Typography.Text type="secondary">
          No subcontractor selected
        </Typography.Text>
      </Card>
    );
  }

  return (
    <Card
      title={<Title level={3}>{subcontractor.name}</Title>}
      extra={
        <Button icon={<EditOutlined />} onClick={() => onEdit?.(subcontractor)}>
          Edit
        </Button>
      }
    >
      <Descriptions column={2}>
        <Descriptions.Item label="Type">{subcontractor.type}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {subcontractor.status}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {subcontractor.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {subcontractor.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {subcontractor.address}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {subcontractor.description}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
