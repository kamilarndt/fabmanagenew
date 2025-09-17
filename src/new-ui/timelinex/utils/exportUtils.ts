// Export utilities for TimelineX

import {
  TimelineGroup,
  TimelineItem,
  TimelineMode,
  TimelineSettings,
  TimelineTheme,
} from "../types";

export interface ExportOptions {
  format: "svg" | "png" | "pdf" | "json" | "csv" | "excel" | "powerpoint";
  filename?: string;
  includeMetadata?: boolean;
  includeGroups?: boolean;
  includeItems?: boolean;
  includeViewport?: boolean;
  quality?: number; // 0-1 for image formats
  width?: number;
  height?: number;
  backgroundColor?: string;
  theme?: "light" | "dark" | "auto";
}

export interface ExportData {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: {
    start: Date;
    end: Date;
    zoom: number;
    pan: { x: number; y: number };
  };
  mode: TimelineMode;
  theme: TimelineTheme;
  settings: TimelineSettings;
  metadata?: {
    exportedAt: Date;
    version: string;
    totalItems: number;
    totalGroups: number;
  };
}

export class TimelineExporter {
  private static instance: TimelineExporter;

  static getInstance(): TimelineExporter {
    if (!TimelineExporter.instance) {
      TimelineExporter.instance = new TimelineExporter();
    }
    return TimelineExporter.instance;
  }

  async exportToSVG(
    data: ExportData,
    options: ExportOptions,
    canvasElement?: HTMLCanvasElement
  ): Promise<string> {
    const { width = 1200, height = 800, backgroundColor = "#ffffff" } = options;

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // Add background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", backgroundColor);
    svg.appendChild(rect);

    // Add timeline content (simplified - in real implementation, you'd render the actual timeline)
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50");
    text.setAttribute("y", "50");
    text.setAttribute("font-family", "Arial, sans-serif");
    text.setAttribute("font-size", "16");
    text.setAttribute("fill", "#333");
    text.textContent = `Timeline Export - ${data.items.length} items, ${data.groups.length} groups`;
    svg.appendChild(text);

    // Convert to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  }

  async exportToPNG(
    data: ExportData,
    options: ExportOptions,
    canvasElement?: HTMLCanvasElement
  ): Promise<string> {
    const { quality = 0.9 } = options;

    if (canvasElement) {
      return canvasElement.toDataURL("image/png", quality);
    }

    // Fallback: create a simple canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    canvas.width = options.width || 1200;
    canvas.height = options.height || 800;

    // Draw background
    ctx.fillStyle = options.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw timeline content (simplified)
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.fillText(`Timeline Export - ${data.items.length} items`, 50, 50);

    return canvas.toDataURL("image/png", quality);
  }

  async exportToPDF(data: ExportData, options: ExportOptions): Promise<Blob> {
    // This would require a PDF library like jsPDF
    // For now, return a placeholder
    const content = `Timeline Export
Items: ${data.items.length}
Groups: ${data.groups.length}
Mode: ${data.mode}
Exported: ${new Date().toISOString()}`;

    return new Blob([content], { type: "application/pdf" });
  }

  async exportToJSON(
    data: ExportData,
    options: ExportOptions
  ): Promise<string> {
    const exportData = {
      ...data,
      metadata: {
        exportedAt: new Date(),
        version: "1.0.0",
        totalItems: data.items.length,
        totalGroups: data.groups.length,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  async exportToCSV(data: ExportData, options: ExportOptions): Promise<string> {
    const headers = [
      "ID",
      "Title",
      "Start",
      "End",
      "Group",
      "Priority",
      "Progress",
      "Description",
    ];
    const rows = data.items.map((item) => [
      item.id,
      item.title,
      item.start.toISOString(),
      (item.end || item.start).toISOString(),
      item.group || "",
      item.priority || "normal",
      item.progress || 0,
      item.description || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  }

  async exportToExcel(data: ExportData, options: ExportOptions): Promise<Blob> {
    // This would require a library like xlsx
    // For now, return CSV as Excel-compatible format
    const csv = await this.exportToCSV(data, options);
    return new Blob([csv], { type: "application/vnd.ms-excel" });
  }

  async exportToPowerPoint(
    data: ExportData,
    options: ExportOptions
  ): Promise<Blob> {
    // This would require a library like pptx
    // For now, return a placeholder
    const content = `Timeline Export for PowerPoint
Items: ${data.items.length}
Groups: ${data.groups.length}
Mode: ${data.mode}`;

    return new Blob([content], { type: "application/vnd.ms-powerpoint" });
  }

  async export(
    data: ExportData,
    options: ExportOptions,
    canvasElement?: HTMLCanvasElement
  ): Promise<{ data: string | Blob; filename: string; mimeType: string }> {
    const filename = options.filename || `timeline-export-${Date.now()}`;

    switch (options.format) {
      case "svg":
        return {
          data: await this.exportToSVG(data, options, canvasElement),
          filename: `${filename}.svg`,
          mimeType: "image/svg+xml",
        };

      case "png":
        return {
          data: await this.exportToPNG(data, options, canvasElement),
          filename: `${filename}.png`,
          mimeType: "image/png",
        };

      case "pdf":
        return {
          data: await this.exportToPDF(data, options),
          filename: `${filename}.pdf`,
          mimeType: "application/pdf",
        };

      case "json":
        return {
          data: await this.exportToJSON(data, options),
          filename: `${filename}.json`,
          mimeType: "application/json",
        };

      case "csv":
        return {
          data: await this.exportToCSV(data, options),
          filename: `${filename}.csv`,
          mimeType: "text/csv",
        };

      case "excel":
        return {
          data: await this.exportToExcel(data, options),
          filename: `${filename}.xls`,
          mimeType: "application/vnd.ms-excel",
        };

      case "powerpoint":
        return {
          data: await this.exportToPowerPoint(data, options),
          filename: `${filename}.ppt`,
          mimeType: "application/vnd.ms-powerpoint",
        };

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  downloadFile(data: string | Blob, filename: string, mimeType: string): void {
    const blob =
      data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

// Convenience functions
export const exportTimeline = async (
  data: ExportData,
  options: ExportOptions,
  canvasElement?: HTMLCanvasElement
): Promise<void> => {
  const exporter = TimelineExporter.getInstance();
  const result = await exporter.export(data, options, canvasElement);
  exporter.downloadFile(result.data, result.filename, result.mimeType);
};

export const getExportFormats = (): Array<{
  value: string;
  label: string;
  description: string;
}> => {
  return [
    { value: "svg", label: "SVG", description: "Scalable Vector Graphics" },
    { value: "png", label: "PNG", description: "Portable Network Graphics" },
    { value: "pdf", label: "PDF", description: "Portable Document Format" },
    { value: "json", label: "JSON", description: "JavaScript Object Notation" },
    { value: "csv", label: "CSV", description: "Comma-Separated Values" },
    { value: "excel", label: "Excel", description: "Microsoft Excel Format" },
    {
      value: "powerpoint",
      label: "PowerPoint",
      description: "Microsoft PowerPoint Format",
    },
  ];
};
