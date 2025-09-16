import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";

const { Title } = Typography;

interface OrdersKanbanProps {
  orders?: any[];
  onAddOrder?: () => void;
  onEditOrder?: (order: any) => void;
  onDeleteOrder?: (order: any) => void;
}

export default function OrdersKanban({
  orders = [],
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
}: OrdersKanbanProps) {
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
        <Title level={3}>Orders</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddOrder}>
          Add Order
        </Button>
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        {orders.map((order) => (
          <Card
            key={order.id}
            title={order.name}
            extra={
              <Space>
                <Button size="small" onClick={() => onEditOrder?.(order)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => onDeleteOrder?.(order)}
                >
                  Delete
                </Button>
              </Space>
            }
          >
            {order.description && <p>{order.description}</p>}
          </Card>
        ))}
      </Space>
    </div>
  );
}
