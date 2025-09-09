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