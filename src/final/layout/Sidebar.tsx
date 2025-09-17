import {
  Calendar,
  ClipboardList,
  Factory,
  FolderOpen,
  LayoutDashboard,
  Palette,
  Settings,
  UserCheck,
  Users,
  Warehouse,
} from "lucide-react";
import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "../../new-ui/atoms/ThemeToggle";
import { designTokens } from "./design-tokens";

// Icon assets
const img =
  "http://localhost:3845/assets/cad031acd21f997812cc439fe69ed215d0e5bbc8.svg";
const img1 =
  "http://localhost:3845/assets/e3fc13e3d13c00f9e9ba37a2911b98aa5241d1ef.svg";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  items?: SidebarItem[];
  onToggle?: () => void;
  className?: string;
}

const defaultItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "projects",
    label: "Projekty",
    icon: <FolderOpen className="w-4 h-4" />,
  },
  { id: "clients", label: "Klienci", icon: <Users className="w-4 h-4" /> },
  {
    id: "calendar",
    label: "Kalendarz",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "design",
    label: "Dział Projektowy",
    icon: <Palette className="w-4 h-4" />,
  },
  { id: "cnc", label: "CNC", icon: <Settings className="w-4 h-4" /> },
  {
    id: "production",
    label: "Produkcja",
    icon: <Factory className="w-4 h-4" />,
  },
  {
    id: "warehouse",
    label: "Magazyn",
    icon: <Warehouse className="w-4 h-4" />,
  },
  {
    id: "contractors",
    label: "Podwykonawcy",
    icon: <UserCheck className="w-4 h-4" />,
  },
  {
    id: "requirements",
    label: "Zapotrzebowania",
    icon: <ClipboardList className="w-4 h-4" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultItems,
  onToggle,
  className = "",
}) => {
  const { theme } = useTheme();
  const colors = designTokens.getColors(theme);
  return (
    <div
      className={`content-stretch flex flex-col items-start justify-start relative rounded-bl-[12px] rounded-tl-[12px] size-full ${className}`}
      style={{
        backgroundColor: colors.background.default,
        borderRight: `1px solid ${colors.border.default}`,
      }}
      data-name="Sidebar"
      data-node-id="3:620"
    >
      {/* Header */}
      <div
        className="box-border content-stretch flex items-center justify-center pb-[20px] pt-[8px] px-[8px] relative shrink-0 w-full"
        data-name="Header"
        data-node-id="I30:4373;1:26848"
      >
        <div
          className="basis-0 box-border content-stretch flex grow items-center justify-start min-h-px min-w-px px-[8px] py-[6px] relative rounded-[4px] shrink-0"
          data-name=".Sidebar Item"
          data-node-id="I30:4373;1:26849"
        >
          <div
            className="basis-0 content-stretch flex gap-[8px] grow items-center justify-start min-h-px min-w-px relative shrink-0"
            data-name="Container"
            data-node-id="I30:4373;1:26849;1460:4116"
          >
            <div
              className="bg-zinc-900 box-border content-stretch flex gap-[10px] items-center justify-start p-[8px] relative rounded-[8px] shrink-0"
              data-name="Container"
              data-node-id="I30:4373;1:26849;1460:4925"
            >
              <div
                className="content-stretch flex h-[16px] items-center justify-center relative shrink-0"
                data-name="Icon"
                data-node-id="I30:4373;1:26849;1460:4312"
              >
                <div
                  className="overflow-clip relative shrink-0 size-[10.667px]"
                  data-name="gallery-vertical-end"
                  data-node-id="I30:4373;1:26849;1460:4312;72:6428"
                >
                  <div
                    className="absolute inset-[4.17%_8.33%]"
                    data-name="Vector (Stroke)"
                    data-node-id="I30:4373;1:26849;1460:4312;72:6428;93:1586"
                  >
                    <img
                      alt="gallery-vertical-end"
                      className="block max-w-none size-full"
                      src={img}
                      style={{
                        filter:
                          theme === "dark"
                            ? "invert(1) brightness(1.2) contrast(1.1)"
                            : "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0"
              data-name="Content"
              data-node-id="I30:4373;1:26849;1460:4967"
            >
              <div
                className="flex flex-col justify-center relative shrink-0 w-full"
                style={{
                  fontSize: `${designTokens.typography.fontSize.body}px`,
                  lineHeight: `${designTokens.typography.lineHeight.bodySmall}px`,
                  fontFamily: designTokens.typography.fontFamily.default,
                  fontWeight: designTokens.typography.fontWeight.heading,
                  color: colors.foreground.default,
                }}
                data-node-id="I30:4373;1:26849;1460:4119"
              >
                <p>FabManage</p>
              </div>
              <div
                className="flex flex-col justify-center relative shrink-0 w-full"
                style={{
                  fontSize: `${designTokens.typography.fontSize.bodyTiny}px`,
                  lineHeight: `${designTokens.typography.lineHeight.bodyTiny}px`,
                  fontFamily: designTokens.typography.fontFamily.default,
                  fontWeight: designTokens.typography.fontWeight.regular,
                  color: colors.foreground.muted,
                }}
                data-node-id="I30:4373;1:26849;1460:4965"
              >
                <p>System Zarządzania Produkcją</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            className="box-border content-stretch cursor-pointer flex h-[28px] items-center justify-center overflow-visible p-[8px] relative rounded-[8px] shrink-0"
            data-name="Button"
            data-node-id="I30:4373;3:1271"
            onClick={onToggle}
          >
            <div
              className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
              data-name="Icon"
              data-node-id="I30:4373;3:1271;210:4312"
            >
              <div
                className="overflow-clip relative shrink-0 size-[10.667px]"
                data-name="panel-left"
                data-node-id="I30:4373;3:1271;210:4312;72:6428"
              >
                <div
                  className="absolute inset-[8.333%]"
                  data-name="Vector (Stroke)"
                  data-node-id="I30:4373;3:1271;210:4312;72:6428;94:2130"
                >
                  <img
                    alt="panel-left"
                    className="block max-w-none size-full"
                    src={img1}
                    style={{
                      filter:
                        theme === "dark" ? "invert(1) brightness(0.8)" : "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div
        className="box-border content-stretch flex flex-col items-start justify-start p-[8px] relative shrink-0 w-full"
        data-name="Container"
        data-node-id="I30:4373;1:26852"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`box-border content-stretch flex gap-[4px] items-center justify-start px-[8px] py-[6px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-colors duration-200 ${
              item.isActive ? "" : ""
            }`}
            style={{
              backgroundColor: item.isActive
                ? colors.background.secondary
                : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!item.isActive) {
                e.currentTarget.style.backgroundColor =
                  colors.background.secondary;
              }
            }}
            onMouseLeave={(e) => {
              if (!item.isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
            data-name=".Sidebar Item"
            data-node-id={`I30:4373;1:2794${2 + index}`}
            onClick={item.onClick}
          >
            <div
              className="basis-0 content-stretch flex gap-[8px] grow items-center justify-start min-h-px min-w-px relative shrink-0"
              data-name="Container"
              data-node-id={`I30:4373;1:2794${2 + index};1460:3855`}
            >
              <div
                className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
                data-name="Icon"
                data-node-id={`I30:4373;1:2794${2 + index};1471:9067`}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    color: colors.icon.default,
                  }}
                >
                  {item.icon}
                </div>
              </div>
              <div
                className="basis-0 flex flex-col grow justify-center min-h-px min-w-px relative shrink-0"
                style={{
                  fontSize: `${designTokens.typography.fontSize.bodySmall}px`,
                  lineHeight: `${designTokens.typography.lineHeight.bodySmall}px`,
                  fontFamily: designTokens.typography.fontFamily.default,
                  fontWeight: designTokens.typography.fontWeight.regular,
                  color: colors.foreground.default,
                }}
                data-node-id={`I30:4373;1:2794${2 + index};1460:3857`}
              >
                <p>{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible Section */}
      <div
        className="box-border content-stretch flex flex-col items-start justify-start p-[8px] relative shrink-0 w-full"
        data-name="Container"
        data-node-id="I30:4373;1:26854"
      >
        <div
          className="h-[256px] shrink-0 w-full"
          data-name=".Collapsible SidebarGroup"
          data-node-id="I30:4373;1:27158"
        />
      </div>

      {/* Collapsible Button Container */}
      <div
        className="absolute h-[712px] left-[256px] top-0 w-[44px]"
        data-name="Collapsable button container"
        data-node-id="I30:4373;1:26856"
      />
    </div>
  );
};

export default function SidebarLayout() {
  const { theme } = useTheme();
  const colors = designTokens.getColors(theme);

  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start relative rounded-bl-[12px] rounded-tl-[12px] size-full"
      style={{
        backgroundColor: colors.background.default,
        boxShadow:
          theme === "dark"
            ? "0px_4px_8px_3px_rgba(0,0,0,0.3),0px_1px_3px_0px_rgba(0,0,0,0.5)"
            : "0px_4px_8px_3px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.3)",
      }}
      data-name="Sidebar"
      data-node-id="30:4373"
    >
      <Sidebar />
    </div>
  );
}
