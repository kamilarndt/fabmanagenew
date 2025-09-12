# Sidebar Navigation - Figma Export

This folder contains SVG exports of the sidebar navigation component, with each element separated for easy use in Figma.

## Files Structure

### Complete Sidebar
- `../sidebar-navigation.svg` - Complete sidebar with all elements (for reference)

### Individual Components
- `sidebar-logo.svg` - Logo section (280x80px)
- `sidebar-collapse-button.svg` - Collapse/expand button (280x64px)
- `sidebar-dashboard-active.svg` - Dashboard menu item in active state (280x48px)
- `sidebar-projekty.svg` - Projekty menu item (280x48px)
- `sidebar-klienci.svg` - Klienci menu item (280x48px)
- `sidebar-kalendarz.svg` - Kalendarz menu item (280x48px)
- `sidebar-dzial-projektowy.svg` - Dział Projektowy menu item (280x48px)
- `sidebar-cnc.svg` - CNC menu item (280x48px)
- `sidebar-produkcja.svg` - Produkcja menu item (280x48px)
- `sidebar-magazyn.svg` - Magazyn menu item (280x48px)
- `sidebar-podwykonawcy.svg` - Podwykonawcy menu item (280x48px)
- `sidebar-zapotrzebowania.svg` - Zapotrzebowania menu item (280x48px)
- `sidebar-user-section.svg` - User profile section (280x120px)

## How to Use in Figma

1. **Import SVGs**: Drag and drop each SVG file into your Figma canvas
2. **Convert to Components**: Right-click each imported SVG and select "Create Component"
3. **Organize in Frames**: Place each component in a frame for easy management
4. **Create Variants**: Use the individual menu items to create different states (active, hover, normal)

## Design Tokens Used

- **Background**: `#25282E` (--bg-secondary)
- **Text Primary**: `rgba(235, 241, 245, 0.96)` (--text-primary)
- **Text Secondary**: `rgba(235, 241, 245, 0.6)` (--text-secondary)
- **Text Muted**: `rgba(235, 241, 245, 0.4)` (--text-muted)
- **Primary Color**: `#16A34A` (--primary-main)
- **Border**: `rgba(235, 241, 245, 0.18)` (--border-main)

## Component States

### Menu Items
- **Normal**: Transparent background, white text
- **Active**: Green background (#16A34A), green text, left border
- **Hover**: Light background overlay (can be added in Figma)

### Typography
- **Font Family**: Inter
- **Logo**: 20px/600 (main), 16px/500 (subtitle)
- **Menu Items**: 14px/400 (normal), 14px/500 (active)
- **User Info**: 14px/500 (name), 12px/400 (role)

## Layout Specifications

- **Sidebar Width**: 280px (expanded), 80px (collapsed)
- **Menu Item Height**: 48px
- **Logo Section Height**: 80px
- **Collapse Button Height**: 64px
- **User Section Height**: 120px
- **Padding**: 16px horizontal, 12px vertical for buttons
- **Icon Spacing**: 8px from left edge, 8px from text

## Icons Used

The SVGs use emoji icons for simplicity. In production, these should be replaced with proper icon components:
- 🏭 Factory (logo)
- ☰ Hamburger menu (collapse)
- 🏠 Home (dashboard)
- 📁 Folder (projects)
- 👥 People (clients)
- 📅 Calendar
- 🎨 Palette (design department)
- 🔧 Wrench (CNC)
- 🏭 Factory (production)
- 📦 Box (warehouse)
- 🚚 Truck (subcontractors)
- 🛒 Shopping cart (demands)
- 👤 User (profile)
