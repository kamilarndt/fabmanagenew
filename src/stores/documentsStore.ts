import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchWithMockFallback, mockData } from '../lib/api';
import type { Document, DocumentCategory, DocumentTemplate, DocumentVersion, DocumentComment, DocumentSearch } from '../types/documents.types';

interface DocumentsState {
  documents: Document[];
  categories: DocumentCategory[];
  templates: DocumentTemplate[];
  versions: DocumentVersion[];
  comments: DocumentComment[];
  
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDocuments: () => Promise<void>;
  addDocument: (document: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'version' | 'view_count' | 'download_count'>) => Promise<void>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<DocumentCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  fetchTemplates: () => Promise<void>;
  addTemplate: (template: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTemplate: (id: string, template: Partial<DocumentTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  fetchVersions: (documentId: string) => Promise<void>;
  createVersion: (documentId: string, changes: string) => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  
  fetchComments: (documentId: string) => Promise<void>;
  addComment: (comment: Omit<DocumentComment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateComment: (id: string, comment: Partial<DocumentComment>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  
  searchDocuments: (search: DocumentSearch) => Promise<Document[]>;
  publishDocument: (id: string) => Promise<void>;
  archiveDocument: (id: string) => Promise<void>;
  duplicateDocument: (id: string) => Promise<void>;
  
  getDocumentStats: () => { total: number; published: number; draft: number; archived: number };
}

export const useDocumentsStore = create<DocumentsState>()(
  immer((set, get) => ({
    documents: [],
    categories: [],
    templates: [],
    versions: [],
    comments: [],
    
    isLoading: false,
    error: null,
    
    fetchDocuments: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        const documents = await fetchWithMockFallback(
          '/api/documents',
          mockData.documents.documents
        );
        
        set((state) => {
          state.documents = documents;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },
    
    addDocument: async (documentData) => {
      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(documentData),
        });
        const document = await response.json();
        
        set((state) => {
          state.documents.push(document);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateDocument: async (id, documentData) => {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(documentData),
        });
        const document = await response.json();
        
        set((state) => {
          const index = state.documents.findIndex(d => d.id === id);
          if (index !== -1) {
            state.documents[index] = { ...state.documents[index], ...document };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteDocument: async (id) => {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete document');
        
        set((state) => {
          state.documents = state.documents.filter(d => d.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchCategories: async () => {
      try {
        const response = await fetch('/api/documents/categories');
        const categories = await response.json();
        
        set((state) => {
          state.categories = categories;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    addCategory: async (categoryData) => {
      try {
        const response = await fetch('/api/documents/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
        const category = await response.json();
        
        set((state) => {
          state.categories.push(category);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateCategory: async (id, categoryData) => {
      try {
        const response = await fetch(`/api/documents/categories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
        const category = await response.json();
        
        set((state) => {
          const index = state.categories.findIndex(c => c.id === id);
          if (index !== -1) {
            state.categories[index] = { ...state.categories[index], ...category };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteCategory: async (id) => {
      try {
        const response = await fetch(`/api/documents/categories/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete category');
        
        set((state) => {
          state.categories = state.categories.filter(c => c.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchTemplates: async () => {
      try {
        const response = await fetch('/api/documents/templates');
        const templates = await response.json();
        
        set((state) => {
          state.templates = templates;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    addTemplate: async (templateData) => {
      try {
        const response = await fetch('/api/documents/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData),
        });
        const template = await response.json();
        
        set((state) => {
          state.templates.push(template);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateTemplate: async (id, templateData) => {
      try {
        const response = await fetch(`/api/documents/templates/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData),
        });
        const template = await response.json();
        
        set((state) => {
          const index = state.templates.findIndex(t => t.id === id);
          if (index !== -1) {
            state.templates[index] = { ...state.templates[index], ...template };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteTemplate: async (id) => {
      try {
        const response = await fetch(`/api/documents/templates/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete template');
        
        set((state) => {
          state.templates = state.templates.filter(t => t.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchVersions: async (documentId) => {
      try {
        const response = await fetch(`/api/documents/${documentId}/versions`);
        const versions = await response.json();
        
        set((state) => {
          state.versions = versions;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    createVersion: async (documentId, changes) => {
      try {
        const response = await fetch(`/api/documents/${documentId}/versions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes }),
        });
        const version = await response.json();
        
        set((state) => {
          state.versions.push(version);
        });
      } catch (error) {
        throw error;
      }
    },
    
    restoreVersion: async (versionId) => {
      try {
        const response = await fetch(`/api/documents/versions/${versionId}/restore`, {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to restore version');
        
        // Refresh documents after restore
        const { fetchDocuments } = get();
        await fetchDocuments();
      } catch (error) {
        throw error;
      }
    },
    
    fetchComments: async (documentId) => {
      try {
        const response = await fetch(`/api/documents/${documentId}/comments`);
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
        const response = await fetch('/api/documents/comments', {
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
        const response = await fetch(`/api/documents/comments/${id}`, {
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
        const response = await fetch(`/api/documents/comments/${id}`, {
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
    
    searchDocuments: async (search) => {
      try {
        const response = await fetch('/api/documents/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(search),
        });
        const documents = await response.json();
        
        return documents;
      } catch (error) {
        throw error;
      }
    },
    
    publishDocument: async (id) => {
      try {
        const response = await fetch(`/api/documents/${id}/publish`, {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to publish document');
        
        set((state) => {
          const document = state.documents.find(d => d.id === id);
          if (document) {
            document.status = 'published';
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    archiveDocument: async (id) => {
      try {
        const response = await fetch(`/api/documents/${id}/archive`, {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to archive document');
        
        set((state) => {
          const document = state.documents.find(d => d.id === id);
          if (document) {
            document.status = 'archived';
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    duplicateDocument: async (id) => {
      try {
        const response = await fetch(`/api/documents/${id}/duplicate`, {
          method: 'POST',
        });
        const document = await response.json();
        
        set((state) => {
          state.documents.push(document);
        });
      } catch (error) {
        throw error;
      }
    },
    
    getDocumentStats: () => {
      const { documents } = get();
      return {
        total: documents.length,
        published: documents.filter(d => d.status === 'published').length,
        draft: documents.filter(d => d.status === 'draft').length,
        archived: documents.filter(d => d.status === 'archived').length,
      };
    },
  }))
);
