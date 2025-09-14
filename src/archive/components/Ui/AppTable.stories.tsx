import type { Meta, StoryObj } from "@storybook/react";
import { AppTable } from "./AppTable";

interface SampleData {
  id: string;
  name: string;
  status: string;
  value: number;
  date: string;
}

const sampleData: SampleData[] = [
  {
    id: "1",
    name: "Project Alpha",
    status: "Active",
    value: 15000,
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Project Beta",
    status: "Pending",
    value: 8500,
    date: "2024-01-20",
  },
  {
    id: "3",
    name: "Project Gamma",
    status: "Completed",
    value: 25000,
    date: "2024-01-10",
  },
  {
    id: "4",
    name: "Project Delta",
    status: "Active",
    value: 12000,
    date: "2024-01-25",
  },
];

const meta: Meta<typeof AppTable<SampleData>> = {
  title: "UI/AppTable",
  component: AppTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    searchable: { control: "boolean" },
    exportable: { control: "boolean" },
    columnManagement: { control: "boolean" },
    globalSearch: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: "name", title: "Project Name", dataIndex: "name", sortable: true },
      { key: "status", title: "Status", dataIndex: "status", sortable: true },
      { key: "value", title: "Value", dataIndex: "value", sortable: true },
      { key: "date", title: "Date", dataIndex: "date", sortable: true },
    ],
    rowKey: (record) => record.id,
  },
};

export const WithSearch: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: "name", title: "Project Name", dataIndex: "name", sortable: true },
      { key: "status", title: "Status", dataIndex: "status", sortable: true },
      { key: "value", title: "Value", dataIndex: "value", sortable: true },
      { key: "date", title: "Date", dataIndex: "date", sortable: true },
    ],
    rowKey: (record) => record.id,
    searchable: true,
    globalSearch: true,
  },
};

export const WithExport: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: "name", title: "Project Name", dataIndex: "name", sortable: true },
      { key: "status", title: "Status", dataIndex: "status", sortable: true },
      { key: "value", title: "Value", dataIndex: "value", sortable: true },
      { key: "date", title: "Date", dataIndex: "date", sortable: true },
    ],
    rowKey: (record) => record.id,
    exportable: true,
    onExport: (data) => console.log("Export data:", data),
  },
};

export const WithColumnManagement: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: "name", title: "Project Name", dataIndex: "name", sortable: true },
      { key: "status", title: "Status", dataIndex: "status", sortable: true },
      { key: "value", title: "Value", dataIndex: "value", sortable: true },
      { key: "date", title: "Date", dataIndex: "date", sortable: true },
    ],
    rowKey: (record) => record.id,
    columnManagement: true,
  },
};

export const FullFeatures: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: "name", title: "Project Name", dataIndex: "name", sortable: true },
      { key: "status", title: "Status", dataIndex: "status", sortable: true },
      { key: "value", title: "Value", dataIndex: "value", sortable: true },
      { key: "date", title: "Date", dataIndex: "date", sortable: true },
    ],
    rowKey: (record) => record.id,
    searchable: true,
    exportable: true,
    columnManagement: true,
    globalSearch: true,
    onExport: (data) => console.log("Export data:", data),
  },
};
