import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../new-ui/atoms/Breadcrumb/Breadcrumb";
import { Button } from "../new-ui/atoms/Button/Button";
import { Card } from "../new-ui/atoms/Card/Card";
import { Empty } from "../new-ui/atoms/Empty/Empty";
import { Icon } from "../new-ui/atoms/Icon/Icon";
import { TabPane, Tabs } from "../new-ui/atoms/Tabs/Tabs";
import { Tag } from "../new-ui/atoms/Tag/Tag";
import { Typography } from "../new-ui/atoms/Typography/Typography";
import {
  Descriptions,
  DescriptionsItem,
} from "../new-ui/molecules/Descriptions/Descriptions";
import { Grid } from "../new-ui/molecules/Grid/Grid";
import { useClientDataStore } from "../stores/clientDataStore";
import { useProjectsStore } from "../stores/projectsStore";
import { useTilesStore } from "../stores/tilesStore";
import type { ProcessedClient } from "../types/clientData.types";

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, loadData, loading } = useClientDataStore();
  const { projects: allProjects } = useProjectsStore();
  const { tiles } = useTilesStore();

  const [client, setClient] = useState<ProcessedClient | null>(null);
  const [activeTab, setActiveTab] = useState<
    "contacts" | "projects" | "invoices"
  >("contacts");

  const handleProjectClick = (projectId: string) => {
    navigate(`/projekt/${projectId}`);
  };

  // Filtruj projekty po kliencie z projectsStore
  const clientProjects = useMemo(() => {
    if (!client) return [];
    return allProjects.filter(
      (project) =>
        project.clientId === client.id || project.client === client.companyName
    );
  }, [allProjects, client]);

  // Oblicz liczby elementów dla każdego projektu
  const projectsWithTileCount = useMemo(() => {
    return clientProjects.map((project) => ({
      ...project,
      elementsCount: tiles.filter((tile) => tile.project === project.id).length,
    }));
  }, [clientProjects, tiles]);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      await loadData();
      const c = getClientById(id);
      if (c) {
        setClient(c);
      }
    };
    run();
  }, [id, getClientById, loadData]);

  if (loading) return null;
  if (!client)
    return (
      <div className="p-6">
        <Empty description="Nie znaleziono klienta" />
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Breadcrumb
          items={[
            { title: "Home" },
            { title: "Klienci", href: "/klienci" },
            { title: client.companyName },
          ]}
        />
      </div>

      <Typography variant="h4" className="mt-0">
        {client.companyName}
      </Typography>

      <Grid.Row gutter={[16, 16]}>
        <Grid.Col xs={24} md={8}>
          <Card className="bg-card">
            <Descriptions title="Dane firmy" column={1}>
              <DescriptionsItem label="NIP">{client.nip}</DescriptionsItem>
              <DescriptionsItem label="REGON">{client.regon}</DescriptionsItem>
              <DescriptionsItem label="Adres">
                {client.address.street} {client.address.houseNumber}
                {client.address.apartmentNumber
                  ? `/${client.address.apartmentNumber}`
                  : ""}
              </DescriptionsItem>
              <DescriptionsItem label="Miasto">
                {client.address.city}
              </DescriptionsItem>
              <DescriptionsItem label="Strona">
                {client.website || "—"}
              </DescriptionsItem>
              <DescriptionsItem label="Email">
                {client.email || "—"}
              </DescriptionsItem>
            </Descriptions>
            {client.description && (
              <Typography variant="p" className="text-gray-500 mt-3">
                {client.description}
              </Typography>
            )}
          </Card>
        </Grid.Col>
        <Grid.Col xs={24} md={16}>
          <Card className="bg-card">
            <Tabs
              activeKey={activeTab}
              onChange={(k) => setActiveTab(k as any)}
            >
              <TabPane key="contacts" tab="Kontakty">
                {client.contacts?.length ? (
                  <Grid.Row gutter={[12, 12]}>
                    {client.contacts.map((c, idx) => (
                      <Grid.Col xs={24} md={12} key={idx}>
                        <Card className="bg-secondary">
                          <Typography variant="strong">
                            {c.imie} {c.nazwisko}
                          </Typography>
                          <div className="text-sm text-gray-500">{c.opis}</div>
                          <div className="text-sm text-gray-500">
                            {c.adres_email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {c.telefon_kontaktowy}
                          </div>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid.Row>
                ) : (
                  <Empty description="Brak kontaktów" />
                )}
              </TabPane>
              <TabPane key="projects" tab="Projekty">
                {projectsWithTileCount?.length ? (
                  <Grid.Row gutter={[12, 12]}>
                    {projectsWithTileCount.map((p) => (
                      <Grid.Col xs={24} key={p.id}>
                        <Card
                          className="bg-secondary cursor-pointer hover:shadow-md transition-all"
                          onClick={() => handleProjectClick(p.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Typography variant="strong">{p.name}</Typography>
                              <div className="text-sm text-gray-500">
                                {p.description}
                              </div>
                              <div className="text-sm text-gray-500">
                                Status:{" "}
                                <Tag
                                  color={
                                    p.status === "completed"
                                      ? "green"
                                      : p.status === "in_progress"
                                        ? "blue"
                                        : "orange"
                                  }
                                >
                                  {p.status}
                                </Tag>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Icon name="eye" className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            Elementy: {p.elementsCount}
                          </div>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid.Row>
                ) : (
                  <Empty description="Brak projektów" />
                )}
              </TabPane>
              <TabPane key="invoices" tab="Faktury">
                <Empty description="Brak faktur" />
              </TabPane>
            </Tabs>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
}
