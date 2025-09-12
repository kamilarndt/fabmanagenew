# Quick Setup Guide - Cursor AI Workspace dla FabManage

## 🚀 Szybka Instalacja

### Krok 1: Skopiuj strukturę folderów
```bash
# W root projektu FabManage utwórz:
mkdir -p .cursor/rules
mkdir -p docs/ai-docs
```

### Krok 2: Skopiuj pliki konfiguracyjne

Skopiuj następujące pliki do odpowiednich lokalizacji:

#### `.cursor/rules/` - Reguły MDC:
- `typescript.mdc` - Reguły TypeScript
- `react.mdc` - Wzorce React
- `zustand.mdc` - State management
- `bootstrap.mdc` - UI i styling  
- `supabase.mdc` - Integracja backend
- `fabmanage-business.mdc` - Logika biznesowa

#### `.cursor/` - Główne instrukcje:
- `instructions.md` - Instrukcje projektu
- `project-overview.mdc` - Przegląd dla AI

### Krok 3: Konfiguracja Cursor Settings

1. Otwórz Cursor Settings (Cmd/Ctrl + ,)
2. Przejdź do sekcji "Rules"
3. Dodaj globalną regułę:

```
Odpowiadaj w języku polskim, jeśli nie zostanie określone inaczej.
Priorytetyzuj bezpieczeństwo typów i wydajność kodu.
Zawsze implementuj proper error handling.
Używaj wzorców i konwencji specyficznych dla projektu FabManage.
```

### Krok 4: Włącz "Thinking Model"

1. W prawym dolnym rogu Cursor wyłącz "Auto-select"
2. Wybierz model "Thinking" z opcją "claude-3.7-sonnet"
3. To zapewni lepsze rezultaty dla złożonej logiki biznesowej

### Krok 5: Konfiguracja .cursorignore

Stwórz plik `.cursorignore` w root projektu:
```
node_modules/
dist/
build/
.git/
*.log
.env
.env.local
coverage/
```

## 🎯 Jak używać workspace

### Chat Mode
- Używaj `@project-overview.mdc` dla kontekstu projektu
- Referencuj `@typescript.mdc` dla wzorców TypeScript
- Użyj `@react.mdc` dla komponentów React

### Agent Mode (Cmd/Ctrl + I)
Agent automatycznie załaduje odpowiednie reguły na podstawie:
- Typu pliku (glob patterns)
- Kontekstu projektu
- Włączonych "alwaysApply" reguł

### Composer Mode
- Otwórz z `Cmd/Ctrl + L`
- AI automatycznie użyje reguł dla modyfikowanych plików
- Może referencować dokumentację z `docs/ai-docs/`

## 🏗️ Przykłady użycia

### Tworzenie nowego komponentu:
```
Stwórz komponent ProjectCard używając wzorców z @react.mdc i @bootstrap.mdc. 
Komponent ma wyświetlać podstawowe informacje o projekcie z statusem modułów.
```

### Implementacja Zustand store:
```
Implementuj TileStore używając wzorców z @zustand.mdc dla zarządzania 
kafelkami w systemie FabManage.
```

### Integracja Supabase:
```
Stwórz service dla projektów używając wzorców z @supabase.mdc 
z proper error handling i TypeScript.
```

## 🔧 Dostrajanie workspace

### Dodawanie nowych reguł:
1. Stwórz nowy plik `.mdc` w `.cursor/rules/`
2. Zdefiniuj glob patterns dla odpowiednich plików
3. Dodaj specific guidelines dla tego wzorca

### Aktualizacja business rules:
Edytuj `.cursor/rules/fabmanage-business.mdc` gdy:
- Dodajesz nowe moduły
- Zmieniasz workflow
- Implementujesz nowe funkcjonalności

### Rozszerzanie dokumentacji:
Dodaj pliki do `docs/ai-docs/` dla:
- Nowych wzorców architektonicznych
- Specific workflows
- Integration guidelines

## ⚡ Pro Tips

1. **Używaj Agent Mode** dla złożonych zadań implementacyjnych
2. **Chat Mode** do quick questions i eksploracji
3. **Reference specific rules** w promptach dla lepszych rezultatów
4. **Update reguły** gdy evolves projekt
5. **Test workspace** na małych taskach przed dużymi implementacjami

## 🐛 Troubleshooting

### AI nie stosuje reguł:
- Sprawdź czy pliki `.mdc` mają proper metadata
- Verify glob patterns match twoje pliki  
- Restart Cursor po dodaniu nowych reguł

### Conflicting suggestions:
- Sprawdź rule precedence (Always > Auto > Manual)
- Simplify overlapping rules
- Use specific file patterns

### Performance issues:
- Zmniejsz liczbę "alwaysApply" reguł
- Use more specific glob patterns
- Split complex rules into smaller files

Ten workspace jest gotowy do użycia i zapewni wysoką jakość kodu zgodną ze specyfiką projektu FabManage! 🎉