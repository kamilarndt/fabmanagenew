import React, { useState, useMemo } from 'react'
import { Card, Tree, Typography, Space, Badge, Input } from 'antd'
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons'
import type { MaterialData } from '../../data/materialsMockData'
import { rhinoCategories } from '../../data/rhinoMaterialsDatabase'

const { Title } = Typography
const { Search } = Input

interface CategoryNode {
  key: string
  title: React.ReactNode
  children?: CategoryNode[]
  isLeaf?: boolean
  categoryPath?: string[]
}

interface CategorySidebarProps {
  materials: MaterialData[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export default function CategorySidebar({ 
  materials, 
  selectedCategories, 
  onCategoryChange 
}: CategorySidebarProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['_MATERIAL'])
  const [searchValue, setSearchValue] = useState('')

  // Budujemy strukturę drzewa kategorii z liczbą materiałów
  const categoryTreeData = useMemo(() => {
    const categoryCounts = new Map<string, number>()
    
    // Liczymy materiały w każdej kategorii
    materials.forEach(material => {
      if (Array.isArray(material.category)) {
        const [mainCat, subCat] = material.category
        const mainKey = mainCat
        const subKey = `${mainCat}_${subCat}`
        
        categoryCounts.set(mainKey, (categoryCounts.get(mainKey) || 0) + 1)
        if (subCat) {
          categoryCounts.set(subKey, (categoryCounts.get(subKey) || 0) + 1)
        }
      }
    })

    // Budujemy drzewo z rhinoCategories
    const treeData: CategoryNode[] = Object.entries(rhinoCategories).map(([mainKey, mainCategory]) => {
      const mainCount = categoryCounts.get(mainKey) || 0
      
      const children: CategoryNode[] = Object.entries(mainCategory.subcategories || {}).map(([subKey, subCategory]) => {
        const fullSubKey = `${mainKey}_${subKey}`
        const subCount = categoryCounts.get(fullSubKey) || 0
        
        return {
          key: fullSubKey,
          title: (
            <Space>
              <span>{subCategory.name}</span>
              {subCount > 0 && <Badge count={subCount} style={{ backgroundColor: '#52c41a' }} />}
            </Space>
          ),
          isLeaf: true,
          categoryPath: [mainKey, subKey]
        }
      }).filter(child => {
        const childCount = categoryCounts.get(child.key) || 0
        return childCount > 0 // Tylko kategorie z materiałami
      })

      return {
        key: mainKey,
        title: (
          <Space>
            <span style={{ fontWeight: 500 }}>{mainCategory.name}</span>
            {mainCount > 0 && <Badge count={mainCount} />}
          </Space>
        ),
        children: children.length > 0 ? children : undefined,
        categoryPath: [mainKey]
      }
    }).filter(main => {
      const mainCount = categoryCounts.get(main.key) || 0
      return mainCount > 0 // Tylko główne kategorie z materiałami
    })

    return treeData
  }, [materials])

  // Filtrowanie drzewa po wyszukiwaniu
  const filteredTreeData = useMemo(() => {
    if (!searchValue) return categoryTreeData

    const filterNodes = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes.map(node => {
        const title = typeof node.title === 'string' ? node.title : 
          React.isValidElement(node.title) ? '' : String(node.title)
        
        const matches = title.toLowerCase().includes(searchValue.toLowerCase())
        
        if (node.children) {
          const filteredChildren = filterNodes(node.children)
          if (matches || filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren.length > 0 ? filteredChildren : undefined
            }
          }
        } else if (matches) {
          return node
        }
        
        return null
      }).filter(Boolean) as CategoryNode[]
    }

    return filterNodes(categoryTreeData)
  }, [categoryTreeData, searchValue])

  const handleSelect = (_selectedKeys: React.Key[], info: any) => {
    const { node } = info
    
    if (node.categoryPath) {
      const categoryKey = node.categoryPath.join('_')
      
      if (selectedCategories.includes(categoryKey)) {
        // Usuń kategorię
        onCategoryChange(selectedCategories.filter(cat => cat !== categoryKey))
      } else {
        // Dodaj kategorię
        onCategoryChange([...selectedCategories, categoryKey])
      }
    }
  }

  const handleClearAll = () => {
    onCategoryChange([])
  }

  return (
    <Card 
      size="small" 
      style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}
      bodyStyle={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: 12 }}>
        <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
          Kategorie materiałów
        </Title>
        
        <Search
          placeholder="Szukaj kategorii..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          style={{ marginBottom: 8 }}
          size="small"
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Wszystkie materiały: <strong>{materials.length}</strong>
          </Typography.Text>
          {selectedCategories.length > 0 && (
            <Typography.Link onClick={handleClearAll} style={{ fontSize: 11 }}>
              Wyczyść ({selectedCategories.length})
            </Typography.Link>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tree
          showIcon
          defaultExpandedKeys={['_MATERIAL']}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={selectedCategories}
          onSelect={handleSelect}
          treeData={filteredTreeData}
          icon={({ expanded }) => 
            expanded ? <FolderOpenOutlined /> : <FolderOutlined />
          }
          style={{ 
            background: 'transparent',
            fontSize: 12
          }}
        />
      </div>

      {selectedCategories.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Aktywne filtry:
          </Typography.Text>
          <div style={{ marginTop: 4 }}>
            {selectedCategories.map(cat => {
              const [main, sub] = cat.split('_')
              const mainName = rhinoCategories[main as keyof typeof rhinoCategories]?.name || main
              const subName = sub || ''
              
              return (
                <Badge 
                  key={cat} 
                  count={`${mainName}${subName ? ' → ' + subName : ''}`} 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    marginRight: 4, 
                    marginBottom: 4,
                    fontSize: 10,
                    height: 18,
                    lineHeight: '18px'
                  }} 
                />
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
