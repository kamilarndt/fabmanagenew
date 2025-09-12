# Ant Design – projektowe wytyczne i integracja z FabManage (v5)

Źródła: [Ant Design – Introduce](https://ant.design/docs/react/introduce)

## Cel
- 100% komponentów UI w projekcie opartych o Ant Design.
- Jeden spójny motyw „dark-green” zarządzany przez CSS Variables i ConfigProvider.
- Ostre krawędzie (borderRadius = 0), wysoki kontrast, akcent mint.

## Instalacja i importy
- Biblioteka: `antd` (React 18/19-compatible).
- Reset: `import 'antd/dist/reset.css'` na starcie aplikacji.
- Tree-shaking ESM – importuj tylko używane komponenty.

## Globalna konfiguracja motywu
W `src/main.tsx`:
- Użyj `ConfigProvider` i `theme.algorithm = theme.darkAlgorithm`.
- Zmapuj zmienne CSS (definiowane w `src/styles/theme.css`) na tokeny AntD:
  - `colorPrimary`, `colorBgBase`, `colorBgContainer`, `colorText`, `colorTextSecondary`, `colorTextTertiary`, `colorBorder`, `colorSuccess`, `colorWarning`, `colorError`, `colorInfo`.
- Wymuś ostre krawędzie: `token.borderRadius = 0` i `components: { Button/Card/Input/Select/Tag: { borderRadius: 0 } }`.

## Zmienne CSS (dark‑green)
W `src/styles/theme.css` (fragment):
```
[data-theme="dark-green"] {
  --primary-main: #00FF85;
  --primary-light: #66FFB3;
  --primary-dark: #00E676;
  --bg-primary: #1A1D21;
  --bg-secondary: #25282E;
  --bg-card: #25282E;
  --text-primary: rgba(230,230,230,.95);
  --text-secondary: rgba(230,230,230,.7);
  --text-muted: rgba(230,230,230,.5);
  --accent-success: var(--primary-main);
  --accent-warning: #FDB528;
  --accent-error: #FF4D49;
  --accent-info: #26C6F9;
  --border-light: rgba(230,230,230,.12);
  --border-medium: rgba(230,230,230,.22);
}
```
Aktywacja: ustaw `data-theme="dark-green"` na `<html>` (zapisywane w `localStorage`).

## Zasady projektowe
- Układy: `Layout`, `Sider`, `Header`, `Content` + `Row/Col` (Grid) i `Space/Flex` dla odstępów.
- Typografia: `Typography.Title/Text/Paragraph` – żadnych stałych kolorów; używamy tokenów.
- Akcje: `Button` z akcentem `colorPrimary`.
- Nawigacja: `Menu` (Sider), `Breadcrumb` (nagłówek), `Tabs/Steps` tam gdzie sekwencje.
- Dane: `Table`, `List`, `Card`, `Statistic`, `Progress`, `Tag`, `Descriptions`, `Empty`.
- Formularze: `Form` + `Input/Select/DatePicker/Upload` wyłącznie AntD.
- Feedback: `Drawer/Modal/Message/Notification/Spin/Alert`.

## Konwencje implementacyjne
- Zero klas bootstrap/tailwind dla UI – tylko AntD + style tokenowe.
- Brak fixed kolorów (`#fff`, `#000`). Zawsze token lub zmienna CSS.
- Komponenty dzielimy na małe, czyste; logika poza JSX.
- Ikony: `@ant-design/icons` lub wbudowane.

## Dostępność i i18n
- ARIA per komponent (wspierane natywnie przez AntD).
- Używamy polskiej lokalizacji tam gdzie dotyczy (`ConfigProvider locale`).

## Walidacja jakości
- Po każdej większej zmianie: `npm run build`, `npm run lint`, `npm run type-check`, `npm run test`.

## Migracja
- Wyszukaj klasy: `card|btn|badge|form-control|form-select|row|col-` i zamień na odpowiednie komponenty AntD.
- Stopniowo usuwaj legacy CSS po zastąpieniu ekranów.
