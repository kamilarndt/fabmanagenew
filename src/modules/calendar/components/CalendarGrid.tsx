import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Space } from "antd";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { CalendarEvent } from "../types";
import { EventCard } from "./EventCard";

interface CalendarGridProps {
  events: CalendarEvent[];
  loading?: boolean;
  onViewEvent?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
  onAddEvent?: () => void;
}

export function CalendarGrid({
  events,
  loading = false,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  onAddEvent,
}: CalendarGridProps) {
  const getEventsByType = (type: string) =>
    events.filter((event) => event.type === type);

  const eventTypes = [
    { key: "project", title: "Projects", color: "blue" },
    { key: "meeting", title: "Meetings", color: "green" },
    { key: "deadline", title: "Deadlines", color: "red" },
    { key: "production", title: "Production", color: "orange" },
    { key: "maintenance", title: "Maintenance", color: "purple" },
    { key: "other", title: "Other", color: "default" },
  ] as const;

  if (events.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title="Calendar Events"
          subtitle="Manage your schedule and important dates"
          actions={
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddEvent}>
              Add Event
            </Button>
          }
        />
        <Empty
          description="No events found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddEvent}>
            Add your first event
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Calendar Events"
        subtitle={`${events.length} event${
          events.length !== 1 ? "s" : ""
        } scheduled`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddEvent}>
              Add Event
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {eventTypes.map((type) => {
          const typeEvents = getEventsByType(type.key);
          return (
            <Col key={type.key} xs={24} md={12} lg={8}>
              <Card
                title={
                  <Space>
                    <span>{type.title}</span>
                    <span>({typeEvents.length})</span>
                  </Space>
                }
                style={{ height: "100%", minHeight: 400 }}
                bodyStyle={{ padding: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 300,
                  }}
                >
                  {typeEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onView={onViewEvent}
                      onEdit={onEditEvent}
                      onDelete={onDeleteEvent}
                    />
                  ))}
                  {typeEvents.length === 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 200,
                        color: "#999",
                        border: "2px dashed #d9d9d9",
                        borderRadius: 6,
                      }}
                    >
                      No events in this category
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
