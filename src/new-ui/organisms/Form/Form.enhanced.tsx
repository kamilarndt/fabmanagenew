import { Button } from "@/new-ui/atoms/Button/Button";
import { Checkbox } from "@/new-ui/atoms/Checkbox/Checkbox";
import { Input } from "@/new-ui/atoms/Input/Input";
import { Label } from "@/new-ui/atoms/Label/Label";
import { RadioGroup } from "@/new-ui/atoms/RadioGroup/RadioGroup";
import { Alert } from "@/new-ui/molecules/Alert/Alert";
import { FormField } from "@/new-ui/molecules/FormField/FormField";
import { Select } from "@/new-ui/molecules/Select/Select";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "datetime-local"
    | "file";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  validation?: {
    required?: boolean | string;
    min?: number | string;
    max?: number | string;
    minLength?: number | string;
    maxLength?: number | string;
    pattern?: RegExp | string;
    email?: boolean | string;
    url?: boolean | string;
    custom?: (value: any) => string | undefined;
  };
  helpText?: string;
  icon?: string;
  rows?: number;
  accept?: string;
  multiple?: boolean;
}

export interface FormProps {
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  onReset?: () => void;
  loading?: boolean;
  disabled?: boolean;
  layout?: "vertical" | "horizontal" | "inline";
  size?: "sm" | "default" | "lg";
  className?: string;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  showSubmit?: boolean;
  submitIcon?: string;
  resetIcon?: string;
  validationMode?: "onChange" | "onBlur" | "onSubmit";
  showValidationSummary?: boolean;
  autoComplete?: boolean;
  noValidate?: boolean;
}

export function Form({
  fields,
  initialValues = {},
  onSubmit,
  onReset,
  loading = false,
  disabled = false,
  layout = "vertical",
  size = "default",
  className,
  submitText = "Submit",
  resetText = "Reset",
  showReset = true,
  showSubmit = true,
  submitIcon = "check",
  resetIcon = "refresh-cw",
  validationMode = "onBlur",
  showValidationSummary = true,
  autoComplete = true,
  noValidate = false,
}: FormProps): React.ReactElement {
  const [values, setValues] =
    React.useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const sizeClasses = {
    sm: "tw-text-sm",
    default: "tw-text-sm",
    lg: "tw-text-base",
  };

  const layoutClasses = {
    vertical: "tw-space-y-4",
    horizontal: "tw-space-y-4",
    inline: "tw-flex tw-flex-wrap tw-gap-4 tw-items-end",
  };

  const validateField = (name: string, value: any): string | undefined => {
    const field = fields.find((f) => f.name === name);
    if (!field?.validation) return undefined;

    const { validation } = field;

    if (
      validation.required &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      return typeof validation.required === "string"
        ? validation.required
        : `${field.label} is required`;
    }

    if (value && validation.min && Number(value) < Number(validation.min)) {
      return `${field.label} must be at least ${validation.min}`;
    }

    if (value && validation.max && Number(value) > Number(validation.max)) {
      return `${field.label} must be at most ${validation.max}`;
    }

    if (
      value &&
      validation.minLength &&
      String(value).length < Number(validation.minLength)
    ) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (
      value &&
      validation.maxLength &&
      String(value).length > Number(validation.maxLength)
    ) {
      return `${field.label} must be at most ${validation.maxLength} characters`;
    }

    if (value && validation.pattern) {
      const pattern =
        validation.pattern instanceof RegExp
          ? validation.pattern
          : new RegExp(validation.pattern);
      if (!pattern.test(String(value))) {
        return `${field.label} format is invalid`;
      }
    }

    if (value && validation.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(String(value))) {
        return typeof validation.email === "string"
          ? validation.email
          : `${field.label} must be a valid email`;
      }
    }

    if (value && validation.url) {
      try {
        new URL(String(value));
      } catch {
        return typeof validation.url === "string"
          ? validation.url
          : `${field.label} must be a valid URL`;
      }
    }

    if (validation.custom) {
      return validation.custom(value);
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field.name, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (validationMode === "onChange") {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (validationMode === "onBlur") {
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (noValidate || validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    onReset?.();
  };

  const renderField = (field: FormFieldConfig) => {
    const fieldError = errors[field.name];
    const isTouched = touched[field.name];
    const showError = isTouched && fieldError;

    const commonProps = {
      name: field.name,
      disabled: disabled || field.disabled,
      required: field.required,
      placeholder: field.placeholder,
      value: values[field.name] || "",
      onChange: (value: any) => handleFieldChange(field.name, value),
      onBlur: () => handleFieldBlur(field.name),
      error: showError,
      className: sizeClasses[size],
    };

    const fieldElement = (() => {
      switch (field.type) {
        case "textarea":
          return (
            <textarea
              {...commonProps}
              rows={field.rows || 3}
              className={cn(
                "tw-flex tw-min-h-[80px] tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
                showError &&
                  "tw-border-destructive focus-visible:tw-ring-destructive",
                sizeClasses[size]
              )}
            />
          );

        case "select":
          return (
            <Select
              {...commonProps}
              options={field.options || []}
              placeholder={field.placeholder}
            />
          );

        case "checkbox":
          return (
            <Checkbox {...commonProps} checked={Boolean(values[field.name])} />
          );

        case "radio":
          return <RadioGroup {...commonProps} options={field.options || []} />;

        case "file":
          return (
            <input
              {...commonProps}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              className={cn(
                "tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
                showError &&
                  "tw-border-destructive focus-visible:tw-ring-destructive",
                sizeClasses[size]
              )}
            />
          );

        default:
          return <Input {...commonProps} type={field.type} icon={field.icon} />;
      }
    })();

    if (layout === "horizontal") {
      return (
        <div
          key={field.name}
          className="tw-grid tw-grid-cols-3 tw-gap-4 tw-items-start"
        >
          <Label htmlFor={field.name} className="tw-pt-2">
            {field.label}
            {field.required && (
              <span className="tw-text-destructive tw-ml-1">*</span>
            )}
          </Label>
          <div className="tw-col-span-2 tw-space-y-1">
            {fieldElement}
            {field.helpText && (
              <p className="tw-text-xs tw-text-muted-foreground">
                {field.helpText}
              </p>
            )}
            {showError && (
              <p className="tw-text-xs tw-text-destructive">{fieldError}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <FormField
        key={field.name}
        label={field.label}
        error={showError ? fieldError : undefined}
        required={field.required}
      >
        {fieldElement}
        {field.helpText && (
          <p className="tw-text-xs tw-text-muted-foreground tw-mt-1">
            {field.helpText}
          </p>
        )}
      </FormField>
    );
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(layoutClasses[layout], className)}
      autoComplete={autoComplete ? "on" : "off"}
      noValidate={noValidate}
    >
      {showValidationSummary && hasErrors && (
        <Alert variant="destructive" className="tw-mb-4">
          <AlertTitle>Please fix the following errors:</AlertTitle>
          <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="tw-text-sm">
                {error}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <div className={layoutClasses[layout]}>{fields.map(renderField)}</div>

      {(showSubmit || showReset) && (
        <div className="tw-flex tw-items-center tw-gap-2 tw-pt-4">
          {showSubmit && (
            <Button
              type="submit"
              loading={loading || isSubmitting}
              disabled={disabled || hasErrors}
              leftIcon={submitIcon}
            >
              {submitText}
            </Button>
          )}
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={disabled || loading}
              leftIcon={resetIcon}
            >
              {resetText}
            </Button>
          )}
        </div>
      )}
    </form>
  );
}

// Form Builder Component
export interface FormBuilderProps {
  schema: FormFieldConfig[];
  onSubmit?: (values: Record<string, any>) => void;
  className?: string;
}

export function FormBuilder({
  schema,
  onSubmit,
  className,
}: FormBuilderProps): React.ReactElement {
  return <Form fields={schema} onSubmit={onSubmit} className={className} />;
}

// Dynamic Form Component
export interface DynamicFormProps {
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  className?: string;
}

export function DynamicForm({
  fields,
  initialValues,
  onSubmit,
  className,
}: DynamicFormProps): React.ReactElement {
  return (
    <Form
      fields={fields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      className={className}
    />
  );
}
