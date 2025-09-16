import { Form, Input, Modal, Select } from "antd";

interface AddMemberModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  onClose?: () => void;
  isOpen?: boolean;
  currentMemberIds?: string[];
  onAddMembers?: (memberIds: string[]) => void;
}

export default function AddMemberModal({
  open,
  onCancel,
  onOk,
}: AddMemberModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal title="Add Member" open={open} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="viewer">Viewer</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
