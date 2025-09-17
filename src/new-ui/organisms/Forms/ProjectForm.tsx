import { showToast } from "@/lib/notifications";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Form } from "@/new-ui/organisms/Form/Form";
import { SlideOver } from "@/new-ui/organisms/SlideOver/SlideOver";
import { listClients } from "@/services/clients";
import { createProject } from "@/services/projects";
import { useEffect, useState } from "react";

export interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (project: any) => void;
}

export function ProjectForm({ open, onClose, onSuccess }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      setClientsLoading(true);
      const clientsData = await listClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading clients:", error);
      showToast("Błąd podczas ładowania listy klientów", "danger");
    } finally {
      setClientsLoading(false);
    }
  };

  const projectFields = [
    {
      name: "name",
      label: "Nazwa projektu",
      type: "text" as const,
      placeholder: "Wprowadź nazwę projektu",
      required: true,
      validation: {
        required: "Nazwa projektu jest wymagana",
        minLength: { value: 3, message: "Nazwa musi mieć co najmniej 3 znaki" },
      },
    },
    {
      name: "clientId",
      label: "Klient",
      type: "select" as const,
      placeholder: "Wybierz klienta",
      required: true,
      options: [
        { value: "", label: "Wybierz klienta...", disabled: true },
        ...clients.map((client) => ({
          value: client.id,
          label: client.name,
        })),
      ],
      validation: {
        required: "Wybierz klienta",
      },
      disabled: clientsLoading,
    },
    {
      name: "deadline",
      label: "Termin realizacji",
      type: "date" as const,
      required: true,
      validation: {
        required: "Termin realizacji jest wymagany",
        custom: (value: string) => {
          if (value && new Date(value) < new Date()) {
            return "Termin nie może być w przeszłości";
          }
          return undefined;
        },
      },
    },
    {
      name: "description",
      label: "Opis projektu",
      type: "textarea" as const,
      placeholder: "Opisz szczegóły projektu...",
      rows: 4,
      helpText: "Opcjonalny opis projektu",
    },
    {
      name: "modules",
      label: "Moduły projektu",
      type: "checkbox" as const,
      helpText: "Wybierz moduły, które będą aktywne w projekcie",
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      const projectData = {
        name: values.name.trim(),
        clientId: values.clientId,
        deadline: values.deadline,
        description: values.description?.trim() || "",
        modules: values.modules || [],
      };

      const project = await createProject({
        ...projectData,
        status: "Nowy" as const,
        client: clients.find((c) => c.id === values.clientId)?.name || "",
      });

      showToast("Projekt został utworzony pomyślnie", "success");
      onSuccess?.(project);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
      showToast("Błąd podczas tworzenia projektu", "danger");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="tw-flex tw-justify-end tw-gap-2">
      <Button variant="outline" onClick={onClose} disabled={loading}>
        Anuluj
      </Button>
      <Button
        type="submit"
        form="project-form"
        loading={loading}
        disabled={loading}
      >
        Utwórz projekt
      </Button>
    </div>
  );

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Nowy projekt"
      size="lg"
      footer={footer}
      data-testid="project-form"
    >
      <Form
        id="project-form"
        fields={projectFields}
        onSubmit={handleSubmit}
        loading={loading}
        submitText=""
        showSubmit={false}
        showReset={false}
        layout="vertical"
      />
    </SlideOver>
  );
}
