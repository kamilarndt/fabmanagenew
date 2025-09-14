import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import OrdersKanban from "../components/Subcontractors/OrdersKanban";
import SubcontractorCard from "../components/Subcontractors/SubcontractorCard";
import SubcontractorProfile from "../components/Subcontractors/SubcontractorProfile";
import { PageHeader } from "../components/shared/PageHeader";
import { useSubcontractorsStore } from "../stores/subcontractorsStore";

const { Search } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

export default function SubcontractorsPage() {
  const {
    initialize,
    getFilteredSubcontractors,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    selectedSubcontractor,
    setSelectedSubcontractor,
  } = useSubcontractorsStore();

  const [activeTab, setActiveTab] = useState("catalog");

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredSubcontractors = getFilteredSubcontractors();

  const handleSubcontractorSelect = (subcontractor: any) => {
    setSelectedSubcontractor(subcontractor);
    setActiveTab("profile");
  };

  return (
    <div className="container-fluid py-3">
      <PageHeader
        title="Podwykonawcy"
        subtitle="Zarządzanie współpracą z zewnętrznymi firmami"
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Katalog Podwykonawców */}
        <TabPane tab="Katalog" key="catalog">
          {/* Filtry i wyszukiwanie */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8}>
                <Search
                  placeholder="Szukaj podwykonawców..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={filters.category}
                  onChange={(value) => setFilters({ category: value })}
                  style={{ width: "100%" }}
                  placeholder="Kategoria"
                >
                  <Select.Option value="All">Wszystkie kategorie</Select.Option>
                  <Select.Option value="Stal">Stal</Select.Option>
                  <Select.Option value="Tworzywa sztuczne">
                    Tworzywa sztuczne
                  </Select.Option>
                  <Select.Option value="Tapicer">Tapicer</Select.Option>
                  <Select.Option value="Szklarz">Szklarz</Select.Option>
                  <Select.Option value="Drukarnia">Drukarnia</Select.Option>
                  <Select.Option value="Inne">Inne</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={filters.status}
                  onChange={(value) => setFilters({ status: value })}
                  style={{ width: "100%" }}
                  placeholder="Status"
                >
                  <Select.Option value="All">Wszystkie statusy</Select.Option>
                  <Select.Option value="Aktywny">Aktywny</Select.Option>
                  <Select.Option value="Nieaktywny">Nieaktywny</Select.Option>
                  <Select.Option value="Zawieszony">Zawieszony</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: "100%" }}
                  placeholder="Sortuj według"
                >
                  <Select.Option value="name">Nazwa</Select.Option>
                  <Select.Option value="rating">Ocena</Select.Option>
                  <Select.Option value="category">Kategoria</Select.Option>
                  <Select.Option value="lastOrder">
                    Ostatnie zlecenie
                  </Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setActiveTab("add")}
                  >
                    Dodaj Podwykonawcę
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Statystyki */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={6}>
              <Card size="small">
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                    {filteredSubcontractors.length}
                  </Title>
                  <div>Wszystkich podwykonawców</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card size="small">
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
                    {
                      filteredSubcontractors.filter(
                        (s) => s.status === "Aktywny"
                      ).length
                    }
                  </Title>
                  <div>Aktywnych</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card size="small">
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ margin: 0, color: "#faad14" }}>
                    {filteredSubcontractors.reduce(
                      (sum, s) => sum + s.currentOrders.length,
                      0
                    )}
                  </Title>
                  <div>Aktualnych zleceń</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card size="small">
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ margin: 0, color: "#722ed1" }}>
                    {filteredSubcontractors.length > 0
                      ? (
                          filteredSubcontractors.reduce(
                            (sum, s) => sum + s.rating,
                            0
                          ) / filteredSubcontractors.length
                        ).toFixed(1)
                      : "0.0"}
                  </Title>
                  <div>Średnia ocena</div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Karty podwykonawców */}
          <Row gutter={[16, 16]}>
            {filteredSubcontractors.map((subcontractor) => (
              <Col key={subcontractor.id} xs={24} sm={12} lg={8} xl={6}>
                <SubcontractorCard
                  subcontractor={subcontractor}
                  onClick={() => handleSubcontractorSelect(subcontractor)}
                />
              </Col>
            ))}
          </Row>

          {filteredSubcontractors.length === 0 && (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <Title level={4} type="secondary">
                Brak podwykonawców
              </Title>
              <p>
                Nie znaleziono podwykonawców spełniających kryteria
                wyszukiwania.
              </p>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setActiveTab("add")}
              >
                Dodaj pierwszego podwykonawcę
              </Button>
            </Card>
          )}
        </TabPane>

        {/* Profil Podwykonawcy */}
        <TabPane tab="Profil" key="profile" disabled={!selectedSubcontractor}>
          {selectedSubcontractor && (
            <SubcontractorProfile
              subcontractor={selectedSubcontractor as any}
            />
          )}
        </TabPane>

        {/* Kanban Zleceń */}
        <TabPane tab="Kanban Zleceń" key="kanban">
          <OrdersKanban />
        </TabPane>
      </Tabs>
    </div>
  );
}
