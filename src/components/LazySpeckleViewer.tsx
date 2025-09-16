import { Card, Typography } from "antd";

const { Title } = Typography;

interface LazySpeckleViewerProps {
  initialStreamUrl?: string;
  onModelSelect?: (url: string) => void;
  height?: number;
  enableSelection?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  loadingText?: string;
}

export default function LazySpeckleViewer({
  initialStreamUrl,
}: LazySpeckleViewerProps) {
  return (
    <Card>
      <Title level={4}>3D Model Viewer</Title>
      <div
        style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text type="secondary">
          Speckle Viewer will be implemented here
          {initialStreamUrl && <div>URL: {initialStreamUrl}</div>}
        </Typography.Text>
      </div>
    </Card>
  );
}
