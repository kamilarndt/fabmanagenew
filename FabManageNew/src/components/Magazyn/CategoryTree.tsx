import React, { useState, useMemo } from 'react'
import { MaterialCategory } from '../../types/magazyn.types'
import { materialCategories, MaterialData } from '../../data/materialsMockData'

interface CategoryTreeProps {
  materials: MaterialData[]
  selectedCategories: string[]
  onCategorySelect: (categories: string[]) => void
  className?: string
}

export default function CategoryTree({ 
  materials, 
  selectedCategories, 
  onCategorySelect,
  className = ''
}: CategoryTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Budowanie struktury drzewa z licznikami
  const categoryTree = useMemo(() => {
    const tree: MaterialCategory[] = []
    
    // Zliczanie materiałów w kategoriach
    const counts: Record<string, number> = {}
    materials.forEach(material => {
      const path = material.category.join('/')
      material.category.forEach((cat, index) => {
        const currentPath = material.category.slice(0, index + 1).join('/')
        counts[currentPath] = (counts[currentPath] || 0) + 1
      })
    })

    // Budowanie drzewa
    Object.entries(materialCategories).forEach(([key, category]) => {
      const node: MaterialCategory = {
        id: key,
        name: category.name,
        materialsCount: counts[key] || 0,
        children: []
      }

      if (category.subcategories) {
        Object.entries(category.subcategories).forEach(([subKey, subCategory]) => {
          const subPath = `${key}/${subKey}`
          node.children?.push({
            id: subKey,
            name: subCategory.name,
            parent: key,
            materialsCount: counts[subPath] || 0
          })
        })
      }

      tree.push(node)
    })

    return tree
  }, [materials])

  const toggleExpand = (categoryId: string) => {
    setExpanded(prev => ({ ...prev, [categoryId]: !prev[categoryId] }))
  }

  const handleCategoryClick = (category: MaterialCategory, parent?: string) => {
    const path = parent ? [parent, category.id] : [category.id]
    
    // Jeśli kategoria jest już wybrana, usuń ją
    if (selectedCategories.join('/') === path.join('/')) {
      onCategorySelect([])
    } else {
      onCategorySelect(path)
    }
  }

  const renderCategory = (category: MaterialCategory, level = 0, parent?: string) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expanded[category.id]
    const path = parent ? [parent, category.id] : [category.id]
    const isSelected = selectedCategories.join('/') === path.join('/')
    const isParentSelected = parent && selectedCategories[0] === parent && !selectedCategories[1]

    return (
      <div key={category.id} className="category-item">
        <div 
          className={`category-row d-flex align-items-center py-2 px-3 rounded-2 mb-1 ${
            isSelected ? 'bg-primary text-white' : isParentSelected ? 'bg-primary-subtle' : 'hover-bg-light'
          }`}
          style={{ 
            paddingLeft: `${16 + level * 20}px`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleCategoryClick(category, parent)}
        >
          {hasChildren && (
            <button
              className={`btn btn-sm p-0 me-2 ${isSelected ? 'text-white' : 'text-muted'}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(category.id)
              }}
              style={{ width: '20px', height: '20px', border: 'none', background: 'none' }}
            >
              <i className={`ri-arrow-${isExpanded ? 'down' : 'right'}-s-line`}></i>
            </button>
          )}
          {!hasChildren && <span style={{ width: '28px' }}></span>}
          
          <span className="flex-grow-1 fw-medium">{category.name}</span>
          
          {category.materialsCount !== undefined && category.materialsCount > 0 && (
            <span className={`badge ${isSelected ? 'bg-white text-primary' : 'bg-secondary-subtle text-secondary'} ms-2`}>
              {category.materialsCount}
            </span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="category-children">
            {category.children.map(child => renderCategory(child, level + 1, category.id))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`category-tree ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-3 px-3">
        <h6 className="mb-0 fw-bold">Kategorie</h6>
        {selectedCategories.length > 0 && (
          <button 
            className="btn btn-sm btn-link text-decoration-none p-0"
            onClick={() => onCategorySelect([])}
          >
            <i className="ri-close-line me-1"></i>Wyczyść
          </button>
        )}
      </div>
      
      <div className="category-list">
        <div 
          className={`category-row d-flex align-items-center py-2 px-3 rounded-2 mb-1 ${
            selectedCategories.length === 0 ? 'bg-primary text-white' : 'hover-bg-light'
          }`}
          style={{ cursor: 'pointer' }}
          onClick={() => onCategorySelect([])}
        >
          <i className="ri-apps-line me-2"></i>
          <span className="flex-grow-1 fw-medium">Wszystkie materiały</span>
          <span className={`badge ${selectedCategories.length === 0 ? 'bg-white text-primary' : 'bg-secondary-subtle text-secondary'}`}>
            {materials.length}
          </span>
        </div>
        
        <hr className="my-2" />
        
        {categoryTree.map(category => renderCategory(category))}
      </div>
    </div>
  )
}

// Dodatkowe style CSS (można przenieść do osobnego pliku)
const styles = `
  .category-tree {
    height: 100%;
    overflow-y: auto;
  }
  
  .category-row:hover:not(.bg-primary) {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  .hover-bg-light:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  .category-children {
    position: relative;
  }
  
  .category-children::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`