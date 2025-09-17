import { Button } from "@/new-ui/atoms/Button/Button";
import { ClientForm, ProjectForm } from "@/new-ui/organisms/Forms";
import { useState } from "react";

export function ExampleUsage() {
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);

  return (
    <div className="tw-p-6 tw-space-y-4">
      <h1 className="tw-text-2xl tw-font-bold">Przykład użycia formularzy</h1>

      <div className="tw-space-x-4">
        <Button onClick={() => setClientFormOpen(true)}>Dodaj klienta</Button>

        <Button onClick={() => setProjectFormOpen(true)}>Dodaj projekt</Button>
      </div>

      {/* Formularz klienta */}
      <ClientForm
        open={clientFormOpen}
        onClose={() => setClientFormOpen(false)}
        onSuccess={(client) => {
          console.log("Client created:", client);
          // Tutaj można zaktualizować listę klientów
        }}
      />

      {/* Formularz projektu */}
      <ProjectForm
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        onSuccess={(project) => {
          console.log("Project created:", project);
          // Tutaj można zaktualizować listę projektów
        }}
      />
    </div>
  );
}
