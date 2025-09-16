import { EyeOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Body } from "../components/ui/Typography";
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
      <div style={{ padding: 24 }}>
        <Empty description="Nie znaleziono klienta" />
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
        <Breadcrumb
          items={[
            { title: "Home" },
            { title: "Klienci", href: "/klienci" },
            { title: client.companyName },
          ]}
        />
      </div>

      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {client.companyName}
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered style={{ background: "var(--bg-card)" }}>
            <Descriptions
              title="Dane firmy"
              column={1}
              labelStyle={{ color: "var(--text-secondary)" }}
            >
              <Descriptions.Item label="NIP">{client.nip}</Descriptions.Item>
              <Descriptions.Item label="REGON">
                {client.regon}
              </Descriptions.Item>
              <Descriptions.Item label="Adres">
                {client.address.street} {client.address.houseNumber}
                {client.address.apartmentNumber
                  ? `/${client.address.apartmentNumber}`
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Miasto">
                {client.address.city}
              </Descriptions.Item>
              <Descriptions.Item label="Strona">
                {client.website || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {client.email || "—"}
              </Descriptions.Item>
            </Descriptions>
            {client.description && (
              <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                {client.description}
              </Typography.Paragraph>
            )}
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card bordered style={{ background: "var(--bg-card)" }}>
            <Tabs
              activeKey={activeTab}
              onChange={(k) => setActiveTab(k as any)}
              items={[
                {
                  key: "contacts",
                  label: "Kontakty",
                  children: client.contacts?.length ? (
                    <Row gutter={[12, 12]}>
                      {client.contacts.map((c, idx) => (
                        <Col xs={24} md={12} key={idx}>
                          <Card
                            size="small"
                            bordered
                            style={{ background: "var(--bg-secondary)" }}
                          >
                            <Typography.Text strong>
                              {c.imie} {c.nazwisko}
                            </Typography.Text>
                            <Body color="muted" style={{ fontSize: 12 }}>
                              {c.opis}
                            </Body>
                            <div>{c.adres_email}</div>
                            <div>{c.telefon_kontaktowy}</div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty description="Brak kontaktów" />
                  ),
                },
                {
                  key: "projects",
                  label: "Projekty",
                  children: projectsWithTileCount?.length ? (
                    <Row gutter={[12, 12]}>
                      {projectsWithTileCount.map((p) => (
                        <Col xs={24} key={p.id}>
                          <Card
                            size="small"
                            bordered
                            style={{
                              background: "var(--bg-secondary)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            hoverable
                            onClick={() => handleProjectClick(p.id)}
                            actions={[
                              <Button
                                key="view"
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProjectClick(p.id);
                                }}
                              >
                                Zobacz projekt
                              </Button>,
                            ]}
                          >
                            <Typography.Text strong>{p.name}</Typography.Text>
                            <Body color="muted" style={{ fontSize: 12 }}>
                              <Tag color="var(--primary-main)">
                                Elementy: {p.elementsCount}
                              </Tag>
                              <span style={{ marginLeft: 8 }}>
                                Status: {p.status}
                              </span>
                              {p.deadline && (
                                <span style={{ marginLeft: 8 }}>
                                  Deadline:{" "}
                                  {new Date(p.deadline).toLocaleDateString(
                                    "pl-PL"
                                  )}
                                </span>
                              )}
                            </Body>
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: "var(--text-secondary)",
                              }}
                            >
                              {p.typ} • Postęp: {p.postep}%
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty description="Brak projektów" />
                  ),
                },
                {
                  key: "invoices",
                  label: "Faktury",
                  children: (
                    <Empty description="Moduł faktur w przygotowaniu" />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
