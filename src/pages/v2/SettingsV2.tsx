import { SettingsPage } from "@/new-ui";
import * as React from "react";

export default function SettingsV2(): React.ReactElement {
  const [settings, setSettings] = React.useState({
    name: "John Doe",
    email: "john.doe@fabmanage.com",
    avatar: undefined as string | undefined,
    language: "en",
    timezone: "Europe/Warsaw",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
    },
  });

  const handleSave = (newSettings: any) => {
    console.log("Saving settings:", newSettings);
    setSettings(newSettings);
    // Here you would typically save to backend
    // await saveSettings(newSettings);
  };

  const handleCancel = () => {
    console.log("Settings cancelled");
    // Reset to original settings if needed
  };

  return (
    <SettingsPage
      settings={settings}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
