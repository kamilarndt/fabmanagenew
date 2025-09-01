import { toast } from "sonner@2.0.3";

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};