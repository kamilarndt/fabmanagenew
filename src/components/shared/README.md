# Shared Components Documentation

## Base Components

### BaseCard
Uniwersalny komponent karty do wyświetlania encji z wspólnymi akcjami.

```tsx
import { BaseCard } from "../../../components/shared/BaseCard";

<BaseCard
  entity={baseEntity}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  statusColorMap={getStatusColor}
  priorityColorMap={getPriorityColor}
  customFields={customFields}
  actions={actions}
/>
```

### BaseGrid
Komponent siatki do wyświetlania list encji pogrupowanych według statusu.

```tsx
import { BaseGrid } from "../../../components/shared/BaseGrid";

<BaseGrid
  entities={baseEntities}
  onViewEntity={handleViewEntity}
  onEditEntity={handleEditEntity}
  onDeleteEntity={handleDeleteEntity}
  onAddEntity={onAddEntity}
  title="Projects"
  subtitle="Manage your projects"
  statusColumns={statusColumns}
  getStatusFromEntity={getStatusFromEntity}
  statusColorMap={statusColorMap}
  customFields={customFields}
/>
```

### BaseStats
Komponent do wyświetlania statystyk i metryk.

```tsx
import { BaseStats } from "../../../components/shared/BaseStats";

<BaseStats
  entities={entities}
  title="Overview"
  getStatusFromEntity={getStatusFromEntity}
  getPriorityFromEntity={getPriorityFromEntity}
  customStats={customStats}
/>
```

### BaseView
Kontener dla widoków modułów z przełączaniem między siatką a statystykami.

```tsx
import { BaseView } from "../../../components/shared/BaseView";

<BaseView
  entities={entities}
  onViewEntity={handleViewEntity}
  onEditEntity={handleEditEntity}
  onDeleteEntity={handleDeleteEntity}
  onAddEntity={onAddEntity}
  title="Projects"
  showStats={true}
  showGrid={true}
/>
```

## Form Components

### BaseForm
Podstawowy komponent formularza z walidacją i obsługą błędów.

```tsx
import { BaseForm } from "../../../components/shared/BaseForm";

<BaseForm
  entity={entity}
  open={open}
  onClose={onClose}
  onSave={onSave}
  title="Edit Entity"
  loading={loading}
  schema={validationSchema}
>
  {/* Form fields */}
</BaseForm>
```

### Specialized Forms

#### ProjectForm
Formularz do edycji projektów.

```tsx
import { ProjectForm } from "../../../components/shared/BaseForm";

<ProjectForm
  project={project}
  open={open}
  onClose={onClose}
  onSave={onSave}
  loading={loading}
/>
```

#### TileForm
Formularz do edycji kafelków.

```tsx
import { TileForm } from "../../../components/shared/BaseForm";

<TileForm
  tile={tile}
  open={open}
  onClose={onClose}
  onSave={onSave}
  loading={loading}
/>
```

#### MaterialForm
Formularz do edycji materiałów.

```tsx
import { MaterialForm } from "../../../components/shared/BaseForm";

<MaterialForm
  material={material}
  open={open}
  onClose={onClose}
  onSave={onSave}
  loading={loading}
/>
```

### GenericForm
Uniwersalny formularz generowany na podstawie konfiguracji pól.

```tsx
import { GenericForm } from "../../../components/shared/BaseForm";

const fields = [
  {
    name: "name",
    label: "Nazwa",
    type: "text",
    required: true,
    placeholder: "Wprowadź nazwę",
    rules: [{ required: true, message: "Nazwa jest wymagana" }],
  },
  {
    name: "description",
    label: "Opis",
    type: "textarea",
    rows: 3,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Nowy", value: "new" },
      { label: "Aktywny", value: "active" },
    ],
  },
];

<GenericForm
  entity={entity}
  open={open}
  onClose={onClose}
  onSave={onSave}
  title="Edit Entity"
  loading={loading}
  fields={fields}
  width={600}
/>
```

## Validation System

### ValidationRules
Gotowe reguły walidacji dla pól formularzy.

```tsx
import { ValidationRules } from "../../../lib/validation";

const rules = [
  ValidationRules.required("Nazwa"),
  ValidationRules.email(),
  ValidationRules.phone(),
  ValidationRules.url(),
  ValidationRules.minLength("Opis", 10),
  ValidationRules.maxLength("Opis", 500),
  ValidationRules.positive("Cena"),
  ValidationRules.futureDate("Termin"),
];
```

### FormValidation
Narzędzia do walidacji formularzy.

```tsx
import { FormValidation } from "../../../lib/validation";

// Walidacja całego formularza
const validation = FormValidation.validateForm(schema, data);
if (validation.success) {
  // Dane są poprawne
  console.log(validation.data);
} else {
  // Błędy walidacji
  const fieldErrors = FormValidation.zodToAntdErrors(validation.errors);
  form.setFields(fieldErrors);
}
```

## Notification System

### Basic Notifications
Podstawowe funkcje notyfikacji.

```tsx
import { 
  showToast, 
  showNotification,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast
} from "../../../lib/notifications";

// Toast messages
showSuccessToast("Operacja zakończona pomyślnie");
showErrorToast("Wystąpił błąd");
showWarningToast("Uwaga");
showInfoToast("Informacja");

// Notifications
showNotification("Sukces", "Dane zostały zapisane", "success");
showErrorNotification("Błąd", "Nie udało się zapisać danych");
```

### Advanced Notifications
Zaawansowane funkcje notyfikacji.

```tsx
import { 
  showConfirmDialog,
  showLoadingNotification,
  showBatchNotification,
  clearAllNotifications
} from "../../../lib/notifications";

// Confirmation dialog
showConfirmDialog(
  "Potwierdź usunięcie",
  "Czy na pewno chcesz usunąć ten element?",
  () => console.log("Confirmed"),
  () => console.log("Cancelled")
);

// Loading notification
const loading = showLoadingNotification("Zapisywanie...", "Proszę czekać");
// Update loading message
loading.update("Prawie gotowe...", "Kończymy zapisywanie");
// Close loading
loading.close();

// Batch operations
showBatchNotification(10, 8, 2, "update"); // 10 total, 8 success, 2 errors

// Clear all notifications
clearAllNotifications();
```

## Usage Examples

### Complete Module Refactoring

```tsx
// 1. Create BaseEntity from your data
const baseEntity: BaseEntity = {
  id: project.id,
  name: project.name,
  description: project.description,
  status: project.status,
  priority: project.priority || "medium",
  assignedTo: project.manager,
  projectId: project.id,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
};

// 2. Use BaseCard for individual items
<BaseCard
  entity={baseEntity}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  statusColorMap={getStatusColor}
  priorityColorMap={getPriorityColor}
  customFields={customProjectFields}
  actions={projectActions}
/>

// 3. Use BaseGrid for lists
<BaseGrid
  entities={baseEntities}
  onViewEntity={handleViewEntity}
  onEditEntity={handleEditEntity}
  onDeleteEntity={handleDeleteEntity}
  onAddEntity={onAddEntity}
  title="Projects"
  subtitle={`${projects.length} projects total`}
  statusColumns={statusColumns}
  getStatusFromEntity={getStatusFromEntity}
  statusColorMap={statusColorMap}
  customFields={customFields}
/>

// 4. Use BaseStats for overview
<BaseStats
  entities={entities}
  title="Project Overview"
  getStatusFromEntity={getStatusFromEntity}
  customStats={[
    { title: "Budget Used", value: 75000, color: "#52c41a" },
    { title: "Budget Remaining", value: 25000, color: "#1890ff" },
  ]}
/>
```

### Form Integration

```tsx
// 1. Define validation schema
const projectSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  client: z.string().min(1, "Klient jest wymagany"),
  deadline: z.string().optional(),
  budget: z.number().min(0, "Budżet nie może być ujemny").optional(),
});

// 2. Use specialized form
<ProjectForm
  project={project}
  open={open}
  onClose={onClose}
  onSave={handleSave}
  loading={loading}
/>

// 3. Or use generic form with custom fields
<GenericForm
  entity={project}
  open={open}
  onClose={onClose}
  onSave={handleSave}
  title="Edit Project"
  loading={loading}
  schema={projectSchema}
  fields={projectFields}
  width={700}
/>
```

## Best Practices

1. **Always use BaseEntity interface** - Konwertuj swoje dane do formatu BaseEntity dla spójności
2. **Provide custom color mappings** - Zdefiniuj funkcje `statusColorMap` i `priorityColorMap` dla spójnego wyglądu
3. **Use custom fields for specific content** - Wykorzystaj `customFields` do wyświetlania specyficznych dla domeny informacji
4. **Implement proper error handling** - Używaj nowego systemu notyfikacji do wyświetlania błędów
5. **Validate forms with Zod schemas** - Wykorzystuj schematy walidacji dla spójnej walidacji formularzy
6. **Use specialized forms when possible** - Preferuj wyspecjalizowane formularze nad GenericForm dla lepszej UX
7. **Keep forms simple** - Unikaj zbyt skomplikowanych formularzy, dziel je na mniejsze części
8. **Provide loading states** - Zawsze pokazuj stany ładowania dla lepszej UX

