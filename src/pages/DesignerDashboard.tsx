import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { Body } from "../components/ui/Typography";
import { useTilesStore, type Tile } from "../stores/tilesStore";

export default function DesignerDashboard() {
  const { tiles, initialize } = useTilesStore();
  const [form] = Form.useForm<{ project?: string; name: string }>();
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const myQueue = useMemo(
    () =>
      tiles.filter((t) =>
        ["do_review", "zaakceptowany", "w_produkcji"].includes(
          (t.status as any) || "do_review"
        )
      ),
    [tiles]
  );

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 160 },
    { title: "Nazwa", dataIndex: "name", key: "name" },
    { title: "Projekt", dataIndex: "project", key: "project", width: 140 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (s: string) => <Tag>{s}</Tag>,
    },
    {
      title: "Akcja",
      key: "action",
      width: 120,
      render: (_: unknown, record: Tile) => (
        <Button size="small" onClick={() => setSelectedTile(record)}>
          Upload
        </Button>
      ),
    },
  ];

  const uploadProps = {
    name: "file",
    action: "/api/upload",
    data: () => ({ tileId: selectedTile?.id }),
    onChange(info: any) {
      if (info.file.status === "done") message.success("Plik przesłany");
      else if (info.file.status === "error") message.error("Błąd uploadu");
    },
  };

  return (
    <div style={{ padding: 16 }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Moje zadania
      </Typography.Title>
      <Table
        rowKey="id"
        dataSource={myQueue as any}
        columns={columns as any}
        pagination={{ pageSize: 10 }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <Card title="Upload plików (DXF/PDF)">
          <Form form={form} layout="vertical">
            <Form.Item label="Projekt" name="project">
              <Input placeholder="ID projektu" />
            </Form.Item>
            <Form.Item
              label="Nazwa elementu"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="np. Panel frontowy" />
            </Form.Item>
            <Form.Item label="Plik">
              <Upload {...uploadProps} accept=".pdf,.dxf,.dwg" maxCount={1}>
                <Button icon={<UploadOutlined />}>Wybierz plik</Button>
              </Upload>
            </Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  message.info(
                    "Dodawanie nowych elementów przez upload zostanie dokończone po integracji z CRUD"
                  )
                }
              >
                Wyślij do review
              </Button>
            </Space>
          </Form>
        </Card>
        <Card title="Szczegóły">
          {selectedTile ? (
            <div>
              <div>
                <b>ID:</b> {selectedTile.id}
              </div>
              <div>
                <b>Nazwa:</b> {selectedTile.name}
              </div>
              <div>
                <b>Projekt:</b> {selectedTile.project}
              </div>
              <div>
                <b>Status:</b> {selectedTile.status}
              </div>
              <Body color="muted">
                Załącz pliki, a następnie zmień status w edycji kafelka.
              </Body>
              <div style={{ marginTop: 12 }}>
                <Button
                  size="small"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `/api/tiles/${selectedTile.id}/files`
                      );
                      const files: Array<{
                        name: string;
                        path: string;
                        size: number;
                      }> = await res.json();
                      if (!files.length) {
                        message.info("Brak plików");
                        return;
                      }
                      const list = files
                        .map(
                          (f) => `• ${f.name} (${Math.round(f.size / 1024)} KB)`
                        )
                        .join("\n");
                      message.success(`Załączone pliki:\n${list}`);
                    } catch {
                      message.error("Nie udało się pobrać listy plików");
                    }
                  }}
                >
                  Pokaż załączniki
                </Button>
              </div>
            </div>
          ) : (
            <Body color="muted">Wybierz element z listy</Body>
          )}
        </Card>
      </div>
    </div>
  );
}
