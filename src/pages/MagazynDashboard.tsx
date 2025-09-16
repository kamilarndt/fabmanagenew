import {
  Button,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
} from "antd";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/PageHeader";
import { Toolbar } from "../components/ui/Toolbar";
import { Body } from "../components/ui/Typography";
import { useMaterialsStore } from "../stores/materialsStore";

interface StatusBuckets {
  critical: number;
  low: number;
  normal: number;
  excess: number;
}

export default function MagazynDashboard() {
  const navigate = useNavigate();
  const materials = useMaterialsStore((s) => s.materials);
  const syncFromBackend = useMaterialsStore((s) => s.syncFromBackend);

  // Initialize materials data
  useEffect(() => {
    if (materials.length === 0) {
      syncFromBackend();
    }
  }, [materials.length, syncFromBackend]);

  const { totalItems, totalValue, alerts, buckets } = useMemo(() => {
    let value = 0;
    const alertsLocal: {
      id: string;
      name: string;
      stock: number;
      minStock: number;
      unit?: string;
    }[] = [];
    const b: StatusBuckets = { critical: 0, low: 0, normal: 0, excess: 0 };

    for (const m of materials) {
      const price = Number((m as any).price || 0);
      const stock = Number((m as any).stock || 0);
      const minStock = Number((m as any).minStock || 0);
      const maxStock = Number((m as any).maxStock || minStock * 2);
      value += price * stock;

      if (stock <= minStock) {
        b.critical++;
        alertsLocal.push({
          id: (m as any).id,
          name: (m as any).name,
          stock,
          minStock,
          unit: (m as any).unit,
        });
      } else if (stock > maxStock) {
        b.excess++;
      } else {
        // Treat the lower 25% of the normal band as "low"
        const lowThreshold = minStock + (maxStock - minStock) * 0.25;
        if (stock <= lowThreshold) {
          b.low++;
        } else {
          b.normal++;
        }
      }
    }

    alertsLocal.sort((a, b) => a.stock - b.stock);

    return {
      totalItems: materials.length,
      totalValue: value,
      alerts: alertsLocal.slice(0, 8),
      buckets: b,
    };
  }, [materials]);

  const totalForPct = Math.max(
    1,
    buckets.critical + buckets.low + buckets.normal + buckets.excess
  );
  const pct = {
    critical: Math.round((buckets.critical / totalForPct) * 100),
    low: Math.round((buckets.low / totalForPct) * 100),
    normal: Math.round((buckets.normal / totalForPct) * 100),
    excess: Math.round((buckets.excess / totalForPct) * 100),
  };

  return (
    <div
      data-component="MagazynPage"
      data-variant="dashboard"
      data-state="active"
    >
      <PageHeader title="Magazyn" subtitle="Przegląd zapasów i alertów" />

      <Toolbar
        left={
          <Space>
            <Button type="primary" onClick={() => navigate("/magazyn/lista")}>
              Magazyn UMMS
            </Button>
            <Button onClick={() => navigate("/demands")}>
              Utwórz zapotrzebowanie
            </Button>
            <Button onClick={() => navigate("/settings")}>
              Zarządzaj dostawcami
            </Button>
          </Space>
        }
        right={
          <Body color="muted" style={{ fontSize: 12 }}>
            Ostatnia aktualizacja: {new Date().toLocaleString("pl-PL")}
          </Body>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered>
            <Statistic
              title="Wartość magazynu (PLN)"
              value={totalValue.toFixed(2)}
              valueStyle={{ color: "var(--primary-main)" }}
              prefix={<i className="ri-coins-line" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered>
            <Statistic
              title="Pozycje ze stanem krytycznym / niskim"
              value={buckets.critical + buckets.low}
              valueStyle={{ color: "var(--accent-warning)" }}
              prefix={<i className="ri-alert-line" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered>
            <Statistic
              title="Liczba pozycji w magazynie"
              value={totalItems}
              valueStyle={{ color: "var(--text-primary)" }}
              prefix={<i className="ri-archive-2-line" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Status zapasów" bordered>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={pct.normal}
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>
                <Tag color="green">W normie {buckets.normal}</Tag>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={pct.low}
                    strokeColor="#faad14"
                    showInfo={false}
                  />
                </div>
                <Tag color="orange">Niski {buckets.low}</Tag>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={pct.critical}
                    strokeColor="#ff4d4f"
                    showInfo={false}
                  />
                </div>
                <Tag color="red">Krytyczny {buckets.critical}</Tag>
              </div>
              <div style={{ display: "flex,", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={pct.excess}
                    strokeColor="#1677ff"
                    showInfo={false}
                  />
                </div>
                <Tag color="blue">Nadmiar {buckets.excess}</Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Pilne alerty" bordered>
            <List
              locale={{ emptyText: "Brak krytycznych alertów" }}
              dataSource={alerts}
              renderItem={(a) => (
                <List.Item>
                  <List.Item.Meta
                    title={a.name}
                    description={
                      <div>
                        <Tag color="red">
                          {a.stock} / min {a.minStock} {a.unit || ""}
                        </Tag>
                      </div>
                    }
                  />
                  <Button
                    size="small"
                    onClick={() => navigate("/magazyn/lista")}
                  >
                    Zarządzaj
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
