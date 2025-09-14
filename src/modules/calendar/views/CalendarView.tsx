import { Segmented } from "antd";
import { useState } from "react";
import { CalendarGrid } from "../components/CalendarGrid";
import { useCalendarQuery } from "../hooks/useCalendarQuery";

interface CalendarViewProps {
  onViewEvent?: (event: any) => void;
  onEditEvent?: (event: any) => void;
  onDeleteEvent?: (event: any) => void;
  onAddEvent?: () => void;
}

export function CalendarView({
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  onAddEvent,
}: CalendarViewProps) {
  const [view, setView] = useState<"grid" | "calendar">("grid");
  const { data: events = [], error } = useCalendarQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading calendar events: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2>Calendar</h2>
          <Segmented
            value={view}
            onChange={(value) => setView(value as "grid" | "calendar")}
            options={[
              { label: "Grid", value: "grid" },
              { label: "Calendar", value: "calendar" },
            ]}
          />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {view === "grid" ? (
          <CalendarGrid
            events={events}
            onViewEvent={onViewEvent}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
            onAddEvent={onAddEvent}
          />
        ) : (
          <div>
            {/* Calendar view implementation would go here */}
            <p>Calendar view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
