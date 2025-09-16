import { Button } from "@/new-ui/atoms/Button/Button";
import { Input } from "@/new-ui/atoms/Input/Input";
import { Label } from "@/new-ui/atoms/Label/Label";
import { Separator } from "@/new-ui/atoms/Separator/Separator";
import { Switch } from "@/new-ui/atoms/Switch/Switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { FormField } from "@/new-ui/molecules/FormField/FormField";
import { Select, type SelectOption } from "@/new-ui/molecules/Select/Select";
import { PageHeader } from "@/new-ui/organisms/PageHeader/PageHeader";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface UserSettings {
  name: string;
  email: string;
  avatar?: string;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: string;
    dataSharing: boolean;
  };
}

export interface SettingsPageProps {
  settings: UserSettings;
  onSave?: (settings: UserSettings) => void;
  onCancel?: () => void;
  className?: string;
  loading?: boolean;
}

export function SettingsPage({
  settings,
  onSave,
  onCancel,
  className,
  loading = false,
}: SettingsPageProps): React.ReactElement {
  const [formData, setFormData] = React.useState<UserSettings>(settings);

  const languageOptions: SelectOption[] = [
    { value: "en", label: "English" },
    { value: "pl", label: "Polski" },
    { value: "de", label: "Deutsch" },
    { value: "fr", label: "Français" },
  ];

  const timezoneOptions: SelectOption[] = [
    { value: "UTC", label: "UTC" },
    { value: "Europe/Warsaw", label: "Europe/Warsaw" },
    { value: "Europe/Berlin", label: "Europe/Berlin" },
    { value: "America/New_York", label: "America/New_York" },
  ];

  const visibilityOptions: SelectOption[] = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "friends", label: "Friends Only" },
  ];

  const handleSave = () => {
    onSave?.(formData);
  };

  const handleCancel = () => {
    setFormData(settings);
    onCancel?.();
  };

  const breadcrumbs = [{ label: "Settings" }];

  const actions = (
    <div className="tw-flex tw-gap-2">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleSave} loading={loading}>
        Save Changes
      </Button>
    </div>
  );

  return (
    <div className={cn("tw-space-y-6", className)}>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
        {/* Main Content */}
        <div className="lg:tw-col-span-2 tw-space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <FormField label="Name" required>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                />
              </FormField>

              <FormField label="Email" required>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                />
              </FormField>

              <FormField label="Avatar URL">
                <Input
                  value={formData.avatar || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, avatar: e.target.value }))
                  }
                  placeholder="Enter avatar URL"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <FormField label="Language">
                <Select
                  options={languageOptions}
                  value={formData.language}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                />
              </FormField>

              <FormField label="Timezone">
                <Select
                  options={timezoneOptions}
                  value={formData.timezone}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, timezone: value }))
                  }
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked },
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked },
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="tw-space-y-6">
          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <FormField label="Profile Visibility">
                <Select
                  options={visibilityOptions}
                  value={formData.privacy.profileVisibility}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: value },
                    }))
                  }
                />
              </FormField>

              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-space-y-0.5">
                  <Label>Data Sharing</Label>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    Allow data sharing for analytics
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.dataSharing}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, dataSharing: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="tw-border-destructive">
            <CardHeader>
              <CardTitle className="tw-text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <div className="tw-space-y-2">
                <h4 className="tw-text-sm tw-font-medium">Delete Account</h4>
                <p className="tw-text-sm tw-text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
