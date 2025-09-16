import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "StatusBadge component displays status information with appropriate colors and styling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    status: { control: "text" },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    showIcon: { control: "boolean" },
    showTooltip: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: "active",
  },
};

export const Small: Story = {
  args: {
    status: "completed",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    status: "pending",
    size: "lg",
  },
};

export const WithoutIcon: Story = {
  args: {
    status: "in_progress",
    showIcon: false,
  },
};

export const WithoutTooltip: Story = {
  args: {
    status: "delayed",
    showTooltip: false,
  },
};

export const ProjectStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <StatusBadge status="draft" />
      <StatusBadge status="active" />
      <StatusBadge status="completed" />
      <StatusBadge status="on_hold" />
      <StatusBadge status="cancelled" />
    </div>
  ),
};

export const TileStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <StatusBadge status="W KOLEJCE" />
      <StatusBadge status="Projektowanie" />
      <StatusBadge status="Do akceptacji" />
      <StatusBadge status="Zaakceptowane" />
      <StatusBadge status="W produkcji CNC" />
      <StatusBadge status="Gotowy do montażu" />
      <StatusBadge status="Zakończony" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <StatusBadge status="active" size="sm" />
      <StatusBadge status="active" size="md" />
      <StatusBadge status="active" size="lg" />
    </div>
  ),
};
