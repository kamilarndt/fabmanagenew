import { describe, it, expect, beforeEach } from 'vitest'
import { useTilesStore } from '../../stores/tilesStore'

describe('tilesStore', () => {
    beforeEach(() => {
        const { setTiles } = useTilesStore.getState()
        setTiles([])
    })

    it('adds a tile', async () => {
        const { addTile } = useTilesStore.getState()
        await addTile({ id: 'X-1', name: 'Test', status: 'W KOLEJCE' })
        expect(useTilesStore.getState().tiles.find(t => t.id === 'X-1')).toBeTruthy()
    })
})

