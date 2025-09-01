import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2095e8d8/health", (c) => {
  return c.json({ status: "ok" });
});

// Tiles management endpoints
app.get("/make-server-2095e8d8/tiles", async (c) => {
  try {
    const tiles = await kv.get("tiles") || [];
    return c.json({ tiles });
  } catch (error) {
    console.log("Error getting tiles:", error);
    return c.json({ error: "Failed to fetch tiles" }, 500);
  }
});

app.post("/make-server-2095e8d8/tiles", async (c) => {
  try {
    const body = await c.req.json();
    const { tiles } = body;
    
    if (!Array.isArray(tiles)) {
      return c.json({ error: "Invalid tiles data" }, 400);
    }

    await kv.set("tiles", tiles);
    return c.json({ success: true, tiles });
  } catch (error) {
    console.log("Error saving tiles:", error);
    return c.json({ error: "Failed to save tiles" }, 500);
  }
});

app.put("/make-server-2095e8d8/tiles/:id", async (c) => {
  try {
    const tileId = c.req.param("id");
    const updates = await c.req.json();
    
    const tiles = await kv.get("tiles") || [];
    const updatedTiles = tiles.map((tile: any) => 
      tile.id === tileId ? { ...tile, ...updates } : tile
    );
    
    await kv.set("tiles", updatedTiles);
    
    const updatedTile = updatedTiles.find((tile: any) => tile.id === tileId);
    return c.json({ success: true, tile: updatedTile });
  } catch (error) {
    console.log("Error updating tile:", error);
    return c.json({ error: "Failed to update tile" }, 500);
  }
});

app.post("/make-server-2095e8d8/tiles/:id/status", async (c) => {
  try {
    const tileId = c.req.param("id");
    const { status, source } = await c.req.json();
    
    const tiles = await kv.get("tiles") || [];
    const updatedTiles = tiles.map((tile: any) => {
      if (tile.id === tileId) {
        const updates: any = { status };
        
        // Add timestamp and progress updates based on status
        if (status === "W produkcji CNC" || status === "W TRAKCIE CIĘCIA") {
          updates.startTime = new Date().toLocaleTimeString("pl-PL", { 
            hour: "2-digit", 
            minute: "2-digit" 
          });
        }
        
        if (status === "Gotowy do montażu" || status === "WYCIĘTE") {
          updates.completedTime = new Date().toLocaleTimeString("pl-PL", { 
            hour: "2-digit", 
            minute: "2-digit" 
          });
          updates.progress = 100;
        }
        
        return { ...tile, ...updates };
      }
      return tile;
    });
    
    await kv.set("tiles", updatedTiles);
    
    const updatedTile = updatedTiles.find((tile: any) => tile.id === tileId);
    return c.json({ success: true, tile: updatedTile });
  } catch (error) {
    console.log("Error updating tile status:", error);
    return c.json({ error: "Failed to update tile status" }, 500);
  }
});

// Projects management endpoints
app.get("/make-server-2095e8d8/projects", async (c) => {
  try {
    const projects = await kv.get("projects") || [];
    return c.json({ projects });
  } catch (error) {
    console.log("Error getting projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

app.post("/make-server-2095e8d8/projects", async (c) => {
  try {
    const projectData = await c.req.json();
    
    const projects = await kv.get("projects") || [];
    const newProject = {
      ...projectData,
      id: `P-${String(projects.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedProjects = [...projects, newProject];
    await kv.set("projects", updatedProjects);
    
    return c.json({ success: true, project: newProject });
  } catch (error) {
    console.log("Error creating project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

Deno.serve(app.fetch);