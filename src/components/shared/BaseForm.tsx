import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Select, Space } from "antd";
import React from "react";
import { showErrorToast, showSuccessToast } from "../../lib/notifications";
import { FormValidation } from "../../lib/validation";
import { AppForm, AppFormField } from "../ui/AppForm";
import type { BaseEntity } from "./BaseCard";

export interface BaseFormProps<T extends BaseEntity> {
  entity?: T | null;
  open: boolean;
  onClose: () => void;
  onSave: (values: Partial<T>) => Promise<void>;
  title: string;
  loading?: boolean;
  schema?: any;
  children: React.ReactNode;
  saveText?: string;
  cancelText?: string;
  width?: number;
}

export function BaseForm<T extends BaseEntity>({
  entity,
  open,
  onClose,
  onSave,
  title,
  loading = false,
  schema,
  children,
  saveText = "Zapisz",
  cancelText = "Anuluj",
  width = 600,
}: BaseFormProps<T>) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (entity) {
      form.setFieldsValue(entity);
    } else {
      form.resetFields();
    }
  }, [entity, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (schema) {
        const validation = FormValidation.validateForm(schema, values);
        if (!validation.success) {
          const fieldErrors = FormValidation.zodToAntdErrors(validation.errors);
          form.setFields(fieldErrors);
          return;
        }
        await onSave(validation.data as Partial<T>);
      } else {
        await onSave(values);
      }

      showSuccessToast("Zapisano pomyślnie");
      onClose();
    } catch (error) {
      console.error("Error saving entity:", error);
      showErrorToast("Błąd podczas zapisywania");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      placement="right"
      destroyOnClose
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            onClick={handleCancel}
            icon={<CloseOutlined />}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {saveText}
          </Button>
        </Space>
      }
    >
      <AppForm form={form} layout="vertical" disabled={loading} schema={schema}>
        {children}
      </AppForm>
    </Drawer>
  );
}

// Specialized form components for different entity types
export interface ProjectFormProps {
  project?: any;
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => Promise<void>;
  loading?: boolean;
}

export function ProjectForm({
  project,
  open,
  onClose,
  onSave,
  loading = false,
}: ProjectFormProps) {
  return (
    <BaseForm
      entity={project}
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={project ? "Edytuj projekt" : "Nowy projekt"}
      loading={loading}
      width={700}
    >
      <AppFormField
        name="name"
        label="Nazwa projektu"
        required
        rules={[{ required: true, message: "Nazwa jest wymagana" }]}
      >
        <input placeholder="Wprowadź nazwę projektu" />
      </AppFormField>

      <AppFormField name="description" label="Opis">
        <textarea rows={3} placeholder="Opis projektu, wymagania, uwagi..." />
      </AppFormField>

      <AppFormField
        name="client"
        label="Klient"
        required
        rules={[{ required: true, message: "Klient jest wymagany" }]}
      >
        <input placeholder="Nazwa klienta" />
      </AppFormField>

      <AppFormField name="deadline" label="Termin" rules={[{ type: "date" }]}>
        <input type="date" />
      </AppFormField>

      <AppFormField
        name="budget"
        label="Budżet"
        rules={[{ type: "number", min: 0 }]}
      >
        <input type="number" placeholder="0" min="0" step="0.01" />
      </AppFormField>

      <AppFormField
        name="status"
        label="Status"
        required
        rules={[{ required: true, message: "Status jest wymagany" }]}
      >
        <select>
          <option value="new">Nowy</option>
          <option value="active">W realizacji</option>
          <option value="on_hold">Wstrzymany</option>
          <option value="completed">Zakończony</option>
          <option value="cancelled">Anulowany</option>
        </select>
      </AppFormField>
    </BaseForm>
  );
}

export interface TileFormProps {
  tile?: any;
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => Promise<void>;
  loading?: boolean;
}

export function TileForm({
  tile,
  open,
  onClose,
  onSave,
  loading = false,
}: TileFormProps) {
  return (
    <BaseForm
      entity={tile}
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={tile ? "Edytuj kafelek" : "Nowy kafelek"}
      loading={loading}
      width={600}
    >
      <AppFormField
        name="name"
        label="Nazwa kafelka"
        required
        rules={[{ required: true, message: "Nazwa jest wymagana" }]}
      >
        <input placeholder="Wprowadź nazwę kafelka" />
      </AppFormField>

      <AppFormField name="opis" label="Opis">
        <textarea rows={3} placeholder="Opis kafelka, wymagania, uwagi..." />
      </AppFormField>

      <AppFormField
        name="status"
        label="Status"
        required
        rules={[{ required: true, message: "Status jest wymagany" }]}
      >
        <select>
          <option value="W KOLEJCE">W kolejce</option>
          <option value="Projektowanie">Projektowanie</option>
          <option value="W trakcie projektowania">
            W trakcie projektowania
          </option>
          <option value="Do akceptacji">Do akceptacji</option>
          <option value="Zaakceptowane">Zaakceptowane</option>
          <option value="W TRAKCIE CIĘCIA">W trakcie cięcia</option>
          <option value="WYCIĘTE">Wycięte</option>
          <option value="Wstrzymany">Wstrzymany</option>
          <option value="Zakończony">Zakończony</option>
        </select>
      </AppFormField>

      <AppFormField name="priority" label="Priorytet">
        <select>
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
          <option value="urgent">Pilny</option>
        </select>
      </AppFormField>

      <AppFormField name="termin" label="Termin" rules={[{ type: "date" }]}>
        <input type="date" />
      </AppFormField>

      <AppFormField name="przypisany_projektant" label="Przypisany projektant">
        <input placeholder="Imię i nazwisko projektanta" />
      </AppFormField>
    </BaseForm>
  );
}

export interface MaterialFormProps {
  material?: any;
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => Promise<void>;
  loading?: boolean;
}

export function MaterialForm({
  material,
  open,
  onClose,
  onSave,
  loading = false,
}: MaterialFormProps) {
  return (
    <BaseForm
      entity={material}
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={material ? "Edytuj materiał" : "Nowy materiał"}
      loading={loading}
      width={500}
    >
      <AppFormField
        name="name"
        label="Nazwa materiału"
        required
        rules={[{ required: true, message: "Nazwa jest wymagana" }]}
      >
        <input placeholder="Wprowadź nazwę materiału" />
      </AppFormField>

      <AppFormField name="code" label="Kod">
        <input placeholder="Kod materiału" />
      </AppFormField>

      <AppFormField
        name="category"
        label="Kategoria"
        required
        rules={[{ required: true, message: "Kategoria jest wymagana" }]}
      >
        <input placeholder="Kategoria materiału" />
      </AppFormField>

      <AppFormField
        name="unit"
        label="Jednostka"
        required
        rules={[{ required: true, message: "Jednostka jest wymagana" }]}
      >
        <select>
          <option value="szt">Sztuki</option>
          <option value="m">Metry</option>
          <option value="m2">Metry kwadratowe</option>
          <option value="m3">Metry sześcienne</option>
          <option value="kg">Kilogramy</option>
          <option value="l">Litry</option>
        </select>
      </AppFormField>

      <AppFormField
        name="price"
        label="Cena"
        required
        rules={[
          { required: true, message: "Cena jest wymagana" },
          {
            type: "number",
            min: 0,
            message: "Cena musi być większa lub równa 0",
          },
        ]}
      >
        <input type="number" placeholder="0.00" min="0" step="0.01" />
      </AppFormField>

      <AppFormField
        name="stock"
        label="Stan magazynowy"
        required
        rules={[
          { required: true, message: "Stan magazynowy jest wymagany" },
          { type: "number", min: 0, message: "Stan nie może być ujemny" },
        ]}
      >
        <input type="number" placeholder="0" min="0" step="0.01" />
      </AppFormField>

      <AppFormField name="supplier" label="Dostawca">
        <input placeholder="Nazwa dostawcy" />
      </AppFormField>

      <AppFormField name="location" label="Lokalizacja">
        <input placeholder="Miejsce przechowywania" />
      </AppFormField>
    </BaseForm>
  );
}

// Generic form for any entity type
export interface GenericFormProps<T extends BaseEntity> {
  entity?: T | null;
  open: boolean;
  onClose: () => void;
  onSave: (values: Partial<T>) => Promise<void>;
  title: string;
  loading?: boolean;
  schema?: any;
  fields: Array<{
    name: keyof T | string;
    label: string;
    type:
      | "text"
      | "textarea"
      | "number"
      | "email"
      | "url"
      | "date"
      | "select"
      | "checkbox";
    required?: boolean;
    placeholder?: string;
    options?: Array<{ label: string; value: any }>;
    rows?: number;
    rules?: any[];
  }>;
  width?: number;
}

export function GenericForm<T extends BaseEntity>({
  entity,
  open,
  onClose,
  onSave,
  title,
  loading = false,
  schema,
  fields,
  width = 600,
}: GenericFormProps<T>) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (entity) {
      form.setFieldsValue(entity);
    } else {
      form.resetFields();
    }
  }, [entity, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (schema) {
        const validation = FormValidation.validateForm(schema, values);
        if (!validation.success) {
          const fieldErrors = FormValidation.zodToAntdErrors(validation.errors);
          form.setFields(fieldErrors);
          return;
        }
        await onSave(validation.data as Partial<T>);
      } else {
        await onSave(values);
      }

      showSuccessToast("Zapisano pomyślnie");
      onClose();
    } catch (error) {
      console.error("Error saving entity:", error);
      showErrorToast("Błąd podczas zapisywania");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const renderField = (field: any) => {
    const { name, type, placeholder, options, rows, rules, ...fieldProps } =
      field;

    switch (type) {
      case "textarea":
        return (
          <AppFormField
            key={name as string}
            name={name as any}
            rules={rules}
            {...fieldProps}
          >
            <textarea placeholder={placeholder} rows={rows || 3} />
          </AppFormField>
        );
      case "number":
        return (
          <AppFormField
            key={name as string}
            name={name as any}
            rules={rules}
            {...fieldProps}
          >
            <input
              type="number"
              placeholder={placeholder}
              style={{ width: "100%" }}
            />
          </AppFormField>
        );
      case "select":
        return (
          <AppFormField
            key={name as string}
            name={name as any}
            rules={rules}
            {...fieldProps}
          >
            <Select placeholder={placeholder}>
              {options?.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </AppFormField>
        );
      case "checkbox":
        return (
          <AppFormField
            key={name as string}
            name={name as any}
            valuePropName="checked"
            rules={rules}
            {...fieldProps}
          >
            <input type="checkbox" />
          </AppFormField>
        );
      default:
        return (
          <AppFormField
            key={name as string}
            name={name as any}
            rules={rules}
            {...fieldProps}
          >
            <input placeholder={placeholder} type={type} />
          </AppFormField>
        );
    }
  };

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      placement="right"
      destroyOnClose
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            onClick={handleCancel}
            icon={<CloseOutlined />}
            disabled={loading}
          >
            Anuluj
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            icon={<SaveOutlined />}
          >
            Zapisz
          </Button>
        </Space>
      }
    >
      <AppForm form={form} layout="vertical" disabled={loading} schema={schema}>
        {fields.map(renderField)}
      </AppForm>
    </Drawer>
  );
}
