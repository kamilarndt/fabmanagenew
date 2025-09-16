import type { Meta, StoryObj } from "@storybook/react";
import ProjectCard from "./ProjectCard";
import type { ProjectWithStats } from "../../types/projects.types";

const sampleProject: ProjectWithStats = {
  id: "proj-001",
  name: "Wystawa Interaktywna EXPO 2024",
  numer: "EXP-2024-001",
  status: "active",
  typ: "Wystawa",
  lokalizacja: "Kraków, Centrum Kongresowe",
  client: "Expo Solutions Sp. z o.o.",
  deadline: "2024-12-15",
  postep: 65,
  progress: 65,
  miniatura: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
  modules: ["concept", "technical_design", "production", "materials"],
  tilesCount: 24,
  manager: "Anna Kowalska",
  created_at: "2024-01-10",
  updated_at: "2024-02-15",
};

const meta: Meta<typeof ProjectCard> = {
  title: "Project/ProjectCard",
  component: ProjectCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: 'ProjectCard component displays project information in a card format with thumbnail, progress, status, and actions.'
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    onEdit: { action: "edit clicked" },
    onDelete: { action: "delete clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project: sampleProject,
  },
};

export const WithoutThumbnail: Story = {
  args: {
    project: {
      ...sampleProject,
      miniatura: undefined,
    },
  },
};

export const CompletedProject: Story = {
  args: {
    project: {
      ...sampleProject,
      status: "completed",
      postep: 100,
      progress: 100,
      name: "Scenografia TV - Program Kulinarny",
      typ: "Scenografia TV",
    },
  },
};

export const EventType: Story = {
  args: {
    project: {
      ...sampleProject,
      typ: "Event",
      name: "Targi Meblarskie 2024",
      lokalizacja: "Warszawa, Ptak Warsaw Expo",
      client: "Furniture Fair International",
      postep: 25,
      progress: 25,
    },
  },
};

export const MinimalProject: Story = {
  args: {
    project: {
      ...sampleProject,
      modules: [],
      tilesCount: 0,
      manager: undefined,
      miniatura: undefined,
      postep: 5,
      progress: 5,
    },
  },
};

export const LargeProject: Story = {
  args: {
    project: {
      ...sampleProject,
      name: "Kompleksowa Wystawa Muzeum Historii Naturalnej - Sekcja Dinozaurów z Interaktywnymi Ekspozycjami",
      modules: ["pricing", "concept", "technical_design", "production", "materials", "logistics"],
      tilesCount: 156,
      typ: "Muzeum",
      postep: 45,
      progress: 45,
    },
  },
};

export const OverdueProject: Story = {
  args: {
    project: {
      ...sampleProject,
      deadline: "2024-01-15", // Past deadline
      status: "delayed",
      postep: 30,
      progress: 30,
    },
  },
};
