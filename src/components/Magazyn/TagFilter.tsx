import type { MaterialData } from '../../data/materialsMockData'
import { memo } from 'react'

interface Tag {
  id: string
  label: string
  value: string
  type: 'category' | 'property' | 'status' | 'supplier'
  count?: number
  color?: string
  icon?: string
}

interface TagFilterProps {
  materials: MaterialData[]
  activeTags: string[]
  onTagToggle: (tagId: string) => void
  onClearAll: () => void
}

function TagFilter({ materials, activeTags, onTagToggle, onClearAll }: TagFilterProps) {
  // Generowanie tagów na podstawie materiałów
  const generateTags = (): Tag[] => {
    const tags: Tag[] = []

    // Zliczanie wystąpień
    const categoryCounts: Record<string, number> = {}
    const supplierCounts: Record<string, number> = {}
    const propertyCounts: Record<string, number> = {}

    materials.forEach(material => {
      // Kategorie
      material.category.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      })

      // Dostawcy
      supplierCounts[material.supplier] = (supplierCounts[material.supplier] || 0) + 1

      // Właściwości
      if (material.properties) {
        if (material.properties.fireResistant) {
          propertyCounts['fireResistant'] = (propertyCounts['fireResistant'] || 0) + 1
        }
        if (material.properties.waterResistant) {
          propertyCounts['waterResistant'] = (propertyCounts['waterResistant'] || 0) + 1
        }
        if (material.properties.flexible) {
          propertyCounts['flexible'] = (propertyCounts['flexible'] || 0) + 1
        }
      }
    })

    // Najpopularniejsze kategorie
    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)

    topCategories.forEach(([cat, count]) => {
      const categoryIcons: Record<string, string> = {
        'MDF': 'ri-stack-line',
        'SKLEJKA': 'ri-layout-4-line',
        'PLEXI_EXTRUDOWANA': 'ri-rectangle-line',
        'PLEXI_LANA': 'ri-square-line',
        'DIBOND': 'ri-layout-grid-line',
        'LED': 'ri-lightbulb-line',
        'OSB': 'ri-grid-line',
        'PLYTA_WIÓROWA': 'ri-layout-3-line'
      }

      tags.push({
        id: `cat-${cat}`,
        label: cat.replace(/_/g, ' '),
        value: cat,
        type: 'category',
        count,
        icon: categoryIcons[cat] || 'ri-folder-line',
        color: 'primary'
      })
    })

    // Tagi właściwości
    if (propertyCounts['fireResistant'] > 0) {
      tags.push({
        id: 'prop-fireResistant',
        label: 'Trudnopalne',
        value: 'fireResistant',
        type: 'property',
        count: propertyCounts['fireResistant'],
        icon: 'ri-fire-line',
        color: 'danger'
      })
    }

    if (propertyCounts['waterResistant'] > 0) {
      tags.push({
        id: 'prop-waterResistant',
        label: 'Wodoodporne',
        value: 'waterResistant',
        type: 'property',
        count: propertyCounts['waterResistant'],
        icon: 'ri-drop-line',
        color: 'info'
      })
    }

    if (propertyCounts['flexible'] > 0) {
      tags.push({
        id: 'prop-flexible',
        label: 'Do gięcia',
        value: 'flexible',
        type: 'property',
        count: propertyCounts['flexible'],
        icon: 'ri-curve-line',
        color: 'purple'
      })
    }

    // Tagi statusu
    const criticalCount = materials.filter(m => m.stock / m.minStock < 0.5).length
    const lowCount = materials.filter(m => {
      const ratio = m.stock / m.minStock
      return ratio >= 0.5 && ratio < 1
    }).length

    if (criticalCount > 0) {
      tags.push({
        id: 'status-critical',
        label: 'Krytyczne',
        value: 'critical',
        type: 'status',
        count: criticalCount,
        icon: 'ri-error-warning-line',
        color: 'danger'
      })
    }

    if (lowCount > 0) {
      tags.push({
        id: 'status-low',
        label: 'Niskie zapasy',
        value: 'low',
        type: 'status',
        count: lowCount,
        icon: 'ri-alert-line',
        color: 'warning'
      })
    }

    return tags
  }

  const tags = generateTags()

  return (
    <div className="tag-filter-container">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="mb-0 text-muted small">Szybkie filtry</h6>
        {activeTags.length > 0 && (
          <button
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={onClearAll}
            aria-label="Wyczyść wszystkie filtry"
          >
            <i className="ri-close-circle-line me-1"></i>
            Wyczyść filtry ({activeTags.length})
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2">
        {tags.map(tag => {
          const isActive = activeTags.includes(tag.id)
          const colorClass = tag.color === 'purple' ? 'purple' : tag.color || 'secondary'

          return (
            <button
              key={tag.id}
              className={`btn btn-sm ${isActive
                ? `btn-${colorClass}`
                : `btn-outline-${colorClass}`
                } tag-button d-flex align-items-center gap-1`}
              onClick={() => onTagToggle(tag.id)}
              aria-pressed={isActive}
              aria-label={`Filtruj: ${tag.label}`}
              style={{
                transition: 'all 0.2s ease',
                borderRadius: '20px',
                padding: '4px 12px'
              }}
            >
              <i className={`${tag.icon} ${!isActive ? 'opacity-75' : ''}`}></i>
              <span>{tag.label}</span>
              {tag.count !== undefined && (
                <span className={`badge ${isActive
                  ? 'bg-white text-dark'
                  : `bg-${colorClass}-subtle text-${colorClass}`
                  } ms-1`}>
                  {tag.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(TagFilter)

