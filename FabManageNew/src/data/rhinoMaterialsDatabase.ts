// Baza danych materiałów na podstawie rhino.txt
// Struktura 1:1 z hierarchią warstw Rhino CAD

export interface RhinoMaterialData {
    id: string
    code: string
    name: string
    category: string[]
    thickness?: number
    variant?: string
    unit: string
    stock: number
    minStock: number
    maxStock: number
    supplier: string
    supplierCode?: string
    price: number
    lastDelivery?: Date
    location?: string
    abcClass?: 'A' | 'B' | 'C'
    properties?: {
        color?: string
        finish?: string
        fireResistant?: boolean
        flexible?: boolean
        waterResistant?: boolean
        diameter?: string
        angle?: string
        [key: string]: any
    }
}

// Hierarchia kategorii BEZPOŚREDNIO z rhino.txt
export const rhinoCategories = {
    "_MATERIAL": {
        name: "Materiały",
        subcategories: {
            "MDF": {
                name: "MDF",
                subcategories: {
                    "6mm": {
                        name: "6mm",
                        variants: ["DO_GIECIA", "TRUDNOPALNA"]
                    },
                    "8mm": {
                        name: "8mm",
                        variants: ["DO_GIECIA", "TRUDNOPALNA"]
                    },
                    "10mm": {
                        name: "10mm",
                        variants: ["DO_GIECIA", "TRUDNOPALNA"]
                    },
                    "12mm": {
                        name: "12mm",
                        variants: []
                    },
                    "18mm": {
                        name: "18mm",
                        variants: ["DO_GIECIA", "TRUDNOPALNA"]
                    },
                    "30mm": {
                        name: "30mm",
                        variants: []
                    },
                    "40mm": {
                        name: "40mm",
                        variants: []
                    }
                }
            },
            "SKLEJKA": {
                name: "Sklejka",
                subcategories: {
                    "3MM": {
                        name: "3mm",
                        variants: ["DO_GIECIA"]
                    },
                    "12mm": {
                        name: "12mm",
                        variants: []
                    },
                    "16mm": {
                        name: "16mm",
                        variants: []
                    },
                    "18mm": {
                        name: "18mm",
                        variants: []
                    }
                }
            },
            "WIOROWA": {
                name: "Płyta wiórowa",
                subcategories: {
                    "6mm": {
                        name: "6mm",
                        variants: ["LAMINOWANA", "SUROWA"]
                    },
                    "8mm": {
                        name: "8mm",
                        variants: []
                    },
                    "10mm": {
                        name: "10mm",
                        variants: []
                    },
                    "12mm": {
                        name: "12mm",
                        variants: []
                    },
                    "18mm": {
                        name: "18mm",
                        variants: ["LAMINOWANA"]
                    },
                    "30mm": {
                        name: "30mm",
                        variants: []
                    },
                    "40mm": {
                        name: "40mm",
                        variants: []
                    }
                }
            },
            "ALUMINIUM": {
                name: "Aluminium",
                subcategories: {
                    "KATOWNIKI": {
                        name: "Kątowniki",
                        variants: []
                    }
                }
            },
            "DILITE": {
                name: "Dilite",
                subcategories: {
                    "bialy": { name: "Dilite biały", variants: [] },
                    "drapany": { name: "Dilite drapany", variants: [] },
                    "srebrny": { name: "Dilite srebrny", variants: [] }
                }
            },
            "GK": {
                name: "Gips-karton",
                subcategories: {
                    "standardowy": { name: "GK standardowy", variants: [] },
                    "dystanse": { name: "GK z dystansami", variants: [] },
                    "profile": { name: "GK z profilami", variants: [] },
                    "riflex": { name: "GK riflex", variants: [] }
                }
            },
            "HDF": {
                name: "HDF",
                subcategories: {
                    "3mm": { name: "HDF 3mm", variants: [] },
                    "4mm": { name: "HDF 4mm", variants: [] }
                }
            },
            "PLEXI": {
                name: "Plexi",
                subcategories: {
                    "4mm": { name: "Plexi 4mm", variants: [] },
                    "4mm_opal_satin": { name: "Plexi 4mm opal satin", variants: [] },
                    "5mm": { name: "Plexi 5mm", variants: [] },
                    "6mm": { name: "Plexi 6mm", variants: [] },
                    "6mm_dual_satin": { name: "Plexi dual satin 6mm", variants: [] },
                    "6mm_opal": { name: "Plexi opal 6mm", variants: [] },
                    "10mm": { name: "Plexi 10mm", variants: [] },
                    "10mm_opal": { name: "Plexi opal 10mm", variants: [] },
                    "15mm": { name: "Plexi 15mm", variants: [] },
                    "30mm_opal": { name: "Plexi opal 30mm", variants: [] }
                }
            },
            "POLIWEGLAN": {
                name: "Poliwęglan",
                subcategories: {
                    "komorowy_10mm": { name: "Komorowy 10mm", variants: [] }
                }
            },
            "POZOSTALE": {
                name: "Pozostałe materiały",
                subcategories: {
                    "cetris_18mm": { name: "Cetris 18mm", variants: [] },
                    "corian": { name: "Corian", variants: [] },
                    "czarna_polysk": { name: "Czarna polysk", variants: [] },
                    "hips": { name: "HIPS", variants: [] },
                    "horyzont": { name: "Horyzont", variants: [] },
                    "lata": { name: "Łata", variants: [] },
                    "panele": { name: "Panele", variants: [] },
                    "pcv": { name: "PCV", variants: [] },
                    "perforacja_siatka": { name: "Perforacja siatka", variants: [] },
                    "ramiaki": { name: "Ramiaki", variants: [] },
                    "stal": { name: "Stal", variants: [] },
                    "styrodur": { name: "Styrodur", variants: [] },
                    "szklo": { name: "Szkło", variants: [] },
                    "sruby": { name: "Śruby", variants: [] },
                    "tkanina": { name: "Tkanina", variants: [] },
                    "wydruk3d": { name: "Wydruk 3D", variants: [] },
                    "wykladzina": { name: "Wykładzina", variants: [] }
                }
            }
        }
    },
    "_PLOTER": {
        name: "Ploter CNC",
        subcategories: {
            "_ARCHIV": { name: "Archiwum", variants: [] },
            "_WYCINANIE": { name: "Wycinanie", variants: [] },
            "ILOSCI": { name: "Ilości", variants: [] },
            "NAZWY": { name: "Nazwy", variants: [] },
            "OTWOR": {
                name: "Otwory",
                subcategories: {
                    "D3mm": { name: "⌀3.0mm", variants: [] },
                    "D4mm": { name: "⌀4.0mm", subcategories: { "GL10mm": { name: "GL=10mm", variants: [] } } },
                    "D5mm": { name: "⌀5.0mm", variants: [] },
                    "D6mm": { name: "⌀6.0mm", subcategories: { "GL9mm": { name: "GL=9.00mm", variants: [] } } },
                    "D8mm": { name: "⌀8.0mm", variants: [] },
                    "D25mm": { name: "⌀25.0mm", variants: [] }
                }
            },
            "FREZ": {
                name: "Frezy",
                subcategories: {
                    "PLASKI": {
                        name: "Płaski",
                        subcategories: {
                            "GL2mm": { name: "GL=2.0mm", variants: [] },
                            "GL3mm": { name: "GL=3.0mm", variants: [] },
                            "GL4mm": { name: "GL=4.0mm", variants: [] },
                            "GL5mm": { name: "GL=5.0mm", variants: [] },
                            "GL6mm": { name: "GL=6.0mm", variants: [] },
                            "GL7mm": { name: "GL=7.0mm", variants: [] },
                            "GL8mm": { name: "GL=8.0mm", variants: [] },
                            "GL9mm": { name: "GL=9.0mm", variants: [] },
                            "GL10mm": { name: "GL=10.0mm", variants: [] },
                            "GL14mm": { name: "GL=14.0mm", variants: [] }
                        }
                    },
                    "STOZKOWY": {
                        name: "Stożkowy",
                        subcategories: {
                            "15deg": { name: "15°", variants: [] },
                            "30deg": { name: "30°", variants: [] },
                            "45deg": { name: "45°", variants: [] },
                            "60deg": { name: "60°", variants: [] }
                        }
                    }
                }
            },
            "WARSTWY": { name: "Warstwy", variants: [] }
        }
    },
    "_ELEMENTY": {
        name: "Elementy projektowe",
        subcategories: {
            "_DRUK3D": { name: "Druk 3D", variants: [] },
            "blatowanie": { name: "Blatowanie", variants: [] },
            "meble": { name: "Meble", variants: [] },
            "podesty": { name: "Podesty", variants: [] },
            "schody_pochylnie": { name: "Schody i pochylnie", variants: [] },
            "sciana": { name: "Ściana", variants: [] },
            "stan_istniejacy": { name: "Stan istniejący", variants: [] },
            "sufit": { name: "Sufit", variants: [] },
            "trybuny": { name: "Trybuny", variants: [] },
            "ekran": { name: "Ekran", variants: [] },
            "dioda": { name: "Dioda", variants: [] },
            "komputer": { name: "Komputer", variants: [] },
            "mechanizmy": { name: "Mechanizmy", variants: [] },
            "bitek": { name: "Bitek", variants: [] },
            "peri": { name: "Peri", variants: [] },
            "praktikable": { name: "Praktikable", variants: [] },
            "rusztowanie": { name: "Rusztowanie", variants: [] },
            "kolki": { name: "Kołki", variants: [] }
        }
    }
}

// Generator realistycznych materiałów na podstawie struktury rhino
const rawRhinoMaterials: RhinoMaterialData[] = [
    // ===== MATERIAŁY =====

    // MDF 6mm
    {
        id: "MAT_R001",
        code: "_MATERIAL/MDF/6mm/STANDARD",
        name: "MDF 6mm Standard",
        category: ["_MATERIAL", "MDF"],
        thickness: 6,
        unit: "arkusz",
        stock: 35,
        minStock: 20,
        maxStock: 80,
        supplier: "Kronopol",
        price: 45.50,
        lastDelivery: new Date("2025-01-10"),
        location: "A1-01",
        abcClass: "B",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },
    {
        id: "MAT_R002",
        code: "_MATERIAL/MDF/6mm/DO_GIECIA",
        name: "MDF 6mm Do gięcia",
        category: ["_MATERIAL", "MDF"],
        thickness: 6,
        variant: "DO_GIECIA",
        unit: "arkusz",
        stock: 12,
        minStock: 15,
        maxStock: 40,
        supplier: "Kronopol",
        price: 68.00,
        lastDelivery: new Date("2024-12-20"),
        location: "A1-02",
        abcClass: "C",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: true,
            waterResistant: false
        }
    },
    {
        id: "MAT_R003",
        code: "_MATERIAL/MDF/6mm/TRUDNOPALNA",
        name: "MDF 6mm Trudnopalna",
        category: ["_MATERIAL", "MDF", "6mm"],
        thickness: 6,
        variant: "TRUDNOPALNA",
        unit: "arkusz",
        stock: 8,
        minStock: 10,
        maxStock: 25,
        supplier: "Pfleiderer",
        price: 89.00,
        lastDelivery: new Date("2024-11-15"),
        location: "A1-03",
        abcClass: "C",
        properties: {
            color: "czerwony",
            finish: "gładki",
            fireResistant: true,
            flexible: false,
            waterResistant: false
        }
    },

    // MDF 8mm
    {
        id: "MAT_R004",
        code: "_MATERIAL/MDF/8mm/STANDARD",
        name: "MDF 8mm Standard",
        category: ["_MATERIAL", "MDF", "8mm"],
        thickness: 8,
        unit: "arkusz",
        stock: 28,
        minStock: 20,
        maxStock: 60,
        supplier: "Kronopol",
        price: 52.50,
        lastDelivery: new Date("2025-01-08"),
        location: "A1-04",
        abcClass: "B",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },
    {
        id: "MAT_R005",
        code: "_MATERIAL/MDF/8mm/DO_GIECIA",
        name: "MDF 8mm Do gięcia",
        category: ["_MATERIAL", "MDF", "8mm"],
        thickness: 8,
        variant: "DO_GIECIA",
        unit: "arkusz",
        stock: 15,
        minStock: 12,
        maxStock: 35,
        supplier: "Kronopol",
        price: 74.00,
        lastDelivery: new Date("2024-12-28"),
        location: "A1-05",
        abcClass: "B",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: true,
            waterResistant: false
        }
    },

    // MDF 10mm
    {
        id: "MAT_R006",
        code: "_MATERIAL/MDF/10mm/STANDARD",
        name: "MDF 10mm Standard",
        category: ["_MATERIAL", "MDF", "10mm"],
        thickness: 10,
        unit: "arkusz",
        stock: 42,
        minStock: 25,
        maxStock: 70,
        supplier: "Kronopol",
        price: 63.50,
        lastDelivery: new Date("2025-01-12"),
        location: "A1-06",
        abcClass: "A",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },

    // MDF 12mm
    {
        id: "MAT_R007",
        code: "_MATERIAL/MDF/12mm/STANDARD",
        name: "MDF 12mm Standard",
        category: ["_MATERIAL", "MDF", "12mm"],
        thickness: 12,
        unit: "arkusz",
        stock: 55,
        minStock: 30,
        maxStock: 90,
        supplier: "Kronopol",
        price: 78.50,
        lastDelivery: new Date("2025-01-05"),
        location: "A1-07",
        abcClass: "A",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },

    // MDF 18mm
    {
        id: "MAT_R008",
        code: "_MATERIAL/MDF/18mm/STANDARD",
        name: "MDF 18mm Standard",
        category: ["_MATERIAL", "MDF", "18mm"],
        thickness: 18,
        unit: "arkusz",
        stock: 68,
        minStock: 40,
        maxStock: 120,
        supplier: "Kronopol",
        price: 125.50,
        lastDelivery: new Date("2025-01-10"),
        location: "A1-08",
        abcClass: "A",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },
    {
        id: "MAT_R009",
        code: "_MATERIAL/MDF/18mm/DO_GIECIA",
        name: "MDF 18mm Do gięcia",
        category: ["_MATERIAL", "MDF", "18mm"],
        thickness: 18,
        variant: "DO_GIECIA",
        unit: "arkusz",
        stock: 8,
        minStock: 15,
        maxStock: 45,
        supplier: "Kronopol",
        price: 168.00,
        lastDelivery: new Date("2024-12-20"),
        location: "A1-09",
        abcClass: "B",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: true,
            waterResistant: false
        }
    },

    // MDF 30mm i 40mm
    {
        id: "MAT_R010",
        code: "_MATERIAL/MDF/30mm/STANDARD",
        name: "MDF 30mm Standard",
        category: ["_MATERIAL", "MDF", "30mm"],
        thickness: 30,
        unit: "arkusz",
        stock: 12,
        minStock: 8,
        maxStock: 25,
        supplier: "Pfleiderer",
        price: 245.00,
        lastDelivery: new Date("2024-11-20"),
        location: "A1-10",
        abcClass: "C",
        properties: {
            color: "surowy",
            finish: "gładki",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },

    // ===== SKLEJKA =====
    {
        id: "MAT_R011",
        code: "_MATERIAL/SKLEJKA/3MM/STANDARD",
        name: "Sklejka 3mm Standard",
        category: ["_MATERIAL", "SKLEJKA", "3MM"],
        thickness: 3,
        unit: "arkusz",
        stock: 25,
        minStock: 15,
        maxStock: 50,
        supplier: "Paged",
        price: 38.00,
        lastDelivery: new Date("2025-01-08"),
        location: "A2-01",
        abcClass: "B",
        properties: {
            color: "naturalna brzoza",
            finish: "szlifowana",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },
    {
        id: "MAT_R012",
        code: "_MATERIAL/SKLEJKA/3MM/DO_GIECIA",
        name: "Sklejka 3mm Do gięcia",
        category: ["_MATERIAL", "SKLEJKA", "3MM"],
        thickness: 3,
        variant: "DO_GIECIA",
        unit: "arkusz",
        stock: 18,
        minStock: 10,
        maxStock: 30,
        supplier: "Paged",
        price: 52.00,
        lastDelivery: new Date("2024-12-15"),
        location: "A2-02",
        abcClass: "B",
        properties: {
            color: "naturalna brzoza",
            finish: "szlifowana",
            fireResistant: false,
            flexible: true,
            waterResistant: false
        }
    },

    // ===== WIOROWA =====
    {
        id: "MAT_R013",
        code: "_MATERIAL/WIOROWA/6mm/SUROWA",
        name: "Płyta wiórowa 6mm Surowa",
        category: ["_MATERIAL", "WIOROWA", "6mm"],
        thickness: 6,
        variant: "SUROWA",
        unit: "arkusz",
        stock: 32,
        minStock: 20,
        maxStock: 60,
        supplier: "Egger",
        price: 35.00,
        lastDelivery: new Date("2025-01-05"),
        location: "A3-01",
        abcClass: "B",
        properties: {
            color: "surowa",
            finish: "naturalna",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },
    {
        id: "MAT_R014",
        code: "_MATERIAL/WIOROWA/6mm/LAMINOWANA",
        name: "Płyta wiórowa 6mm Laminowana",
        category: ["_MATERIAL", "WIOROWA", "6mm"],
        thickness: 6,
        variant: "LAMINOWANA",
        unit: "arkusz",
        stock: 28,
        minStock: 15,
        maxStock: 50,
        supplier: "Egger",
        price: 48.00,
        lastDelivery: new Date("2024-12-28"),
        location: "A3-02",
        abcClass: "B",
        properties: {
            color: "biała",
            finish: "laminat",
            fireResistant: false,
            flexible: false,
            waterResistant: false
        }
    },

    // ===== PLEXI =====
    {
        id: "MAT_R015",
        code: "_MATERIAL/PLEXI/4mm/STANDARD",
        name: "Plexi 4mm Standard",
        category: ["_MATERIAL", "PLEXI", "4mm"],
        thickness: 4,
        unit: "arkusz",
        stock: 45,
        minStock: 25,
        maxStock: 80,
        supplier: "PlastPro",
        price: 68.00,
        lastDelivery: new Date("2025-01-10"),
        location: "B1-01",
        abcClass: "A",
        properties: {
            color: "bezbarwna",
            finish: "błyszcząca",
            fireResistant: false,
            flexible: false,
            waterResistant: true
        }
    },
    {
        id: "MAT_R016",
        code: "_MATERIAL/PLEXI/4mm/OPAL_SATIN",
        name: "Plexi 4mm Opal Satin",
        category: ["_MATERIAL", "PLEXI", "4mm_opal_satin"],
        thickness: 4,
        variant: "OPAL_SATIN",
        unit: "arkusz",
        stock: 22,
        minStock: 15,
        maxStock: 40,
        supplier: "PlastPro",
        price: 89.00,
        lastDelivery: new Date("2024-12-20"),
        location: "B1-02",
        abcClass: "B",
        properties: {
            color: "opal",
            finish: "satynowa",
            fireResistant: false,
            flexible: false,
            waterResistant: true
        }
    },

    // ===== ALUMINIUM =====
    {
        id: "MAT_R017",
        code: "_MATERIAL/ALUMINIUM/KATOWNIKI/20x20",
        name: "Kątownik aluminiowy 20x20mm",
        category: ["_MATERIAL", "ALUMINIUM", "KATOWNIKI"],
        unit: "mb",
        stock: 125,
        minStock: 50,
        maxStock: 200,
        supplier: "AluMetal",
        price: 18.50,
        lastDelivery: new Date("2025-01-08"),
        location: "C1-01",
        abcClass: "A",
        properties: {
            color: "srebrny anodowany",
            finish: "anodowane",
            fireResistant: false,
            flexible: false,
            waterResistant: true
        }
    },

    // ===== PLOTER CNC =====

    // Otwory
    {
        id: "MAT_R018",
        code: "_PLOTER/OTWOR/D3mm",
        name: "Wiertło ⌀3.0mm",
        category: ["_PLOTER", "OTWOR", "D3mm"],
        unit: "sztuka",
        stock: 25,
        minStock: 10,
        maxStock: 50,
        supplier: "CNC Tools",
        price: 12.50,
        lastDelivery: new Date("2025-01-05"),
        location: "D1-01",
        abcClass: "B",
        properties: {
            diameter: "3.0mm",
            material: "HSS",
            coating: "TiN"
        }
    },
    {
        id: "MAT_R019",
        code: "_PLOTER/OTWOR/D4mm",
        name: "Wiertło ⌀4.0mm",
        category: ["_PLOTER", "OTWOR", "D4mm"],
        unit: "sztuka",
        stock: 18,
        minStock: 8,
        maxStock: 30,
        supplier: "CNC Tools",
        price: 15.00,
        lastDelivery: new Date("2024-12-28"),
        location: "D1-02",
        abcClass: "B",
        properties: {
            diameter: "4.0mm",
            material: "HSS",
            coating: "TiN"
        }
    },

    // Frezy płaskie
    {
        id: "MAT_R020",
        code: "_PLOTER/FREZ/PLASKI/GL6mm",
        name: "Frez płaski GL=6.0mm",
        category: ["_PLOTER", "FREZ", "PLASKI"],
        unit: "sztuka",
        stock: 12,
        minStock: 5,
        maxStock: 25,
        supplier: "CNC Tools",
        price: 45.00,
        lastDelivery: new Date("2024-12-20"),
        location: "D1-03",
        abcClass: "B",
        properties: {
            diameter: "6.0mm",
            length: "22mm",
            material: "Carbide",
            coating: "TiAlN"
        }
    },

    // Frezy stożkowe
    {
        id: "MAT_R021",
        code: "_PLOTER/FREZ/STOZKOWY/30deg",
        name: "Frez stożkowy 30°",
        category: ["_PLOTER", "FREZ", "STOZKOWY"],
        unit: "sztuka",
        stock: 8,
        minStock: 3,
        maxStock: 15,
        supplier: "CNC Tools",
        price: 125.00,
        lastDelivery: new Date("2024-11-15"),
        location: "D1-04",
        abcClass: "C",
        properties: {
            angle: "30°",
            diameter: "6.0mm",
            material: "Carbide",
            coating: "Diamond"
        }
    },

    // ===== ELEMENTY PROJEKTOWE =====

    // Druk 3D
    {
        id: "MAT_R022",
        code: "_ELEMENTY/_DRUK3D/FILAMENT_PLA",
        name: "Filament PLA 1.75mm",
        category: ["_ELEMENTY", "_DRUK3D"],
        unit: "kg",
        stock: 15,
        minStock: 8,
        maxStock: 30,
        supplier: "3D Print",
        price: 89.00,
        lastDelivery: new Date("2025-01-10"),
        location: "E1-01",
        abcClass: "B",
        properties: {
            color: "różne kolory",
            material: "PLA",
            diameter: "1.75mm",
            temperature: "190-220°C"
        }
    },

    // Mechanizmy
    {
        id: "MAT_R023",
        code: "_ELEMENTY/mechanizmy/SILNIK_KROK",
        name: "Silnik krokowy NEMA17",
        category: ["_ELEMENTY", "mechanizmy"],
        unit: "sztuka",
        stock: 6,
        minStock: 4,
        maxStock: 12,
        supplier: "Automation",
        price: 155.00,
        lastDelivery: new Date("2024-12-15"),
        location: "E1-02",
        abcClass: "C",
        properties: {
            voltage: "12V",
            torque: "0.4Nm",
            steps: "200/rev",
            connector: "JST"
        }
    },

    // Praktikable
    {
        id: "MAT_R024",
        code: "_ELEMENTY/praktikable/PODEST_1x1",
        name: "Podest praktikable 1x1m",
        category: ["_ELEMENTY", "praktikable"],
        unit: "sztuka",
        stock: 24,
        minStock: 15,
        maxStock: 40,
        supplier: "Stage Equipment",
        price: 450.00,
        lastDelivery: new Date("2025-01-05"),
        location: "F1-01",
        abcClass: "A",
        properties: {
            dimension: "1000x1000mm",
            height: "200mm",
            material: "aluminium",
            load: "750kg/m²"
        }
    },

    // Więcej przykładowych materiałów dla demonstracji...
    {
        id: "MAT_R025",
        code: "_MATERIAL/DILITE/bialy",
        name: "Dilite biały 3mm",
        category: ["_MATERIAL", "DILITE", "bialy"],
        thickness: 3,
        unit: "arkusz",
        stock: 18,
        minStock: 10,
        maxStock: 35,
        supplier: "Dilite Poland",
        price: 95.00,
        lastDelivery: new Date("2024-12-28"),
        location: "B2-01",
        abcClass: "B",
        properties: {
            color: "biały",
            finish: "matowa",
            fireResistant: false,
            flexible: false,
            waterResistant: true
        }
    }
]

// Funkcja do filtrowania materiałów dla kompatybilności
export function filterRhinoMaterials(
    materials: RhinoMaterialData[],
    filters: {
        search?: string
        category?: string[]
        status?: 'all' | 'critical' | 'low' | 'normal' | 'excess'
        supplier?: string
        abcClass?: 'A' | 'B' | 'C'
    }
): RhinoMaterialData[] {
    return materials.filter(material => {
        // Filtr wyszukiwania
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const searchFields = [
                material.code,
                material.name,
                material.supplier,
                material.location,
                material.variant
            ].filter(Boolean).join(' ').toLowerCase()

            if (!searchFields.includes(searchLower)) {
                return false
            }
        }

        // Filtr kategorii — akceptuj prefiks ścieżki o dł. 1 lub 2
        if (filters.category && filters.category.length > 0) {
            const [filterMain, filterSub] = filters.category

            // Sprawdź czy materiał pasuje do wybranej kategorii
            const categoryMatches = (() => {
                // Sprawdź czy główna kategoria pasuje
                if (filterMain && !material.category.includes(filterMain)) {
                    return false
                }

                // Jeśli wybrano podkategorię, sprawdź czy materiał ją zawiera
                if (filterSub && !material.category.includes(filterSub)) {
                    return false
                }

                return true
            })()

            // Sprawdź czy kod materiału zawiera wybrane kategorie
            const codeMatches = (() => {
                if (!material.code) return false
                const filterPath = filters.category.join('/')
                return material.code.includes(filterPath)
            })()

            if (!categoryMatches && !codeMatches) {
                return false
            }
        }

        // Filtr statusu
        if (filters.status && filters.status !== 'all') {
            const stockRatio = material.stock / material.minStock
            let materialStatus: typeof filters.status = 'normal'

            if (stockRatio < 0.5) materialStatus = 'critical'
            else if (stockRatio < 1) materialStatus = 'low'
            else if (stockRatio > material.maxStock / material.minStock) materialStatus = 'excess'

            if (materialStatus !== filters.status) {
                return false
            }
        }

        // Filtr dostawcy
        if (filters.supplier && material.supplier !== filters.supplier) {
            return false
        }

        // Filtr klasy ABC
        if (filters.abcClass && material.abcClass !== filters.abcClass) {
            return false
        }

        return true
    })
}

// Funkcja do obliczania statystyk
export function calculateRhinoMaterialStats(materials: RhinoMaterialData[]) {
    const stats = {
        totalValue: 0,
        criticalCount: 0,
        lowCount: 0,
        excessCount: 0,
        totalItems: materials.length,
        byCategory: {} as Record<string, number>,
        bySupplier: {} as Record<string, number>,
        byAbcClass: { A: 0, B: 0, C: 0 }
    }

    materials.forEach(material => {
        // Wartość magazynu
        stats.totalValue += material.stock * material.price

        // Status zapasów
        const stockRatio = material.stock / material.minStock
        if (stockRatio < 0.5) stats.criticalCount++
        else if (stockRatio < 1) stats.lowCount++
        else if (stockRatio > material.maxStock / material.minStock) stats.excessCount++

        // Grupowanie po kategorii
        const mainCat = material.category[0]
        stats.byCategory[mainCat] = (stats.byCategory[mainCat] || 0) + 1

        // Grupowanie po dostawcy
        stats.bySupplier[material.supplier] = (stats.bySupplier[material.supplier] || 0) + 1

        // Grupowanie po klasie ABC
        if (material.abcClass) {
            stats.byAbcClass[material.abcClass]++
        }
    })

    return stats
}

// Funkcja do generowania hierarchii z materiałów rhino
export function buildRhinoMaterialHierarchy(materials: RhinoMaterialData[]) {
    const hierarchy: any = {}

    materials.forEach(material => {
        const [mainCat, subCat, subSubCat] = material.category

        if (!hierarchy[mainCat]) {
            hierarchy[mainCat] = {
                name: rhinoCategories[mainCat as keyof typeof rhinoCategories]?.name || mainCat,
                subcategories: {},
                materials: []
            }
        }

        if (subCat) {
            if (!hierarchy[mainCat].subcategories[subCat]) {
                hierarchy[mainCat].subcategories[subCat] = {
                    name: subCat,
                    subcategories: {},
                    materials: []
                }
            }

            if (subSubCat) {
                if (!hierarchy[mainCat].subcategories[subCat].subcategories[subSubCat]) {
                    hierarchy[mainCat].subcategories[subCat].subcategories[subSubCat] = {
                        name: subSubCat,
                        materials: []
                    }
                }
                hierarchy[mainCat].subcategories[subCat].subcategories[subSubCat].materials.push(material)
            } else {
                hierarchy[mainCat].subcategories[subCat].materials.push(material)
            }
        } else {
            hierarchy[mainCat].materials.push(material)
        }
    })

    return hierarchy
}

// Eksportowane materiały z poprawioną strukturą kategorii
export const rhinoMaterials: RhinoMaterialData[] = rawRhinoMaterials.map(material => {
    // Upraszczamy kategorie do 2-poziomowej struktury dla kompatybilności z CategoryTree
    const [mainCat, subCat] = material.category
    return {
        ...material,
        category: [mainCat, subCat]
    }
})
