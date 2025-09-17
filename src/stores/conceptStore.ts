import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Concept, ConceptApproval, ConceptComment, ConceptWorkflow, WorkflowStep } from '../types/concept.types';

interface ConceptState {
  concepts: Concept[];
  approvals: ConceptApproval[];
  comments: ConceptComment[];
  workflows: ConceptWorkflow[];
  
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConcepts: () => Promise<void>;
  addConcept: (concept: Omit<Concept, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateConcept: (id: string, concept: Partial<Concept>) => Promise<void>;
  deleteConcept: (id: string) => Promise<void>;
  
  submitConcept: (id: string) => Promise<void>;
  approveConcept: (id: string, approverId: string, comments?: string) => Promise<void>;
  rejectConcept: (id: string, approverId: string, comments: string) => Promise<void>;
  
  fetchApprovals: (conceptId: string) => Promise<void>;
  addApproval: (approval: Omit<ConceptApproval, 'id' | 'created_at'>) => Promise<void>;
  updateApproval: (id: string, approval: Partial<ConceptApproval>) => Promise<void>;
  
  fetchComments: (conceptId: string) => Promise<void>;
  addComment: (comment: Omit<ConceptComment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateComment: (id: string, comment: Partial<ConceptComment>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  
  fetchWorkflows: () => Promise<void>;
  addWorkflow: (workflow: Omit<ConceptWorkflow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateWorkflow: (id: string, workflow: Partial<ConceptWorkflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  
  getConceptStatus: (conceptId: string) => string;
  getApprovalProgress: (conceptId: string) => { completed: number; total: number; percentage: number };
}

export const useConceptStore = create<ConceptState>()(
  immer((set, get) => ({
    concepts: [],
    approvals: [],
    comments: [],
    workflows: [],
    
    isLoading: false,
    error: null,
    
    fetchConcepts: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        const response = await fetch('/api/concepts');
        const concepts = await response.json();
        
        set((state) => {
          state.concepts = concepts;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },
    
    addConcept: async (conceptData) => {
      try {
        const response = await fetch('/api/concepts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conceptData),
        });
        const concept = await response.json();
        
        set((state) => {
          state.concepts.push(concept);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateConcept: async (id, conceptData) => {
      try {
        const response = await fetch(`/api/concepts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conceptData),
        });
        const concept = await response.json();
        
        set((state) => {
          const index = state.concepts.findIndex(c => c.id === id);
          if (index !== -1) {
            state.concepts[index] = { ...state.concepts[index], ...concept };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteConcept: async (id) => {
      try {
        const response = await fetch(`/api/concepts/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete concept');
        
        set((state) => {
          state.concepts = state.concepts.filter(c => c.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    submitConcept: async (id) => {
      try {
        const response = await fetch(`/api/concepts/${id}/submit`, {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to submit concept');
        
        set((state) => {
          const concept = state.concepts.find(c => c.id === id);
          if (concept) {
            concept.status = 'submitted';
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    approveConcept: async (id, approverId, comments) => {
      try {
        const response = await fetch(`/api/concepts/${id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approver_id: approverId, comments }),
        });
        
        if (!response.ok) throw new Error('Failed to approve concept');
        
        set((state) => {
          const concept = state.concepts.find(c => c.id === id);
          if (concept) {
            concept.status = 'approved';
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    rejectConcept: async (id, approverId, comments) => {
      try {
        const response = await fetch(`/api/concepts/${id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approver_id: approverId, comments }),
        });
        
        if (!response.ok) throw new Error('Failed to reject concept');
        
        set((state) => {
          const concept = state.concepts.find(c => c.id === id);
          if (concept) {
            concept.status = 'rejected';
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchApprovals: async (conceptId) => {
      try {
        const response = await fetch(`/api/concepts/${conceptId}/approvals`);
        const approvals = await response.json();
        
        set((state) => {
          state.approvals = approvals;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    addApproval: async (approvalData) => {
      try {
        const response = await fetch('/api/concepts/approvals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(approvalData),
        });
        const approval = await response.json();
        
        set((state) => {
          state.approvals.push(approval);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateApproval: async (id, approvalData) => {
      try {
        const response = await fetch(`/api/concepts/approvals/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(approvalData),
        });
        const approval = await response.json();
        
        set((state) => {
          const index = state.approvals.findIndex(a => a.id === id);
          if (index !== -1) {
            state.approvals[index] = { ...state.approvals[index], ...approval };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchComments: async (conceptId) => {
      try {
        const response = await fetch(`/api/concepts/${conceptId}/comments`);
        const comments = await response.json();
        
        set((state) => {
          state.comments = comments;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    addComment: async (commentData) => {
      try {
        const response = await fetch('/api/concepts/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commentData),
        });
        const comment = await response.json();
        
        set((state) => {
          state.comments.push(comment);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateComment: async (id, commentData) => {
      try {
        const response = await fetch(`/api/concepts/comments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commentData),
        });
        const comment = await response.json();
        
        set((state) => {
          const index = state.comments.findIndex(c => c.id === id);
          if (index !== -1) {
            state.comments[index] = { ...state.comments[index], ...comment };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteComment: async (id) => {
      try {
        const response = await fetch(`/api/concepts/comments/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete comment');
        
        set((state) => {
          state.comments = state.comments.filter(c => c.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchWorkflows: async () => {
      try {
        const response = await fetch('/api/concepts/workflows');
        const workflows = await response.json();
        
        set((state) => {
          state.workflows = workflows;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    addWorkflow: async (workflowData) => {
      try {
        const response = await fetch('/api/concepts/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workflowData),
        });
        const workflow = await response.json();
        
        set((state) => {
          state.workflows.push(workflow);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateWorkflow: async (id, workflowData) => {
      try {
        const response = await fetch(`/api/concepts/workflows/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workflowData),
        });
        const workflow = await response.json();
        
        set((state) => {
          const index = state.workflows.findIndex(w => w.id === id);
          if (index !== -1) {
            state.workflows[index] = { ...state.workflows[index], ...workflow };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteWorkflow: async (id) => {
      try {
        const response = await fetch(`/api/concepts/workflows/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete workflow');
        
        set((state) => {
          state.workflows = state.workflows.filter(w => w.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    getConceptStatus: (conceptId) => {
      const concept = get().concepts.find(c => c.id === conceptId);
      return concept?.status || 'unknown';
    },
    
    getApprovalProgress: (conceptId) => {
      const approvals = get().approvals.filter(a => a.concept_id === conceptId);
      const completed = approvals.filter(a => a.status !== 'pending').length;
      const total = approvals.length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;
      
      return { completed, total, percentage };
    },
  }))
);