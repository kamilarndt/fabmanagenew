import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";

const { Text, Title } = Typography;

interface SubcontractorCardProps {
  subcontractor: any;
  onView?: (subcontractor: any) => void;
  onEdit?: (subcontractor: any) => void;
  onDelete?: (subcontractor: any) => void;
  onClick?: () => void;
}

export default function SubcontractorCard({
  subcontractor,
  onView,
  onEdit,
  onDelete,
}: SubcontractorCardProps) {
  return (
    <Card
      title={<Title level={4}>{subcontractor.name}</Title>}
      extra={
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView?.(subcontractor)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(subcontractor)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete?.(subcontractor)}
          />
        </Space>
      }
    >
      <div style={{ marginBottom: 8 }}>
        <Tag color="blue">{subcontractor.type}</Tag>
        <Tag color="green">{subcontractor.status}</Tag>
      </div>
      {subcontractor.description && (
        <Text type="secondary">{subcontractor.description}</Text>
      )}
    </Card>
  );
}
