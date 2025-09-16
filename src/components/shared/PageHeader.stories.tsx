import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Shared/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    backButton: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Dashboard",
    subtitle: "Overview of your projects and tasks",
  },
};

export const WithBackButton: Story = {
  args: {
    title: "Project Details",
    subtitle: "Manage project settings and team members",
    backButton: {
      onClick: () => console.log("Back clicked"),
      label: "Back",
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: "Advanced Project Management Dashboard with Real-time Analytics",
    subtitle:
      "Comprehensive overview of all ongoing projects, team performance metrics, and resource allocation across multiple departments",
  },
};

export const Minimal: Story = {
  args: {
    title: "Settings",
  },
};

export const WithActions: Story = {
  args: {
    title: "Projects",
    subtitle: "Manage your projects",
    actions: (
      <div style={{ display: "flex", gap: "8px" }}>
        <button>Add Project</button>
        <button>Export</button>
      </div>
    ),
  },
};
