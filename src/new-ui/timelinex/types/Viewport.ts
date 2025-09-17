// Viewport types for TimelineX

export interface Viewport {
  start: Date;
  end: Date;
  zoom: number;
  pan: { x: number; y: number };
}

export interface ViewportBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportSettings {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  panStep: number;
  snapToGrid: boolean;
  gridSize: number;
}
