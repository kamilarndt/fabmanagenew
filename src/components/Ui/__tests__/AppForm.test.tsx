import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { z } from "zod";
import { AppForm, AppFormField } from "../../ui/AppForm";

describe("AppForm", () => {
  it("validates required fields with zod", async () => {
    const schema = z.object({ name: z.string().min(1) });
    const onSubmit = vi.fn();

    render(
      <AppForm<{ name: string }> schema={schema} onSubmit={onSubmit}>
        <AppFormField name="name" label="Name" required>
          <input aria-label="Name" />
        </AppFormField>
        <button type="submit">Submit</button>
      </AppForm>
    );

    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
