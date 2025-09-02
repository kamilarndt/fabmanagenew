# FabManage Component Reference

## Table of Contents

1. [UI Kit Components](#ui-kit-components)
2. [Shadcn/UI Components](#shadcnui-components)
3. [Custom Application Components](#custom-application-components)
4. [Layout Components](#layout-components)

## UI Kit Components

### ConstructorCard
Flexible card component with multiple variants.

```tsx
<ConstructorCard variant="elevated" size="lg" hover={true}>
  <h3>Card Title</h3>
  <p>Card content</p>
</ConstructorCard>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `hover`: boolean
- `selected`: boolean
- `onClick`: () => void

### ProjectTileCard
Specialized card for project tiles with priority and status indicators.

```tsx
<ProjectTileCard 
  priority="Wysoki" 
  status="W KOLEJCE"
  onClick={handleClick}
>
  <h4>Tile Name</h4>
  <p>Tile description</p>
</ProjectTileCard>
```

### DashboardCard
Card component for dashboard displays with title, subtitle, and icon.

```tsx
<DashboardCard 
  title="Active Projects" 
  subtitle="Currently in production"
  icon={<FolderIcon />}
>
  <div className="text-3xl font-bold">12</div>
</DashboardCard>
```

### ConstructorBadge
Flexible badge component with multiple variants.

```tsx
<ConstructorBadge variant="success" size="md" icon={<CheckIcon />}>
  Completed
</ConstructorBadge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React.ReactNode

### StatusBadge
Specialized badge for tile and project statuses.

```tsx
<StatusBadge status="W KOLEJCE" size="md" />
```

**Supported Statuses:**
- 'W KOLEJCE' (blue)
- 'W TRAKCIE CIĘCIA' (orange)
- 'WYCIĘTE' (green)
- 'Zakończony' (green)

### PriorityBadge
Specialized badge for priority levels.

```tsx
<PriorityBadge priority="Wysoki" size="md" />
```

**Supported Priorities:**
- 'Wysoki' (red)
- 'Średni' (yellow)
- 'Niski' (green)

### ConstructorButton
Flexible button component with multiple variants.

```tsx
<ConstructorButton 
  variant="primary" 
  size="md" 
  icon={<PlusIcon />}
  onClick={handleClick}
>
  Add Item
</ConstructorButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

### ActionButton
Specialized button for common actions with built-in icons.

```tsx
<ActionButton action="add" onClick={handleAdd}>
  Add Project
</ActionButton>
```

**Supported Actions:**
- 'add' (green, ➕)
- 'edit' (blue, ✏️)
- 'delete' (red, 🗑️)
- 'save' (green, 💾)
- 'cancel' (outline, ❌)

### IconButton
Button component for icon-only interactions.

```tsx
<IconButton 
  icon={<SettingsIcon />} 
  variant="ghost" 
  size="md"
  onClick={handleSettings}
/>
```

### FloatingActionButton
Fixed position floating action button.

```tsx
<FloatingActionButton 
  icon={<PlusIcon />}
  onClick={handleAdd}
  title="Add new item"
/>
```

## Layout Components

### ConstructorContainer
Container with consistent max-widths and padding.

```tsx
<ConstructorContainer size="lg" padding="md">
  <h1>Page Content</h1>
</ConstructorContainer>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### ConstructorSection
Section with title, subtitle, and consistent spacing.

```tsx
<ConstructorSection 
  title="Project Overview" 
  subtitle="Manage your projects"
  spacing="lg"
>
  <ProjectList />
</ConstructorSection>
```

**Props:**
- `title`: string
- `subtitle`: string
- `spacing`: 'none' | 'sm' | 'md' | 'lg'

### ConstructorGrid
Responsive grid layout component.

```tsx
<ConstructorGrid cols={4} gap="md">
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</ConstructorGrid>
```

**Props:**
- `cols`: 1 | 2 | 3 | 4 | 5 | 6
- `gap`: 'sm' | 'md' | 'lg' | 'xl'

### ConstructorFlex
Flexbox layout with consistent spacing.

```tsx
<ConstructorFlex 
  direction="row" 
  justify="between" 
  align="center"
  gap="md"
>
  <div>Left content</div>
  <div>Right content</div>
</ConstructorFlex>
```

**Props:**
- `direction`: 'row' | 'col' | 'row-reverse' | 'col-reverse'
- `justify`: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
- `align`: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
- `wrap`: 'wrap' | 'wrap-reverse' | 'nowrap'
- `gap`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

### ConstructorStack
Vertical stack layout for consistent spacing.

```tsx
<ConstructorStack spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ConstructorStack>
```

**Props:**
- `spacing`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

### ConstructorDivider
Divider with consistent styling.

```tsx
<ConstructorDivider orientation="horizontal" size="md" />
```

**Props:**
- `orientation`: 'horizontal' | 'vertical'
- `size`: 'sm' | 'md' | 'lg'

## Shadcn/UI Components

### Button
Standard button component with variants.

```tsx
import { Button } from "./ui/button";

<Button variant="default" size="default">
  Click me
</Button>
```

**Variants:** default, destructive, outline, secondary, ghost, link
**Sizes:** default, sm, lg, icon

### Dialog
Modal dialog component.

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./ui/dialog";

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Card
Card component for content containers.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Input
Form input component.

```tsx
import { Input } from "./ui/input";

<Input placeholder="Enter text..." />
```

### Select
Dropdown select component.

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Textarea
Multi-line text input component.

```tsx
import { Textarea } from "./ui/textarea";

<Textarea placeholder="Enter description..." />
```

### Checkbox
Checkbox input component.

```tsx
import { Checkbox } from "./ui/checkbox";

<Checkbox checked={checked} onCheckedChange={setChecked} />
```

### Badge
Badge component for status indicators.

```tsx
import { Badge } from "./ui/badge";

<Badge variant="secondary">Badge</Badge>
```

### Progress
Progress bar component.

```tsx
import { Progress } from "./ui/progress";

<Progress value={33} />
```

### Tabs
Tab navigation component.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

### Table
Table component for data display.

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Project 1</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Form
Form component with validation.

```tsx
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "./ui/form";

<Form>
  <FormField
    name="username"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### DropdownMenu
Dropdown menu component.

```tsx
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Popover
Popover component for contextual information.

```tsx
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "./ui/popover";

<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>
```

### Tooltip
Tooltip component for hover information.

```tsx
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Alert
Alert component for notifications.

```tsx
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

<Alert>
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert description</AlertDescription>
</Alert>
```

### AlertDialog
Confirmation dialog component.

```tsx
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "./ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger>Delete Item</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Sheet
Side panel component.

```tsx
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "./ui/sheet";

<Sheet>
  <SheetTrigger>Open Sheet</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
    <p>Sheet content</p>
  </SheetContent>
</Sheet>
```

### Sidebar
Sidebar navigation component.

```tsx
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider 
} from "./ui/sidebar";

<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Header</SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Menu Item</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

### Calendar
Date picker component.

```tsx
import { Calendar } from "./ui/calendar";

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

### Carousel
Image carousel component.

```tsx
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "./ui/carousel";

<Carousel>
  <CarouselContent>
    <CarouselItem>Item 1</CarouselItem>
    <CarouselItem>Item 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Chart
Chart component for data visualization.

```tsx
import { Chart } from "./ui/chart";

<Chart data={chartData} />
```

### Command
Command palette component.

```tsx
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "./ui/command";

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Item 1</CommandItem>
      <CommandItem>Item 2</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### ContextMenu
Right-click context menu component.

```tsx
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from "./ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Action 1</ContextMenuItem>
    <ContextMenuItem>Action 2</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Drawer
Bottom drawer component.

```tsx
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "./ui/drawer";

<Drawer>
  <DrawerTrigger>Open Drawer</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer description</DrawerDescription>
    </DrawerHeader>
    <p>Drawer content</p>
    <DrawerFooter>
      <DrawerClose>Close</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### HoverCard
Hover card component.

```tsx
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "./ui/hover-card";

<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>
    <p>Hover card content</p>
  </HoverCardContent>
</HoverCard>
```

### Menubar
Menu bar component.

```tsx
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "./ui/menubar";

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
      <MenubarItem>Open</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### NavigationMenu
Navigation menu component.

```tsx
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "./ui/navigation-menu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Pagination
Pagination component.

```tsx
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "./ui/pagination";

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### RadioGroup
Radio button group component.

```tsx
import { 
  RadioGroup, 
  RadioGroupItem 
} from "./ui/radio-group";

<RadioGroup defaultValue="option-1">
  <RadioGroupItem value="option-1" />
  <RadioGroupItem value="option-2" />
</RadioGroup>
```

### Resizable
Resizable panel component.

```tsx
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "./ui/resizable";

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>Panel 1</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Panel 2</ResizablePanel>
</ResizablePanelGroup>
```

### ScrollArea
Scrollable area component.

```tsx
import { ScrollArea } from "./ui/scroll-area";

<ScrollArea className="h-72 w-48">
  <p>Scrollable content</p>
</ScrollArea>
```

### Separator
Visual separator component.

```tsx
import { Separator } from "./ui/separator";

<Separator />
```

### Skeleton
Loading skeleton component.

```tsx
import { Skeleton } from "./ui/skeleton";

<Skeleton className="h-4 w-32" />
```

### Slider
Range slider component.

```tsx
import { Slider } from "./ui/slider";

<Slider defaultValue={[33]} max={100} step={1} />
```

### Switch
Toggle switch component.

```tsx
import { Switch } from "./ui/switch";

<Switch checked={checked} onCheckedChange={setChecked} />
```

### Toggle
Toggle button component.

```tsx
import { Toggle } from "./ui/toggle";

<Toggle pressed={pressed} onPressedChange={setPressed}>
  Toggle
</Toggle>
```

### ToggleGroup
Toggle button group component.

```tsx
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "./ui/toggle-group";

<ToggleGroup type="single">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ToggleGroup>
```

### Avatar
Avatar component for user profiles.

```tsx
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "./ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.png" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### AspectRatio
Aspect ratio container component.

```tsx
import { AspectRatio } from "./ui/aspect-ratio";

<AspectRatio ratio={16 / 9}>
  <img src="/image.jpg" alt="Image" />
</AspectRatio>
```

### Accordion
Collapsible content component.

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "./ui/accordion";

<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>Item 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Collapsible
Collapsible content component.

```tsx
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "./ui/collapsible";

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### InputOTP
One-time password input component.

```tsx
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "./ui/input-otp";

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
</InputOTP>
```

### Label
Form label component.

```tsx
import { Label } from "./ui/label";

<Label htmlFor="email">Email</Label>
```

### Breadcrumb
Breadcrumb navigation component.

```tsx
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "./ui/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink>Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Sonner
Toast notification component.

```tsx
import { Toaster } from "./ui/sonner";

<Toaster />
```

### useMobile
Hook for mobile detection.

```tsx
import { useMobile } from "./ui/use-mobile";

const isMobile = useMobile();
```

### Utils
Utility functions for class name merging.

```tsx
import { cn } from "./ui/utils";

const className = cn("base-class", conditional && "conditional-class");
```

---

## Custom Application Components

### CreateProjectModal
Modal for creating new projects.

```tsx
<CreateProjectModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  onProjectCreate={handleCreate}
/>
```

### EditProjectModal
Modal for editing existing projects.

```tsx
<EditProjectModal
  open={editModalOpen}
  onOpenChange={setEditModalOpen}
  project={selectedProject}
  onProjectUpdate={handleUpdate}
/>
```

### MaterialsModal
Modal for managing materials.

```tsx
<MaterialsModal
  open={materialsModalOpen}
  onOpenChange={setMaterialsModalOpen}
  onMaterialsUpdate={handleMaterialsUpdate}
/>
```

### MaterialsSelectionModal
Modal for selecting materials.

```tsx
<MaterialsSelectionModal
  open={selectionModalOpen}
  onOpenChange={setSelectionModalOpen}
  onSelection={handleSelection}
/>
```

### TileEditModal
Modal for editing tiles.

```tsx
<TileEditModal
  open={tileEditModalOpen}
  onOpenChange={setTileEditModalOpen}
  tile={selectedTile}
  onTileUpdate={handleTileUpdate}
/>
```

### HeaderBar
Application header component.

```tsx
<HeaderBar 
  activeSection={activeSection} 
  onSectionChange={handleSectionChange} 
/>
```

### MainSidebar
Main navigation sidebar.

```tsx
<MainSidebar 
  activeSection={activeSection} 
  onSectionChange={handleSectionChange} 
/>
```

### MobileSidebar
Mobile navigation sidebar.

```tsx
<MobileSidebar 
  activeSection={activeSection} 
  onSectionChange={handleSectionChange} 
/>
```

### TileStatusSync
Context provider for tile status management.

```tsx
<TileStatusProvider>
  <App />
</TileStatusProvider>
```

---

This component reference covers all UI components available in the FabManage system. Each component includes usage examples and available props. For detailed API documentation, see the main API documentation file.