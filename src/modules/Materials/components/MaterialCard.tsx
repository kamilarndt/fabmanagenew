import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Col, Progress, Row, Tag } from "antd";
import React from "react";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseCard } from "../../../components/shared/BaseCard";
import type { MaterialData } from "../../../data/materialsMockData";
import {
  getMaterialThumbnail,
  getThumbnailStyle,
} from "../../../lib/materialThumbnails";

// Removed Typography to prevent infinite loops

interface MaterialCardProps {
  material: MaterialData;
  onSelect?: (material: MaterialData) => void;
  onQuickOrder?: (material: MaterialData) => void;
  onAddToProject?: (material: MaterialData) => void;
  selected?: boolean;
}

export default function MaterialCard({
  material,
  onSelect,
  onQuickOrder,
  onAddToProject,
}: MaterialCardProps) {
  // Oblicz status stanu magazynowego
  const stockStatus = React.useMemo(() => {
    const ratio = material.stock / material.minStock;
    if (ratio < 0.5)
      return {
        status: "critical",
        color: "#ff4d4f",
        icon: <ExclamationCircleOutlined />,
        label: "Krytyczny",
      };
    if (ratio < 1)
      return {
        status: "low",
        color: "#faad14",
        icon: <WarningOutlined />,
        label: "Niski Stan",
      };
    if (ratio > material.maxStock / material.minStock)
      return {
        status: "excess",
        color: "#1890ff",
        icon: <InfoCircleOutlined />,
        label: "Nadmiar",
      };
    return {
      status: "normal",
      color: "#52c41a",
      icon: <CheckCircleOutlined />,
      label: "OK",
    };
  }, [material.stock, material.minStock, material.maxStock]);

  // Oblicz wartość zapasu
  const stockValue = React.useMemo(() => {
    return material.stock * (material.cena || material.price || 0);
  }, [material.stock, material.cena, material.price]);

  // Oblicz procent zapełnienia
  const stockPercent = React.useMemo(() => {
    const percent = (material.stock / material.maxStock) * 100;
    return Math.min(Math.max(percent, 0), 100);
  }, [material.stock, material.maxStock]);

  // Uzyskaj miniaturę materiału
  const thumbnail = getMaterialThumbnail(material.typ, material.rodzaj);
  const thumbnailStyle = getThumbnailStyle(thumbnail);

  // Konwertuj MaterialData na BaseEntity
  const baseEntity: BaseEntity = {
    id: material.id,
    name: material.typ || material.name,
    description: `${material.rodzaj || material.variant || "Standard"} - ${
      material.grubosc || material.thickness || "N/A"
    }mm`,
    status: stockStatus.status,
    priority:
      stockStatus.status === "critical"
        ? "urgent"
        : stockStatus.status === "low"
        ? "high"
        : "medium",
    assignedTo: material.supplier,
    projectId: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mapowanie kolorów statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "red";
      case "low":
        return "orange";
      case "excess":
        return "blue";
      case "normal":
        return "green";
      default:
        return "default";
    }
  };

  // Mapowanie kolorów priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  // Custom fields dla BaseCard
  const customFields = (
    <div>
      {/* Podgląd Wizualny */}
      <div
        style={{
          ...thumbnailStyle,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          borderBottom: "1px solid var(--border-main)",
          position: "relative",
          marginBottom: 12,
        }}
      >
        <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>
          {thumbnail.icon}
        </span>
        {/* Kod materiału w rogu */}
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 8,
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            padding: "2px 6px",
            borderRadius: 3,
            fontSize: 10,
            fontFamily: "monospace",
          }}
        >
          {material.code}
        </div>
      </div>

      {/* Kluczowe Atrybuty */}
      <div style={{ marginBottom: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
              {material.grubosc || material.thickness + "mm" || "N/A"}
            </Tag>
          </Col>
          <Col>
            <Tag
              color={stockStatus.color}
              style={{
                fontSize: 10,
                margin: 0,
                border: "none",
                color: "#fff",
                backgroundColor: stockStatus.color,
              }}
            >
              {stockStatus.icon} {stockStatus.label}
            </Tag>
          </Col>
        </Row>
      </div>

      {/* Dane Magazynowe i Finansowe */}
      <div style={{ marginBottom: 12 }}>
        <Row gutter={12}>
          <Col span={12}>
            <div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-family)",
                }}
              >
                Dostępne:
              </span>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                {material.stock} / {material.minStock} {material.unit}
              </div>
              <Progress
                percent={stockPercent}
                strokeColor={stockStatus.color}
                size="small"
                showInfo={false}
                style={{ marginTop: 4 }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-family)",
                }}
              >
                Cena / {material.unit}:
              </span>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                {(material.cena || material.price || 0).toLocaleString(
                  "pl-PL",
                  {
                    style: "currency",
                    currency: "PLN",
                    maximumFractionDigits: 0,
                  }
                )}
              </div>
              <div style={{ fontSize: 11, color: "#52c41a", marginTop: 2 }}>
                Wartość:{" "}
                {stockValue.toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Dodatkowe info */}
      <div>
        {material.wielkosc_formatki && (
          <span
            style={{
              fontSize: 10,
              color: "var(--text-secondary)",
              fontFamily: "var(--font-family)",
            }}
          >
            📐 Format: {material.wielkosc_formatki}
          </span>
        )}
        {material.location && (
          <div style={{ marginTop: 2 }}>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-family)",
              }}
            >
              📍 {material.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Akcje dla BaseCard
  const actions = [
    <Button
      key="view"
      type="text"
      size="small"
      icon={<EyeOutlined />}
      onClick={() => onSelect?.(material)}
    >
      Szczegóły
    </Button>,
    ...(stockStatus.status === "critical" || stockStatus.status === "low"
      ? [
          <Button
            key="order"
            type="text"
            size="small"
            danger={stockStatus.status === "critical"}
            icon={<ShoppingCartOutlined />}
            onClick={() => onQuickOrder?.(material)}
          >
            Zamów
          </Button>,
        ]
      : []),
    <Button
      key="add"
      type="text"
      size="small"
      icon={<PlusOutlined />}
      onClick={() => onAddToProject?.(material)}
    >
      Dodaj
    </Button>,
  ];

  // Adaptery do konwersji BaseEntity z powrotem na MaterialData
  const handleView = (_entity: BaseEntity) => {
    onSelect?.(material);
  };

  const handleEdit = (_entity: BaseEntity) => {
    onQuickOrder?.(material);
  };

  const handleDelete = (_entity: BaseEntity) => {
    onAddToProject?.(material);
  };

  return (
    <BaseCard
      entity={baseEntity}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      statusColorMap={getStatusColor}
      priorityColorMap={getPriorityColor}
      customFields={customFields}
      actions={actions}
    />
  );
}

export { MaterialCard };
