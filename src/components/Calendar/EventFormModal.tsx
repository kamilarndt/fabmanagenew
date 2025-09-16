import { DatePicker, Form, Input, Modal } from "antd";

interface EventFormModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  onDelete?: () => void;
  initialValues?: any;
  initial?: any;
  resources?: any[];
  onSubmit?: (values: any) => void;
}

export default function EventFormModal({
  open,
  onCancel,
  onOk,
  initialValues,
}: EventFormModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal title="Event Form" open={open} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="start"
          label="Start Date"
          rules={[{ required: true, message: "Please select start date!" }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="end"
          label="End Date"
          rules={[{ required: true, message: "Please select end date!" }]}
        >
          <DatePicker showTime />
        </Form.Item>
      </Form>
    </Modal>
  );
}
