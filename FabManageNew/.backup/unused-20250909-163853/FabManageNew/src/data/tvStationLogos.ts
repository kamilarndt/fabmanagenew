// Logotypy największych stacji telewizyjnych w Polsce
// Źródła: Wikimedia Commons, oficjalne strony, CDN

export const tvStationLogos = {
    // Telewizja Polska S.A.
    tvp: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TVP_logo_2016.svg/200px-TVP_logo_2016.svg.png',
        alternative: 'https://www.tvp.pl/static/images/logo/tvp-logo.png',
        fallback: 'https://via.placeholder.com/200x80/e60012/ffffff?text=TVP'
    },

    // Polsat
    polsat: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Polsat_logo.svg/200px-Polsat_logo.svg.png',
        alternative: 'https://www.polsat.pl/static/images/logo/polsat-logo.png',
        fallback: 'https://via.placeholder.com/200x80/ff6b35/ffffff?text=Polsat'
    },

    // TVN
    tvn: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TVN_logo.svg/200px-TVN_logo.svg.png',
        alternative: 'https://tvn.pl/static/images/logo/tvn-logo.png',
        fallback: 'https://via.placeholder.com/200x80/1e3a8a/ffffff?text=TVN'
    },

    // TV Puls
    tvPuls: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TV_Puls_logo.svg/200px-TV_Puls_logo.svg.png',
        alternative: 'https://www.tvrepublika.pl/static/images/logo/puls-logo.png',
        fallback: 'https://via.placeholder.com/200x80/7c3aed/ffffff?text=TV+Puls'
    },

    // TV4
    tv4: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TV4_logo.svg/200px-TV4_logo.svg.png',
        alternative: 'https://www.tv4.pl/static/images/logo/tv4-logo.png',
        fallback: 'https://via.placeholder.com/200x80/059669/ffffff?text=TV4'
    },

    // TVN24
    tvn24: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TVN24_logo.svg/200px-TVN24_logo.svg.png',
        alternative: 'https://tvn24.pl/static/images/logo/tvn24-logo.png',
        fallback: 'https://via.placeholder.com/200x80/dc2626/ffffff?text=TVN24'
    },

    // Polsat News
    polsatNews: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Polsat_News_logo.svg/200px-Polsat_News_logo.svg.png',
        alternative: 'https://www.polsatnews.pl/static/images/logo/polsatnews-logo.png',
        fallback: 'https://via.placeholder.com/200x80/f59e0b/000000?text=Polsat+News'
    },

    // TV Republika
    tvRepublika: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TV_Republika_logo.svg/200px-TV_Republika_logo.svg.png',
        alternative: 'https://www.tvrepublika.pl/static/images/logo/republika-logo.png',
        fallback: 'https://via.placeholder.com/200x80/1f2937/ffffff?text=TV+Republika'
    },

    // Super Polsat
    superPolsat: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Super_Polsat_logo.svg/200px-Super_Polsat_logo.svg.png',
        alternative: 'https://www.superpolsat.pl/static/images/logo/superpolsat-logo.png',
        fallback: 'https://via.placeholder.com/200x80/10b981/ffffff?text=Super+Polsat'
    },

    // TVN Turbo
    tvnTurbo: {
        primary: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/TVN_Turbo_logo.svg/200px-TVN_Turbo_logo.svg.png',
        alternative: 'https://turbo.tvn.pl/static/images/logo/tvnturbo-logo.png',
        fallback: 'https://via.placeholder.com/200x80/f97316/ffffff?text=TVN+Turbo'
    }
}

// Funkcja pomocnicza do pobierania logotypu z fallback
export function getLogoUrl(stationKey: keyof typeof tvStationLogos, preferredSource: 'primary' | 'alternative' | 'fallback' = 'primary'): string {
    const station = tvStationLogos[stationKey]

    switch (preferredSource) {
        case 'primary':
            return station.primary
        case 'alternative':
            return station.alternative
        case 'fallback':
            return station.fallback
        default:
            return station.primary
    }
}

// Funkcja do sprawdzania dostępności logotypu
export async function checkLogoAvailability(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' })
        return response.ok
    } catch {
        return false
    }
}

// Funkcja do pobierania najlepszego dostępnego logotypu
export async function getBestAvailableLogo(stationKey: keyof typeof tvStationLogos): Promise<string> {
    const station = tvStationLogos[stationKey]

    // Sprawdź primary
    if (await checkLogoAvailability(station.primary)) {
        return station.primary
    }

    // Sprawdź alternative
    if (await checkLogoAvailability(station.alternative)) {
        return station.alternative
    }

    // Użyj fallback
    return station.fallback
}
