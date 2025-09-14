import { CalendarView } from "../modules/calendar";

export default function CalendarNew() {
  const handleViewEvent = (event: any) => {
    console.log("View event:", event);
  };

  const handleEditEvent = (event: any) => {
    console.log("Edit event:", event);
  };

  const handleDeleteEvent = (event: any) => {
    console.log("Delete event:", event);
  };

  const handleAddEvent = () => {
    console.log("Add event");
  };

  return (
    <CalendarView
      onViewEvent={handleViewEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onAddEvent={handleAddEvent}
    />
  );
}
