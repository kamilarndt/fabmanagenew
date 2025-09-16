import { DisconnectOutlined, WifiOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import { useConnectionStatus } from "../lib/connectionMonitor";

export default function ConnectionStatusIndicator() {
  const { isOnline, isConnected, lastChecked } = useConnectionStatus();

  const getStatusColor = () => {
    if (!isOnline) return "red";
    if (isConnected) return "green";
    return "orange"; // Online but not connected to server
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isConnected) return "Online & Connected";
    return "Online, but server unreachable";
  };

  const getStatusIcon = () => {
    if (!isOnline || !isConnected) return <DisconnectOutlined />;
    return <WifiOutlined />;
  };

  return (
    <Tooltip
      title={`${getStatusText()} (Last checked: ${lastChecked.toLocaleTimeString()})`}
      placement="bottomRight"
    >
      <Badge color={getStatusColor()} dot>
        {getStatusIcon()}
      </Badge>
    </Tooltip>
  );
}
