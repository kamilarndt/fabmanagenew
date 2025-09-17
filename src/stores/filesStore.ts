import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchWithMockFallback, mockData } from '../lib/api';
import type { FileItem, Folder, FileVersion, FileShare, FileUpload, FileSearch } from '../types/files.types';

interface FilesState {
  files: FileItem[];
  folders: Folder[];
  versions: FileVersion[];
  shares: FileShare[];
  currentFolder: string | null;
  selectedFiles: string[];
  
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFiles: (folderId?: string) => Promise<void>;
  fetchFolders: (parentId?: string) => Promise<void>;
  uploadFile: (upload: FileUpload) => Promise<FileItem>;
  deleteFile: (fileId: string) => Promise<void>;
  moveFile: (fileId: string, newFolderId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  
  createFolder: (folder: Omit<Folder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  moveFolder: (folderId: string, newParentId: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  
  fetchVersions: (fileId: string) => Promise<void>;
  createVersion: (fileId: string, upload: FileUpload) => Promise<FileVersion>;
  deleteVersion: (versionId: string) => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  
  shareFile: (fileId: string, share: Omit<FileShare, 'id' | 'created_at'>) => Promise<void>;
  unshareFile: (shareId: string) => Promise<void>;
  updateSharePermission: (shareId: string, permission: string) => Promise<void>;
  
  searchFiles: (search: FileSearch) => Promise<FileItem[]>;
  downloadFile: (fileId: string) => Promise<void>;
  previewFile: (fileId: string) => Promise<string>;
  
  setCurrentFolder: (folderId: string | null) => void;
  setSelectedFiles: (fileIds: string[]) => void;
  toggleFileSelection: (fileId: string) => void;
}

export const useFilesStore = create<FilesState>()(
  immer((set, get) => ({
    files: [],
    folders: [],
    versions: [],
    shares: [],
    currentFolder: null,
    selectedFiles: [],
    
    isLoading: false,
    error: null,
    
    fetchFiles: async (folderId) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        const url = folderId 
          ? `/api/files?folder_id=${folderId}`
          : '/api/files';
        const files = await fetchWithMockFallback(
          url,
          mockData.files.files
        );
        
        set((state) => {
          state.files = files;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },
    
    fetchFolders: async (parentId) => {
      try {
        const url = parentId 
          ? `/api/folders?parent_id=${parentId}`
          : '/api/folders';
        const response = await fetch(url);
        const folders = await response.json();
        
        set((state) => {
          state.folders = folders;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },
    
    uploadFile: async (upload) => {
      try {
        const formData = new FormData();
        formData.append('file', upload.file);
        if (upload.folder_id) formData.append('folder_id', upload.folder_id);
        if (upload.description) formData.append('description', upload.description);
        if (upload.tags) formData.append('tags', JSON.stringify(upload.tags));
        if (upload.is_public !== undefined) formData.append('is_public', upload.is_public.toString());
        
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        const file = await response.json();
        
        set((state) => {
          state.files.push(file);
        });
        
        return file;
      } catch (error) {
        throw error;
      }
    },
    
    deleteFile: async (fileId) => {
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete file');
        
        set((state) => {
          state.files = state.files.filter(f => f.id !== fileId);
        });
      } catch (error) {
        throw error;
      }
    },
    
    moveFile: async (fileId, newFolderId) => {
      try {
        const response = await fetch(`/api/files/${fileId}/move`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder_id: newFolderId }),
        });
        
        if (!response.ok) throw new Error('Failed to move file');
        
        set((state) => {
          const file = state.files.find(f => f.id === fileId);
          if (file) {
            file.folder_id = newFolderId;
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    renameFile: async (fileId, newName) => {
      try {
        const response = await fetch(`/api/files/${fileId}/rename`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
        
        if (!response.ok) throw new Error('Failed to rename file');
        
        set((state) => {
          const file = state.files.find(f => f.id === fileId);
          if (file) {
            file.name = newName;
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    createFolder: async (folderData) => {
      try {
        const response = await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(folderData),
        });
        const folder = await response.json();
        
        set((state) => {
          state.folders.push(folder);
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteFolder: async (folderId) => {
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete folder');
        
        set((state) => {
          state.folders = state.folders.filter(f => f.id !== folderId);
        });
      } catch (error) {
        throw error;
      }
    },
    
    moveFolder: async (folderId, newParentId) => {
      try {
        const response = await fetch(`/api/folders/${folderId}/move`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parent_id: newParentId }),
        });
        
        if (!response.ok) throw new Error('Failed to move folder');
        
        set((state) => {
          const folder = state.folders.find(f => f.id === folderId);
          if (folder) {
            folder.parent_id = newParentId;
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    renameFolder: async (folderId, newName) => {
      try {
        const response = await fetch(`/api/folders/${folderId}/rename`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
        
        if (!response.ok) throw new Error('Failed to rename folder');
        
        set((state) => {
          const folder = state.folders.find(f => f.id === folderId);
          if (folder) {
            folder.name = newName;
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchVersions: async (fileId) => {
      try {
        const response = await fetch(`/api/files/${fileId}/versions`);
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
    
    createVersion: async (fileId, upload) => {
      try {
        const formData = new FormData();
        formData.append('file', upload.file);
        if (upload.change_description) formData.append('change_description', upload.change_description);
        
        const response = await fetch(`/api/files/${fileId}/versions`, {
          method: 'POST',
          body: formData,
        });
        const version = await response.json();
        
        set((state) => {
          state.versions.push(version);
        });
        
        return version;
      } catch (error) {
        throw error;
      }
    },
    
    deleteVersion: async (versionId) => {
      try {
        const response = await fetch(`/api/files/versions/${versionId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete version');
        
        set((state) => {
          state.versions = state.versions.filter(v => v.id !== versionId);
        });
      } catch (error) {
        throw error;
      }
    },
    
    restoreVersion: async (versionId) => {
      try {
        const response = await fetch(`/api/files/versions/${versionId}/restore`, {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to restore version');
        
        // Refresh files after restore
        const { fetchFiles } = get();
        await fetchFiles();
      } catch (error) {
        throw error;
      }
    },
    
    shareFile: async (fileId, shareData) => {
      try {
        const response = await fetch(`/api/files/${fileId}/share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shareData),
        });
        const share = await response.json();
        
        set((state) => {
          state.shares.push(share);
        });
      } catch (error) {
        throw error;
      }
    },
    
    unshareFile: async (shareId) => {
      try {
        const response = await fetch(`/api/files/shares/${shareId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to unshare file');
        
        set((state) => {
          state.shares = state.shares.filter(s => s.id !== shareId);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateSharePermission: async (shareId, permission) => {
      try {
        const response = await fetch(`/api/files/shares/${shareId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permission }),
        });
        
        if (!response.ok) throw new Error('Failed to update share permission');
        
        set((state) => {
          const share = state.shares.find(s => s.id === shareId);
          if (share) {
            share.permission = permission as 'read' | 'write' | 'admin';
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    searchFiles: async (search) => {
      try {
        const response = await fetch('/api/files/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(search),
        });
        const files = await response.json();
        
        return files;
      } catch (error) {
        throw error;
      }
    },
    
    downloadFile: async (fileId) => {
      try {
        const response = await fetch(`/api/files/${fileId}/download`);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        throw error;
      }
    },
    
    previewFile: async (fileId) => {
      try {
        const response = await fetch(`/api/files/${fileId}/preview`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        throw error;
      }
    },
    
    setCurrentFolder: (folderId) => {
      set((state) => {
        state.currentFolder = folderId;
      });
    },
    
    setSelectedFiles: (fileIds) => {
      set((state) => {
        state.selectedFiles = fileIds;
      });
    },
    
    toggleFileSelection: (fileId) => {
      set((state) => {
        const index = state.selectedFiles.indexOf(fileId);
        if (index > -1) {
          state.selectedFiles.splice(index, 1);
        } else {
          state.selectedFiles.push(fileId);
        }
      });
    },
  }))
);
