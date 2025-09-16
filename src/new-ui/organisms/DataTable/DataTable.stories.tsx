import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { Column, DataTable } from "./DataTable";

// Sample data types
interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "pending";
  progress: number;
  deadline: string;
  client: string;
}

interface Material {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  projects: number;
  status: "active" | "inactive";
}

const meta: Meta<typeof DataTable> = {
  title: "Organisms/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: { type: "boolean" },
    },
    searchable: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const projectsData: Project[] = [
  {
    id: "1",
    name: "Project Alpha",
    status: "active",
    progress: 75,
    deadline: "2024-03-15",
    client: "TechCorp Industries",
  },
  {
    id: "2",
    name: "Project Beta",
    status: "completed",
    progress: 100,
    deadline: "2024-02-28",
    client: "Manufacturing Co.",
  },
  {
    id: "3",
    name: "Project Gamma",
    status: "pending",
    progress: 25,
    deadline: "2024-04-20",
    client: "AutoParts Ltd.",
  },
  {
    id: "4",
    name: "Project Delta",
    status: "active",
    progress: 90,
    deadline: "2024-03-10",
    client: "SteelWorks Inc.",
  },
];

const materialsData: Material[] = [
  {
    id: "1",
    name: "Steel Sheet",
    type: "Metal",
    quantity: 150,
    unit: "sheets",
    price: 45.5,
    supplier: "MetalCorp",
  },
  {
    id: "2",
    name: "Aluminum Rod",
    type: "Metal",
    quantity: 75,
    unit: "pieces",
    price: 12.3,
    supplier: "AluSupply",
  },
  {
    id: "3",
    name: "Plastic Granules",
    type: "Plastic",
    quantity: 500,
    unit: "kg",
    price: 8.75,
    supplier: "PlastTech",
  },
];

const clientsData: Client[] = [
  {
    id: "1",
    name: "TechCorp Industries",
    email: "contact@techcorp.com",
    phone: "+1-555-0123",
    projects: 5,
    status: "active",
  },
  {
    id: "2",
    name: "Manufacturing Co.",
    email: "info@manufacturing.com",
    phone: "+1-555-0456",
    projects: 3,
    status: "active",
  },
  {
    id: "3",
    name: "AutoParts Ltd.",
    email: "sales@autoparts.com",
    phone: "+1-555-0789",
    projects: 1,
    status: "inactive",
  },
];

export const ProjectsTable: Story = {
  render: () => {
    const columns: Column<Project>[] = [
      {
        key: "name",
        title: "Project Name",
        sortable: true,
      },
      {
        key: "status",
        title: "Status",
        render: (value: string) => (
          <Badge
            variant={
              value === "active"
                ? "success"
                : value === "completed"
                ? "default"
                : "warning"
            }
          >
            {value}
          </Badge>
        ),
        sortable: true,
      },
      {
        key: "progress",
        title: "Progress",
        render: (value: number) => `${value}%`,
        sortable: true,
      },
      {
        key: "deadline",
        title: "Deadline",
        sortable: true,
      },
      {
        key: "client",
        title: "Client",
        sortable: true,
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="tw-flex tw-gap-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm">View</Button>
          </div>
        ),
      },
    ];

    return (
      <DataTable
        data={projectsData}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search projects..."
        onRowClick={(project) => console.log("Clicked project:", project)}
      />
    );
  },
};

export const MaterialsTable: Story = {
  render: () => {
    const columns: Column<Material>[] = [
      {
        key: "name",
        title: "Material Name",
        sortable: true,
      },
      {
        key: "type",
        title: "Type",
        sortable: true,
      },
      {
        key: "quantity",
        title: "Quantity",
        render: (value: number, record: Material) => `${value} ${record.unit}`,
        sortable: true,
      },
      {
        key: "price",
        title: "Price",
        render: (value: number) => `$${value.toFixed(2)}`,
        sortable: true,
      },
      {
        key: "supplier",
        title: "Supplier",
        sortable: true,
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="tw-flex tw-gap-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        ),
      },
    ];

    return (
      <DataTable
        data={materialsData}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search materials..."
      />
    );
  },
};

export const ClientsTable: Story = {
  render: () => {
    const columns: Column<Client>[] = [
      {
        key: "name",
        title: "Client Name",
        sortable: true,
      },
      {
        key: "email",
        title: "Email",
        sortable: true,
      },
      {
        key: "phone",
        title: "Phone",
        sortable: true,
      },
      {
        key: "projects",
        title: "Projects",
        render: (value: number) => `${value} active`,
        sortable: true,
      },
      {
        key: "status",
        title: "Status",
        render: (value: string) => (
          <Badge variant={value === "active" ? "success" : "outline"}>
            {value}
          </Badge>
        ),
        sortable: true,
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="tw-flex tw-gap-2">
            <Button size="sm" variant="outline">
              Contact
            </Button>
            <Button size="sm">View Projects</Button>
          </div>
        ),
      },
    ];

    return (
      <DataTable
        data={clientsData}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search clients..."
      />
    );
  },
};

export const LoadingState: Story = {
  render: () => {
    const columns: Column<Project>[] = [
      { key: "name", title: "Project Name", sortable: true },
      { key: "status", title: "Status", sortable: true },
      { key: "progress", title: "Progress", sortable: true },
      { key: "deadline", title: "Deadline", sortable: true },
    ];

    return (
      <DataTable data={[]} columns={columns} loading={true} searchable={true} />
    );
  },
};

export const NoSearch: Story = {
  render: () => {
    const columns: Column<Project>[] = [
      { key: "name", title: "Project Name", sortable: true },
      { key: "status", title: "Status", sortable: true },
      { key: "progress", title: "Progress", sortable: true },
      { key: "deadline", title: "Deadline", sortable: true },
    ];

    return (
      <DataTable data={projectsData} columns={columns} searchable={false} />
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const columns: Column<Project>[] = [
      { key: "name", title: "Project Name", sortable: true },
      { key: "status", title: "Status", sortable: true },
      { key: "progress", title: "Progress", sortable: true },
      { key: "deadline", title: "Deadline", sortable: true },
    ];

    return (
      <DataTable
        data={[]}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search projects..."
      />
    );
  },
};

export const LargeDataset: Story = {
  render: () => {
    // Generate large dataset
    const largeData: Project[] = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Project ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      status: ["active", "completed", "pending"][i % 3] as
        | "active"
        | "completed"
        | "pending",
      progress: Math.floor(Math.random() * 100),
      deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      client: `Client ${i + 1}`,
    }));

    const columns: Column<Project>[] = [
      { key: "name", title: "Project Name", sortable: true },
      {
        key: "status",
        title: "Status",
        render: (value: string) => (
          <Badge
            variant={
              value === "active"
                ? "success"
                : value === "completed"
                ? "default"
                : "warning"
            }
          >
            {value}
          </Badge>
        ),
        sortable: true,
      },
      {
        key: "progress",
        title: "Progress",
        render: (value: number) => `${value}%`,
        sortable: true,
      },
      { key: "deadline", title: "Deadline", sortable: true },
      { key: "client", title: "Client", sortable: true },
    ];

    return (
      <div className="tw-h-96">
        <DataTable
          data={largeData}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search in 50 projects..."
        />
      </div>
    );
  },
};
