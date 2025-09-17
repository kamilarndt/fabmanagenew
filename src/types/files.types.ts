export interface FileItem {
  id: string;
  name: string;
  original_name: string;
  path: string;
  size: number;
  mime_type: string;
  extension: string;
  project_id: string;
  folder_id?: string;
  uploaded_by: string;
  uploaded_at: string;
  updated_at: string;
  is_public: boolean;
  download_count: number;
  tags: string[];
  description?: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  project_id: string;
  parent_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  description?: string;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version_number: number;
  path: string;
  size: number;
  uploaded_by: string;
  uploaded_at: string;
  change_description?: string;
}

export interface FileShare {
  id: string;
  file_id: string;
  shared_by: string;
  shared_with: string;
  permission: 'read' | 'write' | 'admin';
  expires_at?: string;
  created_at: string;
  is_active: boolean;
}

export interface FileUpload {
  file: File;
  folder_id?: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface FileSearch {
  query: string;
  project_id?: string;
  folder_id?: string;
  mime_type?: string;
  tags?: string[];
  uploaded_by?: string;
  date_from?: string;
  date_to?: string;
  size_min?: number;
  size_max?: number;
}
