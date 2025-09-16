import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { Input } from "@/new-ui/atoms/Input/Input";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  keywords?: string[];
  action: () => void;
  category?: string;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandItem[];
  className?: string;
  placeholder?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  className,
  placeholder = "Type a command or search...",
}: CommandPaletteProps): React.ReactElement {
  const [search, setSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredCommands = React.useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((command) => {
      const matchesLabel = command.label.toLowerCase().includes(searchLower);
      const matchesDescription = command.description
        ?.toLowerCase()
        .includes(searchLower);
      const matchesKeywords = command.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );

      return matchesLabel || matchesDescription || matchesKeywords;
    });
  }, [commands, search]);

  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};

    filteredCommands.forEach((command) => {
      const category = command.category || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(command);
    });

    return groups;
  }, [filteredCommands]);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "Escape":
          onOpenChange(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredCommands.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onOpenChange(false);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredCommands, selectedIndex, onOpenChange]);

  if (!open) return null as unknown as React.ReactElement;

  return (
    <div
      className="tw-fixed tw-inset-0 tw-z-50 tw-bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "tw-absolute tw-left-1/2 tw-top-1/4 tw-w-full tw-max-w-lg tw--translate-x-1/2 tw-rounded-lg tw-border tw-bg-popover tw-p-0 tw-shadow-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="tw-flex tw-items-center tw-border-b tw-px-3">
          <Icon
            name="search"
            className="tw-mr-2 tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50"
          />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="tw-flex tw-h-11 tw-w-full tw-rounded-md tw-bg-transparent tw-py-3 tw-text-sm tw-outline-none placeholder:tw-text-muted-foreground disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
          />
        </div>

        {/* Commands List */}
        <div className="tw-max-h-64 tw-overflow-auto tw-p-1">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="tw-py-6 tw-text-center tw-text-sm tw-text-muted-foreground">
              No commands found.
            </div>
          ) : (
            Object.entries(groupedCommands).map(
              ([category, categoryCommands]) => (
                <div key={category} className="tw-space-y-1">
                  <div className="tw-px-2 tw-py-1.5 tw-text-xs tw-font-medium tw-text-muted-foreground">
                    {category}
                  </div>
                  {categoryCommands.map((command) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={command.id}
                        onClick={() => {
                          command.action();
                          onOpenChange(false);
                        }}
                        className={cn(
                          "tw-flex tw-w-full tw-items-center tw-gap-2 tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-left tw-text-sm tw-outline-none hover:tw-bg-accent hover:tw-text-accent-foreground",
                          isSelected && "tw-bg-accent tw-text-accent-foreground"
                        )}
                      >
                        {command.icon && (
                          <Icon name={command.icon} className="tw-h-4 tw-w-4" />
                        )}
                        <div className="tw-flex-1">
                          <div className="tw-font-medium">{command.label}</div>
                          {command.description && (
                            <div className="tw-text-xs tw-text-muted-foreground">
                              {command.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
