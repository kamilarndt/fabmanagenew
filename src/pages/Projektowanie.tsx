import { Switch } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import TileEditDrawer from "../components/Tiles/tile-edit-drawer";
import { PageLayout } from "../components/layouts/PageLayout";
import { PageHeader } from "../components/shared/PageHeader";
import {
  AppButton,
  AppCard,
  AppCol,
  AppRow,
  AppSelect,
  AppSpace,
  AppTag,
} from "../components/ui";
import { Body, H3 } from "../components/ui/Typography";
import { useProjectsStore } from "../stores/projectsStore";
import { useTilesStore, type Tile } from "../stores/tilesStore";

type DesignStatus =
  | "Projektowanie"
  | "W trakcie projektowania"
  | "Do akceptacji"
  | "Zaakceptowane"
  | "Wymagają poprawek";

export default function Projektowanie() {
  const { tiles, updateTile, initialize } = useTilesStore();
  const { projectsById } = useProjectsStore();
  const { projects } = useProjectsStore();
  const [selected, setSelected] = useState<Tile | null>(null);
  const [showTileModal, setShowTileModal] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);

  // Initialize tiles store
  useEffect(() => {
    console.warn("🔧 Projektowanie: Initializing tiles store...");
    initialize();
  }, [initialize]);

  // Filter tiles that are relevant for the design board
  // Include any tile already moved into one of the design statuses
  const designTiles = useMemo(() => {
    const designStatuses: DesignStatus[] = [
      "Projektowanie",
      "W trakcie projektowania",
      "Do akceptacji",
      "Zaakceptowane",
      "Wymagają poprawek",
    ];
    return tiles.filter((tile) =>
      designStatuses.includes(tile.status as DesignStatus)
    );
  }, [tiles]);

  // Project filter state
  const [selectedProjectId, setSelectedProjectId] = useState<string | "all">(
    "all"
  );
  const [onlySelectedProject, setOnlySelectedProject] =
    useState<boolean>(false);

  // Apply project filter when toggle is enabled and a project is selected
  const filteredDesignTiles = useMemo(() => {
    if (onlySelectedProject && selectedProjectId !== "all") {
      return designTiles.filter((t) => t.project === selectedProjectId);
    }
    return designTiles;
  }, [designTiles, onlySelectedProject, selectedProjectId]);

  const columns: { key: DesignStatus; label: string; color: string }[] = [
    { key: "Projektowanie", label: "Nowe Zlecenia", color: "text-muted" },
    {
      key: "W trakcie projektowania",
      label: "W Trakcie Projektowania",
      color: "text-primary",
    },
    { key: "Do akceptacji", label: "Do Akceptacji", color: "text-warning" },
    { key: "Zaakceptowane", label: "Zaakceptowane", color: "text-success" },
    {
      key: "Wymagają poprawek",
      label: "Wymagają Poprawek",
      color: "text-danger",
    },
  ];

  const byColumn = useMemo(
    () =>
      Object.fromEntries(
        columns.map((c) => [
          c.key,
          filteredDesignTiles.filter((t) => t.status === c.key),
        ])
      ) as Record<DesignStatus, Tile[]>,
    [filteredDesignTiles, columns]
  );

  // Group tiles inside each column by project id
  const byColumnGrouped = useMemo(() => {
    const result = {} as Record<DesignStatus, Record<string, Tile[]>>;
    (columns.map((c) => c.key) as DesignStatus[]).forEach((colKey) => {
      const items = byColumn[colKey] || [];
      const groups: Record<string, Tile[]> = {};
      for (const t of items) {
        const pid = t.project || "—";
        if (!groups[pid]) groups[pid] = [];
        groups[pid].push(t);
      }
      result[colKey] = groups;
    });
    return result;
  }, [byColumn, columns]);

  // Expand/collapse state per column+project
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleGroup = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  const isExpanded = (key: string) => expanded[key] !== false;

  const moveTile = (id: string, status: DesignStatus) => {
    updateTile(id, { status });
  };

  const handleEditTile = (tile: Tile) => {
    setEditingTile(tile);
    setShowTileModal(true);
  };

  const handleSaveTile = (tileData: Omit<Tile, "id">) => {
    if (editingTile) {
      updateTile(editingTile.id, tileData);
    }
    setShowTileModal(false);
    setEditingTile(null);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Dział Projektowy"
        subtitle="Zarządzanie zadaniami projektowymi"
        actions={
          <AppSpace>
            <AppSelect
              size="small"
              style={{ minWidth: 240 }}
              value={selectedProjectId}
              onChange={(val) => setSelectedProjectId(val)}
              options={[
                { value: "all", label: "Wszystkie projekty" },
                ...(projects || []).map((p) => ({
                  value: p.id,
                  label: p.name,
                })),
              ]}
            />
            <AppSpace>
              <Switch
                size="small"
                checked={onlySelectedProject}
                onChange={(v) => setOnlySelectedProject(v)}
              />
              <Body color="muted" style={{ fontSize: 12 }}>
                Pokaż tylko wybrany projekt
              </Body>
            </AppSpace>
            <AppTag color="blue">{filteredDesignTiles.length} zadań</AppTag>
          </AppSpace>
        }
      />

      <AppRow gutter={[24, 24]}>
        <AppCol xs={24} xl={18}>
          <AppRow gutter={[16, 16]}>
            {columns.map((col) => (
              <AppCol xs={24} md={12} xl={8} key={col.key}>
                <AppCard
                  title={
                    <AppSpace
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <H3
                        style={{
                          margin: 0,
                          color: `var(--${col.color.replace("text-", "")})`,
                        }}
                      >
                        {col.label}
                      </H3>
                      <AppTag>{byColumn[col.key].length}</AppTag>
                    </AppSpace>
                  }
                  style={{ height: "100%" }}
                >
                  <ColumnDrop onDrop={(id) => moveTile(id, col.key)}>
                    {Object.entries(byColumnGrouped[col.key] || {}).length ===
                      0 && (
                      <Body color="muted" style={{ textAlign: "center" }}>
                        Brak zadań
                      </Body>
                    )}
                    {Object.entries(byColumnGrouped[col.key] || {})
                      .sort(([a], [b]) => {
                        const an = projectsById[a]?.name || a;
                        const bn = projectsById[b]?.name || b;
                        return an.localeCompare(bn);
                      })
                      .map(([projectId, items]) => {
                        const headerKey = `${col.key}:${projectId}`;
                        const name = projectsById[projectId]?.name || projectId;
                        return (
                          <div
                            key={headerKey}
                            style={{
                              borderBottom: "1px solid var(--border-main)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 12px",
                                backgroundColor: "var(--bg-secondary)",
                                margin: "-12px -12px 0 -12px",
                              }}
                            >
                              <H3
                                style={{
                                  margin: 0,
                                  fontSize: 14,
                                  fontWeight: 600,
                                }}
                              >
                                {name}
                              </H3>
                              <AppSpace>
                                <AppTag>{items.length}</AppTag>
                                <AppButton
                                  size="small"
                                  onClick={() => toggleGroup(headerKey)}
                                >
                                  {isExpanded(headerKey) ? "Zwiń" : "Rozwiń"}
                                </AppButton>
                              </AppSpace>
                            </div>
                            {isExpanded(headerKey) && (
                              <div style={{ marginTop: 8 }}>
                                {items.map((tile) => (
                                  <DesignCardItem
                                    key={tile.id}
                                    tile={tile}
                                    onSelect={() => setSelected(tile)}
                                    onEdit={() => handleEditTile(tile)}
                                    onAccept={() =>
                                      moveTile(tile.id, "Zaakceptowane")
                                    }
                                    onNeedsFix={() =>
                                      moveTile(tile.id, "Wymagają poprawek")
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </ColumnDrop>
                </AppCard>
              </AppCol>
            ))}
          </AppRow>
        </AppCol>
        <AppCol xs={24} xl={6}>
          <AppCard title="Szczegóły" style={{ marginBottom: 24 }}>
            {!selected && (
              <Body color="muted" style={{ textAlign: "center" }}>
                Wybierz kafelek po lewej
              </Body>
            )}
            {selected && (
              <AppSpace direction="vertical" style={{ width: "100%" }}>
                <H3 style={{ margin: 0 }}>{selected.name}</H3>
                <Body color="muted" style={{ fontSize: 12 }}>
                  {selected.project} • {selected.assignee || "Nieprzypisany"}
                </Body>
                <AppTag color="blue">{selected.status}</AppTag>

                <div>
                  <Body color="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                    Przypisz projektanta (Push)
                  </Body>
                  <AppSpace style={{ width: "100%" }}>
                    <AppSelect
                      style={{ flex: 1 }}
                      size="small"
                      placeholder="Wybierz projektanta"
                      value={selected.przypisany_projektant || undefined}
                      onChange={(val) =>
                        updateTile(selected.id, {
                          przypisany_projektant: val,
                          status: "W trakcie projektowania" as any,
                        })
                      }
                      options={[
                        { value: "Anna Kowalska", label: "Anna Kowalska" },
                        { value: "Piotr Nowak", label: "Piotr Nowak" },
                        { value: "Kamil Arndt", label: "Kamil Arndt" },
                      ]}
                    />
                    <AppButton
                      size="small"
                      onClick={async () => {
                        await updateTile(selected.id, {
                          status: "W trakcie projektowania" as any,
                        });
                        try {
                          const { useCalendarStore } = await import(
                            "../stores/calendarStore"
                          );
                          const title = `Projekt: ${selected.name}`;
                          useCalendarStore.getState().autoSchedule({
                            resourceId: "designer-1",
                            tasks: [
                              {
                                title,
                                durationH: 2,
                                meta: {
                                  tileId: selected.id,
                                  projectId: selected.project,
                                },
                                phase: "projektowanie",
                              },
                            ],
                          });
                        } catch {
                          // noop
                        }
                      }}
                    >
                      Przypisz
                    </AppButton>
                  </AppSpace>
                </div>

                <Body color="muted" style={{ fontSize: 12 }}>
                  Koszt robocizny: {selected.laborCost || 0} PLN
                </Body>

                <div
                  style={{
                    borderTop: "1px solid var(--border-main)",
                    paddingTop: 12,
                  }}
                >
                  <Body color="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                    Komponenty BOM ({selected.bom?.length || 0})
                  </Body>
                  {selected.bom?.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "4px 0",
                        borderBottom: "1px solid var(--border-light)",
                        fontSize: 12,
                      }}
                    >
                      {item.name} - {item.quantity} {item.unit}
                    </div>
                  ))}
                  {(!selected.bom || selected.bom.length === 0) && (
                    <Body color="muted" style={{ fontSize: 12 }}>
                      Brak komponentów
                    </Body>
                  )}
                </div>

                <AppButton
                  type="primary"
                  size="small"
                  onClick={() => handleEditTile(selected)}
                  style={{ width: "100%" }}
                >
                  Edytuj
                </AppButton>
              </AppSpace>
            )}
          </AppCard>

          <AppCard title="Pula Zadań (Pull)">
            {tiles
              .filter(
                (t) =>
                  t.status === "W KOLEJCE" &&
                  (!onlySelectedProject || selectedProjectId === "all"
                    ? true
                    : t.project === selectedProjectId)
              )
              .map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4px 0",
                  }}
                >
                  <Body
                    style={{
                      fontSize: 12,
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.name}
                  </Body>
                  <AppButton
                    size="small"
                    type="primary"
                    onClick={() =>
                      updateTile(t.id, { status: "W trakcie projektowania" })
                    }
                  >
                    Weź
                  </AppButton>
                </div>
              ))}
            {tiles.filter(
              (t) =>
                t.status === "W KOLEJCE" &&
                (!onlySelectedProject || selectedProjectId === "all"
                  ? true
                  : t.project === selectedProjectId)
            ).length === 0 && (
              <Body color="muted" style={{ textAlign: "center", fontSize: 12 }}>
                Brak dostępnych zadań
              </Body>
            )}
          </AppCard>
        </AppCol>
      </AppRow>

      {/* Tile Edit Modal */}
      <TileEditDrawer
        open={showTileModal}
        onClose={() => {
          setShowTileModal(false);
          setEditingTile(null);
        }}
        onSave={handleSaveTile}
        tile={editingTile || undefined}
        projectId={editingTile?.project}
      />
    </PageLayout>
  );
}

function DesignCardItem({
  tile,
  onSelect,
  onEdit,
  onAccept,
  onNeedsFix,
}: {
  tile: Tile;
  onSelect: () => void;
  onEdit: () => void;
  onAccept?: () => void;
  onNeedsFix?: () => void;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "DESIGN_CARD",
      item: { id: tile.id },
      collect: (m) => ({ isDragging: m.isDragging() }),
    }),
    [tile.id]
  );

  const refCb = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) drag(el);
    },
    [drag]
  );

  return (
    <div
      ref={refCb}
      style={{
        opacity: isDragging ? 0.5 : 1,
        margin: "4px 0",
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      <AppCard size="small">
        <AppSpace direction="vertical" style={{ width: "100%" }}>
          <H3 style={{ margin: 0, fontSize: 14 }}>{tile.name}</H3>
          <Body color="muted" style={{ fontSize: 12 }}>
            {tile.project} • {tile.assignee || "Nieprzypisany"}
          </Body>
          <AppSpace>
            <AppButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edytuj
            </AppButton>
            {onAccept && (
              <AppButton
                size="small"
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
              >
                ✓
              </AppButton>
            )}
            {onNeedsFix && (
              <AppButton
                size="small"
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  onNeedsFix();
                }}
              >
                ✗
              </AppButton>
            )}
          </AppSpace>
        </AppSpace>
      </AppCard>
    </div>
  );
}

function ColumnDrop({
  onDrop,
  children,
}: {
  onDrop: (id: string) => void;
  children: React.ReactNode;
}) {
  const [, drop] = useDrop(
    () => ({
      accept: "DESIGN_CARD",
      drop: (item: any) => onDrop(item.id),
    }),
    [onDrop]
  );

  const refCb = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) drop(el);
    },
    [drop]
  );

  return (
    <div ref={refCb} style={{ minHeight: 200 }}>
      {children}
    </div>
  );
}
