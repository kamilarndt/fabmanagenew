import { useEffect, useRef, useCallback } from 'react'
import { useProjectsStore } from '../stores/projectsStore'
import { useTilesStore } from '../stores/tilesStore'
import { useClientDataStore } from '../stores/clientDataStore'
import { useMaterialsStore } from '../stores/materialsStore'
import { useUmmsStore } from '../stores/ummsStore'
import { useLogisticsStore } from '../stores/logisticsStore'
import { useAccommodationStore } from '../stores/accommodationStore'

/**
 * Hook do inicjalizacji aplikacji z realnymi danymi produkcyjnymi
 * Ładuje dane tylko raz po pierwszym renderze
 */
export function useInitializeRealData() {
    // Select only stable action references from Zustand stores
    const initializeProjects = useProjectsStore(state => state.initialize)
    const initializeTiles = useTilesStore(state => state.initialize)
    const loadClients = useClientDataStore(state => state.loadData)
    const syncMaterials = useMaterialsStore(state => state.syncFromBackend)
    const syncUmms = useUmmsStore(state => state.syncFromBackend)
    const initializeLogistics = useLogisticsStore(state => state.initialize)
    const initializeAccommodation = useAccommodationStore(state => state.initialize)

    // Guard against double-run (React StrictMode) and any state-driven re-renders
    const hasRunRef = useRef(false)

    const initializeAllStores = useCallback(async () => {
        try {
            const p1 = initializeProjects()
            const p2 = initializeTiles()
            const p3 = loadClients()
            const p4 = syncMaterials()
            const p5 = syncUmms() // Initialize UMMS store
            const p6 = initializeLogistics()
            const p7 = initializeAccommodation()
            await Promise.all([p1, p2, p3, p4, p5, p6, p7])
        } catch (error) {
            console.error('❌ Failed to initialize data stores:', error)
        }
    }, [initializeProjects, initializeTiles, loadClients, syncMaterials, syncUmms, initializeLogistics, initializeAccommodation])

    useEffect(() => {
        if (hasRunRef.current) return
        hasRunRef.current = true
        void initializeAllStores()
    }, [initializeAllStores])
}
