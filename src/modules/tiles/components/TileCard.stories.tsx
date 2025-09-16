import type { Meta, StoryObj } from "@storybook/react";
import type { Tile } from "../../../types/tiles.types";
import TileCard from "./TileCard";

const sampleTile: Tile = {
  id: "tile-001",
  name: "Panel Główny Recepcji",
  status: "W trakcie projektowania",
  priority: "high",
  termin: "2024-03-15",
  moduł_nadrzędny: "concept",
  przypisany_projektant: "Jan Nowak",
  link_model_3d: "https://speckle.xyz/model/abc123",
  bom: [
    {
      name: "Płyta MDF 18mm",
      quantity: 2,
      unit: "szt",
      material_id: "mat-001",
    },
    {
      name: "Folia HPL biała",
      quantity: 4.5,
      unit: "m²",
      material_id: "mat-002",
    },
    {
      name: "Krawędziarka ABS",
      quantity: 12,
      unit: "mb",
      material_id: "mat-003",
    },
  ],
  project_id: "proj-001",
  created_at: "2024-02-01",
  updated_at: "2024-02-15",
};

const meta: Meta<typeof TileCard> = {
  title: "Tiles/TileCard",
  component: TileCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "TileCard component displays individual project tile/element information with status, materials, and actions.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onEdit: { action: "edit clicked" },
    onView: { action: "view clicked" },
    onAssign: { action: "assign clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tile: sampleTile,
  },
};

export const WithoutModel3D: Story = {
  args: {
    tile: {
      ...sampleTile,
      link_model_3d: undefined,
    },
  },
};

export const CompletedTile: Story = {
  args: {
    tile: {
      ...sampleTile,
      status: "Zakończony",
      name: "Panel Boczny Ekspozycji",
    },
  },
};

export const QueuedTile: Story = {
  args: {
    tile: {
      ...sampleTile,
      status: "W KOLEJCE",
      priority: "low",
      przypisany_projektant: undefined,
      name: "Element Dekoracyjny",
    },
  },
};

export const CNCProduction: Story = {
  args: {
    tile: {
      ...sampleTile,
      status: "W produkcji CNC",
      name: "Konstrukcja Nośna Standu",
      bom: [
        {
          name: "Płyta OSB 22mm",
          quantity: 3,
          unit: "szt",
          material_id: "mat-004",
        },
        {
          name: "Wkręty 4x50",
          quantity: 48,
          unit: "szt",
          material_id: "mat-005",
        },
        {
          name: "Klej do drewna",
          quantity: 1,
          unit: "opak",
          material_id: "mat-006",
        },
        { name: "Impregnacja", quantity: 2, unit: "l", material_id: "mat-007" },
        {
          name: "Farba akrylowa",
          quantity: 1.5,
          unit: "l",
          material_id: "mat-008",
        },
      ],
    },
  },
};

export const PendingApproval: Story = {
  args: {
    tile: {
      ...sampleTile,
      status: "Do akceptacji",
      name: "Panel Informacyjny LED",
      priority: "high",
    },
  },
};

export const NoMaterials: Story = {
  args: {
    tile: {
      ...sampleTile,
      bom: [],
      name: "Projekt Koncepcyjny",
      status: "Projektowanie",
    },
  },
};

export const LongNameTile: Story = {
  args: {
    tile: {
      ...sampleTile,
      name: "Panel Główny Recepcji z Systemem Informacyjnym i Interaktywną Mapą Obiektu",
      status: "Wymagają poprawek",
    },
  },
};
