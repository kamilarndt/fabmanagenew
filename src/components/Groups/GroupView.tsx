import type { Tile } from '../../types/tiles.types'
import GroupCard from './GroupCard'

interface Group {
    id: string
    name: string
    tiles: Tile[]
}

interface GroupViewProps {
    groups: Group[]
    onTileClick: (tile: Tile) => void
}

export default function GroupView({ groups, onTileClick }: GroupViewProps) {
    return (
        <div className="row g-3">
            {groups.map(group => (
                <div key={group.id} className="col-12 col-md-6 col-lg-4">
                    <GroupCard
                        group={group}
                        onTileClick={onTileClick}
                    />
                </div>
            ))}
        </div>
    )
}
