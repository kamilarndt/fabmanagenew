$ErrorActionPreference = 'Stop'

param(
  [string]$DbUrl = $env:DATABASE_URL
)

if (-not $DbUrl) {
  $DbUrl = 'postgresql://fabmanage_user:fabmanage_pass@localhost:5432/fabmanage_db'
}

Write-Host "Seeding DB: $DbUrl"
docker run --rm -i --network host postgres:15 bash -lc "psql $DbUrl -v ON_ERROR_STOP=1" < ./scripts/seed.sql

Write-Host "Done."


