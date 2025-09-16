import { Form, Input, Modal } from "antd";

interface CreateGroupModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  onClose?: () => void;
  isOpen?: boolean;
  onCreateGroup?: (groupData: any) => void;
}

export default function CreateGroupModal({
  open,
  onCancel,
  onOk,
}: CreateGroupModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal title="Create Group" open={open} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: "Please input group name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}
