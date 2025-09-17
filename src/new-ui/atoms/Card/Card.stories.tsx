import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../Button/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible and reusable card component with header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated', 'flat'],
      description: 'Visual variant of the card',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size of the card',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Simple card content',
  },
}

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the card content area.</p>
        </CardContent>
      </>
    ),
  },
}

export const Complete: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Detailed information about your current project status and metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> Active</p>
            <p><strong>Progress:</strong> 75%</p>
            <p><strong>Deadline:</strong> March 15, 2024</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="primary">View Details</Button>
        </CardFooter>
      </>
    ),
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <CardHeader>
          <CardTitle>Outlined Card</CardTitle>
          <CardDescription>This card has a thicker border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with outlined styling.</p>
        </CardContent>
      </>
    ),
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>This card has enhanced shadow.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with elevated styling.</p>
        </CardContent>
      </>
    ),
  },
}

export const Flat: Story = {
  args: {
    variant: 'flat',
    children: (
      <>
        <CardHeader>
          <CardTitle>Flat Card</CardTitle>
          <CardDescription>This card has no border or shadow.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with flat styling.</p>
        </CardContent>
      </>
    ),
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <>
        <CardHeader>
          <CardTitle>No Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has no padding.</p>
        </CardContent>
      </>
    ),
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <>
        <CardHeader>
          <CardTitle>Small Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has small padding.</p>
        </CardContent>
      </>
    ),
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <>
        <CardHeader>
          <CardTitle>Large Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has large padding.</p>
        </CardContent>
      </>
    ),
  },
}

export const WithActions: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Actions Card</CardTitle>
          <CardDescription>Card with multiple action buttons.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card contains multiple action buttons in the footer.</p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save</Button>
          </div>
        </CardFooter>
      </>
    ),
  },
}

export const CustomStyling: Story = {
  args: {
    className: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
    children: (
      <>
        <CardHeader>
          <CardTitle className="text-blue-900">Custom Styled Card</CardTitle>
          <CardDescription className="text-blue-700">
            This card has custom gradient background and colors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800">Content with custom styling applied.</p>
        </CardContent>
      </>
    ),
  },
}
