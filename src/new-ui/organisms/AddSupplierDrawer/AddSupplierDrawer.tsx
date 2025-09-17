// Add Supplier Drawer - Form for adding/editing suppliers
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useMaterialStore } from "../../../stores/materialStore";
import { Button } from "../../atoms/Button/Button";
import { Form } from "../../atoms/Form/Form";
import { Input } from "../../atoms/Input/Input";
import { Drawer } from "../../molecules/Drawer/Drawer";

const { TextArea } = Input;

interface AddSupplierDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier?: any; // For editing
}

export const AddSupplierDrawer: React.FC<AddSupplierDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  supplier,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!supplier;

  const { isLoading, createSupplier, updateSupplier } = useMaterialStore();

  useEffect(() => {
    if (open && supplier) {
      // Populate form for editing
      form.setFieldsValue({
        name: supplier.name,
        contact_info: supplier.contact_info,
      });
    } else if (open) {
      // Reset form for new supplier
      form.resetFields();
    }
  }, [open, supplier, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await updateSupplier(supplier.id, values);
      } else {
        await createSupplier(values);
      }

      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(
        error.message || `Failed to ${isEditing ? "update" : "create"} supplier`
      );
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={isEditing ? "Edit Supplier" : "Add New Supplier"}
      width={600}
      open={open}
      onClose={handleClose}
      destroyOnClose
      data-testid="add-supplier-drawer"
      footer={
        <div className="flex justify-end space-x-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            {isEditing ? "Update Supplier" : "Add Supplier"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Supplier Name"
          rules={[
            { required: true, message: "Please enter supplier name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="e.g., ABC Materials Ltd." />
        </Form.Item>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Contact Information
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            Enter contact details in JSON format or as plain text
          </p>
        </div>

        <Form.Item
          name="contact_info"
          label="Contact Information"
          rules={[
            { required: true, message: "Please enter contact information" },
          ]}
        >
          <TextArea
            placeholder={`Enter contact information as JSON or plain text:
            
Example JSON:
{
  "email": "contact@supplier.com",
  "phone": "+48 123 456 789",
  "address": "123 Main St, Warsaw, Poland",
  "website": "https://supplier.com"
}

Or plain text:
Email: contact@supplier.com
Phone: +48 123 456 789
Address: 123 Main St, Warsaw, Poland`}
            rows={8}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
