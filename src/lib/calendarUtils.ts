import type { CalendarEvent } from '../stores/calendarStore';
import type { Tile } from '../stores/tilesStore';

export type Phase = 'projektowanie' | 'wycinanie' | 'produkcja';

export const PHASE_DURATION_MULTIPLIERS = {
    projektowanie: 0.5, // 50% of labor cost
    wycinanie: 0.2,     // 20% of labor cost  
    produkcja: 0.8,     // 80% of labor cost
} as const;

export const MIN_PHASE_DURATION_HOURS = {
    projektowanie: 2,
    wycinanie: 1,
    produkcja: 2,
} as const;

/**
 * Calculate event duration based on tile labor cost and phase
 */
export function calculateEventDuration(tile: Tile, phase: Phase): number {
    const baseHours = tile.laborCost || 0;
    const multiplier = PHASE_DURATION_MULTIPLIERS[phase];
    const calculatedHours = baseHours * multiplier;
    const minHours = MIN_PHASE_DURATION_HOURS[phase];

    return Math.max(calculatedHours, minHours);
}

/**
 * Create calendar event from tile and phase
 */
export function createEventFromTile(
    tile: Tile,
    phase: Phase,
    startDate: Date,
    resourceId?: string
): Omit<CalendarEvent, 'id'> {
    const durationHours = calculateEventDuration(tile, phase);
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

    const phaseLabels = {
        projektowanie: 'Projektowanie',
        wycinanie: 'Wycinanie',
        produkcja: 'Produkcja',
    };

    return {
        title: `${phaseLabels[phase]}: ${tile.name}`,
        start: startDate,
        end: endDate,
        allDay: false,
        resourceId,
        phase,
        eventType: 'task',
        meta: {
            tileId: tile.id,
            projectId: tile.project,
        },
        tags: [phase, tile.status || ''],
    };
}

/**
 * Get phase color for UI
 */
export function getPhaseColor(phase: Phase): string {
    const colors = {
        projektowanie: 'var(--primary-main)',
        wycinanie: 'var(--accent-warning)',
        produkcja: 'var(--accent-success)',
    };
    return colors[phase];
}

/**
 * Get phase icon/emoji
 */
export function getPhaseIcon(phase: Phase): string {
    const icons = {
        projektowanie: '🎨',
        wycinanie: '✂️',
        produkcja: '🔨',
    };
    return icons[phase];
}

/**
 * Format duration for display
 */
export function formatDuration(hours: number): string {
    if (hours < 1) {
        return `${Math.round(hours * 60)}min`;
    }
    if (hours < 24) {
        return `${hours.toFixed(1)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(1)}h`;
}
