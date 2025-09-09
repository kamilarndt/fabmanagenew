import { z } from 'zod'

export const BomItemSchema = z.object({
    id: z.string(),
    type: z.enum(['Materiał surowy', 'Komponent gotowy', 'Usługa']),
    name: z.string(),
    quantity: z.number().nonnegative(),
    unit: z.string(),
    supplier: z.string().optional(),
    status: z.enum(['Na stanie', 'Do zamówienia', 'Zamówione']).optional(),
    unitCost: z.number().nonnegative().optional()
})

export const TileSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['W KOLEJCE', 'W TRAKCIE CIĘCIA', 'WYCIĘTE', 'Projektowanie', 'W trakcie projektowania', 'Do akceptacji', 'Zaakceptowane', 'Wymagają poprawek', 'Gotowy do montażu', 'W produkcji CNC']),
    project: z.string().optional(),
    priority: z.enum(['Wysoki', 'Średni', 'Niski']).optional(),
    technology: z.string().optional(),
    bom: z.array(BomItemSchema).optional(),
    laborCost: z.number().nonnegative().optional(),
    assignee: z.string().optional(),
    dxfFile: z.string().nullable().optional(),
    assemblyDrawing: z.string().nullable().optional(),
    group: z.string().optional(),
    files: z.array(z.object({ name: z.string(), path: z.string(), mime: z.string().optional(), size: z.number().optional() })).optional()
})

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    client: z.string(),
    status: z.enum(['Active', 'On Hold', 'Done']),
    deadline: z.string(),
    budget: z.number().nonnegative().optional(),
    manager: z.string().optional(),
    description: z.string().optional()
})

export type TileInput = z.input<typeof TileSchema>
export type TileOutput = z.output<typeof TileSchema>
export type ProjectInput = z.input<typeof ProjectSchema>
export type ProjectOutput = z.output<typeof ProjectSchema>

