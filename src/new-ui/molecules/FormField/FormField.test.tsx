import { render, screen } from "@testing-library/react";
import { Input } from "../../atoms/Input/Input";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders with label", () => {
    render(
      <FormField label="Test Label">
        <Input placeholder="Test input" />
      </FormField>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test input")).toBeInTheDocument();
  });

  it("renders with error message", () => {
    render(
      <FormField label="Test Label" error="This is an error">
        <Input placeholder="Test input" />
      </FormField>
    );

    expect(screen.getByText("This is an error")).toBeInTheDocument();
    expect(screen.getByText("This is an error")).toHaveClass(
      "tw-text-destructive"
    );
  });

  it("renders with required indicator", () => {
    render(
      <FormField label="Test Label" required>
        <Input placeholder="Test input" />
      </FormField>
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("tw-after:content-['*']");
  });

  it("renders with description", () => {
    render(
      <FormField label="Test Label" description="This is a description">
        <Input placeholder="Test input" />
      </FormField>
    );

    expect(screen.getByText("This is a description")).toBeInTheDocument();
    expect(screen.getByText("This is a description")).toHaveClass(
      "tw-text-muted-foreground"
    );
  });

  it("applies custom className", () => {
    render(
      <FormField label="Test Label" className="custom-field">
        <Input placeholder="Test input" />
      </FormField>
    );

    const field = screen.getByText("Test Label").closest("div");
    expect(field).toHaveClass("custom-field");
  });

  it("renders without label", () => {
    render(
      <FormField>
        <Input placeholder="Test input" />
      </FormField>
    );

    expect(screen.getByPlaceholderText("Test input")).toBeInTheDocument();
    expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
  });
});
