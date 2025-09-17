export interface Concept {
  id: string;
  title: string;
  description: string;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  attachments: string[];
  estimated_cost: number;
  estimated_duration: number; // in days
  actual_cost?: number;
  actual_duration?: number;
  notes?: string;
}

export interface ConceptApproval {
  id: string;
  concept_id: string;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approved_at?: string;
  created_at: string;
}

export interface ConceptComment {
  id: string;
  concept_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ConceptWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  approver_role: string;
  is_required: boolean;
  timeout_days?: number;
}
