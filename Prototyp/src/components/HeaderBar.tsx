import { Search, Bell, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { MobileSidebar } from "./MobileSidebar";
import { useState } from "react";

interface HeaderBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function HeaderBar({ activeSection, onSectionChange }: HeaderBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="h-16 border-b border-border bg-background px-3 sm:px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <MobileSidebar 
              activeSection={activeSection} 
              onSectionChange={handleMobileSectionChange}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 max-w-sm sm:max-w-md min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder="Szukaj projektu, klienta..."
              className="pl-10 bg-input-background border-0 text-sm w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              KA
            </AvatarFallback>
          </Avatar>
          <div className="text-sm hidden sm:block min-w-0">
            <p className="font-medium truncate">Kamil Arndt</p>
          </div>
        </div>
      </div>
    </header>
  );
}