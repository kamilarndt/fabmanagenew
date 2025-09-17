import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Files } from '../../pages/Files';

// Mock the store
vi.mock('../../stores/filesStore', () => ({
  useFilesStore: () => ({
    files: [],
    folders: [],
    versions: [],
    shares: [],
    currentFolder: null,
    selectedFiles: [],
    isLoading: false,
    error: null,
    fetchFiles: vi.fn(),
    fetchFolders: vi.fn(),
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
    moveFile: vi.fn(),
    renameFile: vi.fn(),
    createFolder: vi.fn(),
    deleteFolder: vi.fn(),
    moveFolder: vi.fn(),
    renameFolder: vi.fn(),
    fetchVersions: vi.fn(),
    createVersion: vi.fn(),
    deleteVersion: vi.fn(),
    restoreVersion: vi.fn(),
    shareFile: vi.fn(),
    unshareFile: vi.fn(),
    updateSharePermission: vi.fn(),
    searchFiles: vi.fn(),
    downloadFile: vi.fn(),
    previewFile: vi.fn(),
    setCurrentFolder: vi.fn(),
    setSelectedFiles: vi.fn(),
    toggleFileSelection: vi.fn(),
  }),
}));

describe('Files Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders file management', () => {
    render(<Files />);
    
    expect(screen.getByText('File Management')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useFilesStore).mockReturnValue({
      files: [],
      folders: [],
      versions: [],
      shares: [],
      currentFolder: null,
      selectedFiles: [],
      isLoading: true,
      error: null,
      fetchFiles: vi.fn(),
      fetchFolders: vi.fn(),
      uploadFile: vi.fn(),
      deleteFile: vi.fn(),
      moveFile: vi.fn(),
      renameFile: vi.fn(),
      createFolder: vi.fn(),
      deleteFolder: vi.fn(),
      moveFolder: vi.fn(),
      renameFolder: vi.fn(),
      fetchVersions: vi.fn(),
      createVersion: vi.fn(),
      deleteVersion: vi.fn(),
      restoreVersion: vi.fn(),
      shareFile: vi.fn(),
      unshareFile: vi.fn(),
      updateSharePermission: vi.fn(),
      searchFiles: vi.fn(),
      downloadFile: vi.fn(),
      previewFile: vi.fn(),
      setCurrentFolder: vi.fn(),
      setSelectedFiles: vi.fn(),
      toggleFileSelection: vi.fn(),
    });

    render(<Files />);
    
    expect(screen.getByText('Loading files...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useFilesStore).mockReturnValue({
      files: [],
      folders: [],
      versions: [],
      shares: [],
      currentFolder: null,
      selectedFiles: [],
      isLoading: false,
      error: 'Failed to load files',
      fetchFiles: vi.fn(),
      fetchFolders: vi.fn(),
      uploadFile: vi.fn(),
      deleteFile: vi.fn(),
      moveFile: vi.fn(),
      renameFile: vi.fn(),
      createFolder: vi.fn(),
      deleteFolder: vi.fn(),
      moveFolder: vi.fn(),
      renameFolder: vi.fn(),
      fetchVersions: vi.fn(),
      createVersion: vi.fn(),
      deleteVersion: vi.fn(),
      restoreVersion: vi.fn(),
      shareFile: vi.fn(),
      unshareFile: vi.fn(),
      updateSharePermission: vi.fn(),
      searchFiles: vi.fn(),
      downloadFile: vi.fn(),
      previewFile: vi.fn(),
      setCurrentFolder: vi.fn(),
      setSelectedFiles: vi.fn(),
      toggleFileSelection: vi.fn(),
    });

    render(<Files />);
    
    expect(screen.getByText('Error loading files: Failed to load files')).toBeInTheDocument();
  });
});
