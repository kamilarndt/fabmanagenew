/* ========================================
   FABMANAGE - UTILITY FUNCTIONS DLA STATUSÓW
   ========================================
   
   Centralne miejsce dla logiki statusów:
   - Mapowanie statusów na kolory
   - Mapowanie statusów na klasy CSS
   - Walidacja przejść statusów
   ======================================== */

// ========================================
// TYPY STATUSÓW
// ========================================

export type ProjectStatus = 
  | 'Koncepcja'
  | 'Projektowanie'
  | 'Produkcja'
  | 'Materiały'
  | 'Montaż'
  | 'Zakończony'
  | 'Wstrzymany'
  | 'Anulowany';

export type TileStatus = 
  | 'Projektowanie'
  | 'Do akceptacji'
  | 'Zaakceptowane'
  | 'W kolejce CNC'
  | 'W produkcji CNC'
  | 'Gotowy do montażu'
  | 'Zakończony';

export type MaterialStatus = 
  | 'Dostępny'
  | 'Niski stan'
  | 'Krytyczny'
  | 'Niedostępny'
  | 'W zamówieniu'
  | 'W dostawie';

export type CNCStatus = 
  | 'Wolna'
  | 'W pracy'
  | 'Przerwa'
  | 'Awaria'
  | 'Konserwacja';

// ========================================
// MAPOWANIE STATUSÓW NA KOLORY
// ========================================

export const getStatusColor = (status: string): string => {
  switch (status) {
    // Projekt statusy
    case 'Koncepcja':
      return '#6c757d';
    case 'Projektowanie':
      return '#17a2b8';
    case 'Produkcja':
      return '#ffc107';
    case 'Materiały':
      return '#fd7e14';
    case 'Montaż':
      return '#20c997';
    case 'Zakończony':
      return '#28a745';
    case 'Wstrzymany':
      return '#dc3545';
    case 'Anulowany':
      return '#6c757d';

    // Tile statusy
    case 'Do akceptacji':
      return '#ffc107';
    case 'Zaakceptowane':
      return '#17a2b8';
    case 'W kolejce CNC':
      return '#fd7e14';
    case 'W produkcji CNC':
      return '#ffc107';
    case 'Gotowy do montażu':
      return '#20c997';

    // Material statusy
    case 'Dostępny':
      return '#28a745';
    case 'Niski stan':
      return '#ffc107';
    case 'Krytyczny':
      return '#dc3545';
    case 'Niedostępny':
      return '#6c757d';
    case 'W zamówieniu':
      return '#17a2b8';
    case 'W dostawie':
      return '#fd7e14';

    // CNC statusy
    case 'Wolna':
      return '#28a745';
    case 'W pracy':
      return '#ffc107';
    case 'Przerwa':
      return '#fd7e14';
    case 'Awaria':
      return '#dc3545';
    case 'Konserwacja':
      return '#6c757d';

    default:
      return '#6c757d';
  }
};

// ========================================
// MAPOWANIE STATUSÓW NA KLASY CSS
// ========================================

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    // Projekt statusy
    case 'Koncepcja':
      return 'badge bg-secondary';
    case 'Projektowanie':
      return 'badge bg-info';
    case 'Produkcja':
      return 'badge bg-warning';
    case 'Materiały':
      return 'badge bg-warning';
    case 'Montaż':
      return 'badge bg-success';
    case 'Zakończony':
      return 'badge bg-success';
    case 'Wstrzymany':
      return 'badge bg-danger';
    case 'Anulowany':
      return 'badge bg-secondary';

    // Tile statusy
    case 'Do akceptacji':
      return 'badge bg-warning';
    case 'Zaakceptowane':
      return 'badge bg-info';
    case 'W kolejce CNC':
      return 'badge bg-warning';
    case 'W produkcji CNC':
      return 'badge bg-warning';
    case 'Gotowy do montażu':
      return 'badge bg-success';

    // Material statusy
    case 'Dostępny':
      return 'badge bg-success';
    case 'Niski stan':
      return 'badge bg-warning';
    case 'Krytyczny':
      return 'badge bg-danger';
    case 'Niedostępny':
      return 'badge bg-secondary';
    case 'W zamówieniu':
      return 'badge bg-info';
    case 'W dostawie':
      return 'badge bg-warning';

    // CNC statusy
    case 'Wolna':
      return 'badge bg-success';
    case 'W pracy':
      return 'badge bg-warning';
    case 'Przerwa':
      return 'badge bg-warning';
    case 'Awaria':
      return 'badge bg-danger';
    case 'Konserwacja':
      return 'badge bg-secondary';

    default:
      return 'badge bg-secondary';
  }
};

// ========================================
// MAPOWANIE STATUSÓW NA IKONY
// ========================================

export const getStatusIcon = (status: string): string => {
  switch (status) {
    // Projekt statusy
    case 'Koncepcja':
      return 'ri-lightbulb-line';
    case 'Projektowanie':
      return 'ri-draft-line';
    case 'Produkcja':
      return 'ri-tools-line';
    case 'Materiały':
      return 'ri-box-line';
    case 'Montaż':
      return 'ri-screwdriver-line';
    case 'Zakończony':
      return 'ri-check-double-line';
    case 'Wstrzymany':
      return 'ri-pause-circle-line';
    case 'Anulowany':
      return 'ri-close-circle-line';

    // Tile statusy
    case 'Do akceptacji':
      return 'ri-time-line';
    case 'Zaakceptowane':
      return 'ri-check-line';
    case 'W kolejce CNC':
      return 'ri-list-check';
    case 'W produkcji CNC':
      return 'ri-cpu-line';
    case 'Gotowy do montażu':
      return 'ri-settings-3-line';

    // Material statusy
    case 'Dostępny':
      return 'ri-check-circle-line';
    case 'Niski stan':
      return 'ri-alert-line';
    case 'Krytyczny':
      return 'ri-error-warning-line';
    case 'Niedostępny':
      return 'ri-close-circle-line';
    case 'W zamówieniu':
      return 'ri-shopping-cart-line';
    case 'W dostawie':
      return 'ri-truck-line';

    // CNC statusy
    case 'Wolna':
      return 'ri-check-circle-line';
    case 'W pracy':
      return 'ri-play-circle-line';
    case 'Przerwa':
      return 'ri-pause-circle-line';
    case 'Awaria':
      return 'ri-error-warning-line';
    case 'Konserwacja':
      return 'ri-tools-line';

    default:
      return 'ri-question-line';
  }
};

// ========================================
// WALIDACJA PRZEJŚĆ STATUSÓW
// ========================================

export const canTransitionTo = (currentStatus: string, targetStatus: string): boolean => {
  // Projekt workflow
  const projectWorkflow = [
    'Koncepcja',
    'Projektowanie', 
    'Produkcja',
    'Materiały',
    'Montaż',
    'Zakończony'
  ];

  // Tile workflow
  const tileWorkflow = [
    'Projektowanie',
    'Do akceptacji',
    'Zaakceptowane',
    'W kolejce CNC',
    'W produkcji CNC',
    'Gotowy do montażu',
    'Zakończony'
  ];

  // Sprawdź czy to projekt
  if (projectWorkflow.includes(currentStatus) && projectWorkflow.includes(targetStatus)) {
    const currentIndex = projectWorkflow.indexOf(currentStatus);
    const targetIndex = projectWorkflow.indexOf(targetStatus);
    
    // Pozwól na przejście do następnego kroku lub powrót
    return targetIndex === currentIndex + 1 || targetIndex <= currentIndex;
  }

  // Sprawdź czy to tile
  if (tileWorkflow.includes(currentStatus) && tileWorkflow.includes(targetStatus)) {
    const currentIndex = tileWorkflow.indexOf(currentStatus);
    const targetIndex = tileWorkflow.indexOf(targetStatus);
    
    // Pozwól na przejście do następnego kroku lub powrót
    return targetIndex === currentIndex + 1 || targetIndex <= currentIndex;
  }

  // Dla innych statusów - pozwól na zmianę
  return true;
};

// ========================================
// FUNKCJE POMOCNICZE
// ========================================

export const getStatusPriority = (status: string): number => {
  const priorityMap: Record<string, number> = {
    'Awaria': 1,
    'Krytyczny': 2,
    'Niski stan': 3,
    'W pracy': 4,
    'W kolejce CNC': 5,
    'Do akceptacji': 6,
    'W zamówieniu': 7,
    'W dostawie': 8,
    'Dostępny': 9,
    'Wolna': 10,
    'Zakończony': 11
  };

  return priorityMap[status] || 999;
};

export const getStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    'Koncepcja': 'Pomysł i planowanie projektu',
    'Projektowanie': 'Tworzenie dokumentacji technicznej',
    'Produkcja': 'Wytwarzanie elementów',
    'Materiały': 'Zamawianie i przygotowanie materiałów',
    'Montaż': 'Składanie gotowych elementów',
    'Zakończony': 'Projekt ukończony',
    'Wstrzymany': 'Projekt wstrzymany',
    'Anulowany': 'Projekt anulowany',
    'Do akceptacji': 'Oczekuje na akceptację',
    'Zaakceptowane': 'Zaakceptowane do produkcji',
    'W kolejce CNC': 'W kolejce do obróbki CNC',
    'W produkcji CNC': 'W trakcie obróbki CNC',
    'Gotowy do montażu': 'Gotowy do montażu',
    'Dostępny': 'Materiał dostępny',
    'Niski stan': 'Niski stan magazynowy',
    'Krytyczny': 'Krytycznie niski stan',
    'Niedostępny': 'Materiał niedostępny',
    'W zamówieniu': 'Materiał w zamówieniu',
    'W dostawie': 'Materiał w drodze',
    'Wolna': 'Maszyna dostępna',
    'W pracy': 'Maszyna w trakcie pracy',
    'Przerwa': 'Maszyna na przerwie',
    'Awaria': 'Awaria maszyny',
    'Konserwacja': 'Maszyna w konserwacji'
  };

  return descriptions[status] || 'Status nieznany';
};

// ========================================
// FUNKCJE DLA KOMPONENTÓW
// ========================================

export const getStatusDisplayData = (status: string) => {
  return {
    color: getStatusColor(status),
    badgeClass: getStatusBadgeClass(status),
    icon: getStatusIcon(status),
    priority: getStatusPriority(status),
    description: getStatusDescription(status)
  };
};

// ========================================
// EKSPORT DOMYŚLNY
// ========================================

export default {
  getStatusColor,
  getStatusBadgeClass,
  getStatusIcon,
  canTransitionTo,
  getStatusPriority,
  getStatusDescription,
  getStatusDisplayData
};
