/* ========================================
   FABMANAGE - UTILITY FUNCTIONS DLA STATUSÓW
   ========================================
   
   Centralne miejsce dla logiki statusów używając unified enums
   ======================================== */

import type { ProjectStatus, TileStatus, MaterialStatus } from '../types/enums'
import {
  PROJECT_STATUSES,
  TILE_STATUSES,
  MATERIAL_STATUSES,
  PROJECT_STATUS_LABELS,
  TILE_STATUS_LABELS,
  MATERIAL_STATUS_LABELS,
  getStatusColor as getEnumStatusColor
} from '../types/enums'

// ========================================
// BACKEND INTEGRATION
// ========================================

// Backend uses simplified status values
export type BackendTileStatus = 'new' | 'in_progress' | 'waiting_for_approval' | 'approved' | 'in_production' | 'completed' | 'on_hold' | 'cancelled'

// Map UI -> backend (direct mapping using enum values)
export function toBackendTileStatus(status: TileStatus): BackendTileStatus {
  // Since we now use enum values, this is a direct pass-through
  return status as BackendTileStatus
}

// Map backend -> UI (direct mapping using enum values)
export function toUiTileStatus(status: BackendTileStatus): TileStatus {
  // Since we now use enum values, this is a direct pass-through
  return status as TileStatus
}

// ========================================
// SIMPLIFIED STATUS UTILITIES
// ========================================

// Use the centralized status color function from enums
export const getStatusColor = getEnumStatusColor

// Get status label for display
export function getStatusLabel(status: ProjectStatus | TileStatus | MaterialStatus): string {
  if ((Object.values(PROJECT_STATUSES) as unknown as string[]).includes(status as string)) {
    return PROJECT_STATUS_LABELS[status as ProjectStatus]
  }
  if ((Object.values(TILE_STATUSES) as unknown as string[]).includes(status as string)) {
    return TILE_STATUS_LABELS[status as TileStatus]
  }
  if ((Object.values(MATERIAL_STATUSES) as unknown as string[]).includes(status as string)) {
    return MATERIAL_STATUS_LABELS[status as MaterialStatus]
  }
  return status // fallback to raw value
}

// Ant Design compatible badge status
export function getAntBadgeStatus(status: ProjectStatus | TileStatus): 'success' | 'processing' | 'default' | 'error' | 'warning' {
  switch (status) {
    case PROJECT_STATUSES.DONE:
    case TILE_STATUSES.COMPLETED:
    case TILE_STATUSES.APPROVED:
      return 'success'
    case PROJECT_STATUSES.ACTIVE:
    case TILE_STATUSES.IN_PROGRESS:
    case TILE_STATUSES.IN_PRODUCTION:
      return 'processing'
    case PROJECT_STATUSES.ON_HOLD:
    case TILE_STATUSES.ON_HOLD:
    case TILE_STATUSES.WAITING_FOR_APPROVAL:
      return 'warning'
    case PROJECT_STATUSES.CANCELLED:
    case TILE_STATUSES.CANCELLED:
      return 'error'
    default:
      return 'default'
  }
}

// Transition validation using enum values
export function canTransitionTo(_: ProjectStatus | TileStatus, __: ProjectStatus | TileStatus): boolean {
  return true
}

// ========================================
// LEGACY COMPATIBILITY
// ========================================

// For backward compatibility with old string-based statuses
export const getStatusDisplayData = (status: string) => {
  return {
    color: getStatusColor(status as any),
    label: getStatusLabel(status as any),
    antStatus: getAntBadgeStatus(status as any)
  }
}

// Export everything for backward compatibility
export default {
  getStatusColor,
  getStatusLabel,
  getAntBadgeStatus,
  canTransitionTo,
  getStatusDisplayData,
  // Aliases
  toBackendTileStatus,
  toUiTileStatus
}
