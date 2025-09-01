
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/ui-kit/constructor-design-system.css";
import applyFigmaTheme from "./styles/ui-kit/figma-theme-adapter";

// Apply Figma theme once the DOM is ready
applyFigmaTheme();

createRoot(document.getElementById("root")!).render(<App />);
