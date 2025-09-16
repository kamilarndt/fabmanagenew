import { GenericForm } from "./BaseForm";

// Example: Custom form for CNC tasks
interface CNCTaskFormProps {
  task?: any;
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => Promise<void>;
  loading?: boolean;
}

export function CNCTaskForm({
  task,
  open,
  onClose,
  onSave,
  loading = false,
}: CNCTaskFormProps) {
  const fields = [
    {
      name: "name",
      label: "Nazwa zadania",
      type: "text" as const,
      required: true,
      placeholder: "Wprowadź nazwę zadania CNC",
      rules: [{ required: true, message: "Nazwa jest wymagana" }],
    },
    {
      name: "tileName",
      label: "Nazwa kafelka",
      type: "text" as const,
      required: true,
      placeholder: "Nazwa kafelka do wycięcia",
      rules: [{ required: true, message: "Nazwa kafelka jest wymagana" }],
    },
    {
      name: "material",
      label: "Materiał",
      type: "select" as const,
      required: true,
      options: [
        { label: "MDF", value: "MDF" },
        { label: "Sklejka", value: "Sklejka" },
        { label: "Płyta OSB", value: "Płyta OSB" },
        { label: "Płyta wiórowa", value: "Płyta wiórowa" },
        { label: "Płyta pilśniowa", value: "Płyta pilśniowa" },
      ],
      rules: [{ required: true, message: "Materiał jest wymagany" }],
    },
    {
      name: "priority",
      label: "Priorytet",
      type: "select" as const,
      required: true,
      options: [
        { label: "Niski", value: "low" },
        { label: "Średni", value: "medium" },
        { label: "Wysoki", value: "high" },
        { label: "Pilny", value: "urgent" },
      ],
      rules: [{ required: true, message: "Priorytet jest wymagany" }],
    },
    {
      name: "estimatedDuration",
      label: "Szacowany czas (min)",
      type: "number" as const,
      required: true,
      placeholder: "0",
      rules: [
        { required: true, message: "Szacowany czas jest wymagany" },
        { type: "number", min: 1, message: "Czas musi być większy od 0" },
      ],
    },
    {
      name: "dimensions",
      label: "Wymiary (mm)",
      type: "text" as const,
      required: true,
      placeholder: "np. 1000x500x18",
      rules: [{ required: true, message: "Wymiary są wymagane" }],
    },
    {
      name: "description",
      label: "Opis zadania",
      type: "textarea" as const,
      placeholder: "Szczegółowy opis zadania CNC, uwagi, wymagania...",
      rows: 4,
    },
    {
      name: "assignedTo",
      label: "Przypisany operator",
      type: "text" as const,
      placeholder: "Imię i nazwisko operatora",
    },
  ];

  return (
    <GenericForm
      entity={task}
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={task ? "Edytuj zadanie CNC" : "Nowe zadanie CNC"}
      loading={loading}
      fields={fields}
      width={700}
    />
  );
}

// Example: Custom form for client management
interface ClientFormProps {
  client?: any;
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => Promise<void>;
  loading?: boolean;
}

export function ClientForm({
  client,
  open,
  onClose,
  onSave,
  loading = false,
}: ClientFormProps) {
  const fields = [
    {
      name: "companyName",
      label: "Nazwa firmy",
      type: "text" as const,
      required: true,
      placeholder: "Nazwa firmy klienta",
      rules: [{ required: true, message: "Nazwa firmy jest wymagana" }],
    },
    {
      name: "nip",
      label: "NIP",
      type: "text" as const,
      required: true,
      placeholder: "1234567890",
      rules: [
        { required: true, message: "NIP jest wymagany" },
        { pattern: /^[0-9]{10}$/, message: "NIP musi składać się z 10 cyfr" },
      ],
    },
    {
      name: "regon",
      label: "REGON",
      type: "text" as const,
      placeholder: "Numer REGON (opcjonalny)",
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "kontakt@firma.pl",
      rules: [{ type: "email", message: "Nieprawidłowy format email" }],
    },
    {
      name: "phone",
      label: "Telefon",
      type: "text" as const,
      placeholder: "+48 123 456 789",
      rules: [
        {
          pattern: /^[+]?[0-9\-\s()]{7,}$/,
          message: "Nieprawidłowy format telefonu",
        },
      ],
    },
    {
      name: "website",
      label: "Strona internetowa",
      type: "url" as const,
      placeholder: "https://www.firma.pl",
      rules: [{ type: "url", message: "Nieprawidłowy format URL" }],
    },
    {
      name: "street",
      label: "Ulica",
      type: "text" as const,
      required: true,
      placeholder: "Nazwa ulicy",
      rules: [{ required: true, message: "Ulica jest wymagana" }],
    },
    {
      name: "houseNumber",
      label: "Numer domu",
      type: "text" as const,
      required: true,
      placeholder: "123",
      rules: [{ required: true, message: "Numer domu jest wymagany" }],
    },
    {
      name: "apartmentNumber",
      label: "Numer mieszkania",
      type: "text" as const,
      placeholder: "45 (opcjonalny)",
    },
    {
      name: "city",
      label: "Miasto",
      type: "text" as const,
      required: true,
      placeholder: "Nazwa miasta",
      rules: [{ required: true, message: "Miasto jest wymagane" }],
    },
    {
      name: "postalCode",
      label: "Kod pocztowy",
      type: "text" as const,
      required: true,
      placeholder: "00-000",
      rules: [
        { required: true, message: "Kod pocztowy jest wymagany" },
        {
          pattern: /^\d{2}-\d{3}$/,
          message: "Kod pocztowy musi być w formacie XX-XXX",
        },
      ],
    },
    {
      name: "description",
      label: "Opis klienta",
      type: "textarea" as const,
      placeholder: "Dodatkowe informacje o kliencie...",
      rows: 3,
    },
    {
      name: "isActive",
      label: "Aktywny klient",
      type: "checkbox" as const,
    },
  ];

  return (
    <GenericForm
      entity={client}
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={client ? "Edytuj klienta" : "Nowy klient"}
      loading={loading}
      fields={fields}
      width={800}
    />
  );
}

// Example: Search and filter form
interface SearchFormProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const fields = [
    {
      name: "search",
      label: "Szukaj",
      type: "text" as const,
      placeholder: "Wprowadź frazę wyszukiwania...",
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "Wszystkie", value: "" },
        { label: "Nowy", value: "new" },
        { label: "W realizacji", value: "active" },
        { label: "Wstrzymany", value: "on_hold" },
        { label: "Zakończony", value: "completed" },
        { label: "Anulowany", value: "cancelled" },
      ],
    },
    {
      name: "priority",
      label: "Priorytet",
      type: "select" as const,
      options: [
        { label: "Wszystkie", value: "" },
        { label: "Niski", value: "low" },
        { label: "Średni", value: "medium" },
        { label: "Wysoki", value: "high" },
        { label: "Pilny", value: "urgent" },
      ],
    },
    {
      name: "dateFrom",
      label: "Data od",
      type: "date" as const,
    },
    {
      name: "dateTo",
      label: "Data do",
      type: "date" as const,
    },
  ];

  return (
    <div
      style={{
        padding: 16,
        background: "#f5f5f5",
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <h4 style={{ marginBottom: 16 }}>Filtry i wyszukiwanie</h4>
      <GenericForm
        entity={null}
        open={true}
        onClose={() => {}}
        onSave={async (values) => onSearch(values)}
        title=""
        loading={loading}
        fields={fields}
        width={800}
      />
    </div>
  );
}
