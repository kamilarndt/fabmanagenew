import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PackingList {
  id: string
  projectId: string
  itemName: string
  quantity: number
  unit: string
  packedBy: string
  packedAt: number
  status: 'packed' | 'in_transit' | 'delivered' | 'unpacked'
  notes?: string
}

export interface RoutePlanning {
  id: string
  projectId: string
  fromLocation: string
  toLocation: string
  distance: number // km
  estimatedTime: number // minutes
  vehicleType: string
  driver: string
  plannedDate: number
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  actualDeparture?: number
  actualArrival?: number
  notes?: string
}

export interface SiteInstallation {
  id: string
  projectId: string
  taskName: string
  location: string
  plannedStart: number
  plannedEnd: number
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
  status: 'planned' | 'in_progress' | 'completed' | 'delayed'
  actualStart?: number
  actualEnd?: number
  notes?: string
}

export interface PunchListItem {
  id: string
  projectId: string
  itemDescription: string
  location: string
  category: 'electrical' | 'mechanical' | 'structural' | 'cosmetic' | 'other'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string
  status: 'open' | 'in_progress' | 'completed' | 'verified'
  createdAt: number
  completedAt?: number
  verifiedAt?: number
  notes?: string
}

export interface SignOff {
  id: string
  projectId: string
  documentType: 'installation' | 'testing' | 'commissioning' | 'handover' | 'other'
  documentName: string
  signedBy: string
  signedAt: number
  status: 'pending' | 'signed' | 'rejected'
  rejectionReason?: string
  documentUrl?: string
  notes?: string
}

interface LogisticsStore {
  packingLists: PackingList[]
  routePlanning: RoutePlanning[]
  siteInstallations: SiteInstallation[]
  punchListItems: PunchListItem[]
  signOffs: SignOff[]

  // Initialize with realistic data
  initialize: () => Promise<void>

  // Packing Lists
  addPackingItem: (item: Omit<PackingList, 'id' | 'packedAt'>) => void
  updatePackingItem: (id: string, updates: Partial<PackingList>) => void
  removePackingItem: (id: string) => void
  getPackingListByProject: (projectId: string) => PackingList[]

  // Route Planning
  addRoute: (route: Omit<RoutePlanning, 'id'>) => void
  updateRoute: (id: string, updates: Partial<RoutePlanning>) => void
  removeRoute: (id: string) => void
  getRoutesByProject: (projectId: string) => RoutePlanning[]

  // Site Installation
  addInstallationTask: (task: Omit<SiteInstallation, 'id'>) => void
  updateInstallationTask: (id: string, updates: Partial<SiteInstallation>) => void
  removeInstallationTask: (id: string) => void
  getInstallationTasksByProject: (projectId: string) => SiteInstallation[]

  // Punch List
  addPunchListItem: (item: Omit<PunchListItem, 'id' | 'createdAt'>) => void
  updatePunchListItem: (id: string, updates: Partial<PunchListItem>) => void
  removePunchListItem: (id: string) => void
  getPunchListByProject: (projectId: string) => PunchListItem[]

  // Sign Offs
  addSignOff: (signOff: Omit<SignOff, 'id'>) => void
  updateSignOff: (id: string, updates: Partial<SignOff>) => void
  removeSignOff: (id: string) => void
  getSignOffsByProject: (projectId: string) => SignOff[]
}

export const useLogisticsStore = create<LogisticsStore>()(
  persist(
    (set, get) => ({
      packingLists: [],
      routePlanning: [],
      siteInstallations: [],
      punchListItems: [],
      signOffs: [],

      // Initialize with realistic data
      initialize: async () => {
        try {
          const { config } = await import('../lib/config')

          if (config.useMockData) {
            const { realLogisticsData } = await import('../data/development')

            set({
              routePlanning: realLogisticsData.routePlanning,
              packingLists: realLogisticsData.packingLists
            })

            console.log('🚛 Loaded realistic logistics data')
          }
        } catch (error) {
          console.warn('Failed to load logistics data:', error)
        }
      },

      // Packing Lists
      addPackingItem: (item) => set((state) => ({
        packingLists: [...state.packingLists, {
          ...item,
          id: crypto.randomUUID(),
          packedAt: Date.now()
        }]
      })),

      updatePackingItem: (id, updates) => set((state) => ({
        packingLists: state.packingLists.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),

      removePackingItem: (id) => set((state) => ({
        packingLists: state.packingLists.filter(item => item.id !== id)
      })),

      getPackingListByProject: (projectId) =>
        get().packingLists.filter(item => item.projectId === projectId),

      // Route Planning
      addRoute: (route) => set((state) => ({
        routePlanning: [...state.routePlanning, {
          ...route,
          id: crypto.randomUUID()
        }]
      })),

      updateRoute: (id, updates) => set((state) => ({
        routePlanning: state.routePlanning.map(route =>
          route.id === id ? { ...route, ...updates } : route
        )
      })),

      removeRoute: (id) => set((state) => ({
        routePlanning: state.routePlanning.filter(route => route.id !== id)
      })),

      getRoutesByProject: (projectId) =>
        get().routePlanning.filter(route => route.projectId === projectId),

      // Site Installation
      addInstallationTask: (task) => set((state) => ({
        siteInstallations: [...state.siteInstallations, {
          ...task,
          id: crypto.randomUUID()
        }]
      })),

      updateInstallationTask: (id, updates) => set((state) => ({
        siteInstallations: state.siteInstallations.map(task =>
          task.id === id ? { ...task, ...updates } : task
        )
      })),

      removeInstallationTask: (id) => set((state) => ({
        siteInstallations: state.siteInstallations.filter(task => task.id !== id)
      })),

      getInstallationTasksByProject: (projectId) =>
        get().siteInstallations.filter(task => task.projectId === projectId),

      // Punch List
      addPunchListItem: (item) => set((state) => ({
        punchListItems: [...state.punchListItems, {
          ...item,
          id: crypto.randomUUID(),
          createdAt: Date.now()
        }]
      })),

      updatePunchListItem: (id, updates) => set((state) => ({
        punchListItems: state.punchListItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),

      removePunchListItem: (id) => set((state) => ({
        punchListItems: state.punchListItems.filter(item => item.id !== id)
      })),

      getPunchListByProject: (projectId) =>
        get().punchListItems.filter(item => item.projectId === projectId),

      // Sign Offs
      addSignOff: (signOff) => set((state) => ({
        signOffs: [...state.signOffs, {
          ...signOff,
          id: crypto.randomUUID()
        }]
      })),

      updateSignOff: (id, updates) => set((state) => ({
        signOffs: state.signOffs.map(signOff =>
          signOff.id === id ? { ...signOff, ...updates } : signOff
        )
      })),

      removeSignOff: (id) => set((state) => ({
        signOffs: state.signOffs.filter(signOff => signOff.id !== id)
      })),

      getSignOffsByProject: (projectId) =>
        get().signOffs.filter(signOff => signOff.projectId === projectId),
    }),
    {
      name: 'logistics-store',
      version: 1,
    }
  )
)
