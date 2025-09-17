// import {
//   BellIcon,
//   CogIcon,
//   KeyIcon,
//   PaintBrushIcon,
//   ShieldCheckIcon,
//   UserIcon,
// } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { ModernButton } from "../atoms/Button/ModernButton";
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
} from "../atoms/Card/ModernCard";

const ModernSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    profile: {
      name: "John Doe",
      email: "john.doe@fabmanage.com",
      role: "Project Manager",
      department: "Construction",
      phone: "+1 (555) 123-4567",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      projectUpdates: true,
      materialAlerts: true,
      budgetWarnings: true,
      weeklyReports: false,
    },
    appearance: {
      theme: "light",
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAlerts: true,
    },
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "appearance", name: "Appearance", icon: PaintBrushIcon },
    { id: "security", name: "Security", icon: ShieldCheckIcon },
    { id: "preferences", name: "Preferences", icon: CogIcon },
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <ModernCard>
        <ModernCardHeader
          title="Personal Information"
          description="Update your personal details and contact information"
        />
        <ModernCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) =>
                  handleSettingChange("profile", "name", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) =>
                  handleSettingChange("profile", "email", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Role
              </label>
              <input
                type="text"
                value={settings.profile.role}
                onChange={(e) =>
                  handleSettingChange("profile", "role", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Department
              </label>
              <input
                type="text"
                value={settings.profile.department}
                onChange={(e) =>
                  handleSettingChange("profile", "department", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.profile.phone}
                onChange={(e) =>
                  handleSettingChange("profile", "phone", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-6">
            <ModernButton>Save Changes</ModernButton>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <ModernCard>
        <ModernCardHeader
          title="Notification Preferences"
          description="Choose how you want to be notified about important updates"
        />
        <ModernCardContent>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-primary">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <p className="text-sm text-secondary">
                    {key === "emailNotifications" &&
                      "Receive notifications via email"}
                    {key === "pushNotifications" &&
                      "Receive push notifications in browser"}
                    {key === "projectUpdates" &&
                      "Get notified about project status changes"}
                    {key === "materialAlerts" &&
                      "Receive alerts about low stock materials"}
                    {key === "budgetWarnings" &&
                      "Get warned when approaching budget limits"}
                    {key === "weeklyReports" &&
                      "Receive weekly summary reports"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        key,
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-tertiary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <ModernCard>
        <ModernCardHeader
          title="Appearance Settings"
          description="Customize the look and feel of your application"
        />
        <ModernCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Theme
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) =>
                  handleSettingChange("appearance", "theme", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Language
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) =>
                  handleSettingChange("appearance", "language", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="pl">Polski</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Timezone
              </label>
              <select
                value={settings.appearance.timezone}
                onChange={(e) =>
                  handleSettingChange("appearance", "timezone", e.target.value)
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="UTC-5">UTC-5 (EST)</option>
                <option value="UTC-6">UTC-6 (CST)</option>
                <option value="UTC-7">UTC-7 (MST)</option>
                <option value="UTC-8">UTC-8 (PST)</option>
                <option value="UTC+1">UTC+1 (CET)</option>
                <option value="UTC+2">UTC+2 (EET)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Date Format
              </label>
              <select
                value={settings.appearance.dateFormat}
                onChange={(e) =>
                  handleSettingChange(
                    "appearance",
                    "dateFormat",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <ModernCard>
        <ModernCardHeader
          title="Security Settings"
          description="Manage your account security and privacy settings"
        />
        <ModernCardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-primary">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-secondary">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "twoFactorAuth",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-tertiary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleSettingChange(
                    "security",
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                min="5"
                max="480"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) =>
                  handleSettingChange(
                    "security",
                    "passwordExpiry",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                min="30"
                max="365"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-primary">
                  Login Alerts
                </h3>
                <p className="text-sm text-secondary">
                  Get notified when someone logs into your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.loginAlerts}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "loginAlerts",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-tertiary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-border-light">
              <ModernButton
                variant="outline"
                leftIcon={<KeyIcon className="h-4 w-4" />}
              >
                Change Password
              </ModernButton>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <ModernCard>
        <ModernCardHeader
          title="Application Preferences"
          description="Customize your application experience"
        />
        <ModernCardContent>
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-primary mb-2">
              Preferences Coming Soon
            </h3>
            <p className="text-secondary">
              Additional customization options will be available in future
              updates
            </p>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "appearance":
        return renderAppearanceTab();
      case "security":
        return renderSecurityTab();
      case "preferences":
        return renderPreferencesTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-primary">Settings</h1>
          <p className="text-lg text-secondary mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ModernCard>
              <ModernCardContent padding="none">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-secondary hover:bg-tertiary hover:text-primary"
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </ModernCardContent>
            </ModernCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ModernSettings;
