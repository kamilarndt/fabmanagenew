import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseGrid } from "../../../components/shared/BaseGrid";
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
  // Helper function for future use
  // const getEventsByType = (type: string) =>
  //   events.filter((event) => event.type === type);

  const eventTypes: Array<{
    key: string;
    title: string;
    color?: string;
  }> = [
    { key: "project", title: "Projects", color: "blue" },
    { key: "meeting", title: "Meetings", color: "green" },
    { key: "deadline", title: "Deadlines", color: "red" },
    { key: "production", title: "Production", color: "orange" },
    { key: "maintenance", title: "Maintenance", color: "purple" },
    { key: "other", title: "Other", color: "default" },
  ];

  // Convert CalendarEvent to BaseEntity format
  const baseEntities: BaseEntity[] = events.map((event) => ({
    id: event.id,
    name: event.title,
    description: event.description,
    status: event.status || "scheduled",
    priority: event.priority,
    assignedTo: event.assignedTo,
    projectId: event.projectId,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));

  const getStatusFromEntity = (entity: BaseEntity) => {
    const event = events.find((e) => e.id === entity.id);
    return event?.type || "other";
  };

  const statusColorMap = (status: string) => {
    switch (status) {
      case "project":
        return "blue";
      case "meeting":
        return "green";
      case "deadline":
        return "red";
      case "production":
        return "orange";
      case "maintenance":
        return "purple";
      default:
        return "default";
    }
  };

  const customFields = (entity: BaseEntity) => {
    const event = events.find((e) => e.id === entity.id);
    if (!event) return null;

    return (
      <EventCard
        event={event}
        onView={onViewEvent}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
      />
    );
  };

  // Create adapters to convert BaseEntity back to CalendarEvent
  const handleViewEntity = (entity: BaseEntity) => {
    const event = events.find((e) => e.id === entity.id);
    if (event) onViewEvent?.(event);
  };

  const handleEditEntity = (entity: BaseEntity) => {
    const event = events.find((e) => e.id === entity.id);
    if (event) onEditEvent?.(event);
  };

  const handleDeleteEntity = (entity: BaseEntity) => {
    const event = events.find((e) => e.id === entity.id);
    if (event) onDeleteEvent?.(event);
  };

  return (
    <BaseGrid
      entities={baseEntities}
      loading={loading}
      onViewEntity={handleViewEntity}
      onEditEntity={handleEditEntity}
      onDeleteEntity={handleDeleteEntity}
      onAddEntity={onAddEvent}
      title="Calendar Events"
      subtitle="Manage your schedule and important dates"
      statusColumns={eventTypes}
      getStatusFromEntity={getStatusFromEntity}
      statusColorMap={statusColorMap}
      customFields={customFields}
    />
  );
}
