// Lightweight Figma → Constructor Design System theme adapter
// Applies font and radius/typography tokens to CSS custom properties at runtime

type FontToken = {
    family: string;
    style: string;
    size: number; // px
    weight: number;
    lineHeight: number; // px
};

export type FigmaVariableSnapshot = {
    // Radius
    "Corner-4"?: number;
    "Corner-8"?: number;
    "Corner-12"?: number;
    "Corner-16"?: number;
    "Corner-20"?: number;
    "Corner-Full"?: number | string;
    // Typography (sizes based on the selection snapshot)
    "Text S/Regular"?: FontToken;
    "Text M/Regular"?: FontToken;
    "Text L/Medium"?: FontToken;
    "Text XL/Semibold"?: FontToken;
    "Display M/Semibold"?: FontToken;
};

const defaultSnapshot: FigmaVariableSnapshot = {
    // Based on MCP selection snapshot
    "Corner-4": 4,
    "Corner-8": 8,
    "Corner-12": 12,
    "Corner-16": 16,
    "Corner-20": 20,
    "Corner-Full": 100,
    "Text S/Regular": {
        family: "Plus Jakarta Sans",
        style: "Regular",
        size: 12,
        weight: 400,
        lineHeight: 18
    },
    "Text M/Regular": {
        family: "Plus Jakarta Sans",
        style: "Regular",
        size: 14,
        weight: 400,
        lineHeight: 20
    },
    "Text L/Medium": {
        family: "Plus Jakarta Sans",
        style: "Medium",
        size: 16,
        weight: 500,
        lineHeight: 24
    },
    "Text XL/Semibold": {
        family: "Plus Jakarta Sans",
        style: "SemiBold",
        size: 18,
        weight: 600,
        lineHeight: 28
    },
    "Display M/Semibold": {
        family: "Plus Jakarta Sans",
        style: "SemiBold",
        size: 24,
        weight: 600,
        lineHeight: 32
    }
};

function setVar(name: string, value: string | number) {
    const v = typeof value === "number" && name.startsWith("--constructor-text-")
        ? `${value}px`
        : typeof value === "number" && name.startsWith("--constructor-radius-")
            ? `${value}px`
            : String(value);
    document.documentElement.style.setProperty(name, v);
}

function ensureFontOverride(fontFamily: string) {
    // Inject a minimal override to align components with Figma font
    const id = "constructor-font-override";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
.constructor-component { font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
body { font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
`;
    document.head.appendChild(style);
}

export function applyFigmaTheme(snapshot?: Partial<FigmaVariableSnapshot>) {
    try {
        const s = { ...defaultSnapshot, ...(snapshot || {}) } as FigmaVariableSnapshot;

        // Map radius tokens
        if (s["Corner-4"] !== undefined) setVar("--constructor-radius-sm", s["Corner-4"]!);
        if (s["Corner-8"] !== undefined) setVar("--constructor-radius-md", s["Corner-8"]!);
        if (s["Corner-12"] !== undefined) setVar("--constructor-radius-lg", s["Corner-12"]!);
        if (s["Corner-16"] !== undefined) setVar("--constructor-radius-xl", s["Corner-16"]!);
        if (s["Corner-20"] !== undefined) setVar("--constructor-radius-2xl", s["Corner-20"]!);

        // Map typography sizes
        if (s["Text S/Regular"]) setVar("--constructor-text-xs", s["Text S/Regular"]!.size);
        if (s["Text M/Regular"]) setVar("--constructor-text-sm", s["Text M/Regular"]!.size);
        if (s["Text L/Medium"]) setVar("--constructor-text-base", s["Text L/Medium"]!.size);
        if (s["Text XL/Semibold"]) setVar("--constructor-text-lg", s["Text XL/Semibold"]!.size);
        if (s["Display M/Semibold"]) setVar("--constructor-text-2xl", s["Display M/Semibold"]!.size);

        // Apply font override from the most common text token
        const baseFont = s["Text M/Regular"] || s["Text L/Medium"];
        if (baseFont) ensureFontOverride(baseFont.family);
    } catch (err) {
        // Fail-safe: do nothing if DOM unavailable
        // eslint-disable-next-line no-console
        console.warn("applyFigmaTheme failed:", err);
    }
}

export default applyFigmaTheme;


