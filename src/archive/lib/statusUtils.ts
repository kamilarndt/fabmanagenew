export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    designing: "blue",
    pending_approval: "orange", 
    approved: "green",
    cnc_queue: "purple",
    cnc_production: "cyan",
    ready_assembly: "lime",
    completed: "green",
    cancelled: "red",
    on_hold: "yellow",
  };
  
  return statusColors[status] || "default";
}
