# Contributing Guide

## Workflow
1. Stwórz branch feature od `Ui-Design`/`main`
2. Implementuj zmianę w małych, czytelnych commitach
3. Uruchom: `npm run lint` → `npx vitest --run` → `npm run build`
4. Otwórz PR z krótkim opisem zmiany i wpływu

## Style kodu
- TypeScript, React hooks, bez `any` (chyba że uzasadnione)
- Nazewnictwo czytelne; krótkie funkcje, wczesne zwroty
- Komentarze tylko do złożonej logiki (dlaczego, nie jak)

## Testy
- Dodaj testy jednostkowe do logiki w `stores` i `lib`
- Aktualizuj smoke testy jeśli zmieniasz kluczowe przepływy

## Dokumentacja
- Aktualizuj pliki w `docs/new/` w ramach zmian
- Dodaj notkę do `RELEASE_NOTES_TEMPLATE.md` (sekcja „Improvements/Fixes”)


