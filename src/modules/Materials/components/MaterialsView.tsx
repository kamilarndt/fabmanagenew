import {
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { useProjectsStore } from "../../../stores/projectsStore";
import { useTilesStore } from "../../../stores/tilesStore";
import type { Tile } from "../../../types/tiles.types";

const { Title, Text } = Typography;
const { Search } = Input;

interface MaterialSummary {
  id: string;
  name: string;
  type: string;
  totalQuantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  status: string;
  projects: string[];
  tiles: string[];
}

interface MaterialsViewProps {
  tiles?: Tile[];
}

export default function MaterialsView({
  tiles: propTiles,
}: MaterialsViewProps) {
  const { tiles: storeTiles } = useTilesStore();
  const { projects } = useProjectsStore();

  const tiles = propTiles || storeTiles;
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Agregacja materiałów ze wszystkich kafelków
  const materialSummary = useMemo(() => {
    const materialMap = new Map<string, MaterialSummary>();

    tiles.forEach((tile) => {
      if (!tile.bom) return;

      tile.bom.forEach((item) => {
        const key = `${item.name}-${item.unit}`;

        if (materialMap.has(key)) {
          const existing = materialMap.get(key)!;
          existing.totalQuantity += item.quantity;
          existing.totalCost += item.quantity * (item.unitCost || 0);
          if (!existing.projects.includes(tile.project || "")) {
            existing.projects.push(tile.project || "");
          }
          if (!existing.tiles.includes(tile.id)) {
            existing.tiles.push(tile.id);
          }
        } else {
          materialMap.set(key, {
            id: item.id,
            name: item.name,
            type: item.type,
            totalQuantity: item.quantity,
            unit: item.unit,
            unitCost: item.unitCost || 0,
            totalCost: item.quantity * (item.unitCost || 0),
            status: item.status || "Nieznany",
            projects: tile.project ? [tile.project] : [],
            tiles: [tile.id],
          });
        }
      });
    });

    return Array.from(materialMap.values());
  }, [tiles]);

  const filteredMaterials = useMemo(() => {
    return materialSummary.filter((material) => {
      const matchesSearch = material.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All" || material.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || material.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [materialSummary, searchQuery, typeFilter, statusFilter]);

  const totalCost = useMemo(() => {
    return filteredMaterials.reduce(
      (sum, material) => sum + material.totalCost,
      0
    );
  }, [filteredMaterials]);

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || projectId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Na stanie":
        return "green";
      case "Do zamówienia":
        return "orange";
      case "Zamówione":
        return "blue";
      case "Dostarczone":
        return "green";
      default:
        return "default";
    }
  };

  const handleExportExcel = () => {
    // Mock export functionality
    console.warn("TODO: Exporting to Excel...", filteredMaterials);
  };

  const handleExportPDF = () => {
    // Mock export functionality
    console.warn("TODO: Exporting to PDF...", filteredMaterials);
  };

  const columns = [
    {
      title: "Materiał",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: MaterialSummary) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: "0.8rem" }}>
            {record.type}
          </Text>
        </div>
      ),
    },
    {
      title: "Ilość",
      dataIndex: "totalQuantity",
      key: "quantity",
      render: (quantity: number, record: MaterialSummary) => (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 500 }}>{quantity.toLocaleString()}</div>
          <Text type="secondary" style={{ fontSize: "0.8rem" }}>
            {record.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Cena jednostkowa",
      dataIndex: "unitCost",
      key: "unitCost",
      render: (cost: number) => (
        <div style={{ textAlign: "right" }}>
          {cost.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
        </div>
      ),
    },
    {
      title: "Wartość całkowita",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: number) => (
        <div style={{ textAlign: "right", fontWeight: 500, color: "#1890ff" }}>
          {cost.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Projekty",
      dataIndex: "projects",
      key: "projects",
      render: (projectIds: string[]) => (
        <div>
          {projectIds.slice(0, 2).map((id) => (
            <Tag key={id} style={{ marginBottom: 2, fontSize: "0.75rem" }}>
              {getProjectName(id)}
            </Tag>
          ))}
          {projectIds.length > 2 && (
            <Tooltip
              title={projectIds
                .slice(2)
                .map((id) => getProjectName(id))
                .join(", ")}
            >
              <Tag style={{ fontSize: "0.75rem" }}>
                +{projectIds.length - 2}
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Kafelki",
      dataIndex: "tiles",
      key: "tiles",
      render: (tileIds: string[]) => (
        <Text type="secondary" style={{ fontSize: "0.8rem" }}>
          {tileIds.length} elementów
        </Text>
      ),
    },
  ];

  return (
    <div>
      {/* Header z filtrami */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Search
              placeholder="Szukaj materiałów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              placeholder="Typ materiału"
            >
              <Select.Option value="All">Wszystkie typy</Select.Option>
              <Select.Option value="Materiał surowy">
                Materiał surowy
              </Select.Option>
              <Select.Option value="Usługa">Usługa</Select.Option>
              <Select.Option value="Komponent">Komponent</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              placeholder="Status"
            >
              <Select.Option value="All">Wszystkie statusy</Select.Option>
              <Select.Option value="Na stanie">Na stanie</Select.Option>
              <Select.Option value="Do zamówienia">Do zamówienia</Select.Option>
              <Select.Option value="Zamówione">Zamówione</Select.Option>
              <Select.Option value="Dostarczone">Dostarczone</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                Eksport Excel
              </Button>
              <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                Eksport PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statystyki */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Łączna wartość"
              value={totalCost}
              precision={2}
              prefix="zł"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Liczba materiałów"
              value={filteredMaterials.length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Do zamówienia"
              value={
                filteredMaterials.filter((m) => m.status === "Do zamówienia")
                  .length
              }
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Na stanie"
              value={
                filteredMaterials.filter((m) => m.status === "Na stanie").length
              }
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabela materiałów */}
      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Zagregowana lista materiałów
        </Title>
        <Table
          columns={columns}
          dataSource={filteredMaterials}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1000 }}
          summary={(pageData) => {
            const total = pageData.reduce(
              (sum, item) => sum + item.totalCost,
              0
            );
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>RAZEM</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3}>
                  <Text strong style={{ color: "#1890ff" }}>
                    {total.toLocaleString("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    })}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
}
