# Deployment Guide

This document provides comprehensive deployment instructions for the FabManage-Clean application, covering Docker deployment, PWA configuration, environment setup, and monitoring.

## 🚀 Deployment Overview

### Deployment Strategies

- **Docker**: Multi-stage containerized deployment
- **Static Hosting**: CDN-optimized static file serving
- **PWA**: Progressive Web App with offline support
- **Supabase**: Backend-as-a-Service integration

### Environment Types

- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## 🏗️ Build Process

### Production Build

```bash
# TypeScript compilation + Vite build
npm run build

# Output directory: dist/
# Includes optimized assets, service worker, and manifest
```

### Build Optimization

- **Code Splitting**: Automatic route-based and component-based splitting
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS minification
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Rollup visualizer for bundle size monitoring

### Build Configuration

```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimized chunk splitting
          "react-vendor": ["react", "react-dom"],
          "antd-vendor": ["antd", "@ant-design/icons"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```

## 🔧 Environment Configuration

### Environment Variables

#### Frontend Variables (Vite)

```bash
# API Configuration
VITE_API_BASE_URL=https://api.fabmanage.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# External Services
VITE_SPECKLE_SERVER=https://speckle.xyz
VITE_SPECKLE_TOKEN=your-speckle-token

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

#### Backend Variables (Node.js)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fabmanage

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# External Services
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Security Best Practices

- **Never commit secrets**: Use `.env*` files (gitignored)
- **Environment-specific configs**: Separate configs per environment
- **Secret rotation**: Regular rotation of API keys and tokens
- **Access control**: Limit access to production secrets

### Environment Files Structure

```
.env.local          # Local development overrides
.env.development    # Development environment
.env.staging        # Staging environment
.env.production     # Production environment
.env.example        # Template for new environments
```

## 🐳 Docker Deployment

### Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    image: node:18-alpine
    working_dir: /app
    command: npm start
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app
    restart: unless-stopped
```

### Nginx Configuration

```nginx
# nginx.conf
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # Gzip compression
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

  # Security headers
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
  add_header X-XSS-Protection "1; mode=block";

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
      access_log off;
      return 200 "healthy\n";
      add_header Content-Type text/plain;
    }
  }
}
```

## 📱 PWA Configuration

### Service Worker

```typescript
// vite.config.ts - PWA configuration
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png}"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
      manifest: {
        name: "FabManage",
        short_name: "FabManage",
        description: "Production management system for scenography",
        theme_color: "#1677ff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

### PWA Requirements

- **HTTPS**: Required for service worker and PWA features
- **Manifest**: Proper web app manifest configuration
- **Icons**: App icons in multiple sizes
- **Offline Support**: Service worker for offline functionality

## 🗄️ Supabase Configuration

### Database Setup

```sql
-- Apply migrations
-- Enable RLS policies
-- Configure storage buckets
-- Set up authentication
```

### RLS Policies

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);
```

### Storage Configuration

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('dxf-files', 'dxf-files', false),
  ('images', 'images', true);

-- Set up storage policies
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 📊 Monitoring & Observability

### Health Checks

```typescript
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  });
});
```

### Logging Configuration

```typescript
// Structured logging
import { logger } from "@/lib/logger";

logger.info("Application started", {
  environment: process.env.NODE_ENV,
  version: process.env.npm_package_version,
  port: process.env.PORT,
});

// Error logging
logger.error("Database connection failed", {
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
});
```

### Performance Monitoring

- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Bundle Size**: Track bundle size over time
- **API Performance**: Monitor API response times
- **Error Tracking**: Track and analyze errors

## 🚀 Deployment Commands

### Local Development

```bash
# Start development server
npm run dev

# Start with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Deployment

```bash
# Build for production
npm run build

# Build Docker image
docker build -t fabmanage:latest .

# Run production container
docker run -p 80:80 -e NODE_ENV=production fabmanage:latest

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t fabmanage:${{ github.sha }} .

      - name: Deploy to production
        run: |
          docker tag fabmanage:${{ github.sha }} fabmanage:latest
          docker push fabmanage:latest
```

## 🔒 Security Considerations

### Security Headers

- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **RLS Policies**: Database-level access control
- **API Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schema validation

### Data Protection

- **Encryption**: Encrypt sensitive data at rest
- **HTTPS**: Encrypt data in transit
- **Secrets Management**: Secure secret storage
- **Audit Logging**: Track sensitive operations

---

**Last Updated**: January 2025  
**Deployment Guide Version**: 2.0.0  
**Next Review**: March 2025
