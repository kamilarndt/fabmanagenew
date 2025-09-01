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
  console.log("Health check requested");
  return c.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "2.0",
    endpoints: [
      "/tiles",
      "/projects",
      "/tiles/:id/status",
      "/materials"
    ]
  });
});

// Tiles management endpoints
app.get("/make-server-2095e8d8/tiles", async (c) => {
  try {
    console.log("GET /tiles - Fetching tiles from KV store");
    const tiles = await kv.get("tiles") || [];
    console.log("GET /tiles - Retrieved tiles count:", tiles.length);
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
    console.log(`PUT /tiles/${tileId} - Updates:`, updates);
    
    const tiles = await kv.get("tiles") || [];
    console.log(`PUT /tiles/${tileId} - Current tiles count:`, tiles.length);
    
    const updatedTiles = tiles.map((tile: any) => 
      tile.id === tileId ? { ...tile, ...updates } : tile
    );
    
    await kv.set("tiles", updatedTiles);
    console.log(`PUT /tiles/${tileId} - Successfully updated KV store`);
    
    const updatedTile = updatedTiles.find((tile: any) => tile.id === tileId);
    console.log(`PUT /tiles/${tileId} - Updated tile:`, updatedTile);
    
    return c.json({ success: true, tile: updatedTile });
  } catch (error) {
    console.log("Error updating tile:", error);
    return c.json({ error: "Failed to update tile", details: error.message || error }, 500);
  }
});

app.post("/make-server-2095e8d8/tiles/:id/status", async (c) => {
  try {
    const tileId = c.req.param("id");
    const { status, source } = await c.req.json();
    
    console.log(`[Server] POST /tiles/${tileId}/status - Request:`, { status, source });
    
    const tiles = await kv.get("tiles") || [];
    console.log(`[Server] Current tiles count: ${tiles.length}`);
    
    const existingTile = tiles.find((tile: any) => tile.id === tileId);
    if (!existingTile) {
      console.log(`[Server] Tile ${tileId} not found`);
      return c.json({ error: `Tile ${tileId} not found` }, 404);
    }
    
    console.log(`[Server] Found tile ${tileId} with current status: ${existingTile.status}`);
    
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
        
        const updatedTile = { ...tile, ...updates };
        console.log(`[Server] Updating tile ${tileId} from ${tile.status} to ${updatedTile.status}`);
        return updatedTile;
      }
      return tile;
    });
    
    await kv.set("tiles", updatedTiles);
    console.log(`[Server] Successfully saved ${updatedTiles.length} tiles to KV store`);
    
    const updatedTile = updatedTiles.find((tile: any) => tile.id === tileId);
    console.log(`[Server] Returning updated tile:`, updatedTile);
    
    return c.json({ success: true, tile: updatedTile });
  } catch (error) {
    console.log("Error updating tile status:", error);
    return c.json({ error: "Failed to update tile status", details: error.message || error }, 500);
  }
});

// Projects management endpoints
app.get("/make-server-2095e8d8/projects", async (c) => {
  try {
    console.log("GET /projects - Fetching projects from KV store");
    const projects = await kv.get("projects") || [];
    console.log("GET /projects - Retrieved projects:", projects);
    return c.json({ projects });
  } catch (error) {
    console.log("Error getting projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

app.post("/make-server-2095e8d8/projects", async (c) => {
  try {
    console.log("POST /projects - Creating new project");
    const projectData = await c.req.json();
    console.log("POST /projects - Request body:", projectData);
    
    const projects = await kv.get("projects") || [];
    console.log("POST /projects - Current projects:", projects);
    
    const newProject = {
      ...projectData,
      id: `P-${String(projects.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log("POST /projects - New project object:", newProject);
    
    const updatedProjects = [...projects, newProject];
    console.log("POST /projects - Updated projects array:", updatedProjects);
    
    await kv.set("projects", updatedProjects);
    console.log("POST /projects - Successfully saved to KV store");
    
    return c.json({ success: true, project: newProject });
  } catch (error) {
    console.log("Error creating project:", error);
    return c.json({ error: "Failed to create project", details: error.message || error }, 500);
  }
});

// Materials management endpoints
app.get("/make-server-2095e8d8/materials", async (c) => {
  try {
    console.log("GET /materials - Fetching materials from KV store");
    const materials = await kv.get("materials") || [];
    console.log("GET /materials - Retrieved materials count:", materials.length);
    return c.json({ materials });
  } catch (error) {
    console.log("Error getting materials:", error);
    return c.json({ error: "Failed to fetch materials" }, 500);
  }
});

app.post("/make-server-2095e8d8/materials", async (c) => {
  try {
    console.log("POST /materials - Creating new material");
    const materialData = await c.req.json();
    console.log("POST /materials - Request body:", materialData);
    
    const materials = await kv.get("materials") || [];
    console.log("POST /materials - Current materials:", materials);
    
    const newMaterial = {
      ...materialData,
      id: materialData.id || `MAT-${String(materials.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log("POST /materials - New material object:", newMaterial);
    
    const updatedMaterials = [...materials, newMaterial];
    console.log("POST /materials - Updated materials array:", updatedMaterials);
    
    await kv.set("materials", updatedMaterials);
    console.log("POST /materials - Successfully saved to KV store");
    
    return c.json({ success: true, material: newMaterial });
  } catch (error) {
    console.log("Error creating material:", error);
    return c.json({ error: "Failed to create material", details: error.message || error }, 500);
  }
});

app.put("/make-server-2095e8d8/materials/:id", async (c) => {
  try {
    const materialId = c.req.param("id");
    const updates = await c.req.json();
    console.log(`PUT /materials/${materialId} - Updates:`, updates);
    
    const materials = await kv.get("materials") || [];
    console.log(`PUT /materials/${materialId} - Current materials count:`, materials.length);
    
    const updatedMaterials = materials.map((material: any) => 
      material.id === materialId ? { ...material, ...updates, updatedAt: new Date().toISOString() } : material
    );
    
    await kv.set("materials", updatedMaterials);
    console.log(`PUT /materials/${materialId} - Successfully updated KV store`);
    
    const updatedMaterial = updatedMaterials.find((material: any) => material.id === materialId);
    console.log(`PUT /materials/${materialId} - Updated material:`, updatedMaterial);
    
    return c.json({ success: true, material: updatedMaterial });
  } catch (error) {
    console.log("Error updating material:", error);
    return c.json({ error: "Failed to update material", details: error.message || error }, 500);
  }
});

app.delete("/make-server-2095e8d8/materials/:id", async (c) => {
  try {
    const materialId = c.req.param("id");
    console.log(`DELETE /materials/${materialId} - Deleting material`);
    
    const materials = await kv.get("materials") || [];
    console.log(`DELETE /materials/${materialId} - Current materials count:`, materials.length);
    
    const filteredMaterials = materials.filter((material: any) => material.id !== materialId);
    
    await kv.set("materials", filteredMaterials);
    console.log(`DELETE /materials/${materialId} - Successfully updated KV store`);
    
    return c.json({ success: true, deleted: materialId });
  } catch (error) {
    console.log("Error deleting material:", error);
    return c.json({ error: "Failed to delete material", details: error.message || error }, 500);
  }
});

Deno.serve(app.fetch);