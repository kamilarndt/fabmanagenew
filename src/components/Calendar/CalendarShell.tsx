import { Calendar } from "antd";

interface CalendarShellProps {
  events?: any[];
  onSelectDate?: (date: any) => void;
  onSelectEvent?: (event: any) => void;
  mode?: string;
  title?: string;
  resources?: any[];
  onEventCreate?: (eventData: any) => void;
  onEventUpdate?: (id: string, updates: any) => void;
  onEventDelete?: (eventId: string) => void;
  onEventDrop?: (
    event: any,
    start: Date,
    end: Date,
    resourceId?: string
  ) => void;
  onEventResize?: (event: any, start: Date, end: Date) => void;
  showResourceColumns?: boolean;
}

export default function CalendarShell({ onSelectDate }: CalendarShellProps) {
  return (
    <div>
      <Calendar
        onSelect={onSelectDate}
        onPanelChange={onSelectDate}
        // Add more calendar configuration as needed
      />
    </div>
  );
}
