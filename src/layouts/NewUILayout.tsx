import { AppShell, type SidebarItem } from "@/new-ui";
import * as React from "react";
import { Outlet } from "react-router-dom";

export default function NewUILayout(): React.ReactElement {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "home",
      href: "/v2/dashboard",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "folder",
      href: "/v2/projects",
      children: [
        {
          id: "projects-list",
          label: "All Projects",
          href: "/v2/projects",
        },
        {
          id: "projects-new",
          label: "New Project",
          href: "/v2/projects/new",
        },
      ],
    },
    {
      id: "materials",
      label: "Materials",
      icon: "package",
      href: "/v2/materials",
    },
    {
      id: "tiles",
      label: "Tiles",
      icon: "square",
      href: "/v2/tiles",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      href: "/v2/settings",
    },
  ];

  const handleSidebarItemClick = (item: SidebarItem) => {
    if (item.href) {
      window.location.href = item.href;
    }
  };

  const user = {
    name: "John Doe",
    email: "john.doe@fabmanage.com",
    avatar: undefined,
  };

  const notifications = {
    count: 3,
    onClick: () => {
      console.log("Notifications clicked");
    },
  };

  return (
    <AppShell
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      user={user}
      onUserMenuClick={() => {
        console.log("User menu clicked");
      }}
      notifications={notifications}
    >
      <Outlet />
    </AppShell>
  );
}
