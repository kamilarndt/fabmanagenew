import { Button } from "@/new-ui/atoms/Button/Button";
import { cn } from "@/new-ui/utils/cn";
import type { FieldValues, Path } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "date"
    | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: z.ZodTypeAny;
  className?: string;
  description?: string;
}

interface UniversalAddFormProps<T extends FieldValues> {
  title: string;
  fields: FormField<T>[];
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  className?: string;
}

export function UniversalAddForm<T extends FieldValues>({
  title,
  fields,
  onSubmit,
  onCancel,
  submitText = "Zapisz",
  cancelText = "Anuluj",
  isLoading = false,
  className,
}: UniversalAddFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    // resolver: zodResolver(schema), // Temporarily disabled due to version compatibility
  });

  const isFormSubmitting = isSubmitting || isLoading;

  const renderField = (field: FormField<T>) => {
    const fieldName = field.name as string;
    const hasError = errors[field.name];
    const fieldId = `field-${fieldName}`;

    const baseInputClasses = cn(
      "w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
    );

    const renderInput = () => {
      switch (field.type) {
        case "textarea":
          return (
            <textarea
              id={fieldId}
              {...register(field.name)}
              placeholder={field.placeholder}
              className={cn(baseInputClasses, "min-h-[100px] resize-vertical")}
              style={{
                backgroundColor: "var(--color-background-input)",
                color: "var(--color-foreground-default)",
                borderColor: hasError
                  ? "var(--color-border-destructive)"
                  : "var(--color-border-default)",
              }}
            />
          );

        case "select":
          return (
            <select
              id={fieldId}
              {...register(field.name)}
              className={baseInputClasses}
              style={{
                backgroundColor: "var(--color-background-input)",
                color: "var(--color-foreground-default)",
                borderColor: hasError
                  ? "var(--color-border-destructive)"
                  : "var(--color-border-default)",
              }}
            >
              <option value="">{field.placeholder || "Wybierz opcję"}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case "checkbox":
          return (
            <div className="flex items-center space-x-2">
              <input
                id={fieldId}
                type="checkbox"
                {...register(field.name)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={fieldId} className="text-sm font-medium">
                {field.label}
              </label>
            </div>
          );

        default:
          return (
            <input
              id={fieldId}
              type={field.type}
              {...register(field.name)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              style={{
                backgroundColor: "var(--color-background-input)",
                color: "var(--color-foreground-default)",
                borderColor: hasError
                  ? "var(--color-border-destructive)"
                  : "var(--color-border-default)",
              }}
            />
          );
      }
    };

    return (
      <div key={fieldName} className={cn("space-y-1", field.className)}>
        {field.type !== "checkbox" && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium"
            style={{ color: "var(--color-foreground-default)" }}
          >
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {renderInput()}

        {field.description && (
          <p
            className="text-xs"
            style={{ color: "var(--color-foreground-muted)" }}
          >
            {field.description}
          </p>
        )}

        {hasError && (
          <p className="text-xs text-red-500" role="alert">
            {errors[field.name]?.message as string}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-foreground-default)" }}
        >
          {title}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(renderField)}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isFormSubmitting}
          >
            {cancelText}
          </Button>

          <Button
            type="submit"
            variant="default"
            loading={isFormSubmitting}
            disabled={isFormSubmitting}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </div>
  );
}
