import { Segmented } from "antd";
import { useState } from "react";
import type { BaseEntity } from "./BaseCard";
import { BaseGrid } from "./BaseGrid";
import { BaseStats } from "./BaseStats";

interface BaseViewProps {
  entities: BaseEntity[];
  loading?: boolean;
  error?: Error | null;
  onViewEntity?: (entity: any) => void;
  onEditEntity?: (entity: any) => void;
  onDeleteEntity?: (entity: any) => void;
  onAddEntity?: () => void;
  title?: string;
  subtitle?: string;
  statusColumns?: Array<{
    key: string;
    title: string;
    color?: string;
  }>;
  getStatusFromEntity?: (entity: BaseEntity) => string;
  statusColorMap?: (status: string) => string;
  priorityColorMap?: (priority: string) => string;
  customFields?: (entity: BaseEntity) => React.ReactNode;
  actions?: (entity: BaseEntity) => React.ReactNode[];
  customStats?: Array<{
    title: string;
    value: number;
    color?: string;
    icon?: React.ReactNode;
  }>;
  views?: Array<{
    key: string;
    label: string;
    component: React.ComponentType<any>;
  }>;
}

export function BaseView({
  entities,
  loading = false,
  error,
  onViewEntity,
  onEditEntity,
  onDeleteEntity,
  onAddEntity,
  title = "Entities",
  subtitle,
  statusColumns,
  getStatusFromEntity,
  statusColorMap,
  priorityColorMap,
  customFields,
  actions,
  customStats,
  views = [
    { key: "grid", label: "Grid", component: BaseGrid },
    { key: "stats", label: "Stats", component: BaseStats },
  ],
}: BaseViewProps) {
  const [view, setView] = useState<string>(views[0]?.key || "grid");

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>
          Error loading {title.toLowerCase()}: {error.message}
        </p>
      </div>
    );
  }

  const ViewComponent =
    views.find((v) => v.key === view)?.component || BaseGrid;

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
          <h2>{title}</h2>
          {views.length > 1 && (
            <Segmented
              value={view}
              onChange={(value) => setView(value as string)}
              options={views.map((v) => ({ label: v.label, value: v.key }))}
            />
          )}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {view === "grid" ? (
          <BaseGrid
            entities={entities}
            loading={loading}
            onViewEntity={onViewEntity}
            onEditEntity={onEditEntity}
            onDeleteEntity={onDeleteEntity}
            onAddEntity={onAddEntity}
            title={title}
            subtitle={subtitle}
            statusColumns={statusColumns}
            getStatusFromEntity={getStatusFromEntity}
            statusColorMap={statusColorMap}
            priorityColorMap={priorityColorMap}
            customFields={customFields}
            actions={actions}
          />
        ) : view === "stats" ? (
          <BaseStats
            entities={entities}
            title={`${title} Statistics`}
            customStats={customStats}
          />
        ) : (
          <ViewComponent
            entities={entities}
            loading={loading}
            onViewEntity={onViewEntity}
            onEditEntity={onEditEntity}
            onDeleteEntity={onDeleteEntity}
            onAddEntity={onAddEntity}
            title={title}
            subtitle={subtitle}
            statusColumns={statusColumns}
            getStatusFromEntity={getStatusFromEntity}
            statusColorMap={statusColorMap}
            priorityColorMap={priorityColorMap}
            customFields={customFields}
            actions={actions}
          />
        )}
      </div>
    </div>
  );
}
