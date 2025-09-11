/**
 * Development-only realistic data
 * This file exports all realistic data for development environment
 */

// Import realistic data
export { realProjects as mockProjects } from './realProjects'
export { realTiles as mockTiles } from './realTiles'
export { realClients as mockClients } from './realClients'
export { realMaterialsData as mockMaterials } from './realMaterials'
export { realLogisticsData, realAccommodationData } from './realLogistics'

// UMMS test data
export { ummsTestCatalog, ummsTestInventory, ummsTestOrders } from '../ummsTestCatalog'

// Legacy mock data disabled - using realistic data only
// export * from '../mockDatabase'

console.log('🏭 Realistic production data loaded for development environment')
