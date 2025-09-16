/**
 * Configuration management for FabManage application
 */

// Import user segmentation for dynamic feature flags
import { userSegmentation } from "./user-segments";

export type Environment = "development" | "production" | "test";

export interface AppConfig {
  environment: Environment;
  apiBaseUrl: string;
  useMockData: boolean;
  enableRealtimeUpdates: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  supabaseUrl?: string;
  supabaseKey?: string;
}

function getEnvironment(): Environment {
  const env = import.meta.env.NODE_ENV;
  if (env === "production") return "production";
  if (env === "test") return "test";
  return "development";
}

export function shouldUseMockData(): boolean {
  // Use mock data only when explicitly enabled
  const forceMock = import.meta.env.VITE_USE_MOCK_DATA === "true";
  const noApiUrl =
    !import.meta.env.VITE_API_BASE_URL && getEnvironment() !== "development";

  // Only use mock data if explicitly requested or no API URL (except in development)
  return forceMock || noApiUrl;
}

export const config: AppConfig = {
  environment: getEnvironment(),
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    (getEnvironment() === "development" ? "/api" : "http://localhost:3001/api"),
  useMockData: false,
  enableRealtimeUpdates: import.meta.env.VITE_ENABLE_REALTIME !== "false",
  logLevel:
    import.meta.env.VITE_LOG_LEVEL ||
    (getEnvironment() === "development" ? "debug" : "info"),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Environment checks
export const isDevelopment = config.environment === "development";
export const isProduction = config.environment === "production";
export const isTest = config.environment === "test";

// Feature flags - Dynamic based on user segmentation
export const features = {
  mockData: config.useMockData,
  realtimeUpdates: config.enableRealtimeUpdates && isProduction,
  debugLogs: isDevelopment || config.logLevel === "debug",
  errorReporting: isProduction,
  offlineSupport: true,
  // New UI System - Dynamic based on user segmentation
  newUI:
    import.meta.env.VITE_ENABLE_NEW_UI === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUI"),
  newUIDashboard:
    import.meta.env.VITE_ENABLE_NEW_UI_DASHBOARD === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUIDashboard"),
  newUIProjects:
    import.meta.env.VITE_ENABLE_NEW_UI_PROJECTS === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUIProjects"),
  newUIMaterials:
    import.meta.env.VITE_ENABLE_NEW_UI_MATERIALS === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUIMaterials"),
  newUITiles:
    import.meta.env.VITE_ENABLE_NEW_UI_TILES === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUITiles"),
  newUISettings:
    import.meta.env.VITE_ENABLE_NEW_UI_SETTINGS === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUISettings"),
  // Advanced features
  newUINavigation:
    import.meta.env.VITE_ENABLE_NEW_UI_NAVIGATION === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUINavigation"),
  newUIForms:
    import.meta.env.VITE_ENABLE_NEW_UI_FORMS === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUIForms"),
  newUITables:
    import.meta.env.VITE_ENABLE_NEW_UI_TABLES === "true" ||
    isDevelopment ||
    userSegmentation.isFeatureEnabled("newUITables"),
} as const;

console.log("🔧 App Config:", {
  environment: config.environment,
  useMockData: config.useMockData,
  features: Object.entries(features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature),
});

export default config;
