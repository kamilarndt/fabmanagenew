import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Concepts } from '../../pages/Concepts';

// Mock the store
vi.mock('../../stores/conceptStore', () => ({
  useConceptStore: () => ({
    concepts: [],
    approvals: [],
    comments: [],
    workflows: [],
    isLoading: false,
    error: null,
    fetchConcepts: vi.fn(),
    addConcept: vi.fn(),
    updateConcept: vi.fn(),
    deleteConcept: vi.fn(),
    submitConcept: vi.fn(),
    approveConcept: vi.fn(),
    rejectConcept: vi.fn(),
    fetchApprovals: vi.fn(),
    addApproval: vi.fn(),
    updateApproval: vi.fn(),
    fetchComments: vi.fn(),
    addComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
    fetchWorkflows: vi.fn(),
    addWorkflow: vi.fn(),
    updateWorkflow: vi.fn(),
    deleteWorkflow: vi.fn(),
    getConceptStatus: vi.fn(),
    getApprovalProgress: vi.fn(),
  }),
}));

describe('Concepts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders concept management', () => {
    render(<Concepts />);
    
    expect(screen.getByText('Concept Management')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useConceptStore).mockReturnValue({
      concepts: [],
      approvals: [],
      comments: [],
      workflows: [],
      isLoading: true,
      error: null,
      fetchConcepts: vi.fn(),
      addConcept: vi.fn(),
      updateConcept: vi.fn(),
      deleteConcept: vi.fn(),
      submitConcept: vi.fn(),
      approveConcept: vi.fn(),
      rejectConcept: vi.fn(),
      fetchApprovals: vi.fn(),
      addApproval: vi.fn(),
      updateApproval: vi.fn(),
      fetchComments: vi.fn(),
      addComment: vi.fn(),
      updateComment: vi.fn(),
      deleteComment: vi.fn(),
      fetchWorkflows: vi.fn(),
      addWorkflow: vi.fn(),
      updateWorkflow: vi.fn(),
      deleteWorkflow: vi.fn(),
      getConceptStatus: vi.fn(),
      getApprovalProgress: vi.fn(),
    });

    render(<Concepts />);
    
    expect(screen.getByText('Loading concepts...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useConceptStore).mockReturnValue({
      concepts: [],
      approvals: [],
      comments: [],
      workflows: [],
      isLoading: false,
      error: 'Failed to load concepts',
      fetchConcepts: vi.fn(),
      addConcept: vi.fn(),
      updateConcept: vi.fn(),
      deleteConcept: vi.fn(),
      submitConcept: vi.fn(),
      approveConcept: vi.fn(),
      rejectConcept: vi.fn(),
      fetchApprovals: vi.fn(),
      addApproval: vi.fn(),
      updateApproval: vi.fn(),
      fetchComments: vi.fn(),
      addComment: vi.fn(),
      updateComment: vi.fn(),
      deleteComment: vi.fn(),
      fetchWorkflows: vi.fn(),
      addWorkflow: vi.fn(),
      updateWorkflow: vi.fn(),
      deleteWorkflow: vi.fn(),
      getConceptStatus: vi.fn(),
      getApprovalProgress: vi.fn(),
    });

    render(<Concepts />);
    
    expect(screen.getByText('Error loading concepts: Failed to load concepts')).toBeInTheDocument();
  });
});
