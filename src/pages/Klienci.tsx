import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddClientDrawer } from "../components/forms/AddClientDrawer";
import { Avatar } from "../new-ui/atoms/Avatar/Avatar";
import { Button } from "../new-ui/atoms/Button/Button";
import { Empty } from "../new-ui/atoms/Empty/Empty";
import { Icon } from "../new-ui/atoms/Icon/Icon";
import { Input } from "../new-ui/atoms/Input/Input";
import { Space } from "../new-ui/atoms/Space/Space";
import { Spin } from "../new-ui/atoms/Spin/Spin";
import { Typography } from "../new-ui/atoms/Typography/Typography";
import { Alert } from "../new-ui/molecules/Alert/Alert";
import { Breadcrumb } from "../new-ui/molecules/Breadcrumb/Breadcrumb";
import { Card } from "../new-ui/molecules/Card/Card";
import { Grid } from "../new-ui/molecules/Grid/Grid";
import { useClientDataStore } from "../stores/clientDataStore";
import type { ProcessedClient } from "../types/clientData.types";

export default function Klienci() {
  const navigate = useNavigate();
  const [isAddClientDrawerOpen, setIsAddClientDrawerOpen] = useState(false);
  const { clients, loading, error, loadData, selectClient } =
    useClientDataStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClientClick = (client: ProcessedClient) => {
    selectClient(client);
    navigate(`/klienci/${client.id}`);
  };

  const handleClientAdded = () => {
    setIsAddClientDrawerOpen(false);
    loadData(); // Refresh the clients list
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
          <Spin size="lg" />
          <Typography.Text variant="secondary">
            Ładowanie klientów...
          </Typography.Text>
        </Space>
      </div>
    );

  if (error)
    return (
      <div style={{ maxWidth: 720, margin: "24px auto" }}>
        <Alert
          variant="error"
          title="Błąd ładowania danych"
          description={error}
          action={<button onClick={loadData}>Spróbuj ponownie</button>}
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
        <Space>
          <Input.Search
            allowClear
            placeholder="Szukaj klienta..."
            className="max-w-lg"
            onSearch={() => {
              /* TODO: wire search */
            }}
          />
          <Button
            variant="primary"
            icon={<Icon name="plus" />}
            onClick={() => setIsAddClientDrawerOpen(true)}
            className="bg-brand-primary border-brand-primary text-white"
          >
            Dodaj klienta
          </Button>
        </Space>
      </div>

      <Typography.Title variant="h4" className="mt-0">
        Lista Klientów
      </Typography.Title>
      <Typography.Paragraph variant="secondary" className="mt-1">
        Zarządzaj swoimi klientami i przeglądaj ich szczegóły
      </Typography.Paragraph>

      {data.length === 0 ? (
        <div style={{ padding: 24 }}>
          <Empty description="Brak klientów" />
        </div>
      ) : (
        <Grid.Row gutter={[16, 16]}>
          {data.map((client: ProcessedClient) => {
            const initials = (client.companyName || "")
              .substring(0, 2)
              .toUpperCase();
            return (
              <Grid.Col key={client.id} xs={24} sm={12} md={12} lg={8} xl={6}>
                <Card
                  hoverable
                  onClick={() => handleClientClick(client)}
                  className="bg-card text-primary"
                >
                  <Space
                    direction="vertical"
                    align="center"
                    className="w-full text-primary"
                  >
                    {client.logoUrl ? (
                      <Avatar
                        shape="square"
                        size={64}
                        src={client.logoUrl}
                        icon={<Icon name="user" />}
                      />
                    ) : (
                      <Avatar
                        shape="square"
                        size={64}
                        icon={<Icon name="user" />}
                      >
                        {initials}
                      </Avatar>
                    )}
                    <Typography.Text strong>
                      {client.companyName}
                    </Typography.Text>
                    <div className="w-full text-secondary text-xs">
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
                        variant="secondary"
                        className="mb-0 text-secondary"
                      >
                        {client.description}
                      </Typography.Paragraph>
                    )}
                  </Space>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid.Row>
      )}

      <AddClientDrawer
        open={isAddClientDrawerOpen}
        onClose={() => setIsAddClientDrawerOpen(false)}
        onSuccess={handleClientAdded}
      />
    </div>
  );
}
