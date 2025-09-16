import { z } from 'zod'

// Helper schemas
const NonEmptyString = z.string().min(1, 'To pole jest wymagane')
const PositiveNumber = z.number().positive('Wartość musi być większa od 0')
const NonNegativeNumber = z.number().nonnegative('Wartość nie może być ujemna')
const Email = z.string().email('Nieprawidłowy format email')
const Phone = z.string().regex(/^[+]?[0-9\-\s()]{7,}$/, 'Nieprawidłowy format telefonu')
const NIP = z.string().regex(/^[0-9]{10}$/, 'NIP musi składać się z 10 cyfr')
const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi być w formacie YYYY-MM-DD')
const OptionalDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi być w formacie YYYY-MM-DD').optional()

// BOM Item Schema
export const BomItemSchema = z.object({
    id: z.string(),
    type: z.enum(['Materiał surowy', 'Komponent gotowy', 'Usługa']),
    name: NonEmptyString,
    quantity: PositiveNumber,
    unit: NonEmptyString,
    supplier: z.string().optional(),
    status: z.enum(['Na stanie', 'Do zamówienia', 'Zamówione']).optional(),
    unitCost: NonNegativeNumber.optional(),
    materialId: z.string().optional()
})

// Enhanced Tile Schema with all redesign fields
export const TileSchema = z.object({
    id: z.string(),
    name: NonEmptyString,
    status: z.enum([
        'W KOLEJCE', 'W TRAKCIE CIĘCIA', 'WYCIĘTE',
        'Projektowanie', 'W trakcie projektowania', 'Do akceptacji',
        'Zaakceptowane', 'Wymagają poprawek', 'Gotowy do montażu',
        'Wstrzymany', 'Zakończony', 'W produkcji CNC'
    ]),
    project: z.string().optional(),
    moduł_nadrzędny: z.string().optional(),
    opis: z.string().optional(),
    link_model_3d: z.string().url('Nieprawidłowy format URL').optional().or(z.literal('')),
    speckle_object_ids: z.array(z.string()).optional(),
    załączniki: z.array(z.string()).optional(),
    przypisany_projektant: z.string().optional(),
    termin: OptionalDateString,
    priority: z.enum(['Wysoki', 'Średni', 'Niski']).optional(),
    technology: z.string().optional(),
    bom: z.array(BomItemSchema).optional(),
    laborCost: NonNegativeNumber.optional(),
    assignee: z.string().optional(), // deprecated, use przypisany_projektant
    dxfFile: z.string().nullable().optional(),
    assemblyDrawing: z.string().nullable().optional(),
    group: z.string().optional()
})

// Enhanced Project Schema
export const ProjectSchema = z.object({
    id: z.string(),
    numer: z.string().optional(),
    name: NonEmptyString,
    typ: z.string().optional(),
    lokalizacja: z.string().optional(),
    clientId: z.string().optional(),
    client: NonEmptyString,
    status: z.enum(['Nowy', 'W realizacji', 'Wstrzymany', 'Zakończony']),
    data_utworzenia: DateString.optional(),
    deadline: OptionalDateString,
    postep: z.number().min(0).max(100, 'Postęp nie może przekraczać 100%').optional(),
    budget: NonNegativeNumber.optional(),
    manager: z.string().optional(),
    manager_id: z.string().optional(),
    description: z.string().optional(),
    miniatura: z.string().optional(),
    repozytorium_plikow: z.string().optional(),
    link_model_3d: z.string().url('Nieprawidłowy format URL').optional().or(z.literal('')),
    progress: z.number().min(0).max(100).optional(),
    groups: z.array(z.object({
        id: z.string(),
        name: NonEmptyString,
        description: z.string().optional(),
        thumbnail: z.string().optional(),
        files: z.array(z.object({
            id: z.string(),
            name: NonEmptyString,
            url: z.string().url(),
            type: z.string()
        })).optional()
    })).optional(),
    modules: z.array(z.enum([
        'projektowanie', 'produkcja', 'logistyka',
        'koncepcja', 'wycena', 'zakwaterowanie'
    ])).optional()
})

// Client Schema
export const ClientSchema = z.object({
    id: z.string(),
    companyName: NonEmptyString,
    nip: NIP,
    regon: z.string().optional(),
    address: z.object({
        street: NonEmptyString,
        houseNumber: NonEmptyString,
        apartmentNumber: z.string().optional(),
        city: NonEmptyString,
        postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie XX-XXX')
    }),
    website: z.string().url('Nieprawidłowy format URL').optional().or(z.literal('')),
    email: Email.optional(),
    description: z.string().optional(),
    contacts: z.array(z.object({
        imie: NonEmptyString,
        nazwisko: NonEmptyString,
        adres_email: Email,
        telefon_kontaktowy: Phone,
        opis: z.string().optional()
    })).optional(),
    files: z.array(z.any()).optional(),
    additionalInfo: z.string().optional(),
    cardColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Kolor musi być w formacie hex (#RRGGBB)').optional()
})

// Material Schema
export const MaterialSchema = z.object({
    id: z.string(),
    code: z.string().optional(),
    name: NonEmptyString,
    category: z.array(z.string()),
    unit: NonEmptyString,
    price: NonNegativeNumber,
    stock: NonNegativeNumber,
    minStock: NonNegativeNumber.optional(),
    maxStock: NonNegativeNumber.optional(),
    supplier: z.string().optional(),
    location: z.string().optional()
})

// User Schema
export const UserSchema = z.object({
    id: z.string(),
    name: NonEmptyString,
    email: Email,
    role: z.enum(['admin', 'designer', 'manager', 'operator', 'viewer']),
    avatar: z.string().url().optional(),
    isActive: z.boolean().default(true)
})

// Form schemas for validation
export const CreateProjectFormSchema = ProjectSchema.omit({
    id: true,
    numer: true,
    data_utworzenia: true,
    progress: true,
    postep: true
}).extend({
    deadline: DateString // Make deadline required for new projects
})

export const UpdateProjectFormSchema = CreateProjectFormSchema.partial().extend({
    id: z.string()
})

export const CreateTileFormSchema = TileSchema.omit({
    id: true,
    status: true,
    assignee: true
}).extend({
    name: NonEmptyString
})

export const UpdateTileFormSchema = CreateTileFormSchema.partial().extend({
    id: z.string()
})

export const CreateClientFormSchema = ClientSchema.omit({
    id: true,
    cardColor: true
})

export const UpdateClientFormSchema = CreateClientFormSchema.partial().extend({
    id: z.string()
})

export const CreateMaterialFormSchema = MaterialSchema.omit({
    id: true,
    code: true
})

export const UpdateMaterialFormSchema = CreateMaterialFormSchema.partial().extend({
    id: z.string()
})

// Login/Auth schemas
export const LoginFormSchema = z.object({
    email: Email,
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków')
})

export const RegisterFormSchema = LoginFormSchema.extend({
    name: NonEmptyString,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword']
})

// Search/Filter schemas
export const ProjectFiltersSchema = z.object({
    status: ProjectSchema.shape.status.optional(),
    client: z.string().optional(),
    manager: z.string().optional(),
    dateFrom: OptionalDateString,
    dateTo: OptionalDateString,
    budgetMin: NonNegativeNumber.optional(),
    budgetMax: NonNegativeNumber.optional(),
    search: z.string().optional()
})

export const TileFiltersSchema = z.object({
    status: TileSchema.shape.status.optional(),
    project: z.string().optional(),
    designer: z.string().optional(),
    priority: TileSchema.shape.priority.optional(),
    search: z.string().optional()
})

// Type exports
export type BomItem = z.infer<typeof BomItemSchema>
export type Tile = z.infer<typeof TileSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Client = z.infer<typeof ClientSchema>
export type Material = z.infer<typeof MaterialSchema>
export type User = z.infer<typeof UserSchema>

export type CreateProjectForm = z.infer<typeof CreateProjectFormSchema>
export type UpdateProjectForm = z.infer<typeof UpdateProjectFormSchema>
export type CreateTileForm = z.infer<typeof CreateTileFormSchema>
export type UpdateTileForm = z.infer<typeof UpdateTileFormSchema>
export type CreateClientForm = z.infer<typeof CreateClientFormSchema>
export type UpdateClientForm = z.infer<typeof UpdateClientFormSchema>
export type CreateMaterialForm = z.infer<typeof CreateMaterialFormSchema>
export type UpdateMaterialForm = z.infer<typeof UpdateMaterialFormSchema>

export type LoginForm = z.infer<typeof LoginFormSchema>
export type RegisterForm = z.infer<typeof RegisterFormSchema>
export type ProjectFilters = z.infer<typeof ProjectFiltersSchema>
export type TileFilters = z.infer<typeof TileFiltersSchema>

// Legacy exports for backward compatibility
export type TileInput = z.input<typeof TileSchema>
export type TileOutput = z.output<typeof TileSchema>
export type ProjectInput = z.input<typeof ProjectSchema>
export type ProjectOutput = z.output<typeof ProjectSchema>

// Enhanced validation patterns and utilities
export const ValidationPatterns = {
  // Common regex patterns
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[0-9\-\s()]{7,}$/,
  nip: /^[0-9]{10}$/,
  postalCode: /^\d{2}-\d{3}$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  url: /^https?:\/\/.+/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  
  // Polish specific patterns
  polishPhone: /^(\+48\s?)?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}$/,
  polishPostalCode: /^\d{2}-\d{3}$/,
  
  // File patterns
  imageUrl: /\.(jpg|jpeg|png|gif|webp)$/i,
  documentUrl: /\.(pdf|doc|docx|xls|xlsx)$/i,
  cadFile: /\.(dwg|dxf|step|stp|iges|igs)$/i,
  
  // Business patterns
  projectNumber: /^[A-Z]{2,4}-\d{4,6}$/,
  materialCode: /^[A-Z]{2,3}\d{3,6}$/,
  tileId: /^tile-\d{8,}$/,
}

// Enhanced validation messages
export const ValidationMessages = {
  required: (field: string) => `${field} jest wymagane`,
  minLength: (field: string, min: number) => `${field} musi mieć co najmniej ${min} znaków`,
  maxLength: (field: string, max: number) => `${field} nie może mieć więcej niż ${max} znaków`,
  min: (field: string, min: number) => `${field} musi być większe lub równe ${min}`,
  max: (field: string, max: number) => `${field} nie może być większe niż ${max}`,
  positive: (field: string) => `${field} musi być większe od 0`,
  nonNegative: (field: string) => `${field} nie może być ujemne`,
  email: 'Nieprawidłowy format email',
  phone: 'Nieprawidłowy format telefonu',
  nip: 'NIP musi składać się z 10 cyfr',
  postalCode: 'Kod pocztowy musi być w formacie XX-XXX',
  hexColor: 'Kolor musi być w formacie hex (#RRGGBB)',
  url: 'Nieprawidłowy format URL',
  date: 'Data musi być w formacie YYYY-MM-DD',
  projectNumber: 'Numer projektu musi być w formacie XX-XXXX',
  materialCode: 'Kod materiału musi być w formacie XX-XXXX',
  tileId: 'ID kafelka musi być w formacie tile-XXXXXXXX',
  
  // Custom business messages
  budgetExceeded: 'Budżet został przekroczony',
  deadlinePassed: 'Termin już minął',
  invalidStatusTransition: 'Nieprawidłowa zmiana statusu',
  duplicateEntry: 'Taki wpis już istnieje',
  fileTooLarge: 'Plik jest za duży',
  unsupportedFileType: 'Nieobsługiwany typ pliku',
}

// Validation rule builders
export const ValidationRules = {
  required: (field: string) => ({
    required: true,
    message: ValidationMessages.required(field)
  }),
  
  minLength: (field: string, min: number) => ({
    min: min,
    message: ValidationMessages.minLength(field, min)
  }),
  
  maxLength: (field: string, max: number) => ({
    max: max,
    message: ValidationMessages.maxLength(field, max)
  }),
  
  min: (field: string, min: number) => ({
    type: 'number' as const,
    min: min,
    message: ValidationMessages.min(field, min)
  }),
  
  max: (field: string, max: number) => ({
    type: 'number' as const,
    max: max,
    message: ValidationMessages.max(field, max)
  }),
  
  email: () => ({
    type: 'email' as const,
    message: ValidationMessages.email
  }),
  
  phone: () => ({
    pattern: ValidationPatterns.phone,
    message: ValidationMessages.phone
  }),
  
  nip: () => ({
    pattern: ValidationPatterns.nip,
    message: ValidationMessages.nip
  }),
  
  postalCode: () => ({
    pattern: ValidationPatterns.postalCode,
    message: ValidationMessages.postalCode
  }),
  
  url: () => ({
    type: 'url' as const,
    message: ValidationMessages.url
  }),
  
  date: () => ({
    pattern: ValidationPatterns.date,
    message: ValidationMessages.date
  }),
  
  custom: (validator: (value: any) => boolean, message: string) => ({
    validator: (_: any, value: any) => {
      if (!value || validator(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    }
  }),
  
  // Business specific validators
  budgetNotExceeded: (maxBudget: number) => ({
    validator: (_: any, value: any) => {
      if (!value || value <= maxBudget) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(ValidationMessages.budgetExceeded))
    }
  }),
  
  futureDate: (field: string) => ({
    validator: (_: any, value: any) => {
      if (!value) return Promise.resolve()
      const date = new Date(value)
      const now = new Date()
      if (date > now) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(`${field} musi być w przyszłości`))
    }
  }),
  
  pastDate: (field: string) => ({
    validator: (_: any, value: any) => {
      if (!value) return Promise.resolve()
      const date = new Date(value)
      const now = new Date()
      if (date < now) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(`${field} musi być w przeszłości`))
    }
  }),
}

// Form validation utilities
export const FormValidation = {
  // Validate form data against schema
  validateForm: <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } => {
    try {
      const validatedData = schema.parse(data)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error }
      }
      throw error
    }
  },
  
  // Convert Zod errors to Ant Design form errors
  zodToAntdErrors: (zodError: z.ZodError) => {
    return zodError.errors.map(err => ({
      name: err.path,
      errors: [err.message]
    }))
  },
  
  // Validate single field
  validateField: <T>(schema: z.ZodSchema<T>, fieldName: string, value: any) => {
    try {
      if ('shape' in schema && schema.shape && typeof schema.shape === 'object' && fieldName in schema.shape) {
        const fieldSchema = (schema.shape as any)[fieldName]
        if (fieldSchema) {
          fieldSchema.parse(value)
          return { success: true }
        }
      }
      return { success: false, error: 'Field not found in schema' }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors[0]?.message || 'Validation error' }
      }
      return { success: false, error: 'Unknown validation error' }
    }
  },
  
  // Create validation rules for Ant Design form
  createRules: (fieldName: string, schema: z.ZodSchema<any>) => {
    if (!('shape' in schema) || !schema.shape || typeof schema.shape !== 'object' || !(fieldName in schema.shape)) return []
    const fieldSchema = (schema.shape as any)[fieldName]
    if (!fieldSchema) return []
    
    const rules: any[] = []
    
    // Required rule
    if (fieldSchema._def.typeName === 'ZodString' && fieldSchema._def.checks?.some((c: any) => c.kind === 'min' && c.value === 1)) {
      rules.push(ValidationRules.required(fieldName))
    }
    
    // Min length rule
    const minLengthCheck = fieldSchema._def.checks?.find((c: any) => c.kind === 'min')
    if (minLengthCheck) {
      rules.push(ValidationRules.minLength(fieldName, minLengthCheck.value))
    }
    
    // Max length rule
    const maxLengthCheck = fieldSchema._def.checks?.find((c: any) => c.kind === 'max')
    if (maxLengthCheck) {
      rules.push(ValidationRules.maxLength(fieldName, maxLengthCheck.value))
    }
    
    // Email rule
    if (fieldSchema._def.typeName === 'ZodString' && fieldSchema._def.checks?.some((c: any) => c.kind === 'email')) {
      rules.push(ValidationRules.email())
    }
    
    // URL rule
    if (fieldSchema._def.typeName === 'ZodString' && fieldSchema._def.checks?.some((c: any) => c.kind === 'url')) {
      rules.push(ValidationRules.url())
    }
    
    return rules
  }
}

// Status validation helpers
export const StatusValidation = {
  // Validate status transitions
  isValidTransition: (from: string, to: string, allowedTransitions: Record<string, string[]>) => {
    return allowedTransitions[from]?.includes(to) || false
  },
  
  // Get valid next statuses
  getValidNextStatuses: (currentStatus: string, allowedTransitions: Record<string, string[]>) => {
    return allowedTransitions[currentStatus] || []
  },
  
  // Common status transition rules
  tileStatusTransitions: {
    'W KOLEJCE': ['Projektowanie', 'Wstrzymany'],
    'Projektowanie': ['W trakcie projektowania', 'Wstrzymany'],
    'W trakcie projektowania': ['Do akceptacji', 'Wstrzymany'],
    'Do akceptacji': ['Zaakceptowane', 'Wymagają poprawek'],
    'Zaakceptowane': ['W TRAKCIE CIĘCIA', 'Wstrzymany'],
    'W TRAKCIE CIĘCIA': ['WYCIĘTE', 'Wstrzymany'],
    'WYCIĘTE': ['Gotowy do montażu', 'Wstrzymany'],
    'Wstrzymany': ['W KOLEJCE', 'Projektowanie', 'W trakcie projektowania', 'Do akceptacji', 'Zaakceptowane', 'W TRAKCIE CIĘCIA', 'WYCIĘTE'],
    'Wymagają poprawek': ['Projektowanie', 'W trakcie projektowania'],
    'Gotowy do montażu': ['Zakończony'],
    'Zakończony': []
  },
  
  projectStatusTransitions: {
    'Nowy': ['W realizacji', 'Wstrzymany', 'Anulowany'],
    'W realizacji': ['Wstrzymany', 'Zakończony', 'Anulowany'],
    'Wstrzymany': ['W realizacji', 'Anulowany'],
    'Zakończony': [],
    'Anulowany': []
  }
}

// File validation helpers
export const FileValidation = {
  // Validate file size
  validateFileSize: (file: File, maxSizeMB: number) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  },
  
  // Validate file type
  validateFileType: (file: File, allowedTypes: string[]) => {
    return allowedTypes.some(type => file.type.includes(type))
  },
  
  // Validate image file
  validateImage: (file: File, maxSizeMB: number = 5) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    return {
      isValidType: FileValidation.validateFileType(file, allowedTypes),
      isValidSize: FileValidation.validateFileSize(file, maxSizeMB)
    }
  },
  
  // Validate document file
  validateDocument: (file: File, maxSizeMB: number = 10) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    return {
      isValidType: FileValidation.validateFileType(file, allowedTypes),
      isValidSize: FileValidation.validateFileSize(file, maxSizeMB)
    }
  },
  
  // Validate CAD file
  validateCAD: (file: File, maxSizeMB: number = 50) => {
    const allowedTypes = ['application/dwg', 'application/dxf', 'application/step', 'application/iges']
    return {
      isValidType: FileValidation.validateFileType(file, allowedTypes),
      isValidSize: FileValidation.validateFileSize(file, maxSizeMB)
    }
  }
}

// Business logic validation
export const BusinessValidation = {
  // Validate project budget
  validateProjectBudget: (budget: number, usedBudget: number) => {
    return {
      isValid: usedBudget <= budget,
      remaining: budget - usedBudget,
      percentage: (usedBudget / budget) * 100
    }
  },
  
  // Validate deadline
  validateDeadline: (deadline: string, startDate?: string) => {
    const deadlineDate = new Date(deadline)
    const start = startDate ? new Date(startDate) : new Date()
    return {
      isValid: deadlineDate > start,
      daysRemaining: Math.ceil((deadlineDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
      isOverdue: deadlineDate < new Date()
    }
  },
  
  // Validate material availability
  validateMaterialAvailability: (required: number, available: number) => {
    return {
      isAvailable: available >= required,
      shortage: Math.max(0, required - available),
      excess: Math.max(0, available - required)
    }
  }
}