import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    error: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
    placeholder: "Enter text...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter your email",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter number",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Input with error",
    error: true,
  },
};

export const ErrorWithValue: Story = {
  args: {
    defaultValue: "Invalid value",
    error: true,
  },
};

export const LongPlaceholder: Story = {
  args: {
    placeholder:
      "This is a very long placeholder text that should wrap or truncate appropriately",
  },
};

export const CustomWidth: Story = {
  args: {
    placeholder: "Custom width input",
    style: { width: "300px" },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="tw-space-y-4 tw-w-80">
      <div>
        <label className="tw-text-sm tw-font-medium tw-mb-2 tw-block">
          Default
        </label>
        <Input placeholder="Default input" />
      </div>
      <div>
        <label className="tw-text-sm tw-font-medium tw-mb-2 tw-block">
          With Value
        </label>
        <Input defaultValue="Hello World" placeholder="Enter text..." />
      </div>
      <div>
        <label className="tw-text-sm tw-font-medium tw-mb-2 tw-block">
          Disabled
        </label>
        <Input placeholder="Disabled input" disabled />
      </div>
      <div>
        <label className="tw-text-sm tw-font-medium tw-mb-2 tw-block">
          Error
        </label>
        <Input placeholder="Input with error" error />
      </div>
      <div>
        <label className="tw-text-sm tw-font-medium tw-mb-2 tw-block">
          Error with Value
        </label>
        <Input defaultValue="Invalid value" error />
      </div>
    </div>
  ),
};
