import { useState } from "react";
import { MaterialForm } from "../../../components/shared/BaseForm";
import { useMaterialsStore } from "../../../stores/materialsStore";

interface MaterialsFormProps {
  material?: any;
  open: boolean;
  onClose: () => void;
  onSave?: (values: any) => void | Promise<void>;
}

export function MaterialsForm({
  material,
  open,
  onClose,
  onSave,
}: MaterialsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateMaterial, addMaterial } = useMaterialsStore();

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      
      if (material?.id) {
        await updateMaterial(material.id, values);
      } else {
        const newMaterial = { ...values, id: `material-${Date.now()}` };
        await addMaterial(newMaterial);
      }

      // Call external onSave if provided
      if (onSave) {
        await onSave(values);
      }
    } catch (error) {
      console.error("Error saving material:", error);
      throw error; // Re-throw to let BaseForm handle the error display
    } finally {
      setLoading(false);
    }
  };

  return (
    <MaterialForm
      material={material}
      open={open}
      onClose={onClose}
      onSave={handleSave}
      loading={loading}
    />
  );
}

export default MaterialsForm;
