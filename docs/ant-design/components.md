# Ant Design – przewodnik po komponentach (dark theme)

Źródło: [Ant Design – Components Overview](https://ant.design/components/overview/?theme=dark)

Poniżej skrócony przewodnik po komponentach AntD, z rekomendacjami zastosowania w FabManage i uwagami do naszego motywu „dark-green”.

## General
- Button: główne akcje w widokach; `type="primary"` korzysta z `colorPrimary` (mint). Używaj `size="small"|"middle"|"large"` spójnie, radius = 0 globalnie.
- FloatButton: szybkie akcje kontekstowe (np. „Dodaj element”). Oszczędnie w desktop, częściej w mobile.
- Icon: `@ant-design/icons` – unikamy custom SVG, chyba że brandowe.
- Typography: tytuły i teksty; bez stałych kolorów.

## Layout
- Divider: sekcje w kartach i panelach.
- Flex/Space: odstępy między elementami; preferowane zamiast custom marginesów.
- Grid (Row/Col): układy formularzy, siatki kart.
- Layout: `Sider/Header/Content` – nasz układ główny.
- Splitter: podgląd + edycja (np. CAD/parametry) – gdy wymagane.

## Navigation
- Anchor: długie dokumenty/specyfikacje.
- Breadcrumb: nagłówki stron (projekty, klienci).
- Dropdown: menu akcji; używaj `Menu` jako overlay.
- Menu: Sider. Dark theme dziedziczy nasze tokeny.
- Pagination: tabele listujące.
- Steps: kreatory (dodawanie projektu, zamówienia).
- Tabs: sekcje w `Projekt`, `TileEditSheet`.

## Data Entry
- AutoComplete/Select: wybory klientów, materiałów. Używaj `showSearch`, `optionFilterProp`.
- Cascader/TreeSelect: zagnieżdżone kategorie materiałów.
- Checkbox/Radio/Switch: toggles; Switch ostrożnie (dark: wyraźny kontrast).
- ColorPicker: jeśli wymóg UI (np. kolor płyty).
- DatePicker/TimePicker: terminy, planowanie; strefy PL.
- Form: walidacja, layout `vertical` w większości formularzy.
- Input/InputNumber: liczby sztuk, nazwy, filtracja.
- Mentions: rzadko; komentarze @user.
- Rate/Slider: oceny/zakresy – sporadycznie.
- Transfer: przydziały elementów do zadań.
- Upload: pliki DXF/PDF; preferuj `Dragger`.

## Data Display
- Avatar: logotypy klientów, użytkownicy.
- Badge: liczniki notyfikacji.
- Calendar: moduł kalendarza.
- Card: kontenery sekcji; tło `var(--bg-card)`.
- Carousel: podglądy grafik, rzadko.
- Collapse: dodatkowe szczegóły.
- Descriptions: karty danych klienta/projektu.
- Empty: stany pustych list.
- Image: podgląd grafiki.
- List: listy zadań, aktywność.
- Popover/Tooltip: pomoc kontekstowa.
- QRCode: opcjonalnie etykiety magazyn.
- Segmented: przełączanie widoków (np. Kalendarz: projekt/zespół).
- Statistic: KPI w dashboardzie.
- Table: listy projektów, magazyn; sticky header; pagination.
- Tag: statusy (mint = success/active); `borderRadius: 0`.
- Timeline: historia działań.
- Tour: onboarding.
- Tree: struktury katalogów.

## Feedback
- Alert: błędy, ostrzeżenia.
- Drawer: edycje w „sheet” (u nas dolny pełnoekranowy w mobile, prawy w desktop gdy potrzeba).
- Message/Notification: informowanie o akcjach async.
- Modal: potwierdzenia.
- Popconfirm: akcje destrukcyjne (usuń).
- Progress: postęp produkcji; `strokeColor='var(--primary-main)'`.
- Result: stan końcowy.
- Skeleton/Spin: ładowanie.
- Watermark: nieużywane.

## Other
- Affix: przypięte akcje.
- App: kontekst notyfikacji.
- ConfigProvider: centralny theming i locale.
- Util: helpery.

## Zasady użycia w FabManage
1. Każdy nowy/zmieniany ekran – tylko komponenty AntD z powyższej listy.
2. Kolory tylko przez tokeny/zmienne; brak inline HEX.
3. Krawędzie równe 0 – korzystamy z globalnego ustawienia.
4. Formularze – `Form` + kontrolki AntD; walidacja w `rules`.
5. Tabele – paginacja, sortowanie, sticky header; kolory na tokenach.
6. Upload – obsługa DXF/PDF przez endpoint `/api/upload`.
7. Drawer/Modal – domyślnie Drawer; pełnoekranowy dla skomplikowanych formularzy.
