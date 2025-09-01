import { 
  BarChart3, 
  ClipboardList, 
  Users, 
  Palette, 
  Settings, 
  Factory, 
  Package, 
  Cog 
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "./ui/sidebar";

interface MainSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "projekty", label: "Projekty", icon: ClipboardList },
  { id: "klienci", label: "Klienci (CRM)", icon: Users },
  { id: "projektowy", label: "Dział Projektowy", icon: Palette },
  { id: "cnc", label: "CNC", icon: Settings },
  { id: "produkcja", label: "Produkcja", icon: Factory },
  { id: "magazyn", label: "Magazyn", icon: Package },
  { id: "ustawienia", label: "Ustawienia", icon: Cog },
];

export function MainSidebar({ activeSection, onSectionChange }: MainSidebarProps) {
  return (
    <Sidebar className="w-60 border-r border-sidebar-border hidden lg:flex flex-shrink-0">
      <SidebarHeader className="p-4 lg:p-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Factory className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-sidebar-foreground truncate">FabrykaManage</h1>
            <p className="text-xs text-sidebar-foreground/70">V 2.0</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start gap-3 px-3 py-3"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}