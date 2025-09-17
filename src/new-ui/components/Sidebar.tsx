import {
  CalendarDaysIcon,
  HomeIcon,
  FolderIcon,
  UsersIcon,
  PencilIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/modern", icon: HomeIcon, shortcut: "⇧⌘A" },
    { name: "Projekty", href: "/modern/projects", icon: FolderIcon, shortcut: "⇧⌘A" },
    { name: "Klienci", href: "/modern/clients", icon: UsersIcon, shortcut: "⇧⌘A" },
    { name: "Kalendarz", href: "/modern/calendar", icon: CalendarDaysIcon, shortcut: "⇧⌘A" },
    { name: "Dział Projektowy", href: "/modern/design", icon: PencilIcon, shortcut: "⇧⌘A" },
    { name: "CNC", href: "/modern/cnc", icon: WrenchScrewdriverIcon, shortcut: "⇧⌘A" },
    { name: "Produkcja", href: "/modern/production", icon: BuildingOfficeIcon, shortcut: "⇧⌘A" },
    { name: "Magazyn", href: "/modern/warehouse", icon: ArchiveBoxIcon, shortcut: "⇧⌘A" },
    { name: "Podwykonawcy", href: "/modern/subcontractors", icon: ShieldCheckIcon, shortcut: "⇧⌘A" },
    { name: "Zapotrzebowania", href: "/modern/demands", icon: CubeIcon, shortcut: "⇧⌘A" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-12">
        {/* Collapse Button */}
        <div className="tw-p-2 tw-border-b tw-border-sidebar-border">
          <button
            onClick={() => setIsCollapsed(false)}
            className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-lg hover:tw-bg-sidebar-accent tw-transition-colors"
          >
            <Bars3Icon className="tw-h-4 tw-w-4 tw-text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation Icons */}
        <nav className="tw-flex-1 tw-py-4 tw-space-y-2">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} title={item.name}>
              <div
                className={`tw-w-8 tw-h-8 tw-mx-2 tw-flex tw-items-center tw-justify-center tw-rounded-md tw-transition-colors ${
                  isActive(item.href)
                    ? "tw-bg-sidebar-primary tw-text-sidebar-primary-foreground"
                    : "tw-text-sidebar-foreground hover:tw-bg-sidebar-accent"
                }`}
              >
                <item.icon className="tw-h-4 tw-w-4" />
              </div>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
      {/* Header */}
      <div className="tw-p-4 tw-border-b tw-border-sidebar-border">
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <div className="tw-flex tw-items-center tw-space-x-3">
            <div className="tw-h-8 tw-w-8 tw-bg-sidebar-primary tw-rounded-lg tw-flex tw-items-center tw-justify-center">
              <span className="tw-text-sidebar-primary-foreground tw-font-bold tw-text-sm">
                F
              </span>
            </div>
            <div>
              <h1 className="tw-text-sm tw-font-semibold tw-text-sidebar-foreground">
                FabManage
              </h1>
              <p className="tw-text-xs tw-text-sidebar-accent-foreground">
                System Zarządzania Produkcją
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-lg hover:tw-bg-sidebar-accent tw-transition-colors"
          >
            <ChevronUpDownIcon className="tw-h-4 tw-w-4 tw-text-sidebar-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="tw-relative">
          <MagnifyingGlassIcon className="tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-h-4 tw-w-4 tw-text-sidebar-accent-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-bg-sidebar-accent tw-border tw-border-sidebar-border tw-rounded-md tw-text-sm tw-text-sidebar-foreground placeholder:tw-text-sidebar-accent-foreground focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-sidebar-primary focus:tw-border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="tw-flex-1 tw-py-4 tw-space-y-1">
        {navigation.map((item) => (
          <Link key={item.name} to={item.href}>
            <div
              className={`tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-mx-2 tw-rounded-md tw-transition-colors ${
                isActive(item.href)
                  ? "tw-bg-sidebar-primary tw-text-sidebar-primary-foreground"
                  : "tw-text-sidebar-foreground hover:tw-bg-sidebar-accent hover:tw-text-sidebar-accent-foreground"
              }`}
            >
              <div className="tw-flex tw-items-center tw-space-x-3">
                <item.icon className="tw-h-4 tw-w-4" />
                <span className="tw-text-sm">{item.name}</span>
              </div>
              <span className="tw-text-xs tw-text-sidebar-accent-foreground">
                {item.shortcut}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="tw-p-4 tw-border-t tw-border-sidebar-border">
        <div className="tw-flex tw-items-center tw-space-x-3">
          <div className="tw-h-8 tw-w-8 tw-bg-sidebar-primary tw-rounded-full tw-flex tw-items-center tw-justify-center">
            <span className="tw-text-sidebar-primary-foreground tw-font-medium tw-text-xs">
              JD
            </span>
          </div>
          <div className="tw-flex-1 tw-min-w-0">
            <p className="tw-text-sm tw-font-medium tw-text-sidebar-foreground tw-truncate">
              John Doe
            </p>
            <p className="tw-text-xs tw-text-sidebar-accent-foreground tw-truncate">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
