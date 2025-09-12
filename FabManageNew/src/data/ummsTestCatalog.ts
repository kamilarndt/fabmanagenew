// Test data for Universal Material Management System (UMMS)
// Katalog 200 materiałów + 20 wybranych do magazynu + przykładowe zamówienia

import type { 
  UniversalMaterial, 
  InventoryData, 
  MaterialOrder
} from '../types/umms.types'
import { MaterialCategory, OrderStatus } from '../types/umms.types'

// Generator ID dla materiałów
const generateMaterialId = (category: string, index: number) => 
  `mat_${category.toLowerCase()}_${String(index).padStart(3, '0')}`

// Helper function for dates
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

// Katalog 200 materiałów - WSZYSTKIE dostępne materiały
export const ummsTestCatalog: UniversalMaterial[] = [
  // === SHEET_MATERIAL (Płyty) - 80 materiałów ===
  
  // MDF - różne grubości i warianty
  ...Array.from({ length: 20 }, (_, i) => {
    const thicknesses = [6, 8, 10, 12, 15, 18, 20, 22, 25, 30]
    const thickness = thicknesses[i % thicknesses.length]
    const variants = ['Standard', 'Trudnopalna', 'Do_Gięcia', 'Wodoodporna']
    const variant = variants[i % variants.length]
    
    return {
      id: generateMaterialId('MDF', i + 1),
      fabManageCode: `MDF_${thickness}_${variant.toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      universalName: `MDF ${thickness}mm ${variant}`,
      category: MaterialCategory.SHEET_MATERIAL,
      type: 'MDF',
      physicalProperties: {
        thickness,
        density: 750,
        dimensions: {
          length: 2500,
          width: 1250,
          area: 3.125
        },
        weight: thickness * 3.125 * 0.75,
        color: '#F5F5DC',
        finish: 'Szlifowana z dwóch stron'
      },
      designProperties: {
        renderColor: '#F5F5DC',
        roughness: 0.8,
        metallic: 0.0,
        transparency: 0.0
      },
      validationRules: {
        allowedThickness: [thickness - 0.5, thickness, thickness + 0.5],
        warningThreshold: 0.5,
        errorThreshold: 1.5,
        cuttingConstraints: {
          minCutWidth: 10,
          kerf: 3
        }
      },
      costData: {
        costPerUnit: 45 + thickness * 1.2,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        certifications: ['CE', 'FSC'],
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `Płyta MDF ${thickness}mm ${variant.toLowerCase()}`,
        tags: ['płyta', 'mdf', `${thickness}mm`, variant.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // Sklejka
  ...Array.from({ length: 15 }, (_, i) => {
    const thicknesses = [3, 6, 9, 12, 15, 18, 21, 24]
    const thickness = thicknesses[i % thicknesses.length]
    const types = ['Brzoza', 'Okume', 'Wodoodporna', 'Antypoślizgowa']
    const type = types[i % types.length]
    
    return {
      id: generateMaterialId('SKLEJKA', i + 1),
      fabManageCode: `SKLEJKA_${thickness}_${type.toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      universalName: `Sklejka ${type} ${thickness}mm`,
      category: MaterialCategory.SHEET_MATERIAL,
      type: 'Sklejka',
      physicalProperties: {
        thickness,
        density: 680,
        dimensions: {
          length: 2500,
          width: 1250,
          area: 3.125
        },
        weight: thickness * 3.125 * 0.68,
        color: '#DEB887',
        finish: 'Szlifowana'
      },
      designProperties: {
        renderColor: '#DEB887',
        roughness: 0.7,
        metallic: 0.0,
        transparency: 0.0
      },
      validationRules: {
        allowedThickness: [thickness - 0.3, thickness, thickness + 0.3],
        warningThreshold: 0.3,
        errorThreshold: 1.0
      },
      costData: {
        costPerUnit: 80 + thickness * 2.5,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        certifications: ['CE'],
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `Sklejka ${type.toLowerCase()} ${thickness}mm`,
        tags: ['płyta', 'sklejka', `${thickness}mm`, type.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // Płyta wiórowa
  ...Array.from({ length: 12 }, (_, i) => {
    const thicknesses = [8, 10, 12, 16, 18, 22, 25, 30]
    const thickness = thicknesses[i % thicknesses.length]
    const finishes = ['Surowa', 'Laminowana', 'Melaminowana', 'Lakierowana']
    const finish = finishes[i % finishes.length]
    
    return {
      id: generateMaterialId('WIOROWA', i + 1),
      fabManageCode: `WIOROWA_${thickness}_${finish.toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      universalName: `Płyta wiórowa ${finish} ${thickness}mm`,
      category: MaterialCategory.SHEET_MATERIAL,
      type: 'Płyta wiórowa',
      physicalProperties: {
        thickness,
        density: 650,
        dimensions: {
          length: 2800,
          width: 2070,
          area: 5.796
        },
        weight: thickness * 5.796 * 0.65,
        color: finish === 'Surowa' ? '#D2B48C' : '#FFFFFF',
        finish
      },
      designProperties: {
        renderColor: finish === 'Surowa' ? '#D2B48C' : '#FFFFFF',
        roughness: finish === 'Surowa' ? 0.9 : 0.2,
        metallic: 0.0,
        transparency: 0.0
      },
      validationRules: {
        allowedThickness: [thickness - 0.5, thickness, thickness + 0.5],
        warningThreshold: 0.5,
        errorThreshold: 1.0
      },
      costData: {
        costPerUnit: 35 + thickness * 0.8 + (finish === 'Surowa' ? 0 : 20),
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        certifications: ['CE'],
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `Płyta wiórowa ${finish.toLowerCase()} ${thickness}mm`,
        tags: ['płyta', 'wiórowa', `${thickness}mm`, finish.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // Plexi
  ...Array.from({ length: 10 }, (_, i) => {
    const thicknesses = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20]
    const thickness = thicknesses[i % thicknesses.length]
    const colors = ['Bezbarwne', 'Białe', 'Czarne', 'Czerwone', 'Niebieskie', 'Mleczne']
    const color = colors[i % colors.length]
    
    return {
      id: generateMaterialId('PLEXI', i + 1),
      fabManageCode: `PLEXI_${thickness}_${color.toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      universalName: `Plexi ${color} ${thickness}mm`,
      category: MaterialCategory.SHEET_MATERIAL,
      type: 'Plexi',
      physicalProperties: {
        thickness,
        density: 1190,
        dimensions: {
          length: 2050,
          width: 3050,
          area: 6.25
        },
        weight: thickness * 6.25 * 1.19,
        color: color === 'Bezbarwne' ? '#F0F8FF' : color === 'Białe' ? '#FFFFFF' : '#000000',
        finish: 'Gładka'
      },
      designProperties: {
        renderColor: color === 'Bezbarwne' ? '#F0F8FF' : color === 'Białe' ? '#FFFFFF' : '#000000',
        roughness: 0.1,
        metallic: 0.0,
        transparency: color === 'Bezbarwne' ? 0.9 : color === 'Mleczne' ? 0.5 : 0.0
      },
      validationRules: {
        allowedThickness: [thickness - 0.2, thickness, thickness + 0.2],
        warningThreshold: 0.2,
        errorThreshold: 0.5
      },
      costData: {
        costPerUnit: 180 + thickness * 15,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        certifications: ['CE'],
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `Plexi ${color.toLowerCase()} ${thickness}mm`,
        tags: ['płyta', 'plexi', 'akryl', `${thickness}mm`, color.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // Profile aluminiowe
  ...Array.from({ length: 15 }, (_, i) => {
    const profiles = [
      { name: 'Kątownik', dimensions: '20x20x2' },
      { name: 'Kątownik', dimensions: '30x30x3' },
      { name: 'Profil U', dimensions: '40x20x2' },
      { name: 'Profil T', dimensions: '50x25x3' },
      { name: 'Rura kwadratowa', dimensions: '25x25x2' }
    ]
    const profile = profiles[i % profiles.length]
    
    return {
      id: generateMaterialId('ALU', i + 1),
      fabManageCode: `ALU_${profile.name.replace(' ', '_').toUpperCase()}_${profile.dimensions}_${String(i + 1).padStart(3, '0')}`,
      universalName: `${profile.name} ALU ${profile.dimensions}`,
      category: MaterialCategory.METAL_PROFILES,
      type: 'Aluminium',
      physicalProperties: {
        density: 2700,
        dimensions: {
          length: 6000 // standardowa długość
        },
        color: '#C0C0C0',
        finish: 'Anodowane'
      },
      designProperties: {
        renderColor: '#C0C0C0',
        roughness: 0.3,
        metallic: 0.8,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 1.0,
        errorThreshold: 2.0
      },
      costData: {
        costPerUnit: 25 + i * 3,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        certifications: ['CE'],
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `${profile.name} aluminiowy ${profile.dimensions}`,
        tags: ['profil', 'aluminium', 'metal', profile.name.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // === HARDWARE (Okucia) - 60 materiałów ===
  
  // Śruby
  ...Array.from({ length: 25 }, (_, i) => {
    const types = ['DIN 7991', 'DIN 912', 'DIN 84', 'DIN 965', 'Śruba do drewna']
    const type = types[i % types.length]
    const sizes = ['M3x10', 'M3x16', 'M4x12', 'M4x20', 'M5x16', 'M5x25', 'M6x20', 'M6x30', 'M8x25', 'M8x40']
    const size = sizes[i % sizes.length]
    
    return {
      id: generateMaterialId('SRUBA', i + 1),
      fabManageCode: `SRUBA_${type.replace(/[ /]/g, '_')}_${size}_${String(i + 1).padStart(3, '0')}`,
      universalName: `Śruba ${type} ${size}`,
      category: MaterialCategory.HARDWARE,
      type: 'Śruba',
      physicalProperties: {
        diameter: parseInt(size.split('x')[0].replace('M', '')),
        length: parseInt(size.split('x')[1]),
        color: '#808080',
        finish: 'Ocynkowana'
      },
      designProperties: {
        renderColor: '#808080',
        roughness: 0.4,
        metallic: 0.7,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 0.1,
        errorThreshold: 0.5
      },
      costData: {
        costPerUnit: 0.15 + (i * 0.05),
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `Śruba ${type} ${size}`,
        tags: ['śruba', 'hardware', 'mocowanie', type.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // Zawias i okucia
  ...Array.from({ length: 20 }, (_, i) => {
    const types = ['Zawias', 'Uchwyt', 'Prowadnica', 'Zatrzask', 'Magnes']
    const type = types[i % types.length]
    const variants = ['Standard', 'Heavy Duty', 'Soft Close', 'Push to Open']
    const variant = variants[i % variants.length]
    
    return {
      id: generateMaterialId('OKUCIA', i + 1),
      fabManageCode: `OKUCIA_${type.toUpperCase()}_${variant.replace(' ', '_').toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      universalName: `${type} ${variant}`,
      category: MaterialCategory.HARDWARE,
      type: type,
      physicalProperties: {
        color: '#696969',
        finish: 'Satyna'
      },
      designProperties: {
        renderColor: '#696969',
        roughness: 0.5,
        metallic: 0.6,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 1.0,
        errorThreshold: 2.0
      },
      costData: {
        costPerUnit: 15 + i * 2,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `${type} ${variant.toLowerCase()}`,
        tags: ['okucia', type.toLowerCase(), 'hardware']
      }
    } as UniversalMaterial
  }),

  // Kołki i łączniki
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Kołek drewniany', 'Łącznik IKEA', 'Wkręt', 'Nit pop', 'Śruba łeb płaski']
    const type = types[i % types.length]
    const sizes = ['6mm', '8mm', '10mm', '12mm', '15mm']
    const size = sizes[i % sizes.length]
    
    return {
      id: generateMaterialId('LACZNIKI', i + 1),
      fabManageCode: `LACZNIKI_${type.replace(/ /g, '_').toUpperCase()}_${size}_${String(i + 1).padStart(3, '0')}`,
      universalName: `${type} ${size}`,
      category: MaterialCategory.HARDWARE,
      type: 'Łącznik',
      physicalProperties: {
        diameter: parseInt(size.replace('mm', '')),
        color: type.includes('drewniany') ? '#DEB887' : '#808080',
        finish: type.includes('drewniany') ? 'Naturalne' : 'Ocynkowane'
      },
      designProperties: {
        renderColor: type.includes('drewniany') ? '#DEB887' : '#808080',
        roughness: 0.4,
        metallic: type.includes('drewniany') ? 0.0 : 0.7,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 0.1,
        errorThreshold: 0.3
      },
      costData: {
        costPerUnit: 0.25 + (i * 0.1),
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `${type} ${size}`,
        tags: ['łącznik', 'hardware', type.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // === LIGHTING (Oświetlenie) - 30 materiałów ===
  
  // Taśmy LED
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['LED Strip 2835', 'LED Strip 5050', 'LED Strip COB', 'LED Neon Flex']
    const type = types[i % types.length]
    const colors = ['3000K', '4000K', '6000K', 'RGB', 'RGBW']
    const color = colors[i % colors.length]
    const powers = ['4.8W/m', '7.2W/m', '9.6W/m', '14.4W/m', '24W/m']
    const power = powers[i % powers.length]
    
    return {
      id: generateMaterialId('LED_STRIP', i + 1),
      fabManageCode: `LED_STRIP_${type.replace(/[ ]/g, '_')}_${color}_${power.replace('/', '_')}_${String(i + 1).padStart(3, '0')}`,
      universalName: `${type} ${color} ${power}`,
      category: MaterialCategory.LIGHTING,
      type: 'Taśma LED',
      physicalProperties: {
        color: color.includes('RGB') ? '#FFFFFF' : color === '3000K' ? '#FFF8DC' : '#F0F8FF',
        finish: 'IP20'
      },
      designProperties: {
        renderColor: color.includes('RGB') ? '#FFFFFF' : color === '3000K' ? '#FFF8DC' : '#F0F8FF',
        roughness: 0.1,
        metallic: 0.0,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 1.0,
        errorThreshold: 2.0
      },
      costData: {
        costPerUnit: 25 + i * 5,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `${type} ${color} ${power}`,
        tags: ['led', 'oświetlenie', 'taśma', color.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // Sterowniki i zasilacze
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Zasilacz LED', 'Sterownik RGB', 'Ściemniacz', 'Kontroler WIFI']
    const type = types[i % types.length]
    const powers = ['12V 60W', '24V 100W', '24V 150W', '12V 30W']
    const power = powers[i % powers.length]
    
    return {
      id: generateMaterialId('LED_CTRL', i + 1),
      fabManageCode: `LED_CTRL_${type.replace(/ /g, '_').toUpperCase()}_${power.replace(/[ V]/g, '_')}_${String(i + 1).padStart(3, '0')}`,
      universalName: `${type} ${power}`,
      category: MaterialCategory.ELECTRONICS,
      type: 'Sterownik LED',
      physicalProperties: {
        color: '#000000',
        finish: 'Plastik'
      },
      designProperties: {
        renderColor: '#000000',
        roughness: 0.6,
        metallic: 0.0,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 1.0,
        errorThreshold: 2.0
      },
      costData: {
        costPerUnit: 80 + i * 10,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `${type} ${power}`,
        tags: ['led', 'sterownik', 'elektronika', type.toLowerCase()]
      }
    } as UniversalMaterial
  }),

  // === TEXTILES (Tkaniny) - 30 materiałów ===
  
  // Tkaniny tapicerskie
  ...Array.from({ length: 30 }, (_, i) => {
    const types = ['Welur', 'Skóra eko', 'Tkanina bouclé', 'Len', 'Bawełna', 'Mikrofibra']
    const type = types[i % types.length]
    const colors = ['Beżowy', 'Szary', 'Granatowy', 'Czarny', 'Brązowy', 'Zielony']
    const color = colors[i % colors.length]
    const patterns = ['Gładki', 'Wzór geometryczny', 'Melanż', 'Strukturalny']
    const pattern = patterns[i % patterns.length]
    
    return {
      id: generateMaterialId('TEXTILE', i + 1),
      fabManageCode: `TEXTILE_${type.replace(/ /g, '_').toUpperCase()}_${color.toUpperCase()}_${pattern.replace(/ /g, '_').toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      universalName: `${type} ${color} ${pattern}`,
      category: MaterialCategory.TEXTILES,
      type: type,
      physicalProperties: {
        color: color === 'Beżowy' ? '#F5F5DC' : color === 'Szary' ? '#808080' : '#000080',
        finish: pattern
      },
      designProperties: {
        renderColor: color === 'Beżowy' ? '#F5F5DC' : color === 'Szary' ? '#808080' : '#000080',
        roughness: 0.8,
        metallic: 0.0,
        transparency: 0.0
      },
      validationRules: {
        warningThreshold: 5.0,
        errorThreshold: 10.0
      },
      costData: {
        costPerUnit: 45 + i * 3,
        currency: 'PLN',
        lastUpdated: daysAgo(Math.floor(Math.random() * 30))
      },
      metadata: {
        isStandardItem: true,
        isCustomOrder: false,
        createdBy: 'system',
        lastModified: daysAgo(Math.floor(Math.random() * 30)),
        description: `${type} ${color.toLowerCase()} ${pattern.toLowerCase()}`,
        tags: ['tkanina', 'tapicerstwo', type.toLowerCase(), color.toLowerCase()]
      }
    } as UniversalMaterial
  })
]

// 20 materiałów NA STANIE w magazynie - najczęściej używane
export const ummsTestInventory: InventoryData[] = [
  // MDF 18mm Standard - najczęściej używany
  {
    materialId: 'mat_mdf_001',
    currentStock: 45,
    unit: 'szt',
    reservedQuantity: 8,
    availableQuantity: 37,
    minStockLevel: 10,
    maxStockLevel: 80,
    reorderPoint: 15,
    leadTime: 7,
    location: 'A1-01',
    abcClass: 'A'
  },
  // Sklejka brzoza 12mm
  {
    materialId: 'mat_sklejka_001',
    currentStock: 28,
    unit: 'szt',
    reservedQuantity: 5,
    availableQuantity: 23,
    minStockLevel: 8,
    maxStockLevel: 50,
    reorderPoint: 12,
    leadTime: 10,
    location: 'A1-02',
    abcClass: 'A'
  },
  // Płyta wiórowa 18mm laminowana
  {
    materialId: 'mat_wiorowa_002',
    currentStock: 32,
    unit: 'szt',
    reservedQuantity: 3,
    availableQuantity: 29,
    minStockLevel: 10,
    maxStockLevel: 60,
    reorderPoint: 15,
    leadTime: 5,
    location: 'A2-01',
    abcClass: 'A'
  },
  // Plexi bezbarwne 5mm
  {
    materialId: 'mat_plexi_001',
    currentStock: 15,
    unit: 'szt',
    reservedQuantity: 2,
    availableQuantity: 13,
    minStockLevel: 5,
    maxStockLevel: 25,
    reorderPoint: 8,
    leadTime: 14,
    location: 'B1-01',
    abcClass: 'B'
  },
  // Profil ALU kątownik 30x30x3
  {
    materialId: 'mat_alu_002',
    currentStock: 120,
    unit: 'mb',
    reservedQuantity: 35,
    availableQuantity: 85,
    minStockLevel: 50,
    maxStockLevel: 200,
    reorderPoint: 75,
    leadTime: 21,
    location: 'C1-01',
    abcClass: 'A'
  },
  // Śruba DIN 912 M6x20
  {
    materialId: 'mat_sruba_007',
    currentStock: 2500,
    unit: 'szt',
    reservedQuantity: 150,
    availableQuantity: 2350,
    minStockLevel: 500,
    maxStockLevel: 5000,
    reorderPoint: 1000,
    leadTime: 3,
    location: 'D1-01',
    abcClass: 'A'
  },
  // Zawias standardowy
  {
    materialId: 'mat_okucia_001',
    currentStock: 180,
    unit: 'szt',
    reservedQuantity: 24,
    availableQuantity: 156,
    minStockLevel: 50,
    maxStockLevel: 300,
    reorderPoint: 80,
    leadTime: 7,
    location: 'D2-01',
    abcClass: 'B'
  },
  // Taśma LED 2835 3000K
  {
    materialId: 'mat_led_strip_001',
    currentStock: 85,
    unit: 'mb',
    reservedQuantity: 12,
    availableQuantity: 73,
    minStockLevel: 25,
    maxStockLevel: 150,
    reorderPoint: 40,
    leadTime: 14,
    location: 'E1-01',
    abcClass: 'B'
  },
  // Zasilacz LED 24V 100W
  {
    materialId: 'mat_led_ctrl_002',
    currentStock: 12,
    unit: 'szt',
    reservedQuantity: 2,
    availableQuantity: 10,
    minStockLevel: 5,
    maxStockLevel: 20,
    reorderPoint: 8,
    leadTime: 10,
    location: 'E2-01',
    abcClass: 'B'
  },
  // Welur beżowy gładki
  {
    materialId: 'mat_textile_001',
    currentStock: 45,
    unit: 'm2',
    reservedQuantity: 8,
    availableQuantity: 37,
    minStockLevel: 15,
    maxStockLevel: 80,
    reorderPoint: 25,
    leadTime: 21,
    location: 'F1-01',
    abcClass: 'B'
  },
  // MDF 12mm standard
  {
    materialId: 'mat_mdf_004',
    currentStock: 22,
    unit: 'szt',
    reservedQuantity: 4,
    availableQuantity: 18,
    minStockLevel: 8,
    maxStockLevel: 40,
    reorderPoint: 12,
    leadTime: 7,
    location: 'A1-03',
    abcClass: 'B'
  },
  // Śruba do drewna 4x20
  {
    materialId: 'mat_sruba_015',
    currentStock: 1800,
    unit: 'szt',
    reservedQuantity: 200,
    availableQuantity: 1600,
    minStockLevel: 500,
    maxStockLevel: 3000,
    reorderPoint: 800,
    leadTime: 5,
    location: 'D1-02',
    abcClass: 'A'
  },
  // Kołek drewniany 8mm
  {
    materialId: 'mat_laczniki_001',
    currentStock: 5000,
    unit: 'szt',
    reservedQuantity: 300,
    availableQuantity: 4700,
    minStockLevel: 1000,
    maxStockLevel: 8000,
    reorderPoint: 2000,
    leadTime: 7,
    location: 'D3-01',
    abcClass: 'A'
  },
  // Sklejka okume 15mm
  {
    materialId: 'mat_sklejka_007',
    currentStock: 18,
    unit: 'szt',
    reservedQuantity: 3,
    availableQuantity: 15,
    minStockLevel: 6,
    maxStockLevel: 30,
    reorderPoint: 10,
    leadTime: 14,
    location: 'A1-04',
    abcClass: 'B'
  },
  // Plexi białe 3mm
  {
    materialId: 'mat_plexi_002',
    currentStock: 25,
    unit: 'szt',
    reservedQuantity: 4,
    availableQuantity: 21,
    minStockLevel: 8,
    maxStockLevel: 40,
    reorderPoint: 12,
    leadTime: 14,
    location: 'B1-02',
    abcClass: 'B'
  },
  // Uchwyt standard
  {
    materialId: 'mat_okucia_002',
    currentStock: 95,
    unit: 'szt',
    reservedQuantity: 12,
    availableQuantity: 83,
    minStockLevel: 30,
    maxStockLevel: 150,
    reorderPoint: 50,
    leadTime: 10,
    location: 'D2-02',
    abcClass: 'B'
  },
  // LED Neon Flex 4000K
  {
    materialId: 'mat_led_strip_004',
    currentStock: 65,
    unit: 'mb',
    reservedQuantity: 8,
    availableQuantity: 57,
    minStockLevel: 20,
    maxStockLevel: 100,
    reorderPoint: 35,
    leadTime: 21,
    location: 'E1-02',
    abcClass: 'B'
  },
  // Skóra eko szara
  {
    materialId: 'mat_textile_007',
    currentStock: 32,
    unit: 'm2',
    reservedQuantity: 5,
    availableQuantity: 27,
    minStockLevel: 10,
    maxStockLevel: 50,
    reorderPoint: 18,
    leadTime: 28,
    location: 'F1-02',
    abcClass: 'C'
  },
  // MDF 6mm do gięcia
  {
    materialId: 'mat_mdf_002',
    currentStock: 8,
    unit: 'szt',
    reservedQuantity: 2,
    availableQuantity: 6,
    minStockLevel: 5,
    maxStockLevel: 20,
    reorderPoint: 8,
    leadTime: 10,
    location: 'A1-05',
    abcClass: 'C'
  },
  // Sterownik RGB
  {
    materialId: 'mat_led_ctrl_007',
    currentStock: 15,
    unit: 'szt',
    reservedQuantity: 1,
    availableQuantity: 14,
    minStockLevel: 5,
    maxStockLevel: 25,
    reorderPoint: 8,
    leadTime: 14,
    location: 'E2-02',
    abcClass: 'C'
  }
]

// Przykładowe zamówienia materiałów
export const ummsTestOrders: MaterialOrder[] = [
  {
    id: 'order_001',
    materialId: 'mat_mdf_020', // MDF 30mm - nie ma na stanie
    materialName: 'MDF 30mm Standard',
    quantity: 15,
    unit: 'szt',
    projectId: 'proj_001',
    requestedBy: 'Jan Kowalski',
    requestedAt: daysAgo(3),
    status: OrderStatus.TO_ORDER,
    priority: 'high',
    notes: 'Potrzebne na projekt wystawy',
    estimatedCost: 1250.00,
    estimatedDelivery: daysAgo(-7) // za 7 dni
  },
  {
    id: 'order_002',
    materialId: 'mat_plexi_008', // Plexi czerwone 10mm
    materialName: 'Plexi Czerwone 10mm',
    quantity: 8,
    unit: 'szt',
    projectId: 'proj_002',
    requestedBy: 'Anna Nowak',
    requestedAt: daysAgo(5),
    status: OrderStatus.ORDERED,
    priority: 'medium',
    notes: 'Zamówione u Akryl-Pol',
    orderNumber: 'AP-2024-0156',
    estimatedCost: 720.00,
    estimatedDelivery: daysAgo(-10) // za 10 dni
  },
  {
    id: 'order_003',
    materialId: 'mat_textile_025', // Tkanina bouclé zielona
    materialName: 'Tkanina bouclé Zielona Strukturalna',
    quantity: 25,
    unit: 'm2',
    projectId: 'proj_003',
    requestedBy: 'Piotr Wiśniewski',
    requestedAt: daysAgo(8),
    status: OrderStatus.RECEIVED,
    priority: 'low',
    notes: 'Dostarczone, czeka na rozładunek',
    orderNumber: 'TEX-2024-0089',
    estimatedCost: 1875.00,
    actualDelivery: daysAgo(1)
  },
  {
    id: 'order_004',
    materialId: 'mat_alu_012', // Profil U 40x20x2
    materialName: 'Profil U ALU 40x20x2',
    quantity: 180,
    unit: 'mb',
    requestedBy: 'Tomasz Król',
    requestedAt: daysAgo(2),
    status: OrderStatus.TO_ORDER,
    priority: 'medium',
    notes: 'Sprawdzić dostępność u 3 dostawców',
    estimatedCost: 2160.00
  },
  {
    id: 'order_005',
    materialId: 'mat_led_strip_012', // LED Strip RGB 14.4W/m
    materialName: 'LED Strip 5050 RGB 14.4W/m',
    quantity: 50,
    unit: 'mb',
    projectId: 'proj_004',
    requestedBy: 'Magdalena Zielińska',
    requestedAt: daysAgo(6),
    status: OrderStatus.ORDERED,
    priority: 'high',
    notes: 'Termin realizacji projektu: 2 tygodnie',
    orderNumber: 'LED-2024-0234',
    trackingNumber: 'DPD123456789',
    estimatedCost: 1750.00,
    estimatedDelivery: daysAgo(-3) // za 3 dni
  }
]
