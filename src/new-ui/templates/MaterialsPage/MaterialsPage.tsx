import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { SearchBox } from "@/new-ui/molecules/SearchBox/SearchBox";
import { Select, type SelectOption } from "@/new-ui/molecules/Select/Select";
import { DataTable } from "@/new-ui/organisms/DataTable/DataTable";
import { PageHeader } from "@/new-ui/organisms/PageHeader/PageHeader";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface Material {
  id: string;
  name: string;
  type: string;
  supplier: string;
  cost: number;
  quantity: number;
  unit: string;
  status: "available" | "low-stock" | "out-of-stock";
  lastUpdated: string;
}

export interface MaterialsPageProps {
  materials: Material[];
  onMaterialClick?: (materialId: string) => void;
  onAddMaterial?: () => void;
  onEditMaterial?: (materialId: string) => void;
  onDeleteMaterial?: (materialId: string) => void;
  className?: string;
}

export function MaterialsPage({
  materials,
  onMaterialClick,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
  className,
}: MaterialsPageProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const statusOptions: SelectOption[] = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  const typeOptions: SelectOption[] = [
    { value: "all", label: "All Types" },
    ...Array.from(new Set(materials.map((m) => m.type))).map((type) => ({
      value: type,
      label: type,
    })),
  ];

  const filteredMaterials = React.useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || material.status === statusFilter;
      const matchesType = typeFilter === "all" || material.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [materials, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: Material["status"]) => {
    switch (status) {
      case "available":
        return "success";
      case "low-stock":
        return "warning";
      case "out-of-stock":
        return "destructive";
      default:
        return "default";
    }
  };

  const columns = [
    {
      key: "name" as keyof Material,
      title: "Material",
      sortable: true,
      render: (value: string, record: Material) => (
        <div>
          <p className="tw-font-medium">{value}</p>
          <p className="tw-text-sm tw-text-muted-foreground">{record.type}</p>
        </div>
      ),
    },
    {
      key: "supplier" as keyof Material,
      title: "Supplier",
      sortable: true,
    },
    {
      key: "quantity" as keyof Material,
      title: "Quantity",
      sortable: true,
      render: (value: number, record: Material) => (
        <div className="tw-text-right">
          <p className="tw-font-medium">
            {value} {record.unit}
          </p>
        </div>
      ),
    },
    {
      key: "cost" as keyof Material,
      title: "Cost",
      sortable: true,
      render: (value: number) => (
        <div className="tw-text-right">
          <p className="tw-font-medium">${value.toFixed(2)}</p>
        </div>
      ),
    },
    {
      key: "status" as keyof Material,
      title: "Status",
      sortable: true,
      render: (value: Material["status"]) => (
        <Badge variant={getStatusColor(value)}>{value.replace("-", " ")}</Badge>
      ),
    },
    {
      key: "id" as keyof Material,
      title: "Actions",
      render: (_: any, record: Material) => (
        <div className="tw-flex tw-gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditMaterial?.(record.id)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteMaterial?.(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const breadcrumbs = [{ label: "Materials" }];

  const actions = <Button onClick={onAddMaterial}>Add Material</Button>;

  return (
    <div className={cn("tw-space-y-6", className)}>
      <PageHeader
        title="Materials"
        description="Manage your material inventory and suppliers"
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <SearchBox
              placeholder="Search materials or suppliers..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            />
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="Filter by type"
            />
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Materials ({filteredMaterials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredMaterials}
            columns={columns}
            onRowClick={(record) => onMaterialClick?.(record.id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
