import {
  Button,
  Descriptions,
  Drawer,
  Input,
  InputNumber,
  Space,
  Table,
  Tabs,
  Tag,
  message,
} from "antd";
import React, { useMemo, useState } from "react";
import type { MaterialItem } from "../../../hooks/useMaterialsQuery";

type Props = {
  open: boolean;
  material?: MaterialItem | null;
  onClose: () => void;
  onSaved?: (next: Partial<MaterialItem>) => void;
};

export default function MaterialDetailDrawer({
  open,
  material,
  onClose,
  onSaved,
}: Props) {
  const [minQty, setMinQty] = useState<number | undefined>(
    material?.min_quantity
  );
  const [maxQty, setMaxQty] = useState<number | undefined>(
    material?.max_quantity
  );
  const [location, setLocation] = useState<string | undefined>(
    material?.location
  );
  const [unitCost, setUnitCost] = useState<number | undefined>(
    material?.unitCost
  );

  React.useEffect(() => {
    setMinQty(material?.min_quantity);
    setMaxQty(material?.max_quantity);
    setLocation(material?.location);
    setUnitCost(material?.unitCost);
  }, [material?.id]);

  const stockStatus = useMemo(() => {
    if (!material) return null;
    const ratio =
      (material.quantity || 0) / Math.max(1, material.min_quantity || 1);
    if (ratio < 0.5) return { label: "Krytyczny", color: "red" as const };
    if (ratio < 1) return { label: "Niski", color: "orange" as const };
    if (material.quantity > (material.max_quantity || Number.MAX_SAFE_INTEGER))
      return { label: "Nadmiar", color: "blue" as const };
    return { label: "W normie", color: "green" as const };
  }, [material]);

  const historyData = useMemo(() => {
    if (!material) return [];
    // Mocked movement history; backend wiring can replace later
    return [
      {
        key: "1",
        type: "Przyjęcie",
        quantity: 10,
        date: new Date().toISOString().slice(0, 10),
        by: "System",
      },
      {
        key: "2",
        type: "Wydanie",
        quantity: -4,
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
        by: "Operator",
      },
    ];
  }, [material]);

  const handleSave = () => {
    // Wire to backend if available; for now optimistic update + toast
    onSaved?.({
      min_quantity: minQty as number,
      max_quantity: maxQty as number,
      location,
      unitCost,
    });
    message.success("Zapisano ustawienia materiału");
    onClose();
  };

  return (
    <Drawer
      title={
        material
          ? `${material.category} • ${material.type || material.name || ""}`
          : "Szczegóły materiału"
      }
      open={open}
      onClose={onClose}
      width={520}
      destroyOnClose
    >
      {!material ? null : (
        <Tabs
          defaultActiveKey="info"
          items={[
            {
              key: "info",
              label: "Informacje",
              children: (
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  style={{ background: "var(--bg-card)" }}
                >
                  <Descriptions.Item label="ID">
                    {material.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kategoria">
                    {material.category}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typ/Nazwa">
                    {material.type || material.name || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jednostka">
                    {material.unit}
                  </Descriptions.Item>
                  <Descriptions.Item label="Grubość">
                    {material.thickness_mm
                      ? `${material.thickness_mm} mm`
                      : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lokalizacja">
                    {material.location || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dostawca">
                    {material.supplier || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cena jedn.">
                    {(material.unitCost || 0).toFixed(2)} PLN / {material.unit}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stan">
                    <Space>
                      <span>
                        {material.quantity} / {material.min_quantity}{" "}
                        {material.unit}
                      </span>
                      {stockStatus && (
                        <Tag color={stockStatus.color}>{stockStatus.label}</Tag>
                      )}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: "history",
              label: "Historia ruchów",
              children: (
                <Table
                  size="small"
                  dataSource={historyData}
                  columns={[
                    { title: "Data", dataIndex: "date" },
                    { title: "Typ", dataIndex: "type" },
                    { title: "Ilość", dataIndex: "quantity" },
                    { title: "Użytkownik", dataIndex: "by" },
                  ]}
                  pagination={false}
                />
              ),
            },
            {
              key: "settings",
              label: "Ustawienia",
              children: (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      Minimalny stan
                    </div>
                    <InputNumber
                      min={0}
                      value={minQty}
                      onChange={(v) => setMinQty(Number(v))}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      Maksymalny stan
                    </div>
                    <InputNumber
                      min={0}
                      value={maxQty}
                      onChange={(v) => setMaxQty(Number(v))}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      Lokalizacja
                    </div>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      Cena jedn. (PLN)
                    </div>
                    <InputNumber
                      min={0}
                      step={0.01}
                      value={unitCost}
                      onChange={(v) => setUnitCost(Number(v))}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <Space>
                    <Button type="primary" onClick={handleSave}>
                      Zapisz
                    </Button>
                    <Button onClick={onClose}>Anuluj</Button>
                  </Space>
                </div>
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
}
