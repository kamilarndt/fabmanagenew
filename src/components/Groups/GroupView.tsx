import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";

const { Title } = Typography;

interface GroupViewProps {
  groups?: any[];
  onAddGroup?: () => void;
  onEditGroup?: (group: any) => void;
  onDeleteGroup?: (group: any) => void;
  onTileClick?: (tile: any) => void;
}

export default function GroupView({
  groups = [],
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
}: GroupViewProps) {
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3}>Groups</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddGroup}>
          Add Group
        </Button>
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        {groups.map((group) => (
          <Card
            key={group.id}
            title={group.name}
            extra={
              <Space>
                <Button size="small" onClick={() => onEditGroup?.(group)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => onDeleteGroup?.(group)}
                >
                  Delete
                </Button>
              </Space>
            }
          >
            {group.description && <p>{group.description}</p>}
          </Card>
        ))}
      </Space>
    </div>
  );
}
