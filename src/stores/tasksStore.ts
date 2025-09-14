import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface TaskItem {
  id: string;
  title: string;
  project?: string;
  deadline?: string;
  overdue?: boolean;
  completed: boolean;
}

interface TasksState {
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, "id"> & { id?: string }) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  toggleTask: (id: string) => void;
  setTasks: (tasks: TaskItem[]) => void;
}

export const useTasksStore = create<TasksState>()(
  devtools((set) => ({
    tasks: [
      {
        id: "1",
        title: "Przygotuj pliki DXF dla recepcji",
        project: "Smart Kids Planet",
        deadline: "2025-01-02",
        overdue: true,
        completed: false,
      },
      {
        id: "2",
        title: "Weryfikacja rysunków technicznych",
        project: "Stoisko GR8 TECH - Londyn 2025",
        deadline: "2025-01-05",
        overdue: false,
        completed: false,
      },
      {
        id: "3",
        title: "Kontrola jakości elementów CNC",
        project: "Studio TV - Les 12 Coups de Midi",
        deadline: "2025-01-03",
        overdue: true,
        completed: false,
      },
      {
        id: "4",
        title: "Przygotowanie oferty cenowej",
        project: "Projekt Alpha",
        deadline: "2025-01-08",
        overdue: false,
        completed: true,
      },
    ],

    addTask: (task) =>
      set((state) => ({
        tasks: [
          ...state.tasks,
          { id: task.id ?? crypto.randomUUID(), ...task },
        ],
      })),

    updateTask: (id, updates) =>
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),

    toggleTask: (id) =>
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      })),

    setTasks: (tasks) => set({ tasks }),
  }))
);
