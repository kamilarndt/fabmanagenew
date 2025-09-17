import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Documents } from '../../pages/Documents';

// Mock the store
vi.mock('../../stores/documentsStore', () => ({
  useDocumentsStore: () => ({
    documents: [],
    categories: [],
    templates: [],
    versions: [],
    comments: [],
    isLoading: false,
    error: null,
    fetchDocuments: vi.fn(),
    fetchCategories: vi.fn(),
    fetchTemplates: vi.fn(),
    addDocument: vi.fn(),
    addCategory: vi.fn(),
    addTemplate: vi.fn(),
    updateDocument: vi.fn(),
    updateCategory: vi.fn(),
    updateTemplate: vi.fn(),
    deleteDocument: vi.fn(),
    deleteCategory: vi.fn(),
    deleteTemplate: vi.fn(),
    fetchVersions: vi.fn(),
    createVersion: vi.fn(),
    deleteVersion: vi.fn(),
    restoreVersion: vi.fn(),
    fetchComments: vi.fn(),
    addComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
    searchDocuments: vi.fn(),
    publishDocument: vi.fn(),
    archiveDocument: vi.fn(),
    duplicateDocument: vi.fn(),
    getDocumentStats: vi.fn(),
  }),
}));

describe('Documents Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders document management', () => {
    render(<Documents />);
    
    expect(screen.getByText('Document Management')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useDocumentsStore).mockReturnValue({
      documents: [],
      categories: [],
      templates: [],
      versions: [],
      comments: [],
      isLoading: true,
      error: null,
      fetchDocuments: vi.fn(),
      fetchCategories: vi.fn(),
      fetchTemplates: vi.fn(),
      addDocument: vi.fn(),
      addCategory: vi.fn(),
      addTemplate: vi.fn(),
      updateDocument: vi.fn(),
      updateCategory: vi.fn(),
      updateTemplate: vi.fn(),
      deleteDocument: vi.fn(),
      deleteCategory: vi.fn(),
      deleteTemplate: vi.fn(),
      fetchVersions: vi.fn(),
      createVersion: vi.fn(),
      deleteVersion: vi.fn(),
      restoreVersion: vi.fn(),
      fetchComments: vi.fn(),
      addComment: vi.fn(),
      updateComment: vi.fn(),
      deleteComment: vi.fn(),
      searchDocuments: vi.fn(),
      publishDocument: vi.fn(),
      archiveDocument: vi.fn(),
      duplicateDocument: vi.fn(),
      getDocumentStats: vi.fn(),
    });

    render(<Documents />);
    
    expect(screen.getByText('Loading documents...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useDocumentsStore).mockReturnValue({
      documents: [],
      categories: [],
      templates: [],
      versions: [],
      comments: [],
      isLoading: false,
      error: 'Failed to load documents',
      fetchDocuments: vi.fn(),
      fetchCategories: vi.fn(),
      fetchTemplates: vi.fn(),
      addDocument: vi.fn(),
      addCategory: vi.fn(),
      addTemplate: vi.fn(),
      updateDocument: vi.fn(),
      updateCategory: vi.fn(),
      updateTemplate: vi.fn(),
      deleteDocument: vi.fn(),
      deleteCategory: vi.fn(),
      deleteTemplate: vi.fn(),
      fetchVersions: vi.fn(),
      createVersion: vi.fn(),
      deleteVersion: vi.fn(),
      restoreVersion: vi.fn(),
      fetchComments: vi.fn(),
      addComment: vi.fn(),
      updateComment: vi.fn(),
      deleteComment: vi.fn(),
      searchDocuments: vi.fn(),
      publishDocument: vi.fn(),
      archiveDocument: vi.fn(),
      duplicateDocument: vi.fn(),
      getDocumentStats: vi.fn(),
    });

    render(<Documents />);
    
    expect(screen.getByText('Error loading documents: Failed to load documents')).toBeInTheDocument();
  });
});
