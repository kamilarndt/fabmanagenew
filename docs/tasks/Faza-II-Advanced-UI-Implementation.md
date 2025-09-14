# **Faza II: Advanced UI System Implementation - FabManage**
**Enterprise-Grade Component Library & Design System**

---

## **Wprowadzenie**

Ten dokument opisuje **Fazę II** rozwoju UI systemu aplikacji FabManage - implementację zaawansowanego systemu komponentów, design tokens, accessibility features i developer tools. Faza II rozpoczyna się po ukończeniu podstawowej refaktoryzacji (Faza I) i tworzy enterprise-grade UI foundation.

**Założenia:**
- ✅ Podstawowa refaktoryzacja (Atomic Design) została ukończona
- ✅ Struktura folderów (`src/components/ui/`, `src/modules/`) istnieje
- ✅ Podstawowe atomy (AppButton, AppInput, Typography) są zaimplementowane

**Cel Fazy II:**
- 🎯 Stworzenie professional design system z comprehensive tokens
- 🎯 Implementacja advanced UI components
- 🎯 Zapewnienie WCAG AA accessibility compliance
- 🎯 Zbudowanie robust testing infrastructure
- 🎯 Optymalizacja performance i developer experience

---

## **Sprint 1: Foundation - Design System & Tokens (Week 1-2)**

### **1.1. Design Tokens Implementation**

**📁 Lokalizacja:** `src/styles/design-tokens.ts`

```typescript
// Design Tokens - Complete System
export const designTokens = {
  // === SPACING SYSTEM (8px grid) ===
  spacing: {
    '0': '0px',
    '1': '4px',   // 0.25rem
    '2': '8px',   // 0.5rem  
    '3': '12px',  // 0.75rem
    '4': '16px',  // 1rem
    '5': '20px',  // 1.25rem
    '6': '24px',  // 1.5rem
    '8': '32px',  // 2rem
    '10': '40px', // 2.5rem
    '12': '48px', // 3rem
    '16': '64px', // 4rem
    '20': '80px', // 5rem
    '24': '96px'  // 6rem
  },

  // === TYPOGRAPHY SYSTEM ===
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      'xs': ['12px', '16px'],   // [size, line-height]
      'sm': ['14px', '20px'],
      'base': ['16px', '24px'],
      'lg': ['18px', '28px'],
      'xl': ['20px', '28px'],
      '2xl': ['24px', '32px'],
      '3xl': ['30px', '36px'],
      '4xl': ['36px', '40px'],
      '5xl': ['48px', '48px']
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em'
    }
  },

  // === BUSINESS COLORS ===
  colors: {
    // Brand Colors
    brand: {
      50: '#E6F7FF',
      100: '#BAE7FF', 
      500: '#1677FF',  // Primary
      600: '#0958D9',
      900: '#002766'
    },

    // Semantic Colors
    semantic: {
      success: { light: '#F6FFED', main: '#52C41A', dark: '#389E0D' },
      warning: { light: '#FFFBE6', main: '#FAAD14', dark: '#D48806' },
      error: { light: '#FFF2F0', main: '#FF4D4F', dark: '#CF1322' },
      info: { light: '#E6F7FF', main: '#1677FF', dark: '#0958D9' }
    },

    // Production Status Colors (Business Logic)
    production: {
      planning: { bg: '#F0F5FF', text: '#1677FF', border: '#ADC6FF' },
      design: { bg: '#F9F0FF', text: '#722ED1', border: '#D3ADF7' },
      approved: { bg: '#F6FFED', text: '#52C41A', border: '#B7EB8F' },
      cutting: { bg: '#FFF7E6', text: '#FA8C16', border: '#FFD591' },
      assembly: { bg: '#E6FFFB', text: '#13C2C2', border: '#87E8DE' },
      ready: { bg: '#F6FFED', text: '#52C41A', border: '#B7EB8F' },
      shipped: { bg: '#F5F5F5', text: '#8C8C8C', border: '#D9D9D9' }
    },

    // Priority Colors
    priority: {
      low: { bg: '#F6FFED', text: '#52C41A', icon: '🟢' },
      medium: { bg: '#FFFBE6', text: '#FAAD14', icon: '🟡' },
      high: { bg: '#FFF2E8', text: '#FA8C16', icon: '🟠' },
      urgent: { bg: '#FFF2F0', text: '#FF4D4F', icon: '🔴' }
    },

    // Neutral Grays
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E8E8E8', 
      300: '#D9D9D9',
      400: '#BFBFBF',
      500: '#8C8C8C',
      600: '#595959',
      700: '#434343',
      800: '#262626',
      900: '#141414'
    }
  },

  // === BORDERS & RADIUS ===
  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '6px',    // Ant Design default
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },

  // === SHADOWS ===
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // === Z-INDEX SCALE ===
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },

  // === BREAKPOINTS ===
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px', 
    lg: '992px',
    xl: '1200px',
    xxl: '1600px'
  }
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type SpacingToken = keyof typeof designTokens.spacing;
export type ColorToken = keyof typeof designTokens.colors;
```

### **1.2. CSS Custom Properties Integration**

**📁 Lokalizacja:** `src/styles/css-variables.css`

```css
:root {
  /* === SPACING === */
  --spacing-0: 0px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;

  /* === COLORS === */
  --color-brand-primary: #1677FF;
  --color-brand-primary-hover: #0958D9;
  
  /* Production Status */
  --color-status-planning: #1677FF;
  --color-status-design: #722ED1;
  --color-status-approved: #52C41A;
  --color-status-cutting: #FA8C16;
  --color-status-assembly: #13C2C2;
  --color-status-ready: #52C41A;
  --color-status-shipped: #8C8C8C;

  /* === TYPOGRAPHY === */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;

  /* === SHADOWS === */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Dark theme variables */
[data-theme="dark"] {
  --color-brand-primary: #4096FF;
  --color-background: #141414;
  --color-surface: #262626;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A6A6A6;
}
```

### **1.3. Theme Provider Setup**

**📁 Lokalizacja:** `src/components/providers/ThemeProvider.tsx`

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { designTokens } from '../../styles/design-tokens';

type ThemeMode = 'light' | 'dark';
type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
  tokens: typeof designTokens;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('fab-manage-theme') as ThemeMode;
    if (stored) return stored;
    
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' : 'light';
    return systemPreference || defaultTheme;
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('fab-manage-theme', newMode);
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Ant Design theme configuration
  const antdTheme = {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: designTokens.colors.brand[500],
      colorSuccess: designTokens.colors.semantic.success.main,
      colorWarning: designTokens.colors.semantic.warning.main,
      colorError: designTokens.colors.semantic.error.main,
      colorInfo: designTokens.colors.semantic.info.main,
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
      borderRadius: parseInt(designTokens.borderRadius.base),
    },
    components: {
      Button: {
        borderRadius: parseInt(designTokens.borderRadius.md),
      },
      Card: {
        borderRadius: parseInt(designTokens.borderRadius.lg),
      },
      Modal: {
        borderRadius: parseInt(designTokens.borderRadius.lg),
      }
    }
  };

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    tokens: designTokens
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
```

---

## **Sprint 2: Advanced UI Components (Week 3-4)**

### **2.1. Enhanced Form Components**

**📁 Lokalizacja:** `src/components/ui/AppForm.tsx`

```tsx
import React from 'react';
import { Form, FormProps } from 'antd';
import { z } from 'zod';
import { useForm } from 'antd/es/form/Form';

interface AppFormProps<T extends Record<string, any>> extends Omit<FormProps, 'onFinish'> {
  schema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  children: React.ReactNode;
  loading?: boolean;
}

export function AppForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  children,
  loading = false,
  ...formProps
}: AppFormProps<T>) {
  const [form] = useForm();

  const handleFinish = async (values: T) => {
    try {
      // Validate with Zod if schema provided
      const validatedData = schema ? schema.parse(values) : values;
      await onSubmit?.(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to Ant Design form errors
        const fieldErrors = error.errors.map(err => ({
          name: err.path,
          errors: [err.message]
        }));
        form.setFields(fieldErrors);
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      disabled={loading}
      {...formProps}
    >
      {children}
    </Form>
  );
}

// Form Field Wrapper with enhanced features
interface AppFormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  help?: string;
  tooltip?: string;
  children: React.ReactNode;
}

export const AppFormField: React.FC<AppFormFieldProps> = ({
  name,
  label,
  required,
  help,
  tooltip,
  children
}) => (
  <Form.Item
    name={name}
    label={label}
    required={required}
    help={help}
    tooltip={tooltip}
    rules={required ? [{ required: true, message: `${label} jest wymagane` }] : []}
  >
    {children}
  </Form.Item>
);
```

**📁 Lokalizacja:** `src/components/ui/AppSelect.tsx`

```tsx
import React, { useMemo } from 'react';
import { Select, SelectProps, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from '../../hooks/useDebounce';

interface AppSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

interface AppSelectProps extends Omit<SelectProps, 'options'> {
  options: AppSelectOption[];
  loading?: boolean;
  searchable?: boolean;
  grouped?: boolean;
  onSearch?: (value: string) => void;
  searchDelay?: number;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  options,
  loading = false,
  searchable = true,
  grouped = false,
  onSearch,
  searchDelay = 300,
  ...selectProps
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const debouncedSearchValue = useDebounce(searchValue, searchDelay);

  // Trigger search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearchValue && onSearch) {
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onSearch]);

  // Group options if needed
  const processedOptions = useMemo(() => {
    if (!grouped) return options;

    const groups = options.reduce((acc, option) => {
      const group = option.group || 'Other';
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {} as Record<string, AppSelectOption[]>);

    return Object.entries(groups).map(([label, options]) => ({
      label,
      options: options.map(opt => ({
        label: opt.label,
        value: opt.value,
        disabled: opt.disabled
      }))
    }));
  }, [options, grouped]);

  return (
    <Select
      showSearch={searchable}
      placeholder="Wybierz opcję..."
      optionFilterProp="label"
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      suffixIcon={searchable ? <SearchOutlined /> : undefined}
      notFoundContent={loading ? <Spin size="small" /> : 'Brak wyników'}
      onSearch={setSearchValue}
      options={processedOptions}
      {...selectProps}
    />
  );
};
```

### **2.2. Advanced Data Table**

**📁 Lokalizacja:** `src/components/ui/AppTable.tsx`

```tsx
import React, { useState, useMemo } from 'react';
import { Table, TableProps, Input, Button, Space, Dropdown, Checkbox } from 'antd';
import { SearchOutlined, SettingOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface AppTableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  fixed?: 'left' | 'right';
  hidden?: boolean;
}

interface AppTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: AppTableColumn<T>[];
  data: T[];
  searchable?: boolean;
  exportable?: boolean;
  columnManagement?: boolean;
  globalSearch?: boolean;
  onExport?: (data: T[]) => void;
}

export function AppTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  exportable = false,
  columnManagement = true,
  globalSearch = true,
  onExport,
  ...tableProps
}: AppTableProps<T>) {
  const [searchText, setSearchText] = useState('');
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  
  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!searchText || !globalSearch) return data;
    
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText, globalSearch]);

  // Process columns
  const processedColumns = useMemo(() => {
    return columns
      .filter(col => !hiddenColumns.has(col.key))
      .map(col => ({
        key: col.key,
        title: col.title,
        dataIndex: col.dataIndex,
        render: col.render,
        sorter: col.sortable ? (a: T, b: T) => {
          const aValue = col.dataIndex ? a[col.dataIndex] : '';
          const bValue = col.dataIndex ? b[col.dataIndex] : '';
          return String(aValue).localeCompare(String(bValue));
        } : undefined,
        width: col.width,
        fixed: col.fixed
      })) as ColumnsType<T>;
  }, [columns, hiddenColumns]);

  // Column visibility management
  const columnVisibilityItems = columns.map(col => ({
    key: col.key,
    label: (
      <Checkbox
        checked={!hiddenColumns.has(col.key)}
        onChange={(e) => {
          const newHidden = new Set(hiddenColumns);
          if (e.target.checked) {
            newHidden.delete(col.key);
          } else {
            newHidden.add(col.key);
          }
          setHiddenColumns(newHidden);
        }}
      >
        {col.title}
      </Checkbox>
    )
  }));

  const toolbar = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 16 
    }}>
      {searchable && (
        <Input
          placeholder="Szukaj w tabeli..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      )}
      
      <Space>
        {exportable && (
          <Button
            icon={<DownloadOutlined />}
            onClick={() => onExport?.(filteredData)}
          >
            Eksportuj
          </Button>
        )}
        
        {columnManagement && (
          <Dropdown 
            menu={{ items: columnVisibilityItems }}
            trigger={['click']}
          >
            <Button icon={<SettingOutlined />}>
              Kolumny
            </Button>
          </Dropdown>
        )}
      </Space>
    </div>
  );

  return (
    <div>
      {toolbar}
      <Table
        columns={processedColumns}
        dataSource={filteredData}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} z ${total} elementów`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </div>
  );
}
```

---

## **Sprint 3: Accessibility & Internationalization (Week 5-6)**

### **3.1. Accessibility System**

**📁 Lokalizacja:** `src/utils/a11y.ts`

```typescript
// Screen Reader Only utility
export const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0'
};

// Focus ring utility
export const focusRing = {
  '&:focus-visible': {
    outline: '2px solid var(--color-brand-primary)',
    outlineOffset: '2px',
    borderRadius: '4px'
  }
};

// Announce to screen readers
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = Object.entries(srOnly)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}: ${value}`)
    .join('; ');
  
  document.body.appendChild(announcer);
  announcer.textContent = message;
  
  setTimeout(() => document.body.removeChild(announcer), 1000);
};

// Keyboard navigation helpers
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => element.removeEventListener('keydown', handleKeyDown);
};
```

**📁 Lokalizacja:** `src/components/ui/SkipLink.tsx`

```tsx
import React from 'react';

interface SkipLinkProps {
  href: string;
  children: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => (
  <a
    href={href}
    style={{
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: 'var(--color-brand-primary)',
      color: 'white',
      padding: '8px',
      textDecoration: 'none',
      zIndex: 9999,
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 600
    }}
    onFocus={(e) => {
      e.currentTarget.style.top = '6px';
    }}
    onBlur={(e) => {
      e.currentTarget.style.top = '-40px';
    }}
  >
    {children}
  </a>
);

// Usage in App
export const AppWithSkipLinks: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <SkipLink href="#main-content">Przejdź do głównej treści</SkipLink>
    <SkipLink href="#navigation">Przejdź do nawigacji</SkipLink>
    {children}
  </>
);
```

### **3.2. Internationalization Setup**

**📁 Lokalizacja:** `src/i18n/index.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation namespaces
export const namespaces = [
  'common',
  'navigation', 
  'projects',
  'materials',
  'production',
  'errors'
] as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pl',
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace configuration
    ns: namespaces,
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    // Backend options
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;
```

**📁 Lokalizacja:** `public/locales/pl/common.json`

```json
{
  "actions": {
    "save": "Zapisz",
    "cancel": "Anuluj", 
    "delete": "Usuń",
    "edit": "Edytuj",
    "add": "Dodaj",
    "search": "Szukaj",
    "export": "Eksportuj",
    "import": "Importuj",
    "refresh": "Odśwież"
  },
  "status": {
    "loading": "Ładowanie...",
    "error": "Wystąpił błąd",
    "success": "Operacja zakończona pomyślnie",
    "noData": "Brak danych"
  },
  "fields": {
    "name": "Nazwa",
    "description": "Opis", 
    "date": "Data",
    "status": "Status",
    "priority": "Priorytet",
    "quantity": "Ilość",
    "price": "Cena"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "projects": "Projekty",
    "materials": "Materiały",
    "production": "Produkcja",
    "clients": "Klienci"
  }
}
```

**📁 Lokalizacja:** `src/hooks/useTranslation.ts`

```tsx
import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { namespaces } from '../i18n';

type Namespace = typeof namespaces[number];

// Enhanced translation hook with type safety
export const useTranslation = (namespace: Namespace = 'common') => {
  const { t, i18n } = useI18nTranslation(namespace);
  
  return {
    t,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    isLoading: i18n.isInitialized === false
  };
};

// Translation component for inline use
interface TProps {
  i18nKey: string;
  values?: Record<string, any>;
  components?: Record<string, React.ReactElement>;
}

export const T: React.FC<TProps> = ({ i18nKey, values, components }) => {
  const { t } = useTranslation();
  return <>{t(i18nKey, { ...values, ...components })}</>;
};
```

---

## **Sprint 4: Animation & Performance (Week 7-8)**

### **4.1. Animation System**

**📁 Lokalizacja:** `src/components/animations/FadeIn.tsx`

```tsx
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

const getDirectionOffset = (direction: FadeInProps['direction'], distance: number) => {
  switch (direction) {
    case 'up': return { y: distance };
    case 'down': return { y: -distance };
    case 'left': return { x: distance };
    case 'right': return { x: -distance };
    default: return {};
  }
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  stagger = false,
  staggerDelay = 0.1,
  ...props
}) => {
  const initialOffset = getDirectionOffset(direction, distance);
  
  const containerVariants = {
    hidden: { opacity: 0, ...initialOffset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        when: "beforeChildren",
        staggerChildren: stagger ? staggerDelay : 0,
        ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, ...initialOffset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: duration * 0.8 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {stagger ? (
        React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={childVariants}>
            {child}
          </motion.div>
        ))
      ) : children}
    </motion.div>
  );
};
```

**📁 Lokalizacja:** `src/utils/animation-presets.ts`

```typescript
import type { Variants } from 'framer-motion';

// Common animation presets
export const animations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },

  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    whileHover: { x: 4 },
    whileTap: { scale: 0.98 }
  },

  // Card hover effects
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -4,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  },

  // Loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Success/Error feedback
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }
} as const;

// Stagger variants for lists
export const staggerVariants: Variants = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  item: animations.listItem
};
```

### **4.2. Performance Optimizations**

**📁 Lokalizacja:** `src/components/ui/VirtualizedList.tsx`

```tsx
import React, { useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Empty } from 'antd';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  width?: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  width = '100%',
  renderItem,
  emptyMessage = 'Brak elementów',
  overscan = 5
}: VirtualizedListProps<T>) {
  
  const ItemRenderer = React.memo(({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    return (
      <div style={style}>
        {renderItem(item, index)}
      </div>
    );
  });

  if (!items.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description={emptyMessage} />
      </div>
    );
  }

  return (
    <List
      height={height}
      width={width}
      itemCount={items.length}
      itemSize={itemHeight}
      overscanCount={overscan}
    >
      {ItemRenderer}
    </List>
  );
}
```

**📁 Lokalizacja:** `src/hooks/useVirtualizedData.ts`

```tsx
import { useState, useMemo, useCallback } from 'react';

interface UseVirtualizedDataOptions<T> {
  items: T[];
  pageSize?: number;
  searchTerm?: string;
  searchFields?: (keyof T)[];
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}

export function useVirtualizedData<T extends Record<string, any>>({
  items,
  pageSize = 50,
  searchTerm = '',
  searchFields = [],
  sortBy,
  sortOrder = 'asc'
}: UseVirtualizedDataOptions<T>) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: pageSize });

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm || !searchFields.length) return items;
    
    return items.filter(item =>
      searchFields.some(field =>
        String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm, searchFields]);

  // Sort items
  const sortedItems = useMemo(() => {
    if (!sortBy) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredItems, sortBy, sortOrder]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return sortedItems.slice(visibleRange.start, visibleRange.end);
  }, [sortedItems, visibleRange]);

  const loadMore = useCallback(() => {
    setVisibleRange(prev => ({
      start: prev.start,
      end: Math.min(prev.end + pageSize, sortedItems.length)
    }));
  }, [pageSize, sortedItems.length]);

  const hasMore = visibleRange.end < sortedItems.length;

  return {
    items: visibleItems,
    totalCount: sortedItems.length,
    filteredCount: filteredItems.length,
    hasMore,
    loadMore,
    setVisibleRange
  };
}
```

---

## **Sprint 5: Testing & Quality Assurance (Week 9-10)**

### **5.1. Testing Infrastructure**

**📁 Lokalizacja:** `src/test-utils/test-providers.tsx`

```tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Test query client with disabled retries
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

interface TestProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const TestProvider: React.FC<TestProviderProps> = ({ 
  children, 
  queryClient = createTestQueryClient() 
}) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: RenderOptions & { queryClient?: QueryClient }
) => {
  const { queryClient, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProvider queryClient={queryClient}>{children}</TestProvider>
    ),
    ...renderOptions
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
```

**📁 Lokalizacja:** `tests/component-tests/AppButton.test.tsx`

```tsx
import { render, screen, fireEvent } from '../../src/test-utils/test-providers';
import { AppButton } from '../../src/components/ui/AppButton';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('AppButton', () => {
  it('renders correctly with default props', () => {
    render(<AppButton>Test Button</AppButton>);
    
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<AppButton onClick={handleClick}>Click me</AppButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<AppButton variant="primary">Primary</AppButton>);
    expect(screen.getByRole('button')).toHaveClass('ant-btn-primary');
    
    rerender(<AppButton variant="ghost">Ghost</AppButton>);
    expect(screen.getByRole('button')).toHaveClass('ant-btn-background-ghost');
  });

  it('shows loading state correctly', () => {
    render(<AppButton loading>Loading</AppButton>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('ant-btn-loading');
  });

  it('meets accessibility requirements', async () => {
    const { container } = render(<AppButton>Accessible Button</AppButton>);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<AppButton onClick={handleClick}>Keyboard Button</AppButton>);
    
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('handles different sizes correctly', () => {
    const { rerender } = render(<AppButton size="large">Large</AppButton>);
    expect(screen.getByRole('button')).toHaveClass('ant-btn-lg');
    
    rerender(<AppButton size="small">Small</AppButton>);
    expect(screen.getByRole('button')).toHaveClass('ant-btn-sm');
  });
});
```

**📁 Lokalizacja:** `tests/e2e/ui-components.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('UI Components - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/storybook');
  });

  test('AppButton variants', async ({ page }) => {
    await page.goto('/storybook?path=/story/ui-appbutton--all-variants');
    
    // Wait for all buttons to be visible
    await page.waitForSelector('[data-testid="button-variants"]');
    
    // Take screenshot of all button variants
    await expect(page.locator('[data-testid="button-variants"]'))
      .toHaveScreenshot('button-variants.png');
  });

  test('AppTable with data', async ({ page }) => {
    await page.goto('/storybook?path=/story/ui-apptable--with-data');
    
    // Wait for table to load
    await page.waitForSelector('.ant-table-tbody tr');
    
    // Test sorting
    await page.click('[data-testid="table-header-name"]');
    await page.waitForTimeout(500);
    
    // Test search
    await page.fill('[data-testid="table-search"]', 'test');
    await page.waitForTimeout(500);
    
    // Screenshot of table with search
    await expect(page.locator('[data-testid="app-table"]'))
      .toHaveScreenshot('table-with-search.png');
  });

  test('Theme switching', async ({ page }) => {
    await page.goto('/');
    
    // Light theme screenshot
    await expect(page.locator('main')).toHaveScreenshot('light-theme.png');
    
    // Switch to dark theme
    await page.click('[data-testid="theme-switcher"]');
    await page.waitForTimeout(500);
    
    // Dark theme screenshot
    await expect(page.locator('main')).toHaveScreenshot('dark-theme.png');
  });
});

test.describe('Accessibility Tests', () => {
  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/projects');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'skip-link');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveClass(/navigation-item/);
    
    // Enter key should activate focused element
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/projects\/new/);
  });

  test('screen reader announcements', async ({ page }) => {
    await page.goto('/projects');
    
    // Create new project to trigger announcement
    await page.click('[data-testid="new-project-button"]');
    
    // Check for aria-live region update
    await expect(page.locator('[aria-live="polite"]'))
      .toHaveText('Otwarto formularz nowego projektu');
  });
});
```

### **5.2. Performance Testing**

**📁 Lokalizacja:** `tests/performance/bundle-size.test.ts`

```typescript
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Bundle Size Tests', () => {
  const BUNDLE_SIZE_LIMITS = {
    'main': 500, // KB
    'vendor': 1000, // KB
    'total': 1500 // KB
  };

  beforeAll(() => {
    // Build the application
    execSync('npm run build', { stdio: 'inherit' });
  });

  test('bundle sizes are within limits', () => {
    const distPath = path.join(process.cwd(), 'dist');
    const statsPath = path.join(distPath, 'stats.json');
    
    if (!fs.existsSync(statsPath)) {
      throw new Error('Stats file not found. Ensure build generates stats.json');
    }

    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
    const assets = stats.assets;

    const mainBundle = assets.find((asset: any) => asset.name.includes('main'));
    const vendorBundle = assets.find((asset: any) => asset.name.includes('vendor'));
    
    const mainSize = Math.round(mainBundle.size / 1024);
    const vendorSize = Math.round(vendorBundle.size / 1024);
    const totalSize = mainSize + vendorSize;

    expect(mainSize).toBeLessThanOrEqual(BUNDLE_SIZE_LIMITS.main);
    expect(vendorSize).toBeLessThanOrEqual(BUNDLE_SIZE_LIMITS.vendor);
    expect(totalSize).toBeLessThanOrEqual(BUNDLE_SIZE_LIMITS.total);

    console.log(`Bundle sizes: Main: ${mainSize}KB, Vendor: ${vendorSize}KB, Total: ${totalSize}KB`);
  });

  test('no duplicate dependencies', () => {
    const packageLock = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package-lock.json'), 'utf-8')
    );
    
    const duplicates = findDuplicateDependencies(packageLock);
    
    expect(duplicates).toEqual([]);
  });
});

function findDuplicateDependencies(packageLock: any): string[] {
  const packages: Record<string, string[]> = {};
  
  function traverse(deps: any, path: string = '') {
    if (!deps) return;
    
    Object.entries(deps).forEach(([name, info]: [string, any]) => {
      if (!packages[name]) packages[name] = [];
      packages[name].push(`${path}/${name}@${info.version}`);
      
      if (info.dependencies) {
        traverse(info.dependencies, `${path}/${name}`);
      }
    });
  }
  
  traverse(packageLock.packages);
  
  return Object.entries(packages)
    .filter(([_, versions]) => new Set(versions.map(v => v.split('@').pop())).size > 1)
    .map(([name]) => name);
}
```

---

## **Sprint 6: Developer Experience Tools (Week 11-12)**

### **6.1. Storybook Configuration**

**📁 Lokalizacja:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-design-tokens',
    '@storybook/addon-interactions',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  viteFinal: async (config) => {
    // Ensure design tokens are available
    config.define = {
      ...config.define,
      __DESIGN_TOKENS__: JSON.stringify(require('../src/styles/design-tokens'))
    };
    
    return config;
  }
};

export default config;
```

**📁 Lokalizacja:** `.storybook/preview.tsx`

```typescript
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/components/providers/ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import '../src/styles/css-variables.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#141414' },
        { name: 'gray', value: '#f5f5f5' }
      ]
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } }
      }
    }
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <div style={{ padding: '20px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </I18nextProvider>
    )
  ]
};

export default preview;
```

**📁 Lokalizacja:** `src/components/ui/AppButton.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AppButton } from './AppButton';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  DownloadOutlined 
} from '@ant-design/icons';

const meta: Meta<typeof AppButton> = {
  title: 'UI/AppButton',
  component: AppButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced button component based on Ant Design Button with consistent theming and accessibility features.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'default', 'dashed', 'text', 'link'],
      description: 'Button style variant'
    },
    size: {
      control: 'select', 
      options: ['small', 'middle', 'large'],
      description: 'Button size'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction'
    }
  },
  args: {
    onClick: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Button'
  }
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <PlusOutlined />,
    children: 'Add Item'
  }
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...'
  }
};

export const AllVariants: Story = {
  render: () => (
    <div data-testid="button-variants" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <AppButton variant="primary">Primary</AppButton>
      <AppButton variant="default">Default</AppButton>
      <AppButton variant="dashed">Dashed</AppButton>
      <AppButton variant="text">Text</AppButton>
      <AppButton variant="link">Link</AppButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants displayed together.'
      }
    }
  }
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <AppButton size="small">Small</AppButton>
      <AppButton size="middle">Middle</AppButton>
      <AppButton size="large">Large</AppButton>
    </div>
  )
};

export const ActionButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <AppButton variant="primary" icon={<PlusOutlined />}>
        Add
      </AppButton>
      <AppButton icon={<EditOutlined />}>
        Edit
      </AppButton>
      <AppButton icon={<DownloadOutlined />}>
        Export
      </AppButton>
      <AppButton 
        variant="text" 
        icon={<DeleteOutlined />}
        style={{ color: 'var(--color-error-main)' }}
      >
        Delete
      </AppButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common action buttons used throughout the application.'
      }
    }
  }
};
```

### **6.2. Development Tools**

**📁 Lokalizacja:** `src/dev-tools/ComponentDevTools.tsx`

```tsx
import React, { useState } from 'react';
import { Drawer, Tabs, Tree, Typography, Space, Switch, Button } from 'antd';
import { BugOutlined } from '@ant-design/icons';

interface ComponentDevToolsProps {
  children: React.ReactNode;
}

export const ComponentDevTools: React.FC<ComponentDevToolsProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  const componentTree = [
    {
      title: 'App',
      key: 'app',
      children: [
        { title: 'ThemeProvider', key: 'theme-provider' },
        { title: 'BrowserRouter', key: 'router' },
        { title: 'QueryClient', key: 'query-client' }
      ]
    }
  ];

  const performanceMetrics = [
    { name: 'Bundle Size', value: '1.2MB', status: 'warning' },
    { name: 'First Paint', value: '850ms', status: 'good' },
    { name: 'Components', value: '47', status: 'info' },
    { name: 'Memory Usage', value: '23MB', status: 'good' }
  ];

  return (
    <>
      {/* Floating debug button */}
      <Button
        type="primary"
        shape="circle"
        icon={<BugOutlined />}
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      />

      <Drawer
        title="Component Dev Tools"
        placement="right"
        width={400}
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Tabs
          items={[
            {
              key: 'tree',
              label: 'Component Tree',
              children: (
                <Tree
                  treeData={componentTree}
                  defaultExpandAll
                  onSelect={(keys) => console.log('Selected:', keys)}
                />
              )
            },
            {
              key: 'performance',
              label: 'Performance',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {performanceMetrics.map(metric => (
                    <div key={metric.name} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#f5f5f5',
                      borderRadius: '6px'
                    }}>
                      <Typography.Text>{metric.name}</Typography.Text>
                      <Typography.Text strong>{metric.value}</Typography.Text>
                    </div>
                  ))}
                  <Button onClick={() => console.log('Performance analysis triggered')}>
                    Analyze Performance
                  </Button>
                </Space>
              )
            },
            {
              key: 'accessibility',
              label: 'A11y',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Text>Highlight Focus</Typography.Text>
                    <Switch 
                      checked={highlightMode}
                      onChange={setHighlightMode}
                    />
                  </div>
                  <Button onClick={() => console.log('Running a11y audit...')}>
                    Run A11y Audit
                  </Button>
                  <Typography.Text type="secondary">
                    Last audit: All checks passed ✅
                  </Typography.Text>
                </Space>
              )
            }
          ]}
        />
      </Drawer>

      <div className={highlightMode ? 'highlight-focus-mode' : ''}>
        {children}
      </div>
    </>
  );
};
```

---

## **Implementation Timeline & Quality Gates**

### **Quality Checkpoints**

**Week 2: Foundation Review**
- [ ] Design tokens implemented and tested
- [ ] CSS custom properties working
- [ ] Theme provider with dark mode functional
- [ ] No TypeScript errors
- [ ] Bundle size impact analyzed

**Week 4: Components Review**
- [ ] All advanced components implemented
- [ ] Storybook stories created for each component
- [ ] Unit tests written (>80% coverage)
- [ ] Visual regression tests passing
- [ ] Accessibility audit clean

**Week 6: A11y & i18n Review**
- [ ] WCAG AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility confirmed
- [ ] Multiple language files created
- [ ] Translation system working

**Week 8: Performance Review**  
- [ ] Animation performance optimized
- [ ] Bundle size within targets
- [ ] Virtualization working for large datasets
- [ ] Memory leaks checked
- [ ] Core Web Vitals metrics good

**Week 10: Testing Review**
- [ ] Test coverage >85%
- [ ] E2E tests covering critical paths
- [ ] Visual regression baseline established
- [ ] Performance benchmarks set
- [ ] CI/CD pipeline updated

**Week 12: Final Review**
- [ ] Developer tools functional
- [ ] Documentation complete
- [ ] Migration guide created
- [ ] Team training completed
- [ ] Production readiness verified

---

## **Deployment & Rollout Strategy**

### **Feature Flags Implementation**

```typescript
// Feature flag system
export const featureFlags = {
  ADVANCED_COMPONENTS: process.env.VITE_FF_ADVANCED_COMPONENTS === 'true',
  DARK_MODE: process.env.VITE_FF_DARK_MODE === 'true',
  ANIMATIONS: process.env.VITE_FF_ANIMATIONS === 'true',
  I18N: process.env.VITE_FF_I18N === 'true'
} as const;
```

### **Gradual Rollout Plan**

**Phase A (Week 13):** Internal testing
- Deploy to staging with feature flags off
- Team testing and feedback collection
- Performance monitoring setup

**Phase B (Week 14):** Beta rollout  
- Enable for 20% of users
- Monitor error rates and performance
- Collect user feedback

**Phase C (Week 15):** Full deployment
- Enable for all users
- Monitor adoption metrics
- Support team training

---

## **Success Metrics**

**Developer Experience:**
- 🎯 Component creation time: -60%
- 🎯 UI consistency score: >95%
- 🎯 Developer satisfaction: >8/10

**Performance:**
- 🎯 Bundle size increase: <20%
- 🎯 First Paint: <1s
- 🎯 Core Web Vitals: All green

**Quality:**
- 🎯 A11y compliance: WCAG AA
- 🎯 Test coverage: >85%
- 🎯 Bug reports: -40%

**Business Impact:**
- 🎯 Feature delivery speed: +50%
- 🎯 Design system adoption: >90%
- 🎯 Cross-team consistency: >95%

---

## **Wnioski**

Ten dokument przedstawia complete roadmap dla implementacji enterprise-grade UI system w aplikacji FabManage. Każdy sprint ma clearly defined deliverables, quality gates i success metrics, zapewniając structured approach do budowy scalable i maintainable UI foundation.

**Kluczowe korzyści:**
- **Professional Design System** z comprehensive tokens
- **Advanced Component Library** z accessibility built-in  
- **Developer-Friendly Tools** dla productivity
- **Performance Optimizations** dla scale
- **Quality Assurance** przez comprehensive testing

Ta implementacja stworzy solid foundation dla long-term success aplikacji FabManage.