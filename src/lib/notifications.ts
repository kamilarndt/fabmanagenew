import { message } from "@/new-ui/utils/message";
import { notification } from "@/new-ui/utils/notification";

export function showToast(
  messageText: string,
  variant: "success" | "danger" | "info" | "warning" = "success"
) {
  const type = variant === "danger" ? "error" : variant;
  message[type]({
    content: messageText,
    duration: 3,
  });
}

export function showNotification(
  title: string,
  description: string,
  type: "success" | "error" | "info" | "warning" = "success"
) {
  notification[type]({
    title: title,
    description,
    duration: 4.5,
    placement: "topRight",
  });
}
