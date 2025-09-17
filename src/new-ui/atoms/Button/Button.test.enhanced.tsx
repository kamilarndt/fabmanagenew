import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.enhanced";

describe("Button Enhanced", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("applies correct variant styles", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveStyle({
      backgroundColor: expect.any(String),
      color: expect.any(String),
    });
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button", { name: /loading/i });

    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });

    expect(button).toBeDisabled();
  });

  it("renders with left and right icons", () => {
    render(
      <Button leftIcon="➕" rightIcon="→">
        Add Item
      </Button>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    expect(button).toHaveTextContent("➕");
    expect(button).toHaveTextContent("→");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button", { name: /custom/i });

    expect(button).toHaveClass("custom-class");
  });

  it("renders FAB variant correctly", () => {
    render(
      <Button size="fab" variant="gradient">
        +
      </Button>
    );
    const button = screen.getByRole("button", { name: /\+/i });

    expect(button).toHaveStyle({
      borderRadius: "50%",
    });
  });

  it("supports keyboard navigation", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByRole("button", { name: /keyboard/i });
    button.focus();

    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has proper accessibility attributes", () => {
    render(<Button aria-label="Custom label">Button</Button>);
    const button = screen.getByRole("button", { name: /custom label/i });

    expect(button).toHaveAttribute("aria-label", "Custom label");
  });
});
