import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button.enhanced";

const meta: Meta<typeof Button> = {
  title: "Design System/Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Enhanced Button component using design tokens from Figma. Supports multiple variants, sizes, and states with full accessibility compliance.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "success",
        "warning",
        "gradient",
      ],
      description: "Visual style variant of the button",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon", "fab"],
      description: "Size of the button",
    },
    loading: {
      control: { type: "boolean" },
      description: "Shows loading spinner and disables button",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables the button",
    },
    children: {
      control: { type: "text" },
      description: "Button content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="gradient">Gradient</Button>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">⚙</Button>
      <Button size="fab">+</Button>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button variant="destructive" loading>
        Destructive Loading
      </Button>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon="➕">Add Item</Button>
      <Button rightIcon="→">Continue</Button>
      <Button leftIcon="💾" rightIcon="✓">
        Save Changes
      </Button>
      <Button size="icon" leftIcon="⚙">
        Settings
      </Button>
    </div>
  ),
};

// FAB (Floating Action Button)
export const FloatingActionButton: Story = {
  render: () => (
    <div className="relative h-32 w-32 bg-gray-100 rounded-lg">
      <Button
        size="fab"
        variant="gradient"
        className="absolute bottom-4 right-4"
      >
        +
      </Button>
    </div>
  ),
};

// Accessibility
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <p>
        All buttons have proper ARIA labels and keyboard navigation support.
      </p>
      <div className="flex gap-4">
        <Button aria-label="Save document">💾</Button>
        <Button aria-label="Delete item" variant="destructive">
          🗑
        </Button>
        <Button aria-label="Edit profile">✏</Button>
      </div>
    </div>
  ),
};
