import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline", "success", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Error",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const WithNumber: Story = {
  args: {
    children: "42",
  },
};

export const LongText: Story = {
  args: {
    children: "Very Long Badge Text",
  },
};

export const WithIcon: Story = {
  args: {
    children: "🚀 Feature",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="tw-flex tw-flex-wrap tw-gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WithNumbers: Story = {
  render: () => (
    <div className="tw-flex tw-flex-wrap tw-gap-2">
      <Badge>1</Badge>
      <Badge variant="destructive">99+</Badge>
      <Badge variant="success">✓</Badge>
      <Badge variant="warning">!</Badge>
      <Badge variant="outline">42</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="tw-space-y-2">
      <div className="tw-flex tw-items-center tw-gap-2">
        <span className="tw-text-sm">Project Status:</span>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
        <span className="tw-text-sm">Priority:</span>
        <Badge variant="warning">High</Badge>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
        <span className="tw-text-sm">Issue:</span>
        <Badge variant="destructive">Critical</Badge>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
        <span className="tw-text-sm">Type:</span>
        <Badge variant="outline">Feature</Badge>
      </div>
    </div>
  ),
};
