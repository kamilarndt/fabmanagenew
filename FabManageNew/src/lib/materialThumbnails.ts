// System miniatur i kolorów dla różnych typów materiałów
export interface MaterialThumbnail {
    backgroundColor: string
    pattern?: string
    textureGradient?: string
    icon?: string
    textColor?: string
}

// Mapa kolorów i wzorów dla typów materiałów
export const materialThumbnails: Record<string, MaterialThumbnail> = {
    // === PŁYTY MEBLOWE ===
    'MDF': {
        backgroundColor: '#8B4513',
        textureGradient: 'linear-gradient(45deg, #8B4513 25%, #A0522D 25%, #A0522D 50%, #8B4513 50%, #8B4513 75%, #A0522D 75%)',
        icon: '🪵',
        textColor: '#fff'
    },
    'SKLEJKA': {
        backgroundColor: '#D2691E',
        textureGradient: 'linear-gradient(0deg, #D2691E 0%, #DEB887 50%, #D2691E 100%)',
        icon: '🪵',
        textColor: '#fff'
    },
    'WIOROWA': {
        backgroundColor: '#CD853F',
        textureGradient: 'linear-gradient(90deg, #CD853F 0%, #F4A460 25%, #CD853F 50%, #F4A460 75%, #CD853F 100%)',
        icon: '📦',
        textColor: '#fff'
    },
    'HDF': {
        backgroundColor: '#654321',
        textureGradient: 'linear-gradient(45deg, #654321 0%, #8B4513 100%)',
        icon: '🪵',
        textColor: '#fff'
    },

    // === TWORZYWA ===
    'PLEXI': {
        backgroundColor: '#E6F3FF',
        textureGradient: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(230,243,255,0.9) 100%)',
        icon: '💎',
        textColor: '#0066CC'
    },
    'POLIWEGLAN': {
        backgroundColor: '#F0F8FF',
        textureGradient: 'linear-gradient(180deg, rgba(240,248,255,0.9) 0%, rgba(176,224,230,0.7) 100%)',
        icon: '🔷',
        textColor: '#4682B4'
    },
    'DILITE': {
        backgroundColor: '#FFFAF0',
        textureGradient: 'linear-gradient(45deg, #FFFAF0 25%, #FFF8DC 25%, #FFF8DC 50%, #FFFAF0 50%)',
        icon: '⚪',
        textColor: '#8B4513'
    },

    // === METAL ===
    'ALUMINIUM': {
        backgroundColor: '#C0C0C0',
        textureGradient: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 25%, #B8B8B8 50%, #D3D3D3 75%, #C0C0C0 100%)',
        icon: '🔩',
        textColor: '#333'
    },
    'STAL': {
        backgroundColor: '#708090',
        textureGradient: 'linear-gradient(90deg, #708090 0%, #778899 50%, #708090 100%)',
        icon: '⚙️',
        textColor: '#fff'
    },

    // === POZOSTAŁE ===
    'GK': {
        backgroundColor: '#F5F5DC',
        textureGradient: 'linear-gradient(0deg, #F5F5DC 0%, #FFFAF0 100%)',
        icon: '🧱',
        textColor: '#8B4513'
    },
    'PLOTER': {
        backgroundColor: '#2F4F4F',
        textureGradient: 'linear-gradient(45deg, #2F4F4F 0%, #696969 100%)',
        icon: '⚡',
        textColor: '#fff'
    }
}

// Fallback dla nieznanych typów
export const defaultThumbnail: MaterialThumbnail = {
    backgroundColor: '#888888',
    textureGradient: 'linear-gradient(45deg, #888888 25%, #999999 25%, #999999 50%, #888888 50%)',
    icon: '📦',
    textColor: '#fff'
}

// Funkcja do uzyskania miniatury dla materiału
export function getMaterialThumbnail(typ?: string, rodzaj?: string): MaterialThumbnail {
    // Najpierw sprawdź typ
    if (typ && materialThumbnails[typ.toUpperCase()]) {
        return materialThumbnails[typ.toUpperCase()]
    }

    // Potem sprawdź rodzaj
    if (rodzaj) {
        const rodzajUpper = rodzaj.toUpperCase()
        for (const [key, thumbnail] of Object.entries(materialThumbnails)) {
            if (rodzajUpper.includes(key)) {
                return thumbnail
            }
        }
    }

    return defaultThumbnail
}

// Funkcja do generowania CSS dla tekstury
export function getThumbnailStyle(thumbnail: MaterialThumbnail): React.CSSProperties {
    return {
        background: thumbnail.textureGradient || thumbnail.backgroundColor,
        color: thumbnail.textColor || '#fff',
        backgroundSize: '20px 20px'
    }
}
