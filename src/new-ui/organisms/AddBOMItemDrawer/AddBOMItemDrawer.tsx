// Add BOM Item Drawer - Form for adding materials to project BOM
import React, { useEffect, useState } from "react";
import { Form } from "../../atoms/Form/Form";
import { Drawer } from "../../molecules/Drawer/Drawer";
import { Select } from "../../molecules/Select/Select";
// InputNumber component not available in new-ui yet, using Ant Design temporarily
import { PlusOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import { useMaterialStore } from "../../../stores/materialStore";
import { Button } from "../../atoms/Button/Button";

const { Option } = Select;

interface AddBOMItemDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}

interface Material {
  id: string;
  code: string;
  name: string;
  category: string | null;
  unit_price: number | null;
}

export const AddBOMItemDrawer: React.FC<AddBOMItemDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  projectId,
}) => {
  const [form] = Form.useForm();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const { materials, isLoading, fetchMaterials, addBOMItem } =
    useMaterialStore();

  useEffect(() => {
    if (open && materials.length === 0) {
      fetchMaterials();
    }
  }, [open, materials.length, fetchMaterials]);

  useEffect(() => {
    if (selectedMaterial?.unit_price) {
      form.setFieldsValue({
        unit_cost: selectedMaterial.unit_price,
      });
    }
  }, [selectedMaterial, form]);

  const handleMaterialChange = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    setSelectedMaterial(material || null);
  };

  const handleSubmit = async (values: any) => {
    try {
      await addBOMItem(projectId, {
        material_id: values.material_id,
        quantity: values.quantity,
        unit_cost: values.unit_cost,
      });

      form.resetFields();
      setSelectedMaterial(null);
      onSuccess();
      message.success("BOM item added successfully");
    } catch (error: any) {
      message.error(error.message || "Failed to add BOM item");
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedMaterial(null);
    onClose();
  };

  return (
    <Drawer
      title="Add Material to BOM"
      width={600}
      open={open}
      onClose={handleClose}
      destroyOnClose
      footer={
        <div className="flex justify-end space-x-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Add Material
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          quantity: 1,
          unit_cost: 0,
        }}
      >
        <Form.Item
          name="material_id"
          label="Material"
          rules={[{ required: true, message: "Please select a material" }]}
        >
          <Select
            placeholder="Select material"
            showSearch
            loading={isLoading}
            onChange={handleMaterialChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) || false
            }
          >
            {materials.map((material) => (
              <Option key={material.id} value={material.id}>
                <div>
                  <div className="font-medium">{material.name}</div>
                  <div className="text-sm text-gray-500">
                    {material.code} • {material.category || "Uncategorized"}
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedMaterial && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <div>
                <strong>Material:</strong> {selectedMaterial.name}
              </div>
              <div>
                <strong>Code:</strong> {selectedMaterial.code}
              </div>
              <div>
                <strong>Category:</strong>{" "}
                {selectedMaterial.category || "Uncategorized"}
              </div>
              {selectedMaterial.unit_price && (
                <div>
                  <strong>Standard Price:</strong>{" "}
                  {new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(selectedMaterial.unit_price)}
                </div>
              )}
            </div>
          </div>
        )}

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            { required: true, message: "Please enter quantity" },
            {
              type: "number",
              min: 0.001,
              message: "Quantity must be greater than 0",
            },
          ]}
        >
          <InputNumber
            placeholder="Enter quantity"
            min={0.001}
            step={0.001}
            precision={3}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="unit_cost"
          label="Unit Cost (PLN)"
          rules={[
            { required: true, message: "Please enter unit cost" },
            {
              type: "number",
              min: 0,
              message: "Unit cost must be non-negative",
            },
          ]}
        >
          <InputNumber
            placeholder="Enter unit cost"
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

        <Form.Item shouldUpdate>
          {({ getFieldsValue }) => {
            const { quantity, unit_cost } = getFieldsValue();
            const totalCost = (quantity || 0) * (unit_cost || 0);

            return (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <strong>Total Cost:</strong>{" "}
                  <span className="text-blue-600 font-semibold">
                    {new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(totalCost)}
                  </span>
                </div>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </Drawer>
  );
};
