// Utility functions dla systemu klientów - FabManage

import type { ProcessedClient } from '../types/clientData.types';

// Legacy types for backward compatibility
export type CompanyClient = ProcessedClient;
export interface GeneratedLogo {
    cardColor: string;
    textColor: string;
    initials: string;
    backgroundColor: string;
}
export interface ProjectColorScheme {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
    accent: string;
}

/**
 * Generuje logo z inicjałów nazwy firmy
 */
export function generateLogoFromName(companyName: string): GeneratedLogo {
    const words = companyName.trim().split(' ');
    const initials = words
        .slice(0, 3) // Maksymalnie 3 inicjały
        .map(word => word.charAt(0).toUpperCase())
        .join('');

    // Generuj kolor na podstawie nazwy firmy (deterministyczny)
    const hash = companyName.split('').reduce((a, b) => {
        a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
        return a;
    }, 0);

    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
    const lightness = 45 + (Math.abs(hash) % 15); // 45-60%

    const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const textColor = lightness > 50 ? '#000000' : '#ffffff';

    return {
        initials,
        backgroundColor,
        textColor,
        cardColor: backgroundColor
    };
}

/**
 * Wyciąga dominujący kolor z obrazka (placeholder - w rzeczywistości użyj react-color-thief)
 */
export function extractColorFromImage(): Promise<string> {
    // TODO: Implementacja wyciągania koloru z obrazu
    // Na razie zwracamy domyślny kolor
    return Promise.resolve('#3b82f6')
}

/**
 * Określa kolor tekstu na podstawie koloru tła
 */
export function getTextColorForBackground(backgroundColor: string): string {
    // Konwertuj kolor na RGB
    let r: number, g: number, b: number;

    if (backgroundColor.startsWith('#')) {
        r = parseInt(backgroundColor.slice(1, 3), 16);
        g = parseInt(backgroundColor.slice(3, 5), 16);
        b = parseInt(backgroundColor.slice(5, 7), 16);
    } else if (backgroundColor.startsWith('rgb')) {
        const matches = backgroundColor.match(/\d+/g);
        if (matches) {
            [r, g, b] = matches.map(Number);
        } else {
            return '#000000';
        }
    } else if (backgroundColor.startsWith('hsl')) {
        // Konwertuj HSL na RGB (uproszczona wersja)
        const matches = backgroundColor.match(/\d+/g);
        if (matches) {
            const [, , l] = matches.map(Number);
            // Uproszczona konwersja HSL na RGB

            const lightness = l / 100;

            if (lightness > 0.5) {
                return '#000000';
            } else {
                return '#ffffff';
            }
        } else {
            return '#000000';
        }
    } else {
        return '#000000';
    }

    // Oblicz luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generuje schemat kolorów dla projektu na podstawie koloru klienta
 */
export function generateProjectColorScheme(clientColor: string): ProjectColorScheme {
    // Konwertuj hex na HSL
    const hex = clientColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }

    // Generuj kolory na podstawie głównego koloru
    const primary = clientColor
    const light = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.min(85, Math.round(l * 100) + 15)}%)`
    const dark = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.max(15, Math.round(l * 100) - 15)}%)`
    const accent = `hsl(${Math.round((h * 360 + 180) % 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`

    // Calculate secondary color (30 degrees shift in hue)
    const secondary = `hsl(${Math.round((h * 360 + 30) % 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`

    return {
        primary,
        secondary,
        light,
        dark,
        accent
    }
}

/**
 * Generuje gradient na podstawie koloru klienta
 */
export function generateClientGradient(clientColor: string): string {
    const colorScheme = generateProjectColorScheme(clientColor);
    return `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.light} 100%)`;
}

/**
 * Generuje hover effect dla karty klienta
 */
export function generateClientCardHover(clientColor: string): string {
    const colorScheme = generateProjectColorScheme(clientColor);
    return `linear-gradient(135deg, ${colorScheme.light} 0%, ${colorScheme.primary} 100%)`;
}

/**
 * Generuje shadow dla karty klienta
 */
export function generateClientCardShadow(clientColor: string): string {
    return `0 4px 20px ${clientColor}40, 0 2px 8px ${clientColor}20`;
}

/**
 * Generuje border dla karty klienta
 */
export function generateClientCardBorder(clientColor: string): string {
    return `2px solid ${clientColor}20`;
}

/**
 * Generuje kolor dla statusu klienta
 */
export function getStatusColor(status: CompanyClient['status']): string {
    switch (status) {
        case 'Active':
            return '#10b981'; // Green
        case 'Inactive':
            return '#6b7280'; // Gray
        case 'Pending':
            return '#f59e0b'; // Yellow
        default:
            return '#6b7280';
    }
}

/**
 * Generuje kolor dla segmentu klienta
 */
export function getSegmentColor(segment: CompanyClient['segment']): string {
    switch (segment) {
        case 'Mały':
            return '#3b82f6'; // Blue
        case 'Średni':
            return '#8b5cf6'; // Purple
        case 'Duży':
            return '#ef4444'; // Red
        default:
            return '#6b7280';
    }
}

/**
 * Formatuje numer telefonu
 */
export function formatPhoneNumber(phone: string): string {
    // Usuń wszystkie nie-cyfry
    const cleaned = phone.replace(/\D/g, '');

    // Formatuj według wzorca +48 XXX XXX XXX
    if (cleaned.length === 11 && cleaned.startsWith('48')) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    } else if (cleaned.length === 9) {
        return `+48 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    return phone; // Zwróć oryginalny jeśli nie pasuje do wzorca
}

/**
 * Formatuje adres email
 */
export function formatEmail(email: string): string {
    return email.toLowerCase().trim();
}

/**
 * Generuje skrót nazwy firmy
 */
export function generateCompanyAbbreviation(companyName: string): string {
    const words = companyName.trim().split(' ');

    if (words.length === 1) {
        return words[0].slice(0, 3).toUpperCase();
    }

    return words
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
}

/**
 * Generuje unikalny ID dla klienta
 */
export function generateClientId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `C-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generuje unikalny ID dla osoby kontaktowej
 */
export function generateContactId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CP-${timestamp}-${random}`.toUpperCase();
}

/**
 * Waliduje NIP
 */
export function validateNIP(nip: string): boolean {
    const cleaned = nip.replace(/\D/g, '');

    if (cleaned.length !== 10) {
        return false;
    }

    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned[i]) * weights[i];
    }

    const checksum = sum % 11;
    const lastDigit = parseInt(cleaned[9]);

    return checksum === lastDigit;
}

/**
 * Formatuje NIP
 */
export function formatNIP(nip: string): string {
    const cleaned = nip.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
    }

    return nip;
}

/**
 * Generuje avatar dla osoby kontaktowej
 */
export function generateContactAvatar(name: string, size: number = 40): string {
    const initials = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

    const hash = name.split('').reduce((a, b) => {
        a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
        return a;
    }, 0);

    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 20);
    const lightness = 45 + (Math.abs(hash) % 15);

    return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="hsl(${hue}, ${saturation}%, ${lightness}%)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
            fill="white" text-anchor="middle" dy="0.35em">${initials}</text>
    </svg>
  `)}`;
}
