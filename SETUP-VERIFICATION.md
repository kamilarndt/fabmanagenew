# FabManage Setup Verification Guide

## 🎯 Overview

This guide helps you verify that all components of the FabManage-Clean2 project are properly set up and working together.

## 🔍 Quick Verification

### 1. Check System Requirements

```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version

# Check if Git is available
git --version
```

### 2. Verify Project Structure

Ensure these essential files and directories exist:

```
FabManage-Clean2/
├── package.json          ✅ Main project configuration
├── tsconfig.json         ✅ TypeScript configuration
├── vite.config.ts        ✅ Vite build configuration
├── index.html            ✅ Main HTML file
├── src/
│   ├── main.tsx          ✅ Application entry point
│   ├── App.tsx           ✅ Main App component
│   ├── index.css         ✅ Global styles
│   ├── components/       ✅ Reusable components
│   ├── pages/            ✅ Page components
│   ├── stores/           ✅ State management
│   ├── types/            ✅ TypeScript types
│   ├── hooks/            ✅ Custom hooks
│   └── utils/            ✅ Utility functions
├── tests/                ✅ Test files
├── k8s/                  ✅ Kubernetes manifests
├── monitoring/           ✅ Monitoring configuration
└── scripts/              ✅ Deployment scripts
```

### 3. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 4. Run Setup Verification

```bash
# Run comprehensive setup check
./scripts/check-setup.sh

# Or on Windows
bash scripts/check-setup.sh
```

## 🧪 Testing the Application

### 1. Development Server

```bash
# Start development server
npm run dev

# Or use the startup script
./scripts/start-dev.sh
```

The application should be available at `http://localhost:3000`

### 2. Run All Tests

```bash
# Run comprehensive test suite
./scripts/test-all.sh

# Or run individual test types
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run lint          # Code quality
npm run type-check    # TypeScript checking
```

### 3. Build Verification

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Module Verification

### Check Each Module

Navigate to each module in the application and verify:

1. **Materials Management** (`/materials`)
   - ✅ Page loads without errors
   - ✅ Materials list displays
   - ✅ Add/Edit functionality works
   - ✅ Search and filtering works

2. **Project Tiles** (`/tiles`)
   - ✅ Kanban board displays
   - ✅ Drag & drop functionality works
   - ✅ Task creation works
   - ✅ Status updates work

3. **Pricing** (`/pricing`)
   - ✅ Pricing calculations display
   - ✅ Real-time updates work
   - ✅ Cost breakdowns show

4. **Logistics** (`/logistics`)
   - ✅ Transport management interface
   - ✅ Route planning works
   - ✅ Vehicle tracking displays

5. **Accommodation** (`/accommodation`)
   - ✅ Hotel booking interface
   - ✅ Booking management works
   - ✅ Integration with external APIs

6. **Files** (`/files`)
   - ✅ File upload/download works
   - ✅ Version control functions
   - ✅ File sharing works

7. **Concepts** (`/concepts`)
   - ✅ Concept creation works
   - ✅ Approval workflow functions
   - ✅ Status tracking works

8. **Documents** (`/documents`)
   - ✅ Document library displays
   - ✅ Categorization works
   - ✅ Search functionality works

9. **Messaging** (`/messaging`)
   - ✅ Chat interface loads
   - ✅ Real-time messaging works
   - ✅ Presence indicators show

## 🔧 Troubleshooting

### Common Issues

#### 1. Dependencies Not Installed
```bash
# Solution: Install dependencies
npm install
```

#### 2. TypeScript Errors
```bash
# Check TypeScript configuration
npm run type-check

# Fix common issues
npm run lint:fix
```

#### 3. Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Test Failures
```bash
# Run tests with verbose output
npm run test -- --verbose

# Check specific test files
npm run test src/pages/Materials.test.tsx
```

#### 5. Development Server Issues
```bash
# Check if port 3000 is available
netstat -an | grep 3000

# Use different port
npm run dev -- --port 3001
```

### Performance Issues

#### 1. Slow Loading
- Check bundle size: `npm run analyze`
- Verify code splitting is working
- Check for memory leaks in browser dev tools

#### 2. Build Time Issues
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for circular dependencies
- Optimize imports

## 📊 Verification Checklist

### ✅ System Requirements
- [ ] Node.js 18+ installed
- [ ] npm 8+ installed
- [ ] Git available (optional)
- [ ] Sufficient disk space (1GB+)

### ✅ Project Structure
- [ ] All essential files present
- [ ] Directory structure correct
- [ ] Configuration files valid

### ✅ Dependencies
- [ ] All packages installed
- [ ] No version conflicts
- [ ] Security audit passed

### ✅ Application Functionality
- [ ] Development server starts
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] All modules functional

### ✅ Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Code quality checks pass

### ✅ Build Process
- [ ] Production build succeeds
- [ ] Bundle size optimized
- [ ] No build warnings/errors

### ✅ Deployment Ready
- [ ] Docker configuration valid
- [ ] Kubernetes manifests correct
- [ ] Monitoring setup complete
- [ ] CI/CD pipeline configured

## 🚀 Next Steps

Once verification is complete:

1. **Development**: Start building features
2. **Testing**: Add more test coverage
3. **Documentation**: Update docs as needed
4. **Deployment**: Deploy to staging/production
5. **Monitoring**: Set up production monitoring

## 📞 Support

If you encounter issues:

1. Check this verification guide
2. Review error messages carefully
3. Check the troubleshooting section
4. Create an issue with detailed information
5. Contact the development team

---

**Remember**: A properly verified setup ensures smooth development and deployment!
