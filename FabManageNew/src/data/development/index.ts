/**
 * Development-only mock data
 * This file exports all mock data for development environment
 */

export { mockClients } from '../mockDatabase'
export { mockProjects } from '../mockDatabase'
export { mockTiles } from '../mockDatabase'

// Re-export for backwards compatibility
export * from '../mockDatabase'

console.log('📦 Mock data loaded for development environment')
