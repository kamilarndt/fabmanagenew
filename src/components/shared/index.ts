// Shared Components (Molecules)
// Bardziej złożone, ale wciąż generyczne komponenty

export { BackPageHeader, PageHeader, SimplePageHeader } from "./PageHeader";

export { EntityTable, SimpleTable } from "./EntityTable";

export { ConfirmSlideOver, FormSlideOver, SlideOver } from "./SlideOver";

export { KanbanBoardGeneric, SimpleKanban } from "./KanbanBoardGeneric";

// Base Components for Module Refactoring
export { BaseCard } from "./BaseCard";
export type { BaseEntity } from "./BaseCard";
export { BaseGrid } from "./BaseGrid";
export { BaseStats } from "./BaseStats";
export { BaseView } from "./BaseView";
export { 
  BaseForm, 
  ProjectForm, 
  TileForm, 
  MaterialForm, 
  GenericForm 
} from "./BaseForm";
export type { 
  BaseFormProps, 
  ProjectFormProps, 
  TileFormProps, 
  MaterialFormProps, 
  GenericFormProps 
} from "./BaseForm";
export { 
  CNCTaskForm, 
  ClientForm, 
  SearchForm 
} from "./FormExamples";
