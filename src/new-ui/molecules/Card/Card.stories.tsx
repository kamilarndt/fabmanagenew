import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="tw-w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description of the card content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="tw-w-80">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>
          This card includes a footer with actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with footer actions.</p>
      </CardContent>
      <CardFooter className="tw-justify-between">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProjectCard: Story = {
  render: () => (
    <Card className="tw-w-80">
      <CardHeader>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle className="tw-text-lg">Project Alpha</CardTitle>
          <Badge variant="success">Active</Badge>
        </div>
        <CardDescription>
          Manufacturing project for automotive parts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="tw-space-y-2">
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Progress:</span>
            <span>75%</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Deadline:</span>
            <span>2024-03-15</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Team:</span>
            <span>5 members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="tw-w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const MaterialCard: Story = {
  render: () => (
    <Card className="tw-w-80">
      <CardHeader>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle className="tw-text-lg">Steel Sheet</CardTitle>
          <Badge variant="outline">In Stock</Badge>
        </div>
        <CardDescription>High-grade steel for manufacturing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="tw-space-y-2">
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Quantity:</span>
            <span>150 sheets</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Thickness:</span>
            <span>2.5mm</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Price:</span>
            <span>$45.50/sheet</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="tw-justify-between">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button size="sm">Use Material</Button>
      </CardFooter>
    </Card>
  ),
};

export const ClientCard: Story = {
  render: () => (
    <Card className="tw-w-80">
      <CardHeader>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle className="tw-text-lg">TechCorp Industries</CardTitle>
          <Badge variant="default">Premium</Badge>
        </div>
        <CardDescription>Leading technology manufacturer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="tw-space-y-2">
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Contact:</span>
            <span>John Smith</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Email:</span>
            <span>john@techcorp.com</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Projects:</span>
            <span>12 active</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="tw-w-full">Contact Client</Button>
      </CardFooter>
    </Card>
  ),
};

export const WarningCard: Story = {
  render: () => (
    <Card className="tw-w-80 tw-border-warning">
      <CardHeader>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle className="tw-text-lg tw-text-warning">
            Low Stock Alert
          </CardTitle>
          <Badge variant="warning">Warning</Badge>
        </div>
        <CardDescription>Material inventory is running low</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="tw-space-y-2">
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Material:</span>
            <span>Aluminum Sheets</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Remaining:</span>
            <span className="tw-text-warning">5 units</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Min. Required:</span>
            <span>20 units</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="warning" className="tw-w-full">
          Order More
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ErrorCard: Story = {
  render: () => (
    <Card className="tw-w-80 tw-border-destructive">
      <CardHeader>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle className="tw-text-lg tw-text-destructive">
            Production Error
          </CardTitle>
          <Badge variant="destructive">Critical</Badge>
        </div>
        <CardDescription>Machine malfunction detected</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="tw-space-y-2">
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Machine:</span>
            <span>CNC-001</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Error Code:</span>
            <span className="tw-text-destructive">E-404</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm">
            <span className="tw-text-muted-foreground">Time:</span>
            <span>14:32</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="tw-w-full">
          Fix Issue
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-w-full tw-max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Project Alpha</CardTitle>
          <CardDescription>Manufacturing project</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Project details and progress information.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="tw-w-full">
            View
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Material Stock</CardTitle>
          <CardDescription>Inventory management</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Current stock levels and availability.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="tw-w-full">
            Manage
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Portal</CardTitle>
          <CardDescription>Customer management</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Client information and project history.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="tw-w-full">
            Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
