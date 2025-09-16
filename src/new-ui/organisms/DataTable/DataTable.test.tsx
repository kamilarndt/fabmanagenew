import { fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";

interface TestData {
  id: string;
  name: string;
  status: string;
}

const mockData: TestData[] = [
  { id: "1", name: "Item 1", status: "active" },
  { id: "2", name: "Item 2", status: "inactive" },
  { id: "3", name: "Item 3", status: "active" },
];

const mockColumns = [
  {
    key: "name" as keyof TestData,
    title: "Name",
    sortable: true,
  },
  {
    key: "status" as keyof TestData,
    title: "Status",
    sortable: true,
  },
];

describe("DataTable", () => {
  it("renders table with data", () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("handles row clicks", () => {
    const handleRowClick = vi.fn();
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onRowClick={handleRowClick}
      />
    );

    fireEvent.click(screen.getByText("Item 1"));
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("shows loading state", () => {
    render(<DataTable data={[]} columns={mockColumns} loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<DataTable data={[]} columns={mockColumns} />);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("handles search", () => {
    render(<DataTable data={mockData} columns={mockColumns} searchable />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Item 1" } });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        className="custom-table"
      />
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("custom-table");
  });
});
