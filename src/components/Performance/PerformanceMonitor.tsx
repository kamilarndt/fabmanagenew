import {
  ClockCircleOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Progress,
  Space,
  Statistic,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  collectPerformanceMetrics,
  useMemoryMonitor,
} from "../../utils/performance";

const { Panel } = Collapse;

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const memoryInfo = useMemoryMonitor();

  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = collectPerformanceMetrics();
      setMetrics(newMetrics);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getPerformanceStatus = (
    value: number,
    thresholds: { good: number; poor: number }
  ) => {
    if (value <= thresholds.good) return "success";
    if (value <= thresholds.poor) return "warning";
    return "error";
  };

  if (!isVisible) {
    return (
      <Button
        type="primary"
        icon={<DashboardOutlined />}
        onClick={() => setIsVisible(true)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
      >
        Performance Monitor
      </Button>
    );
  }

  return (
    <Card
      title="Performance Monitor"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 400,
        zIndex: 1000,
        maxHeight: "80vh",
        overflow: "auto",
      }}
      extra={
        <Button type="text" onClick={() => setIsVisible(false)}>
          ✕
        </Button>
      }
    >
      <Collapse defaultActiveKey={["core-web-vitals", "memory", "bundle"]}>
        <Panel header="Core Web Vitals" key="core-web-vitals">
          <Space direction="vertical" style={{ width: "100%" }}>
            {metrics?.LCP && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Largest Contentful Paint (LCP)</span>
                  <span className="font-medium">
                    {metrics.LCP.toFixed(2)}ms
                  </span>
                </div>
                <Progress
                  percent={Math.min((metrics.LCP / 2500) * 100, 100)}
                  status={getPerformanceStatus(metrics.LCP, {
                    good: 2500,
                    poor: 4000,
                  })}
                  size="small"
                />
              </div>
            )}

            {metrics?.FID && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>First Input Delay (FID)</span>
                  <span className="font-medium">
                    {metrics.FID.toFixed(2)}ms
                  </span>
                </div>
                <Progress
                  percent={Math.min((metrics.FID / 100) * 100, 100)}
                  status={getPerformanceStatus(metrics.FID, {
                    good: 100,
                    poor: 300,
                  })}
                  size="small"
                />
              </div>
            )}

            {metrics?.CLS && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Cumulative Layout Shift (CLS)</span>
                  <span className="font-medium">{metrics.CLS.toFixed(3)}</span>
                </div>
                <Progress
                  percent={Math.min((metrics.CLS / 0.1) * 100, 100)}
                  status={getPerformanceStatus(metrics.CLS, {
                    good: 0.1,
                    poor: 0.25,
                  })}
                  size="small"
                />
              </div>
            )}
          </Space>
        </Panel>

        <Panel header="Memory Usage" key="memory">
          {memoryInfo ? (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Statistic
                title="Used Memory"
                value={formatBytes(memoryInfo.usedJSHeapSize)}
                prefix={<DatabaseOutlined />}
              />
              <Statistic
                title="Total Memory"
                value={formatBytes(memoryInfo.totalJSHeapSize)}
                prefix={<DatabaseOutlined />}
              />
              <Statistic
                title="Memory Limit"
                value={formatBytes(memoryInfo.jsHeapSizeLimit)}
                prefix={<DatabaseOutlined />}
              />
              <Progress
                percent={
                  (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100
                }
                status={
                  memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.8
                    ? "exception"
                    : "active"
                }
              />
            </Space>
          ) : (
            <Alert
              message="Memory information not available"
              type="info"
              showIcon
            />
          )}
        </Panel>

        <Panel header="Bundle Analysis" key="bundle">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Statistic
              title="Bundle Size"
              value={
                metrics?.bundleSize ? formatBytes(metrics.bundleSize) : "N/A"
              }
              prefix={<DashboardOutlined />}
            />
            <Statistic
              title="Render Time"
              value={
                metrics?.renderTime
                  ? `${metrics.renderTime.toFixed(2)}ms`
                  : "N/A"
              }
              prefix={<ClockCircleOutlined />}
            />
            {metrics?.renderTime && metrics.renderTime > 16 && (
              <Alert
                message="Slow render detected"
                description="Render time exceeds 16ms (one frame)"
                type="warning"
                icon={<WarningOutlined />}
                showIcon
              />
            )}
          </Space>
        </Panel>
      </Collapse>
    </Card>
  );
};
