import { abTesting } from "@/lib/ab-testing";
import { features } from "@/lib/config";
import { cutoverManager } from "@/lib/cutover-manager";
import { feedbackIntegration } from "@/lib/feedback-integration";
import { usePerformanceMonitor } from "@/lib/performance-monitor";
import { performanceOptimizer } from "@/lib/performance-optimizer";
import {
  USER_SEGMENTS,
  userSegmentation,
  type UserProfile,
} from "@/lib/user-segments";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Timeline,
} from "antd";
import * as React from "react";

export default function MigrationDashboard(): React.ReactElement {
  const { getPerformanceReport } = usePerformanceMonitor();
  const [performanceReport, setPerformanceReport] = React.useState<any>(null);
  const [abTestResults, setABTestResults] = React.useState<any>(null);
  const [currentSegment, setCurrentSegment] = React.useState(
    userSegmentation.getCurrentSegment()
  );
  const [userProfile] = React.useState(userSegmentation.getUserProfile());
  const [enabledFeatures, setEnabledFeatures] = React.useState(
    userSegmentation.getEnabledFeatures()
  );
  const [performanceOptimization] = React.useState(
    performanceOptimizer.getPerformanceReport()
  );
  const [feedbackAnalytics] = React.useState(
    feedbackIntegration.getFeedbackAnalytics()
  );
  const [cutoverStatus, setCutoverStatus] = React.useState(
    cutoverManager.getCutoverStatus()
  );

  React.useEffect(() => {
    const report = getPerformanceReport();
    setPerformanceReport(report);

    const results = abTesting.getTestResults("dashboard-ui");
    setABTestResults(results);
  }, [getPerformanceReport]);

  const migrationStatus = [
    {
      page: "Dashboard",
      status: "In Progress",
      progress: 75,
      users: 150,
      feedback: 4.2,
    },
    {
      page: "Projects",
      status: "Planned",
      progress: 0,
      users: 0,
      feedback: 0,
    },
    {
      page: "Materials",
      status: "Planned",
      progress: 0,
      users: 0,
      feedback: 0,
    },
    {
      page: "Tiles",
      status: "Planned",
      progress: 0,
      users: 0,
      feedback: 0,
    },
  ];

  const columns = [
    {
      title: "Page",
      dataIndex: "page",
      key: "page",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "In Progress"
            ? "blue"
            : status === "Completed"
            ? "green"
            : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
    },
    {
      title: "Feedback Score",
      dataIndex: "feedback",
      key: "feedback",
      render: (score: number) => (score > 0 ? `${score}/5` : "N/A"),
    },
  ];

  return (
    <div className="tw-p-6">
      <h1 className="tw-text-2xl tw-font-bold tw-mb-6">Migration Dashboard</h1>

      {/* Feature Flags Status */}
      <Card title="Feature Flags Status" className="tw-mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="New UI Enabled"
              value={features.newUI ? "Yes" : "No"}
              valueStyle={{ color: features.newUI ? "#3f8600" : "#cf1322" }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Dashboard V2"
              value={features.newUIDashboard ? "Yes" : "No"}
              valueStyle={{
                color: features.newUIDashboard ? "#3f8600" : "#cf1322",
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Projects V2"
              value={features.newUIProjects ? "Yes" : "No"}
              valueStyle={{
                color: features.newUIProjects ? "#3f8600" : "#cf1322",
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Materials V2"
              value={features.newUIMaterials ? "Yes" : "No"}
              valueStyle={{
                color: features.newUIMaterials ? "#3f8600" : "#cf1322",
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* A/B Test Results */}
      {abTestResults && (
        <Card title="A/B Test Results - Dashboard UI" className="tw-mb-6">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Control Users"
                value={abTestResults.summary.control.count}
                suffix="users"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Treatment Users"
                value={abTestResults.summary.treatment.count}
                suffix="users"
              />
            </Col>
            <Col span={8}>
              <Statistic title="Traffic Split" value="10%" suffix="new UI" />
            </Col>
          </Row>

          {Object.keys(abTestResults.summary.control.avgMetrics).length > 0 && (
            <div className="tw-mt-4">
              <h4>Performance Comparison</h4>
              <Table
                dataSource={Object.keys(
                  abTestResults.summary.control.avgMetrics
                ).map((metric) => ({
                  key: metric,
                  metric,
                  control:
                    abTestResults.summary.control.avgMetrics[metric].toFixed(2),
                  treatment:
                    abTestResults.summary.treatment.avgMetrics[metric].toFixed(
                      2
                    ),
                  significance:
                    abTestResults.summary.significance[metric]?.toFixed(2) ||
                    "N/A",
                }))}
                columns={[
                  { title: "Metric", dataIndex: "metric", key: "metric" },
                  { title: "Control", dataIndex: "control", key: "control" },
                  {
                    title: "Treatment",
                    dataIndex: "treatment",
                    key: "treatment",
                  },
                  {
                    title: "Significance",
                    dataIndex: "significance",
                    key: "significance",
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          )}
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceReport && (
        <Card title="Performance Metrics" className="tw-mb-6">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Avg Render Time"
                value={performanceReport.metrics.componentRenderTime.toFixed(2)}
                suffix="ms"
                valueStyle={{
                  color:
                    performanceReport.metrics.componentRenderTime > 16
                      ? "#cf1322"
                      : "#3f8600",
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Avg Page Load"
                value={performanceReport.metrics.pageLoadTime.toFixed(2)}
                suffix="ms"
                valueStyle={{
                  color:
                    performanceReport.metrics.pageLoadTime > 3000
                      ? "#cf1322"
                      : "#3f8600",
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Avg Interaction"
                value={performanceReport.metrics.userInteractionTime.toFixed(2)}
                suffix="ms"
                valueStyle={{
                  color:
                    performanceReport.metrics.userInteractionTime > 100
                      ? "#cf1322"
                      : "#3f8600",
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Total Feedback"
                value={performanceReport.feedback.length}
                suffix="responses"
              />
            </Col>
          </Row>

          {performanceReport.recommendations.length > 0 && (
            <div className="tw-mt-4">
              <h4>Recommendations</h4>
              <ul className="tw-list-disc tw-list-inside">
                {performanceReport.recommendations.map(
                  (rec: string, index: number) => (
                    <li key={index} className="tw-text-sm tw-text-gray-600">
                      {rec}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Migration Status */}
      <Card title="Migration Status">
        <Table
          dataSource={migrationStatus}
          columns={columns}
          pagination={false}
        />
      </Card>

      {/* User Testing Controls */}
      <Card title="User Testing & Segmentation">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <h4>Current User Segment</h4>
            {currentSegment ? (
              <div>
                <Tag color="blue">{currentSegment.name}</Tag>
                <p className="tw-text-sm tw-text-gray-600 tw-mt-2">
                  {currentSegment.description}
                </p>
                <p className="tw-text-xs tw-text-gray-500">
                  {currentSegment.percentage}% of users
                </p>
              </div>
            ) : (
              <Alert message="No user segment assigned" type="warning" />
            )}
          </Col>

          <Col xs={24} lg={12}>
            <h4>User Profile</h4>
            {userProfile ? (
              <div className="tw-space-y-2">
                <div>
                  <strong>Email:</strong> {userProfile.email}
                </div>
                <div>
                  <strong>Role:</strong> {userProfile.role}
                </div>
                <div>
                  <strong>Experience:</strong> {userProfile.experience}
                </div>
                <div>
                  <strong>Usage:</strong> {userProfile.usageFrequency}
                </div>
                <div>
                  <strong>Device:</strong> {userProfile.device}
                </div>
              </div>
            ) : (
              <Alert message="No user profile loaded" type="info" />
            )}
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <h4>Test User Segment</h4>
            <Select
              style={{ width: "100%" }}
              placeholder="Select segment to test"
              value={currentSegment?.id}
              onChange={(segmentId) => {
                const segment = USER_SEGMENTS.find((s) => s.id === segmentId);
                if (segment) {
                  // Simulate user profile for testing
                  const testProfile: UserProfile = {
                    id: "test-user",
                    email: "test@example.com",
                    role: "user",
                    experience: "experienced",
                    subscription: "premium",
                    usageFrequency: "high",
                    lastActive: 1,
                    browser: "Chrome",
                    device: "desktop",
                    region: "US",
                    custom: {},
                  };
                  userSegmentation.setUserProfile(testProfile);
                  setCurrentSegment(segment);
                  setEnabledFeatures(segment.features);
                }
              }}
            >
              {USER_SEGMENTS.map((segment) => (
                <Select.Option key={segment.id} value={segment.id}>
                  {segment.name} ({segment.percentage}%)
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} lg={16}>
            <h4>Enabled Features</h4>
            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
              {Object.entries(enabledFeatures).map(([feature, enabled]) => (
                <div
                  key={feature}
                  className="tw-flex tw-items-center tw-justify-between"
                >
                  <span className="tw-text-sm">{feature}</span>
                  <Switch checked={enabled as boolean} disabled size="small" />
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <h4>Quick Actions</h4>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  // Reset to default user
                  localStorage.removeItem("user-profile");
                  window.location.reload();
                }}
              >
                Reset to Default User
              </Button>
              <Button
                onClick={() => {
                  // Force enable all new UI features
                  const allEnabled = {
                    newUI: true,
                    newUIDashboard: true,
                    newUIProjects: true,
                    newUIMaterials: true,
                    newUITiles: true,
                    newUISettings: true,
                    newUINavigation: true,
                    newUIForms: true,
                    newUITables: true,
                    experimentalFeatures: ["all"],
                  };
                  setEnabledFeatures(allEnabled);
                }}
              >
                Enable All New UI
              </Button>
              <Button
                onClick={() => {
                  // Force disable all new UI features
                  const allDisabled = {
                    newUI: false,
                    newUIDashboard: false,
                    newUIProjects: false,
                    newUIMaterials: false,
                    newUITiles: false,
                    newUISettings: false,
                    newUINavigation: false,
                    newUIForms: false,
                    newUITables: false,
                    experimentalFeatures: [],
                  };
                  setEnabledFeatures(allDisabled);
                }}
              >
                Disable All New UI
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Performance Optimization */}
      <Card title="Performance Optimization">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Statistic
              title="Average Page Load Time"
              value={performanceOptimization.averageMetrics.pageLoadTime}
              suffix="ms"
              valueStyle={{
                color:
                  performanceOptimization.averageMetrics.pageLoadTime > 2000
                    ? "#cf1322"
                    : "#3f8600",
              }}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Statistic
              title="Component Render Time"
              value={performanceOptimization.averageMetrics.componentRenderTime}
              suffix="ms"
              valueStyle={{
                color:
                  performanceOptimization.averageMetrics.componentRenderTime >
                  100
                    ? "#cf1322"
                    : "#3f8600",
              }}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Statistic
              title="Memory Usage"
              value={performanceOptimization.averageMetrics.memoryUsage}
              suffix="MB"
              valueStyle={{
                color:
                  performanceOptimization.averageMetrics.memoryUsage > 100
                    ? "#cf1322"
                    : "#3f8600",
              }}
            />
          </Col>
        </Row>

        {performanceOptimization.issues.length > 0 && (
          <Alert
            message="Performance Issues Detected"
            description={`${performanceOptimization.issues.length} performance issues need attention`}
            type="warning"
            showIcon
            className="tw-mt-4"
          />
        )}

        {performanceOptimization.recommendations.length > 0 && (
          <div className="tw-mt-4">
            <h4>Optimization Recommendations</h4>
            <div className="tw-space-y-2">
              {performanceOptimization.recommendations
                .slice(0, 3)
                .map((rec) => (
                  <div
                    key={rec.id}
                    className="tw-flex tw-items-center tw-justify-between tw-p-2 tw-bg-gray-50 tw-rounded"
                  >
                    <div>
                      <div className="tw-font-medium">{rec.description}</div>
                      <div className="tw-text-sm tw-text-gray-600">
                        {rec.impact}
                      </div>
                    </div>
                    <Badge
                      color={
                        rec.priority === "critical"
                          ? "red"
                          : rec.priority === "high"
                          ? "orange"
                          : "blue"
                      }
                      text={rec.priority}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>

      {/* Feedback Integration */}
      <Card title="User Feedback Analytics">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Statistic
              title="Total Feedback"
              value={feedbackAnalytics.totalFeedback}
              suffix="items"
            />
          </Col>
          <Col xs={24} lg={6}>
            <Statistic
              title="Average Rating"
              value={feedbackAnalytics.averageRating}
              precision={1}
              suffix="/5"
              valueStyle={{
                color:
                  feedbackAnalytics.averageRating >= 4
                    ? "#3f8600"
                    : feedbackAnalytics.averageRating >= 3
                    ? "#faad14"
                    : "#cf1322",
              }}
            />
          </Col>
          <Col xs={24} lg={6}>
            <Statistic
              title="User Satisfaction"
              value={feedbackAnalytics.userSatisfaction}
              suffix="%"
              valueStyle={{
                color:
                  feedbackAnalytics.userSatisfaction >= 80
                    ? "#3f8600"
                    : feedbackAnalytics.userSatisfaction >= 60
                    ? "#faad14"
                    : "#cf1322",
              }}
            />
          </Col>
          <Col xs={24} lg={6}>
            <Statistic
              title="Response Time"
              value={feedbackAnalytics.responseTime}
              precision={1}
              suffix="hours"
            />
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <h4>Feedback by Type</h4>
            <div className="tw-space-y-2">
              {Object.entries(feedbackAnalytics.feedbackByType).map(
                ([type, count]) => (
                  <div
                    key={type}
                    className="tw-flex tw-items-center tw-justify-between"
                  >
                    <span className="tw-capitalize">
                      {type.replace("_", " ")}
                    </span>
                    <Badge count={count} />
                  </div>
                )
              )}
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <h4>Top Issues</h4>
            <div className="tw-space-y-2">
              {feedbackAnalytics.topIssues.slice(0, 5).map((issue) => (
                <div
                  key={issue.issue}
                  className="tw-flex tw-items-center tw-justify-between"
                >
                  <span className="tw-text-sm">{issue.issue}</span>
                  <Badge count={issue.count} />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Cut-over Management */}
      <Card title="Cut-over Management">
        {cutoverStatus.currentPlan ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <h4>Current Plan: {cutoverStatus.currentPlan.name}</h4>
                <p className="tw-text-sm tw-text-gray-600">
                  {cutoverStatus.currentPlan.description}
                </p>
                <div className="tw-mt-2">
                  <Progress
                    percent={cutoverStatus.progress}
                    status={
                      cutoverStatus.progress === 100 ? "success" : "active"
                    }
                  />
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <h4>Status</h4>
                <Tag
                  color={
                    cutoverStatus.currentPlan.status === "in-progress"
                      ? "blue"
                      : "green"
                  }
                >
                  {cutoverStatus.currentPlan.status}
                </Tag>
                {cutoverStatus.nextPhase && (
                  <div className="tw-mt-2">
                    <p className="tw-text-sm">
                      Next Phase: {cutoverStatus.nextPhase.name}
                    </p>
                  </div>
                )}
              </Col>
            </Row>

            {cutoverStatus.risks.length > 0 && (
              <Alert
                message="High Risk Items"
                description={cutoverStatus.risks.join(", ")}
                type="warning"
                showIcon
                className="tw-mt-4"
              />
            )}

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <h4>Cut-over Timeline</h4>
                <Timeline>
                  {cutoverStatus.currentPlan.phases.map((phase) => (
                    <Timeline.Item
                      key={phase.id}
                      color={
                        phase.status === "completed"
                          ? "green"
                          : phase.status === "in-progress"
                          ? "blue"
                          : "gray"
                      }
                    >
                      <div className="tw-flex tw-items-center tw-justify-between">
                        <div>
                          <div className="tw-font-medium">{phase.name}</div>
                          <div className="tw-text-sm tw-text-gray-600">
                            {phase.description}
                          </div>
                        </div>
                        <Tag
                          color={
                            phase.status === "completed"
                              ? "green"
                              : phase.status === "in-progress"
                              ? "blue"
                              : "default"
                          }
                        >
                          {phase.status}
                        </Tag>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <h4>Quick Actions</h4>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      cutoverManager.completeCutover(
                        cutoverStatus.currentPlan!.id
                      );
                      setCutoverStatus(cutoverManager.getCutoverStatus());
                    }}
                    disabled={cutoverStatus.progress < 100}
                  >
                    Complete Cut-over
                  </Button>
                  <Button
                    danger
                    onClick={() => {
                      if (
                        window.confirm("Are you sure you want to rollback?")
                      ) {
                        cutoverManager.rollbackCutover(
                          cutoverStatus.currentPlan!.id,
                          "Manual rollback"
                        );
                        setCutoverStatus(cutoverManager.getCutoverStatus());
                      }
                    }}
                  >
                    Rollback
                  </Button>
                  <Button
                    onClick={() => {
                      cutoverManager.checkRollbackTriggers();
                      setCutoverStatus(cutoverManager.getCutoverStatus());
                    }}
                  >
                    Check Triggers
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="tw-text-center tw-py-8">
            <p className="tw-text-gray-500">No active cut-over plan</p>
            <Button
              type="primary"
              onClick={() => {
                // Create a sample cut-over plan
                cutoverManager.createPlan({
                  name: "New UI Full Cut-over",
                  description:
                    "Complete migration from Ant Design to New UI system",
                  targetDate: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toISOString(),
                  phases: [
                    {
                      id: "phase-1",
                      name: "Preparation",
                      description: "Final testing and preparation",
                      order: 1,
                      status: "pending",
                      duration: 8,
                      dependencies: [],
                      tasks: [],
                      rollbackSteps: [
                        "Revert feature flags",
                        "Restore old UI components",
                      ],
                    },
                    {
                      id: "phase-2",
                      name: "Deployment",
                      description: "Deploy new UI to production",
                      order: 2,
                      status: "pending",
                      duration: 4,
                      dependencies: ["phase-1"],
                      tasks: [],
                      rollbackSteps: [
                        "Revert deployment",
                        "Restore previous version",
                      ],
                    },
                    {
                      id: "phase-3",
                      name: "Monitoring",
                      description: "Monitor performance and user feedback",
                      order: 3,
                      status: "pending",
                      duration: 24,
                      dependencies: ["phase-2"],
                      tasks: [],
                      rollbackSteps: [
                        "Disable new UI features",
                        "Restore old UI",
                      ],
                    },
                  ],
                  rollbackTriggers: [
                    {
                      id: "trigger-1",
                      name: "High Error Rate",
                      condition: "error_rate_high",
                      threshold: 5,
                      action: "auto-rollback",
                      severity: "critical",
                      enabled: true,
                    },
                    {
                      id: "trigger-2",
                      name: "Performance Degradation",
                      condition: "performance_degradation",
                      threshold: 50,
                      action: "alert",
                      severity: "high",
                      enabled: true,
                    },
                  ],
                  successCriteria: [
                    {
                      id: "criteria-1",
                      name: "User Satisfaction",
                      metric: "user_satisfaction",
                      target: 80,
                      current: 0,
                      unit: "%",
                      status: "pending",
                    },
                    {
                      id: "criteria-2",
                      name: "Performance Improvement",
                      metric: "performance_improvement",
                      target: 20,
                      current: 0,
                      unit: "%",
                      status: "pending",
                    },
                  ],
                  riskAssessment: {
                    overallRisk: "medium",
                    risks: [
                      {
                        id: "risk-1",
                        description: "User resistance to new UI",
                        probability: "medium",
                        impact: "high",
                        mitigation: "Provide training and support",
                      },
                    ],
                  },
                });
                setCutoverStatus(cutoverManager.getCutoverStatus());
              }}
            >
              Create Cut-over Plan
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
