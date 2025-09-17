import { z } from "zod";

// Base project schema for validation
export const projectSchema = z.object({
  name: z.string().min(1, "Nazwa projektu jest wymagana"),
  client: z.string().min(1, "Nazwa klienta jest wymagana"),
  clientId: z.string().optional(),
  deadline: z.string().min(1, "Termin jest wymagany"),
  status: z
    .enum(["Nowy", "Wyceniany", "W realizacji", "Zakończony", "Wstrzymany"])
    .default("Nowy"),
  typ: z.string().optional(),
  lokalizacja: z.string().optional(),
  description: z.string().optional(),
  budget: z.number().min(0, "Budżet nie może być ujemny").optional(),
  manager: z.string().optional(),
  modules: z
    .array(
      z.enum([
        "wycena",
        "koncepcja",
        "projektowanie",
        "projektowanie_techniczne",
        "produkcja",
        "materialy",
        "logistyka",
        "logistyka_montaz",
        "zakwaterowanie",
        "montaz",
        "model_3d",
      ])
    )
    .optional(),
  link_model_3d: z
    .string()
    .url("Nieprawidłowy format URL")
    .optional()
    .or(z.literal("")),
});

// Schema for creating new projects
export const projectCreateSchema = projectSchema.extend({
  numer: z.string().optional(),
  data_utworzenia: z.string().optional(),
  postep: z.number().min(0).max(100).optional().default(0),
  groups: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        thumbnail: z.string().optional(),
        files: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              url: z.string().url(),
              type: z.string(),
            })
          )
          .optional(),
      })
    )
    .optional()
    .default([]),
});

// TypeScript types
export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectCreateData = z.infer<typeof projectCreateSchema>;

// Validation functions
export function validateProjectData(data: unknown): ProjectFormData {
  return projectSchema.parse(data);
}

export function validateProjectCreateData(data: unknown): ProjectCreateData {
  return projectCreateSchema.parse(data);
}

// Safe validation functions that return success/error results
export function safeValidateProjectData(data: unknown): {
  success: boolean;
  data?: ProjectFormData;
  error?: string;
} {
  try {
    const validatedData = projectSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return { success: false, error: "Nieznany błąd walidacji" };
  }
}

export function safeValidateProjectCreateData(data: unknown): {
  success: boolean;
  data?: ProjectCreateData;
  error?: string;
} {
  try {
    const validatedData = projectCreateSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return { success: false, error: "Nieznany błąd walidacji" };
  }
}
