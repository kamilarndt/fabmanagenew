import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

describe("Card", () => {
  it("renders basic card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByText("Title").closest(".tw-rounded-lg");
    expect(card).toHaveClass("tw-border");

    const header = screen.getByText("Title").closest("div");
    expect(header).toHaveClass("tw-flex", "tw-flex-col", "tw-space-y-1.5");

    const content = screen.getByText("Content");
    expect(content).toHaveClass("tw-p-6", "tw-pt-0");
  });

  it("renders without optional parts", () => {
    render(
      <Card>
        <CardContent>Only Content</CardContent>
      </Card>
    );

    expect(screen.getByText("Only Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Card className="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByText("Content").closest(".tw-rounded-lg");
    expect(card).toHaveClass("custom-card");
  });
});
