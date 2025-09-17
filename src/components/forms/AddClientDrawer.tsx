import React, { useState } from "react";
import { showToast } from "../../lib/notifications";
import { cn } from "../../lib/utils";
import { Button } from "../../new-ui/atoms/Button/Button";
import { Icon } from "../../new-ui/atoms/Icon/Icon";
import { Input } from "../../new-ui/atoms/Input/Input";
import { Space } from "../../new-ui/atoms/Space/Space";
import { Drawer } from "../../new-ui/molecules/Drawer/Drawer";
import { clientSchema, type ClientFormData } from "../../schemas/client.schema";
import { clientsService } from "../../services/clients";

interface AddClientDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (client: unknown) => void;
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
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = clientSchema.parse(formData);

      // Create client via service
      const newClient = await clientsService.create(validatedData);

      // Success feedback
      showToast("Klient został pomyślnie dodany!", "success");

      // Call success callback
      onSuccess(newClient);

      // Reset form and close
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        address: "",
        notes: "",
      });
      onClose();
    } catch (error: unknown) {
      console.error("Error creating client:", error);

      if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError") {
        // Handle Zod validation errors
        const fieldErrors: Record<string, string> = {};
        if ('errors' in error && Array.isArray(error.errors)) {
          error.errors.forEach((err: unknown) => {
            if (err && typeof err === 'object' && 'path' in err && 'message' in err) {
              const path = err.path as unknown[];
              if (Array.isArray(path) && path.length > 0) {
                fieldErrors[String(path[0])] = String(err.message);
              }
            }
          });
        }
        setErrors(fieldErrors);
        showToast("Proszę poprawić błędy w formularzu", "danger");
      } else {
        // Handle API errors
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? String(error.message) 
          : "Wystąpił błąd podczas dodawania klienta";
        showToast(errorMessage, "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      address: "",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <Icon name="user-plus" className="w-5 h-5 text-primary" />
          <span>Dodaj nowego klienta</span>
        </div>
      }
      open={open}
      onClose={handleCancel}
      placement="right"
      width={480}
      destroyOnClose
      className="modern-drawer"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imię i nazwisko *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Wprowadź imię i nazwisko"
              error={errors.name}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Wprowadź adres email"
              error={errors.email}
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Wprowadź numer telefonu"
              error={errors.phone}
              className="w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Company Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Firma
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Wprowadź nazwę firmy"
              error={errors.companyName}
              className="w-full"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Wprowadź adres"
              error={errors.address}
              className="w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notatki
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Dodatkowe informacje o kliencie"
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.notes && "border-red-500 text-red-700 focus-visible:ring-red-500"
              )}
              rows={3}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <Space className="w-full justify-end pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            <Icon name="x" className="w-4 h-4 mr-2" />
            Anuluj
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            <Icon name="user-plus" className="w-4 h-4 mr-2" />
            Dodaj klienta
          </Button>
        </Space>
      </form>
    </Drawer>
  );
};