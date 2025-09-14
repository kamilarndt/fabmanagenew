import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { AppTable } from "../../ui/AppTable";

interface Row {
  id: string;
  name: string;
  value: number;
}

describe("AppTable", () => {
  const rows: Row[] = [
    { id: "1", name: "Alpha", value: 10 },
    { id: "2", name: "Bravo", value: 20 },
    { id: "3", name: "Charlie", value: 30 },
  ];

  it("renders and filters via search", () => {
    render(
      <AppTable<Row>
        data={rows}
        columns={[
          { key: "name", title: "Name", dataIndex: "name", sortable: true },
          { key: "value", title: "Value", dataIndex: "value" },
        ]}
        rowKey={(r) => r.id}
      />
    );
    const input = screen.getByTestId("table-search") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "br" } });
    expect(screen.getByText("Bravo")).toBeInTheDocument();
  });
});
