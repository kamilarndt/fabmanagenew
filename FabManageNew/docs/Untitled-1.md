FabrykaManage - Kompleksowy Redesign v2.1
Wprowadzenie

Niniejszy dokument opisuje kompleksowe zmiany w interfejsie i funkcjonalnościach aplikacji FabrykaManage. Celem redesignu jest usprawnienie przepływu pracy, wprowadzenie wizualnego kontekstu do zarządzania projektami oraz pełna integracja z fundamentalną koncepcją systemu kafelkowego.

Rozróżnienie terminologii:

    Zakładki (Sidebar Nav): Główne sekcje aplikacji, takie jak Projekty, Klienci, Podwykonawcy.

    Moduły (Wewnątrz Projektu): Podsekcje każdego projektu, takie jak Elementy, Materiały, Wycena.

1. Zakładka: Projekty (Lista Projektów)

Główny widok listy projektów zostaje przeprojektowany z listy tekstowej na siatkę interaktywnych kart projektów, które dostarczają kluczowych informacji na pierwszy rzut oka.
1.1. Karta Projektu

Każdy projekt na liście jest reprezentowany przez wizualną kartę.

Struktura Karty Projektu:

+------------------------------------------------------+
| [Miniatura Projektu]                                 |
| 🖼️                                                    |
+------------------------------------------------------+
| [Nazwa Projektu]                        [Status]     |
| Nr: [Numer Projektu]                                 |
|------------------------------------------------------|
| Klient: [Nazwa Klienta]                              |
| Deadline: [Data]         Postęp: [Pasek postępu 35%] |
+------------------------------------------------------+
| MODUŁY PROJEKTU:                                     |
| - Scena Główna ..................... (12 kafelków)  |
| - Strefa Wejściowa ................. (8 kafelków)   |
| - Zaplecze Techniczne .............. (5 kafelków)   |
+------------------------------------------------------+

    Miniatura Projektu: Obrazek lub render projektu.

    Moduły Projektu: Lista kluczowych modułów w projekcie wraz z liczbą kafelków-elementów w każdym z nich.

1.2. Model Danych Projektu

Każdy projekt w systemie będzie oparty o następującą strukturę danych:

    id (unikalny identyfikator)

    numer (np. P-2025/09/01)

    nazwa

    typ (np. Targi, Scenografia TV, Muzeum)

    lokalizacja

    status (np. Nowy, Wyceniany, W realizacji, Zakończony)

    data_utworzenia

    data_rozpoczęcia

    deadline

    postep (w procentach)

    opis

    miniatura (URL do obrazka)

    repozytorium_plikow (link)

    link_model_3d (np. link do Speckle)

    klient_id

    manager_id

2. Wewnątrz Projektu: Przeprojektowane Moduły
2.1. Moduł: Elementy (Wizualny Inwentarz Projektu)

Moduł ten staje się wizualnym centrum zarządzania wszystkimi komponentami (kafelkami) projektu.
Nowa Karta Kafelka-Elementu

Centralnym punktem jest nowa, rozbudowana karta kafelka, która łączy podgląd 3D z kluczowymi danymi.

Struktura Karty:

+--------------------------------------------------+
| [Podgląd 3D / Render]                            |
| 🖼️                                                |
+--------------------------------------------------+
| Nazwa Kafelka [ID: KAF-112]                      |
|--------------------------------------------------|
| Status: [ Projektowanie ]   Termin: 15.09.2025   |
+--------------------------------------------------+
| MATERIAŁY:                                       |
| - Sklejka 18mm ....................... 2.5 ark. |
| - Profil stalowy 40x40 ............... 12.5 mb  |
| + 2 więcej...                                    |
+--------------------------------------------------+
| [Otwórz Szczegóły]   [Przypisz Projektanta]      |
+--------------------------------------------------+

    Podgląd Wizualny: Automatycznie generowany thumbnail z modelu 3D (np. przez Speckle). Kliknięcie otwiera interaktywny viewer 3D.

    Sekcja Materiałowa: Dynamicznie generowana lista kluczowych materiałów potrzebnych do wykonania tego kafelka.

Okno Tworzenia / Edycji Kafelka

Pojawia się jako modal po kliknięciu [+ Dodaj Nowy Kafelek] lub [Otwórz Szczegóły].

Layout Okna (dwukolumnowy):

Lewa Kolumna (Dane Podstawowe)
	

Prawa Kolumna (Zarządzanie Materiałami)

Nazwa Kafelka*: [___________]
	

Materiały Elementu:

Moduł nadrzędny: [Scena Główna ▼]
	

[+ Dodaj materiał z bazy]

Opis: [___________]
	

[+ Utwórz nowy materiał]

Link do modelu 3D: [___________]
	

Lista materiałów:

Załączniki: [Prześlij pliki]
	

- Sklejka 18mm ... [ 2.5 ] ark. [ X ]


	

- Profil stalowy ... [ 12.5 ] mb [ X ]

Przypisany projektant: [K. Arndt ▼]
	


Termin: [Wybierz datę]
	


    Usunięte Pola: Zgodnie z sugestią, usunięto pola "Technologia wiodąca" i "Priorytet". Priorytet jest teraz zarządzany w module Działu Projektowego.

    Zarządzanie Materiałami: Użytkownik może łatwo dodawać materiały z istniejącej bazy lub tworzyć nowe pozycje, określając ich ilość i jednostkę.

2.2. Moduł: Materiały (Zbiorcze Zapotrzebowanie)

Ten moduł prezentuje zagregowaną listę wszystkich materiałów potrzebnych do realizacji całego projektu. Dane są automatycznie zliczane ze wszystkich kafelków-elementów.

Struktura Widoku:

    Tabela Zbiorcza (Bill of Materials):

        Nazwa Materiału: (np. Sklejka 18mm)

        Ilość Całkowita: (np. 45.5 ark.)

        Jednostka: (np. ark.)

        Status Zamówienia: (np. Do zamówienia, W magazynie)

        Używane w: (np. KAF-112, KAF-114, KAF-201...)

    Akcje: [Eksportuj do CSV] [Generuj Zamówienie]

2.3. Moduł: Wycena

Moduł zaimplementowany dokładnie według specyfikacji.

    Layout: Dwukolumnowy.

    Kolumna Lewa (Struktura Wyceny Projektu):

        Automatycznie generowane, rozwijane drzewo kosztów, zagregowane z modułów i kafelków. Zapewnia pełną transparentność kosztów produkcyjnych.

    Kolumna Prawa (Kalkulacja Końcowa):

        Panel dla managera do dodawania kosztów dodatkowych (logistyka, montaż, zarządzanie), ustalania marży, upustów i analizy rentowności.

    Pasek Akcji: [ Zapisz wersję roboczą ] [ Generuj Ofertę PDF ] [ Zatwierdź i wyślij do klienta ]

3. Zakładka: Dział Projektowy

Moduł ten pozostaje zgodny z wcześniej zdefiniowaną, zaawansowaną koncepcją.

    Dwa Modele Pracy: "Push" (kierownik przypisuje) i "Pull" (projektanci wybierają z puli).

    Dwa Widoki:

        Tablica Kanban: Do zarządzania procesem (Pula Zadań, Do zaprojektowania, W trakcie, Do weryfikacji, Ukończone).

        Oś Czasu (Timeline): Do planowania obciążenia zespołu i wizualizacji terminów.

4. Nowa Zakładka: Podwykonawcy

Nowa, kluczowa zakładka do zarządzania współpracą z zewnętrznymi firmami.
4.1. Katalog Podwykonawców

Główny widok to baza podwykonawców, którą można filtrować i przeszukiwać.

    Kategorie: Tapicer, Stal, Tworzywa sztuczne, Szklarz, Drukarnia.

    Widok: Karty podwykonawców z logo, danymi kontaktowymi i oceną.

4.2. Profil Podwykonawcy

Szczegółowy widok danego podwykonawcy.

    Dane kontaktowe i adresowe.

    Historia Zleceń: Lista wszystkich kafelków zrealizowanych przez firmę, wraz z datami i numerami projektów.

    Wskazówki i Notatki: Wewnętrzne uwagi po każdym zleceniu (np. "Dobry kontakt, ale wymagają precyzyjnych rysunków").

4.3. Kanban Zleceń dla Podwykonawców

Tablica do śledzenia postępu prac zlecanych na zewnątrz.

    Kolumny Statusów:

        Do zamówienia

        Zamówione

        W produkcji

        W transporcie

        Dostarczone

    Karta Zlecenia: Zawiera informacje o kafelku, nazwę podwykonawcy, termin i koszt.