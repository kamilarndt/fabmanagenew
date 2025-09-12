# ERD Entity Exports - Figma Ready

This folder contains individual SVG exports of each entity from the FabManage database schema, designed for easy use in Figma.

## 📁 Available Entities

### Core Business Entities
- **`PROJECT.svg`** - Main project entity with all project details
- **`CLIENT.svg`** - Client information and contact details
- **`TILE.svg`** - Individual project components/tiles
- **`USER.svg`** - System users and their roles

### Material & Inventory Management
- **`MATERIAL.svg`** - Raw materials and inventory items
- **`BOM_ITEM.svg`** - Bill of Materials items for tiles

### External Services
- **`SUBCONTRACTOR.svg`** - External service providers
- **`SUBCONTRACTOR_ORDER.svg`** - Orders placed with subcontractors

### System & Support
- **`ACTIVITY_LOG.svg`** - System activity tracking
- **`FILE_ASSET.svg`** - File management system
- **`QUESTION.svg`** - Q&A system for tiles
- **`CALENDAR_EVENT.svg`** - Calendar and scheduling

## 🎨 Design System

### Color Coding
- **🔴 Red (PK)**: Primary Key fields
- **🔵 Blue (FK)**: Foreign Key fields  
- **🟠 Orange (ENUM)**: Enumeration fields
- **🟢 Green**: Data type indicators
- **⚫ Gray**: Field names and descriptions

### Typography
- **Entity Title**: Inter, 16px, Bold
- **Field Names**: Inter, 12px, Medium
- **Data Types**: Inter, 11px, Regular
- **Descriptions**: Inter, 10px, Italic

### Layout
- **Entity Box**: 400x500px with rounded corners
- **Field Spacing**: 20px vertical between fields
- **Margins**: 20px from edges
- **Background**: Light gray (#f8f9fa) with subtle border

## 🔧 How to Use in Figma

### 1. Import SVGs
- Drag and drop each SVG file into your Figma canvas
- Each entity is a complete, self-contained component

### 2. Create Components
- Right-click each imported SVG → "Create Component"
- Name components clearly (e.g., "Entity - PROJECT")

### 3. Organize in Frames
- Group related entities in frames
- Use consistent naming conventions
- Consider creating a master ERD diagram

### 4. Customize as Needed
- Modify colors to match your design system
- Adjust typography if needed
- Add relationship lines between entities

## 📊 Entity Relationships

### Primary Relationships
- **PROJECT** ←→ **CLIENT** (one-to-many)
- **PROJECT** ←→ **TILE** (one-to-many)
- **TILE** ←→ **BOM_ITEM** (one-to-many)
- **TILE** ←→ **MATERIAL** (many-to-many via BOM_ITEM)
- **SUBCONTRACTOR** ←→ **SUBCONTRACTOR_ORDER** (one-to-many)

### Supporting Relationships
- **USER** ←→ **ACTIVITY_LOG** (one-to-many)
- **TILE** ←→ **QUESTION** (one-to-many)
- **TILE** ←→ **FILE_ASSET** (one-to-many)
- **PROJECT** ←→ **CALENDAR_EVENT** (one-to-many)

## 🎯 Use Cases

### Database Design
- Use as reference for database schema design
- Validate entity relationships
- Document data model changes

### UI/UX Design
- Design data entry forms
- Create entity detail views
- Plan data visualization components

### Documentation
- Technical documentation
- API documentation
- Developer onboarding materials

### Presentations
- System architecture presentations
- Database design reviews
- Stakeholder communications

## 🔄 Updates

When the database schema changes:
1. Update the source Mermaid file (`data-model-erd.mmd`)
2. Regenerate the individual SVG files
3. Update this README if new entities are added
4. Notify team members of changes

## 📝 Notes

- All SVGs are optimized for Figma import
- Entity boxes are sized to accommodate typical field counts
- Color coding is consistent across all entities
- Typography matches the main design system
- Files are named using UPPERCASE convention for clarity
