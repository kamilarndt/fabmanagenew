# MCP Setup & Commands Playbook

## Cel
iAutomatyzacja eksportu design tokenów i generacji komponentów z Figma do kodu za pomocą TalkToFigma MCP plugin w Cursor IDE.

## Konfiguracja MCP Server
1. **Zainstaluj**: 
   ```bash
   npm install -g cursor-talk-to-figma-mcp
   ```
2. **Skonfiguruj** `.cursor/mcp.json`: 
   ```json
   {
     "mcpServers": {
       "TalkToFigma": {
         "command": "cursor-talk-to-figma-mcp",
         "args": ["--port=3055"]
       }
     }
   }
   ```
3. **Uruchom WebSocket server**:
   ```bash
   bun socket --port 3055
   ```
4. **W Figma**: zainstaluj plugin **Cursor Talk To Figma MCP** i połącz z `ws://localhost:3055`.

## Kluczowe Komendy MCP
| Komenda | Opis | Przykład |
|---------|------|----------|
| join_channel | Dołącz do kanału Figma | `join_channel <figma_channel_id>` |
| get_figma_data | Pobierz cały dokument | `get_figma_data --file-key=<FILE_KEY>` |
| extract_design_tokens | Ekstraktuj wszystkie tokeny | `extract_design_tokens --output=src/new-ui/tokens/` |
| get_color_styles | Pobierz style koloru w formacie Tailwind | `get_color_styles --format=tailwind-css` |
| get_typography_styles | Pobierz style typografii | `get_typography_styles --output=src/new-ui/tokens/typography.ts` |
| get_component_variants | Generuj pliki komponentów z wariantami | `get_component_variants --component='Button' --output=src/new-ui/atoms/Button/` |
| extract_input_styles | Eksport stylów input | `extract_input_styles --output=src/new-ui/atoms/Input/` |
| export_icon_components | Pobierz ikony SVG | `export_icon_components --path=src/new-ui/atoms/Icon/` |
| extract_form_patterns | Ekstraktuj molekuły formularzy | `extract_form_patterns --output=src/new-ui/molecules/FormField/` |

## Przykładowy Workflow
1. **Połącz**: `$ join_channel 12345abcdef`
2. **Pobierz plik**: `$ get_figma_data --file-key=XYZ`  
3. **Ekstrakt tokenów**: `$ extract_design_tokens --output=src/new-ui/tokens/`  
4. **Kolory**: `$ get_color_styles --format=tailwind-css`  
5. **Typografia**: `$ get_typography_styles --output=src/new-ui/tokens/typography.ts`  
6. **Atomy**: `$ get_component_variants --component='Button' --output=src/new-ui/atoms/Button/`  

---
*Playbook przygotowany przez zespół UI i integracji*