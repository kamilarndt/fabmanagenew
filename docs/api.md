# API Reference

This document provides comprehensive API documentation for the FabManage-Clean application. In production, Supabase serves as the primary backend API, while a local Node.js server provides development and demo endpoints.

## 🌐 API Overview

### Primary Backend (Supabase)

- **Authentication**: JWT-based authentication with role-based access control
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **Storage**: File storage for DXF files, images, and documents
- **Realtime**: WebSocket connections for live updates
- **Edge Functions**: Serverless functions for complex business logic

### Development API (Node.js)

- **Local Server**: `backend/src/server.ts` for development and demo
- **Mock Data**: Seed data for testing and development
- **File Processing**: DXF file parsing and processing
- **Health Checks**: System status and connectivity monitoring

## 📋 API Conventions

### Request/Response Format

- **Content-Type**: `application/json` for all requests and responses
- **Date Format**: ISO 8601 for all timestamps (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Error Format**: `{ error: string, code?: string, details?: any }`
- **Pagination**: `{ data: T[], pagination: { page: number, limit: number, total: number } }`

### Authentication

- **JWT Tokens**: Bearer token in Authorization header
- **Token Refresh**: Automatic token refresh on expiration
- **Role-Based Access**: Different permissions based on user roles

### Error Handling

- **HTTP Status Codes**: Standard HTTP status codes for different error types
- **Error Types**: `ApiError` class for consistent error handling
- **User Feedback**: Ant Design notifications for user-friendly error messages

## 🔗 API Endpoints

### Health & Status

```http
GET /api/health
```

**Response:**

```json
{
  "ok": true,
  "timestamp": "2025-01-16T10:30:00.000Z",
  "db": true,
  "version": "2.0.0"
}
```

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"
}
```

```http
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

### Clients Management

```http
GET /api/clients
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "+1234567890",
    "created_at": "2025-01-16T10:30:00.000Z",
    "updated_at": "2025-01-16T10:30:00.000Z"
  }
]
```

```http
POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Client",
  "email": "newclient@example.com",
  "phone": "+1234567890"
}
```

### Projects Management

```http
GET /api/projects
Authorization: Bearer <token>
Query Parameters:
- status?: 'active' | 'completed' | 'cancelled'
- client_id?: string
- page?: number
- limit?: number
```

```http
GET /api/projects/:id
Authorization: Bearer <token>
```

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Project Name",
  "client_id": "uuid",
  "description": "Project description",
  "start_date": "2025-01-16T00:00:00.000Z",
  "end_date": "2025-02-16T00:00:00.000Z",
  "status": "active"
}
```

### Tiles Management

```http
GET /api/tiles
Authorization: Bearer <token>
Query Parameters:
- project_id?: string
- status?: 'design' | 'approval' | 'cnc' | 'production' | 'assembly'
- page?: number
- limit?: number
```

```http
GET /api/tiles/:id
Authorization: Bearer <token>
```

```http
POST /api/tiles
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_id": "uuid",
  "name": "Tile Name",
  "description": "Tile description",
  "status": "design",
  "priority": "high",
  "dimensions": {
    "width": 100,
    "height": 200,
    "depth": 50
  },
  "materials": [
    {
      "material_id": "uuid",
      "quantity": 2,
      "unit": "pcs"
    }
  ]
}
```

### Materials & BOM

```http
GET /api/materials
Authorization: Bearer <token>
Query Parameters:
- category?: string
- search?: string
- page?: number
- limit?: number
```

```http
GET /api/materials/bom
Authorization: Bearer <token>
Query Parameters:
- project_id: string (required)
```

**Response:**

```json
[
  {
    "tile_id": "uuid",
    "material_id": "uuid",
    "code": "MAT001",
    "name": "Material Name",
    "quantity": 5,
    "unit": "pcs",
    "unit_price": 10.5,
    "total_price": 52.5
  }
]
```

### File Upload & Processing

```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <File>,
  "type": "dxf" | "image" | "document",
  "project_id": "uuid"
}
```

```http
POST /api/files/process-dxf
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_id": "uuid",
  "project_id": "uuid"
}
```

### Logistics & Installation

```http
GET /api/logistics/packing-lists
Authorization: Bearer <token>
Query Parameters:
- project_id?: string
- status?: 'pending' | 'prepared' | 'shipped' | 'delivered'
```

```http
POST /api/logistics/packing-lists
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_id": "uuid",
  "items": [
    {
      "tile_id": "uuid",
      "quantity": 1,
      "packaging": "crate"
    }
  ]
}
```

## 🔄 Real-time Subscriptions

### Supabase Realtime Channels

```typescript
// Subscribe to project updates
const subscription = supabase
  .channel("projects")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "projects",
    },
    (payload) => {
      console.log("Project updated:", payload);
    }
  )
  .subscribe();

// Subscribe to tile updates
const tileSubscription = supabase
  .channel("tiles")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "tiles",
      filter: `project_id=eq.${projectId}`,
    },
    (payload) => {
      console.log("Tile updated:", payload);
    }
  )
  .subscribe();
```

## 🛡️ Security & Authorization

### Row Level Security (RLS)

- **Projects**: Users can only access projects they're assigned to
- **Tiles**: Access based on project membership
- **Materials**: Global read access, write access based on role
- **Clients**: Access based on user role and project assignments

### API Rate Limiting

- **Authentication**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **File Upload**: 10 requests per minute per user
- **Realtime**: 1000 messages per hour per user

### Input Validation

- **Zod Schemas**: All inputs validated against Zod schemas
- **Sanitization**: HTML content sanitized with DOMPurify
- **File Validation**: File type and size validation
- **SQL Injection**: Protected by parameterized queries

## 🔧 Service Layer

### Service Architecture

```typescript
// Example service structure
export class ProjectService {
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    // Implementation with error handling and caching
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    // Implementation with validation and error handling
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    // Implementation with optimistic updates
  }
}
```

### Error Handling

```typescript
// ApiError class for consistent error handling
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
  }
}
```

### HTTP Client Strategy

```typescript
// httpClient handles strategy switching
const httpClient = {
  async request<T>(config: RequestConfig): Promise<T> {
    if (isSupabaseAvailable()) {
      return supabaseRequest<T>(config);
    } else {
      return restRequest<T>(config);
    }
  },
};
```

## 📊 API Monitoring

### Health Checks

- **Database Connectivity**: Check PostgreSQL connection
- **External Services**: Verify Supabase connectivity
- **File Storage**: Test file upload/download
- **Realtime**: Verify WebSocket connections

### Performance Metrics

- **Response Times**: Track API response times
- **Error Rates**: Monitor error rates by endpoint
- **Throughput**: Track requests per second
- **Cache Hit Rates**: Monitor query cache performance

### Logging

- **Request Logging**: Log all API requests with timing
- **Error Logging**: Detailed error logs with stack traces
- **Audit Logging**: Track data changes and user actions
- **Performance Logging**: Log slow queries and operations

---

**Last Updated**: January 2025  
**API Version**: 2.0.0  
**Next Review**: March 2025
