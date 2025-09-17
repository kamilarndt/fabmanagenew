// Add Material Drawer - Form for adding/editing materials
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button } from "../../atoms/Button/Button";
import { Form } from "../../atoms/Form/Form";
import { Input } from "../../atoms/Input/Input";
import { Drawer } from "../../molecules/Drawer/Drawer";
// InputNumber component not available in new-ui yet, using Ant Design temporarily
import { InputNumber } from "antd";
import React, { useEffect } from "react";
import { useMaterialStore } from "../../../stores/materialStore";
import { Select } from "../../molecules/Select/Select";

const { Option } = Select;

interface AddMaterialDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  material?: any; // For editing
}

export const AddMaterialDrawer: React.FC<AddMaterialDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  material,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!material;

  const {
    suppliers,
    isLoading,
    fetchSuppliers,
    createMaterial,
    updateMaterial,
  } = useMaterialStore();

  useEffect(() => {
    if (open && suppliers.length === 0) {
      fetchSuppliers();
    }
  }, [open, suppliers.length, fetchSuppliers]);

  useEffect(() => {
    if (open && material) {
      // Populate form for editing
      form.setFieldsValue({
        code: material.code,
        name: material.name,
        category: material.category,
        unit_price: material.unit_price,
        inventory_level: material.inventory_level,
        supplier_id: material.supplier_id,
      });
    } else if (open) {
      // Reset form for new material
      form.resetFields();
    }
  }, [open, material, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await updateMaterial(material.id, values);
      } else {
        await createMaterial(values);
      }

      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(
        error.message || `Failed to ${isEditing ? "update" : "create"} material`
      );
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const categories = [
    "Materiały konstrukcyjne",
    "Materiały malarskie",
    "Tekstylia",
    "Oświetlenie",
    "Łączniki",
    "Kleje",
    "Elektryka",
    "Narzędzia",
    "Bezpieczeństwo",
  ];

  return (
    <Drawer
      title={isEditing ? "Edit Material" : "Add New Material"}
      width={600}
      open={open}
      onClose={handleClose}
      destroyOnClose
      data-testid="add-material-drawer"
      footer={
        <div className="flex justify-end space-x-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            {isEditing ? "Update Material" : "Add Material"}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          inventory_level: 0,
          unit_price: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Material Code"
              rules={[
                { required: true, message: "Please enter material code" },
                { min: 2, message: "Code must be at least 2 characters" },
              ]}
            >
              <Input placeholder="e.g., MAT-001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Material Name"
              rules={[
                { required: true, message: "Please enter material name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="e.g., Steel Beam 100x50" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category" allowClear>
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unit_price"
              label="Unit Price (PLN)"
              rules={[
                { required: true, message: "Please enter unit price" },
                {
                  type: "number",
                  min: 0,
                  message: "Price must be non-negative",
                },
              ]}
            >
              <InputNumber
                placeholder="0.00"
                min={0}
                step={0.01}
                precision={2}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="inventory_level"
              label="Inventory Level"
              rules={[
                { required: true, message: "Please enter inventory level" },
                {
                  type: "number",
                  min: 0,
                  message: "Inventory must be non-negative",
                },
              ]}
            >
              <InputNumber
                placeholder="0"
                min={0}
                step={1}
                precision={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="supplier_id" label="Supplier">
          <Select
            placeholder="Select supplier (optional)"
            allowClear
            loading={isLoading}
          >
            {suppliers.map((supplier) => (
              <Option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
