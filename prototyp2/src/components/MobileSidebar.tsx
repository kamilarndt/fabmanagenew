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

interface MobileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose?: () => void;
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

export function MobileSidebar({ activeSection, onSectionChange, onClose }: MobileSidebarProps) {
  const handleItemClick = (section: string) => {
    onSectionChange(section);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full bg-sidebar flex flex-col">
      <div className="p-4 sm:p-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Factory className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-sidebar-foreground truncate">FabrykaManage</h1>
            <p className="text-xs text-sidebar-foreground/70">V 2.0</p>
          </div>
        </div>
      </div>
      
      <nav className="px-3 flex-1 overflow-y-auto">
        <ul className="space-y-1 pb-6">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}