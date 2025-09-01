# FabManage Quick Start Guide

## 🚀 Getting Started

This guide will help you get up and running with the FabManage system quickly.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account (for backend)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kamilarndt/fabmanagenew.git
cd fabmanagenew
```

### 2. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install prototyp2 dependencies
cd prototyp2
npm install
cd ..
```

### 3. Environment Setup

Create environment files:

```bash
# Main project
cp .env.example .env.local

# Prototyp2 project
cd prototyp2
cp .env.example .env.local
cd ..
```

Configure your environment variables:

```env
# .env.local
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start Development Server

```bash
# Start main project
npm run dev

# Or start prototyp2 (in another terminal)
cd prototyp2
npm run dev
```

## 🎯 Basic Usage

### Creating Your First Component

```tsx
import React from 'react';
import { ConstructorCard, ConstructorButton } from './components/ui-kit';

function MyComponent() {
  return (
    <ConstructorCard variant="elevated" size="lg">
      <h2>My First Component</h2>
      <ConstructorButton variant="primary" onClick={() => alert('Hello!')}>
        Click Me
      </ConstructorButton>
    </ConstructorCard>
  );
}

export default MyComponent;
```

### Using the Tile Status System

```tsx
import React, { useContext } from 'react';
import { TileStatusContext } from './components/TileStatusSync';
import { StatusBadge, ConstructorButton } from './components/ui-kit';

function TileManager() {
  const { tiles, updateTileStatus } = useContext(TileStatusContext);

  const handleStatusChange = async (tileId: string, newStatus: string) => {
    await updateTileStatus(tileId, newStatus, 'my-component');
  };

  return (
    <div>
      {tiles.map(tile => (
        <div key={tile.id}>
          <h3>{tile.name}</h3>
          <StatusBadge status={tile.status} />
          <ConstructorButton 
            onClick={() => handleStatusChange(tile.id, 'WYCIĘTE')}
          >
            Mark Complete
          </ConstructorButton>
        </div>
      ))}
    </div>
  );
}
```

### Creating a Modal

```tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { ConstructorButton } from './components/ui-kit';

function MyModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ConstructorButton onClick={() => setOpen(true)}>
        Open Modal
      </ConstructorButton>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>My Modal</DialogTitle>
          </DialogHeader>
          <p>Modal content goes here</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## 📊 Working with Data

### Project Data Structure

```typescript
interface ProjectData {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  team: string[];
  stage: string;
  overdue: boolean;
}
```

### Tile Data Structure

```typescript
interface TileData {
  id: string;
  name: string;
  status: string;
  project?: string;
  zone?: string;
  assignedTo?: string;
  priority?: string;
  estimatedTime?: string;
  progress?: number;
  materials?: string[];
  dxfFile?: string | null;
  assemblyDrawing?: string | null;
  notes?: string;
  machine?: string;
  startTime?: string;
  completedTime?: string;
  actualTime?: string;
  projectName?: string;
}
```

## 🔧 Common Patterns

### Toast Notifications

```tsx
import { showSuccessToast, showErrorToast } from './utils/toast';

// Success notification
showSuccessToast('Operation completed successfully!');

// Error notification
showErrorToast('Something went wrong');
```

### Form Handling

```tsx
import React, { useState } from 'react';
import { Input } from './components/ui/input';
import { ConstructorButton } from './components/ui-kit';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <Input
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <ConstructorButton type="submit">
        Submit
      </ConstructorButton>
    </form>
  );
}
```

### API Calls

```tsx
import { testBackendConnection } from './utils/supabase/client';

async function checkConnection() {
  try {
    const isConnected = await testBackendConnection();
    if (isConnected) {
      console.log('Backend connected!');
    }
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

## 🎨 Styling Guidelines

### Using Tailwind CSS

```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Spacing
<div className="space-y-4 p-6">
  <h1>Title</h1>
  <p>Content</p>
</div>

// Colors
<div className="bg-blue-50 text-blue-900 border border-blue-200">
  Blue themed content
</div>
```

### Custom CSS Classes

```css
/* Custom utility classes */
.constructor-responsive-hide-sm {
  @media (max-width: 640px) {
    display: none;
  }
}

.constructor-responsive-hide-md {
  @media (max-width: 768px) {
    display: none;
  }
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Component Testing Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ConstructorButton } from './components/ui-kit';

test('button clicks correctly', () => {
  const handleClick = jest.fn();
  
  render(
    <ConstructorButton onClick={handleClick}>
      Click Me
    </ConstructorButton>
  );
  
  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 🚀 Deployment

### Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t fabmanage .

# Run container
docker run -p 3000:3000 fabmanage
```

## 🔍 Debugging

### Common Issues

1. **Component not rendering**: Check if all required props are provided
2. **State not updating**: Ensure you're using the TileStatusProvider
3. **API errors**: Verify Supabase configuration
4. **Styling issues**: Check Tailwind CSS classes

### Debug Tools

- **React DevTools**: For component debugging
- **Network tab**: For API request debugging
- **Console logs**: For state management debugging
- **Supabase dashboard**: For database debugging

## 📚 Next Steps

1. **Read the full API documentation** in `docs/API_DOCUMENTATION.md`
2. **Explore the component reference** in `docs/COMPONENT_REFERENCE.md`
3. **Check out the existing components** in `src/components/`
4. **Review the project structure** in the main README

## 🤝 Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the development team

---

Happy coding! 🎉