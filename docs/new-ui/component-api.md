# Component API Reference

## Cel
iOpis props, wariantów i a11y dla nowych komponentów (atoms, molecules, organisms) w `src/new-ui/`.

---

## 1. Atom: Button
### Lokalizacja
`src/new-ui/atoms/Button/Button.tsx`

### Props
| Prop         | Typ                     | Domyślna  | Opis                              |
|--------------|-------------------------|-----------|------------------------------------|
| children     | React.ReactNode         | —         | Zawartość przycisku                |
| variant      | 'default' \| 'destructive' | 'default' | Styl komponentu (kolorystyka)      |
| size         | 'sm' \| 'md' \| 'lg' | 'md'      | Rozmiar przycisku                  |
| disabled     | boolean                 | false     | Wyłącza interakcję                 |
| onClick      | (e) => void             | —         | Handler kliknięcia                 |
| className    | string                  | —         | Dodatkowe klasy CSS                |

### Warianty
- **default**: niebieski, białe teksty
- **destructive**: czerwony, białe teksty
- **outline**: obwódka, przezroczyste wypełnienie

### Accessibility
- Rola `button`
- Obsługa klawisza Enter/Space
- Focus ring za pomocą Tailwind classes

---

## 2. Molecule: FormField
### Lokalizacja
`src/new-ui/molecules/FormField/FormField.tsx`

### API
| Prop    | Typ                     | Opis                             |
|---------|-------------------------|-----------------------------------|
| label   | string                  | Etykieta pola formularza         |
| id      | string                  | Unikalny identyfikator inputa    |
| error   | string \| undefined     | Tekst błędu, wyświetlany pod polem|
| children| React.ReactNode         | Input element (atom)              |

### A11y
- `aria-labelledby` dla inputa
- `aria-invalid` gdy `error` niepusty

---

## 3. Organism: DataTable
### Lokalizacja
`src/new-ui/organisms/DataTable/DataTable.tsx`

### Props
| Prop          | Typ                           | Opis                                      |
|---------------|-------------------------------|--------------------------------------------|
| columns       | ColumnDef<T>[]                | Definicje kolumn dla @tanstack/react-table|
| data          | T[]                           | Dane do wyświetlenia                      |
| pageSize      | number                        | Rozmiar strony                             |
| onRowClick    | (row: T) => void             | Callback po kliknięciu w wiersz            |
| loading       | boolean                       | Stan ładowania (skeletons)                |
| className     | string                        | Dodatkowe klasy CSS                        |

### Funkcje
- Sortowanie, filtrowanie i paginacja poprzez TanStack
- Responsywne kolumny (CSS grid)
- Virtualizacja dużych zbiorów danych

### Accessibility
- Role `table`, `row`, `columnheader`, `cell`
- Obsługa klawiszy strzałek (opcjonalne)

---

## 4. Organism: Sheet
### Lokalizacja
`src/new-ui/organisms/Sheet/Sheet.tsx`

### Props
| Prop         | Typ                           | Domyślna | Opis                             |
|--------------|-------------------------------|----------|----------------------------------|
| open         | boolean                       | —        | Stan otwarcia                   |
| onOpenChange | (open: boolean) => void       | —        | Callback przy zmianie stanu     |
| side         | 'right' \| 'left'           | 'right'  | Strona, skąd wysuwa się panel   |
| size         | 'sm' \| 'md' \| 'lg'     | 'md'     | Szerokość panelu               |
| children     | React.ReactNode               | —        | Zawartość SheetContent          |

### A11y
- Focus trap wewnątrz panelu
- `aria-modal=true`
- Obsługa ESC do zamknięcia

---

*Dokument wygenerowany automatycznie na podstawie Component API Reference Template*