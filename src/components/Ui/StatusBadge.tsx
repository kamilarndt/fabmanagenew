import { Badge as ModernBadge } from "@/new-ui/atoms/Badge/Badge";
import { getStatusColor } from "../../lib/statusUtils";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  showIcon = true,
  showTooltip = true,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const color = getStatusColor(status as any);
  const icon: string | undefined = undefined;
  const description = status;

  const getVariant = (color: string) => {
    switch (color) {
      case "success":
      case "green":
        return "success";
      case "warning":
      case "orange":
        return "warning";
      case "error":
      case "red":
        return "destructive";
      case "blue":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <ModernBadge
      variant={getVariant(color) as any}
      style={{
        borderRadius: 6,
        fontFamily: "var(--font-family)",
        fontWeight: 500,
      }}
      title={showTooltip ? description : undefined}
      className={className}
    >
      {showIcon && <i className={`${icon} me-1`} />}
      {status}
    </ModernBadge>
  );
}

export default StatusBadge;
