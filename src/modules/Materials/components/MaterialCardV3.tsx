import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Card, Progress, Space, Tag, Tooltip } from "antd";
import React from "react";
import type { MaterialItem } from "../../../hooks/useMaterialsQuery";
import {
  getMaterialThumbnail,
  getThumbnailStyle,
} from "../../../lib/materialThumbnails";

interface MaterialCardV3Props {
  material: MaterialItem;
  onSelect?: (material: MaterialItem) => void;
  onQuickOrder?: (material: MaterialItem) => void;
  onAddToProject?: (material: MaterialItem) => void;
  selected?: boolean;
}

export const MaterialCardV3: React.FC<MaterialCardV3Props> = React.memo(
  ({ material, onSelect, onQuickOrder, onAddToProject, selected = false }) => {
    // Optymalizowane obliczenia z memoization
    const stockStatus = React.useMemo(() => {
      const ratio = material.quantity / (material.min_quantity || 1);
      if (ratio < 0.5)
        return {
          status: "critical",
          color: "#ff4d4f",
          icon: <ExclamationCircleOutlined />,
          label: "Krytyczny",
          percent: Math.min(ratio * 100, 100),
        };
      if (ratio < 1)
        return {
          status: "low",
          color: "#faad14",
          icon: <WarningOutlined />,
          label: "Niski",
          percent: Math.min(ratio * 100, 100),
        };
      if (ratio > (material.max_quantity || 100) / (material.min_quantity || 1))
        return {
          status: "excess",
          color: "#1890ff",
          icon: <InfoCircleOutlined />,
          label: "Nadmiar",
          percent: 100,
        };
      return {
        status: "normal",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        label: "OK",
        percent: Math.min(ratio * 100, 100),
      };
    }, [material.quantity, material.min_quantity, material.max_quantity]);

    const stockValue = React.useMemo(() => {
      return material.quantity * (material.unitCost || 0);
    }, [material.quantity, material.unitCost]);

    // Przygotuj nazwę główną i dodatkową
    const displayName = React.useMemo(() => {
      const mainName = material.category || "Materiał";
      const subName = material.type || material.name;
      return { mainName, subName };
    }, [material.category, material.type, material.name]);

    // Uzyskaj miniaturę
    const thumbnail = getMaterialThumbnail(material.type, material.category);
    const thumbnailStyle = getThumbnailStyle(thumbnail);

    return (
      <Card
        hoverable
        size="small"
        className={`material-card-v3 ${selected ? "selected" : ""}`}
        style={{
          height: "240px", // Kompaktowa wysokość
          backgroundColor: "var(--bg-card)",
          border: selected
            ? "2px solid var(--primary-main)"
            : "1px solid var(--border-main)",
          borderRadius: "8px",
          transition: "all 0.2s ease",
          overflow: "hidden",
          cursor: "pointer",
          ...(selected && {
            boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
          }),
        }}
        bodyStyle={{ padding: "12px", height: "100%" }}
        onClick={() => onSelect?.(material)}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Nagłówek z miniaturą i nazwą */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#fff",
                flexShrink: 0,
                ...thumbnailStyle,
              }}
            >
              {typeof thumbnail === "string"
                ? thumbnail
                : thumbnail?.icon || "📦"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  lineHeight: "1.2",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName.mainName}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.2",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName.subName}
              </div>
            </div>
          </div>

          {/* Kluczowe dane */}
          <div style={{ flex: 1, marginBottom: "8px" }}>
            {/* Grubość (jeśli dostępna) */}
            {material.thickness_mm && (
              <div style={{ marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "var(--primary-main)",
                  }}
                >
                  {material.thickness_mm}mm
                </span>
              </div>
            )}

            {/* Stan magazynowy */}
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Stan: {material.quantity} / {material.min_quantity}{" "}
                  {material.unit}
                </span>
                <Tag
                  color={stockStatus.color}
                  style={{ margin: 0, fontSize: "10px", padding: "1px 6px" }}
                >
                  {stockStatus.icon} {stockStatus.label}
                </Tag>
              </div>
              <Progress
                percent={stockStatus.percent}
                strokeColor={stockStatus.color}
                showInfo={false}
                size="small"
                style={{ marginBottom: "2px" }}
              />
            </div>

            {/* Cena */}
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {material.unitCost?.toFixed(2) || "0.00"} PLN
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "normal",
                    color: "var(--text-secondary)",
                    marginLeft: "4px",
                  }}
                >
                  / {material.unit}
                </span>
              </div>
              {stockValue > 0 && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Wartość: {stockValue.toFixed(2)} PLN
                </div>
              )}
            </div>

            {/* Lokalizacja */}
            {material.location && (
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                📍 {material.location}
              </div>
            )}
          </div>

          {/* Stopka z akcjami */}
          <div
            style={{
              borderTop: "1px solid var(--border-light)",
              paddingTop: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space size="small">
              <Tooltip title="Szczegóły">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(material);
                  }}
                />
              </Tooltip>

              <Tooltip title="Szybkie zamówienie">
                <Button
                  type="text"
                  size="small"
                  icon={<ShoppingCartOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickOrder?.(material);
                  }}
                />
              </Tooltip>

              <Tooltip title="Dodaj do projektu">
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToProject?.(material);
                  }}
                />
              </Tooltip>
            </Space>

            {/* ID materiału */}
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-tertiary)",
                fontFamily: "monospace",
              }}
            >
              #{material.id.slice(-6)}
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

MaterialCardV3.displayName = "MaterialCardV3";
