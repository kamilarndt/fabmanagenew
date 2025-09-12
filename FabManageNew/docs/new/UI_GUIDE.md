## Przewodnik UI

### Nawigacja główna
- Zakładki: Home/Dashboard, Projekty, Klienci, Projektowanie, CNC, Magazyn, Produkcja
- Breadcrumbs, global search, profil użytkownika

### Kluczowe widoki
- Dashboard: KPI, aktywności, skróty
- Projects: tabela + filtry, kontekstowe akcje, masowe operacje
- Projekt (szczegóły): zakładki dynamiczne zależnie od `project.modules`
- CNC: statusy maszyn/prac, kolejka, drag&drop
- Magazyn: drzewo kategorii, lista/kafelki, krytyczne stany, szczegóły
- Produkcja: kanban i/lub harmonogram (plan)

### Komponenty
- Kanban: `components/Kanban/*`
- Modale: tworzenie/edycja projektu, kafelek, materiały
- DXF preview/fullscreen: przegląd plików DXF + warstwy

### Wzorce interakcji
- Drag&drop, context menus, progressive disclosure
- Powiadomienia/toasty, ładowanie/szkielety


