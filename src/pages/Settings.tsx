import {
  CloudSyncOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Button } from "../new-ui/atoms/Button/Button";
import { Divider } from "../new-ui/atoms/Divider/Divider";
import { Input } from "../new-ui/atoms/Input/Input";
import { Space } from "../new-ui/atoms/Space/Space";
import { Tag } from "../new-ui/atoms/Tag/Tag";
import { Typography } from "../new-ui/atoms/Typography/Typography";
import { Card } from "../new-ui/molecules/Card/Card";
import { Descriptions } from "../new-ui/molecules/Descriptions/Descriptions";
import { Form } from "../new-ui/molecules/Form/Form";
import {
  backupDb,
  getDbStatus,
  getFilesRoot,
  setFilesRoot,
} from "../services/settings";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("");
  const [exists, setExists] = useState<boolean | null>(null);
  const [writable, setWritable] = useState<boolean | null>(null);
  const [dbPath, setDbPath] = useState("");
  const [projectsRoot, setProjectsRoot] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const fr = await getFilesRoot();
      setPath(fr.path);
      setExists(fr.exists);
      setWritable(fr.writable);
      const db = await getDbStatus();
      setDbPath(db.path);
      setProjectsRoot(db.projectsRoot);
    } catch (e: any) {
      message.error(e?.message || "Nie udało się pobrać ustawień");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSave = async () => {
    setLoading(true);
    try {
      const res = await setFilesRoot(path);
      if (res.ok) {
        message.success("Zapisano lokalizację projektów");
        await refresh();
      } else {
        message.error("Nie udało się zapisać ścieżki");
      }
    } catch (e: any) {
      message.error(e?.message || "Błąd zapisu");
    } finally {
      setLoading(false);
    }
  };

  const onBackup = async () => {
    setLoading(true);
    try {
      const res = await backupDb();
      if (res.ok) {
        message.success("Wykonano backup bazy danych");
      } else {
        message.error("Backup nie powiódł się");
      }
    } catch (e: any) {
      message.error(e?.message || "Błąd backupu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Ustawienia
      </Typography.Title>

      <Card
        loading={loading}
        title="Folder synchronizacji projektów"
        extra={<CloudSyncOutlined />}
      >
        <Form layout="vertical" onFinish={onSave}>
          <Form.Item label="Ścieżka główna">
            <Input
              prefix={<FolderOpenOutlined />}
              placeholder="Z:\\_NoweRozdanie"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </Form.Item>
          <Space>
            <Tag color={exists ? "green" : "red"}>
              {exists ? "Istnieje" : "Brak"}
            </Tag>
            <Tag color={writable ? "green" : "orange"}>
              {writable ? "Zapisywalny" : "Tylko odczyt"}
            </Tag>
          </Space>
          <div style={{ marginTop: 12 }}>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
              Zapisz
            </Button>
          </div>
        </Form>
      </Card>

      <Card title="Baza danych" extra={<DatabaseOutlined />}>
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Aktualny plik bazy">
            {dbPath}
          </Descriptions.Item>
          <Descriptions.Item label="Katalog projektów">
            {projectsRoot}
          </Descriptions.Item>
        </Descriptions>
        <Divider style={{ margin: "12px 0" }} />
        <Space>
          <Button onClick={refresh}>Odśwież</Button>
          <Button type="primary" onClick={onBackup}>
            Wykonaj backup
          </Button>
        </Space>
      </Card>
    </Space>
  );
}
