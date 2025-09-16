import { UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClientDataStore } from "../stores/clientDataStore";

export default function Klienci() {
  const navigate = useNavigate();
  const { clients, loading, error, loadData, selectClient } =
    useClientDataStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClientClick = (client: any) => {
    selectClient(client);
    navigate(`/klienci/${client.id}`);
  };

  const data = useMemo(() => clients || [], [clients]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Typography.Text type="secondary">
            Ładowanie klientów...
          </Typography.Text>
        </Space>
      </div>
    );

  if (error)
    return (
      <div style={{ maxWidth: 720, margin: "24px auto" }}>
        <Alert
          type="error"
          showIcon
          message="Błąd ładowania danych"
          description={error}
          action={<a onClick={loadData}>Spróbuj ponownie</a>}
        />
      </div>
    );

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumb items={[{ title: "Home" }, { title: "Klienci" }]} />
        <Input.Search
          allowClear
          placeholder="Szukaj klienta..."
          style={{ maxWidth: 520 }}
          onSearch={() => {
            /* TODO: wire search */
          }}
        />
      </div>

      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Lista Klientów
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginTop: 4 }}>
        Zarządzaj swoimi klientami i przeglądaj ich szczegóły
      </Typography.Paragraph>

      {data.length === 0 ? (
        <div style={{ padding: 24 }}>
          <Empty description="Brak klientów" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {data.map((client: any) => {
            const initials = (client.companyName || "")
              .substring(0, 2)
              .toUpperCase();
            return (
              <Col key={client.id} xs={24} sm={12} md={12} lg={8} xl={6}>
                <Card
                  hoverable
                  onClick={() => handleClientClick(client)}
                  styles={{
                    body: {
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                    },
                  }}
                >
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%", color: "var(--text-primary)" }}
                  >
                    {client.logoUrl ? (
                      <Avatar
                        shape="square"
                        size={64}
                        src={client.logoUrl}
                        icon={<UserOutlined />}
                      />
                    ) : (
                      <Avatar shape="square" size={64} icon={<UserOutlined />}>
                        {initials}
                      </Avatar>
                    )}
                    <Typography.Text strong>
                      {client.companyName}
                    </Typography.Text>
                    <div
                      style={{
                        width: "100%",
                        color: "var(--text-secondary)",
                        fontSize: 12,
                      }}
                    >
                      <div>
                        <b>NIP:</b> {client.nip}
                      </div>
                      <div>
                        <b>Miasto:</b> {client.address?.city}
                      </div>
                      <div>
                        <b>Kontakty:</b> {client.contacts?.length ?? 0}
                      </div>
                    </div>
                    {client.description && (
                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        type="secondary"
                        style={{
                          marginBottom: 0,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {client.description}
                      </Typography.Paragraph>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
