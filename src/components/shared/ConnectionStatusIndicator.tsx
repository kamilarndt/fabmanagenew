/**
 * Component showing database connection status and allowing manual refresh
 */

import { ReloadOutlined } from "@ant-design/icons";
import { Badge, Button, Space, Tooltip } from "antd";
import { useConnectionStatus } from "../../lib/connectionMonitor";

export default function ConnectionStatusIndicator() {
  const { isOnline, isConnected, lastChecked } = useConnectionStatus();

  const getStatusColor = () => {
    if (!isOnline) return "error";
    if (isConnected) return "success";
    return "warning";
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isConnected) return "Online & Connected";
    return "Online, but server unreachable";
  };

  const getTooltipContent = () => {
    return (
      <div>
        <div>
          <strong>Status:</strong> {getStatusText()}
        </div>
        <div>
          <strong>Last checked:</strong> {lastChecked.toLocaleTimeString()}
        </div>
      </div>
    );
  };

  return (
    <Tooltip title={getTooltipContent()} placement="bottomRight">
      <Space size="small">
        <Badge status={getStatusColor()} text={getStatusText()} />
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
          style={{ padding: "0 4px" }}
        />
      </Space>
    </Tooltip>
  );
}
