import { CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Space, message } from "antd";
import React, { useState } from "react";
import { clientSchema, type ClientFormData } from "../../schemas/client.schema";
import { clientsService } from "../../services/clients";

interface AddClientDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (client: any) => void;
}

/**
 * Add Client Drawer Form
 *
 * Features:
 * - Right-side drawer (UI/UX Guidelines compliance)
 * - Zod validation with error display
 * - Loading states during submission
 * - Success feedback with auto-close
 * - Integration with clientsService
 * - Design token integration
 */
export const AddClientDrawer: React.FC<AddClientDrawerProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<ClientFormData>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: ClientFormData) => {
    setLoading(true);
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = clientSchema.parse(values);

      // Create client via service
      const newClient = await clientsService.create(validatedData);

      // Success feedback
      message.success("Klient został pomyślnie dodany!");

      // Call success callback
      onSuccess(newClient);

      // Reset form and close
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("Error creating client:", error);

      if (error.name === "ZodError") {
        // Handle Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);

        // Set form field errors
        const formErrors = error.errors.map((err: any) => ({
          name: err.path,
          errors: [err.message],
        }));
        form.setFields(formErrors);
      } else {
        // Handle API errors
        message.error(
          error.message || "Wystąpił błąd podczas dodawania klienta"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    onClose();
  };

  return (
    <Drawer
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-foreground-default)",
          }}
        >
          <UserAddOutlined />
          Dodaj nowego klienta
        </div>
      }
      width={480}
      open={open}
      onClose={handleCancel}
      placement="right"
      closable={false}
      data-testid="add-client-drawer"
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleCancel}
          style={{ color: "var(--color-foreground-muted)" }}
        />
      }
      style={{
        backgroundColor: "var(--color-background-card)",
        borderLeft: "1px solid var(--color-border-default)",
      }}
      bodyStyle={{
        padding: "24px",
        backgroundColor: "var(--color-background-card)",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        requiredMark={false}
        style={{ height: "100%" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Client Name - Required */}
          <Form.Item
            label="Nazwa klienta"
            name="name"
            required
            validateStatus={errors.name ? "error" : ""}
            help={errors.name}
          >
            <Input
              placeholder="Wprowadź nazwę klienta"
              size="large"
              style={{
                backgroundColor: "var(--color-background-default)",
                borderColor: "var(--color-border-default)",
                color: "var(--color-foreground-default)",
              }}
            />
          </Form.Item>

          {/* Company Name - Optional */}
          <Form.Item
            label="Nazwa firmy"
            name="companyName"
            validateStatus={errors.companyName ? "error" : ""}
            help={errors.companyName}
          >
            <Input
              placeholder="Wprowadź nazwę firmy (opcjonalnie)"
              size="large"
              style={{
                backgroundColor: "var(--color-background-default)",
                borderColor: "var(--color-border-default)",
                color: "var(--color-foreground-default)",
              }}
            />
          </Form.Item>

          {/* Email - Optional */}
          <Form.Item
            label="Email"
            name="email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email}
          >
            <Input
              type="email"
              placeholder="Wprowadź adres email (opcjonalnie)"
              size="large"
              style={{
                backgroundColor: "var(--color-background-default)",
                borderColor: "var(--color-border-default)",
                color: "var(--color-foreground-default)",
              }}
            />
          </Form.Item>

          {/* Phone - Optional */}
          <Form.Item
            label="Telefon"
            name="phone"
            validateStatus={errors.phone ? "error" : ""}
            help={errors.phone}
          >
            <Input
              placeholder="Wprowadź numer telefonu (opcjonalnie)"
              size="large"
              style={{
                backgroundColor: "var(--color-background-default)",
                borderColor: "var(--color-border-default)",
                color: "var(--color-foreground-default)",
              }}
            />
          </Form.Item>

          {/* Address - Optional */}
          <Form.Item
            label="Adres"
            name="address"
            validateStatus={errors.address ? "error" : ""}
            help={errors.address}
          >
            <Input.TextArea
              placeholder="Wprowadź adres (opcjonalnie)"
              rows={3}
              style={{
                backgroundColor: "var(--color-background-default)",
                borderColor: "var(--color-border-default)",
                color: "var(--color-foreground-default)",
              }}
            />
          </Form.Item>

          {/* Notes - Optional */}
          <Form.Item
            label="Notatki"
            name="notes"
            validateStatus={errors.notes ? "error" : ""}
            help={errors.notes}
          >
            <Input.TextArea
              placeholder="Dodatkowe notatki (opcjonalnie)"
              rows={3}
              style={{
                backgroundColor: "var(--color-background-default)",
                borderColor: "var(--color-border-default)",
                color: "var(--color-foreground-default)",
              }}
            />
          </Form.Item>
        </Space>

        {/* Submit Buttons */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px",
            borderTop: "1px solid var(--color-border-default)",
            backgroundColor: "var(--color-background-card)",
            display: "flex",
            gap: "16px",
            justifyContent: "flex-end",
          }}
        >
          <Button
            size="large"
            onClick={handleCancel}
            disabled={loading}
            style={{
              backgroundColor: "var(--color-background-default)",
              borderColor: "var(--color-border-default)",
              color: "var(--color-foreground-default)",
            }}
          >
            Anuluj
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "var(--color-brand-primary)",
              borderColor: "var(--color-brand-primary)",
              color: "var(--color-white)",
            }}
          >
            {loading ? "Dodawanie..." : "Dodaj klienta"}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddClientDrawer;
