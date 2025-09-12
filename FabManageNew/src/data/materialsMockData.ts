// Re-export nowej bazy danych z rhino.txt dla kompatybilności
export {
  rhinoMaterials as mockMaterials,
  filterRhinoMaterials as filterMaterials,
  calculateRhinoMaterialStats as calculateMaterialStats,
  buildRhinoMaterialHierarchy as buildMaterialHierarchy
} from './rhinoMaterialsDatabase'

// Uproszczona struktura kategorii dla CategoryTree (2 poziomy)
export const materialCategories = {
  "_MATERIAL": {
    name: "Materiały",
    subcategories: {
      "MDF": { name: "MDF" },
      "SKLEJKA": { name: "Sklejka" },
      "WIOROWA": { name: "Płyta wiórowa" },
      "ALUMINIUM": { name: "Aluminium" },
      "DILITE": { name: "Dilite" },
      "GK": { name: "Gips-karton" },
      "HDF": { name: "HDF" },
      "PLEXI": { name: "Plexi" },
      "POLIWEGLAN": { name: "Poliwęglan" },
      "POZOSTALE": { name: "Pozostałe materiały" }
    }
  },
  "_PLOTER": {
    name: "Ploter CNC",
    subcategories: {
      "OTWOR": { name: "Otwory" },
      "FREZ": { name: "Frezy" },
      "WARSTWY": { name: "Warstwy" }
    }
  },
  "_ELEMENTY": {
    name: "Elementy projektowe",
    subcategories: {
      "_DRUK3D": { name: "Druk 3D" },
      "meble": { name: "Meble" },
      "mechanizmy": { name: "Mechanizmy" },
      "praktikable": { name: "Praktikable" },
      "ekran": { name: "Ekrany" }
    }
  }
}

// Zachowujemy stary interfejs dla kompatybilności
export type { RhinoMaterialData as MaterialData } from './rhinoMaterialsDatabase'

/*
Nowa baza danych materiałów zawiera pełną hierarchię z rhino.txt:

🗂️ _MATERIAL
  ├── MDF (6mm, 8mm, 10mm, 12mm, 18mm, 30mm, 40mm)
  │   └── Warianty: DO_GIECIA, TRUDNOPALNA
  ├── SKLEJKA (3MM, 12mm, 16mm, 18mm)
  │   └── Warianty: DO_GIECIA
  ├── WIOROWA (6mm, 8mm, 10mm, 12mm, 18mm, 30mm, 40mm)
  │   └── Warianty: LAMINOWANA, SUROWA
  ├── ALUMINIUM → KATOWNIKI
  ├── DILITE → biały, drapany, srebrny
  ├── GK → standardowy, dystanse, profile, riflex
  ├── HDF → 3mm, 4mm
  ├── PLEXI → 4mm, 5mm, 6mm, 10mm, 15mm (opal, satin)
  ├── POLIWEGLAN → komorowy 10mm
  └── POZOSTALE → cetris, corian, hips, stal, szkło, śruby, etc.

🗂️ _PLOTER
  ├── OTWOR → ⌀3-25mm (różne średnice)
  ├── FREZ
  │   ├── PLASKI → GL=2-14mm
  │   └── STOZKOWY → 15°, 30°, 45°, 60°
  └── WARSTWY

🗂️ _ELEMENTY
  ├── _DRUK3D
  ├── Architektura → meble, schody, ściany, sufity
  ├── Elektronika → ekrany, diody, komputery
  └── Konstrukcje → praktikable, rusztowania, kołki

Każda kategoria zawiera realistyczne materiały z:
- Kodami zgodnymi z hierarchią rhino.txt
- Stanami magazynowymi
- Cenami i dostawcami
- Lokalizacjami w magazynie
- Właściwościami technicznymi
*/