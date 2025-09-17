export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  version: number;
  tags: string[];
  attachments: string[];
  is_public: boolean;
  view_count: number;
  download_count: number;
  last_accessed_at?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category_id: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: string;
  changes: string;
  created_by: string;
  created_at: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  author_id: string;
  author_name: string;
  content: string;
  position?: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentSearch {
  query: string;
  category_id?: string;
  subcategory?: string;
  status?: string;
  tags?: string[];
  created_by?: string;
  date_from?: string;
  date_to?: string;
  is_public?: boolean;
}
