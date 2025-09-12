import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { Pool } from 'pg'

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://fabmanage_user:fabmanage_pass@localhost:5432/fabmanage_db`
})

app.get('/api/health', async (_req, res) => {
  try {
    const r = await pool.query('SELECT 1')
    res.json({ ok: true, db: r.rows[0]['?column?'] === 1 })
  } catch (e) {
    res.status(500).json({ ok: false, error: (e as Error).message })
  }
})

// Clients
app.get('/api/clients', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, phone FROM clients ORDER BY name')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
})

app.post('/api/clients', async (req, res) => {
  const { id, name, email, phone } = req.body ?? {}
  try {
    await pool.query('INSERT INTO clients (id, name, email, phone) VALUES ($1,$2,$3,$4)', [id, name, email, phone])
    res.status(201).json({ id, name, email, phone })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
})

// Projects
app.get('/api/projects', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
})

// Tiles
app.get('/api/tiles', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tiles ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
})

// Materials BOM for project
app.get('/api/materials/bom', async (req, res) => {
  const projectId = req.query.projectId as string
  try {
    const { rows } = await pool.query(
      `SELECT tm.tile_id, m.id as material_id, m.code, m.name, tm.quantity, m.unit
       FROM tile_materials tm
       JOIN tiles t ON t.id = tm.tile_id
       JOIN materials m ON m.id = tm.material_id
       WHERE t.project_id = $1`,
      [projectId]
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})


