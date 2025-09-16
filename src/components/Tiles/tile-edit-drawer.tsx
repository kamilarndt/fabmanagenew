import { DatePicker, Drawer, Form, Input, Select } from "antd";
import React from "react";

interface TileEditDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  tile?: any;
  projectId?: string;
}

export default function TileEditDrawer({
  open,
  onClose,
  tile,
}: TileEditDrawerProps) {
  const [form] = Form.useForm();

  // Use handleSave in the drawer footer
  React.useEffect(() => {
    if (open) {
      // This is a placeholder - in a real implementation, you'd add a footer with save button
    }
  }, [open]);

  return (
    <Drawer
      title="Edit Tile"
      open={open}
      onClose={onClose}
      placement="right"
      width={400}
    >
      <Form form={form} layout="vertical" initialValues={tile}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select>
            <Select.Option value="new">New</Select.Option>
            <Select.Option value="in_progress">In Progress</Select.Option>
            <Select.Option value="waiting_for_approval">
              Waiting for Approval
            </Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="in_production">In Production</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="Priority">
          <Select>
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
            <Select.Option value="urgent">Urgent</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="deadline" label="Deadline">
          <DatePicker />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
