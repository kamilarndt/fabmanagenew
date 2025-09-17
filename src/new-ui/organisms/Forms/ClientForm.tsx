import { showToast } from "@/lib/notifications";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Form } from "@/new-ui/organisms/Form/Form";
import { SlideOver } from "@/new-ui/organisms/SlideOver/SlideOver";
import { createClient } from "@/services/clients";
import { useState } from "react";

export interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (client: any) => void;
}

export function ClientForm({ open, onClose, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false);

  const clientFields = [
    {
      name: "name",
      label: "Nazwa klienta",
      type: "text" as const,
      placeholder: "Wprowadź nazwę klienta",
      required: true,
      validation: {
        required: "Nazwa klienta jest wymagana",
        minLength: { value: 2, message: "Nazwa musi mieć co najmniej 2 znaki" },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "klient@example.com",
      validation: {
        email: "Wprowadź poprawny adres email",
      },
    },
    {
      name: "phone",
      label: "Telefon",
      type: "tel" as const,
      placeholder: "+48 123 456 789",
      validation: {
        pattern: {
          value: /^[\+]?[0-9\s\-\(\)]{9,}$/,
          message: "Wprowadź poprawny numer telefonu",
        },
      },
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      const client = await createClient({
        name: values.name.trim(),
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
      });

      showToast("Klient został utworzony pomyślnie", "success");
      onSuccess?.(client);
      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      showToast("Błąd podczas tworzenia klienta", "danger");
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
        form="client-form"
        loading={loading}
        disabled={loading}
      >
        Utwórz klienta
      </Button>
    </div>
  );

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Nowy klient"
      size="md"
      footer={footer}
    >
      <Form
        id="client-form"
        fields={clientFields}
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
