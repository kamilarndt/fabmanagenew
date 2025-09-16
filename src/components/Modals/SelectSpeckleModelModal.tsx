import { Button, List, Modal } from "antd";

interface SelectSpeckleModelModalProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (model: any) => void;
  models?: any[];
  onClose?: () => void;
}

export default function SelectSpeckleModelModal({
  open,
  onCancel,
  onSelect,
  models = [],
}: SelectSpeckleModelModalProps) {
  return (
    <Modal
      title="Select Speckle Model"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <List
        dataSource={models}
        renderItem={(model) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => onSelect(model)}>
                Select
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={model.name}
              description={model.description}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}
