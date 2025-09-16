import type { FormProps } from "antd";
import { Form } from "antd";
import React from "react";
import { z } from "zod";

interface AppFormProps<T extends Record<string, unknown>>
  extends Omit<FormProps, "onFinish"> {
  schema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  children: React.ReactNode;
  loading?: boolean;
}

export function AppForm<T extends Record<string, unknown>>({
  schema,
  onSubmit,
  children,
  loading = false,
  ...formProps
}: AppFormProps<T>) {
  const [form] = Form.useForm();

  const handleFinish = async (values: T) => {
    try {
      const validated = schema ? schema.parse(values) : values;
      await onSubmit?.(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map((err) => ({
          name: err.path as any,
          errors: [err.message],
        }));
        form.setFields(fieldErrors);
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      disabled={loading}
      {...formProps}
    >
      {children}
    </Form>
  );
}

interface AppFormFieldProps {
  name: string | (string | number)[];
  label?: string;
  required?: boolean;
  help?: string;
  tooltip?: string;
  children: React.ReactNode;
}

export function AppFormField({
  name,
  label,
  required,
  help,
  tooltip,
  children,
}: AppFormFieldProps) {
  return (
    <Form.Item
      name={name as any}
      label={label}
      required={required}
      help={help}
      tooltip={tooltip}
      rules={
        required
          ? [{ required: true, message: `${label || "Pole"} jest wymagane` }]
          : []
      }
    >
      {children}
    </Form.Item>
  );
}
