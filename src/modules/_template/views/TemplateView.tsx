import { Segmented } from "antd";
import { useState } from "react";
import { TemplateGrid } from "../components/TemplateGrid";
import { TemplateStats } from "../components/TemplateStats";
import { useTemplateQuery } from "../hooks/useTemplateQuery";

interface TemplateViewProps {
  onViewEntity?: (entity: any) => void;
  onEditEntity?: (entity: any) => void;
  onDeleteEntity?: (entity: any) => void;
  onAddEntity?: () => void;
}

export function TemplateView({
  onViewEntity,
  onEditEntity,
  onDeleteEntity,
  onAddEntity,
}: TemplateViewProps) {
  const [view, setView] = useState<"grid" | "stats">("grid");
  const { data: entities = [], error } = useTemplateQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading entities: {error.message}</p>
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
          <h2>Template Module</h2>
          <Segmented
            value={view}
            onChange={(value) => setView(value as "grid" | "stats")}
            options={[
              { label: "Grid", value: "grid" },
              { label: "Stats", value: "stats" },
            ]}
          />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {view === "grid" ? (
          <TemplateGrid
            entities={entities}
            onViewEntity={onViewEntity}
            onEditEntity={onEditEntity}
            onDeleteEntity={onDeleteEntity}
            onAddEntity={onAddEntity}
          />
        ) : (
          <TemplateStats entities={entities} />
        )}
      </div>
    </div>
  );
}

