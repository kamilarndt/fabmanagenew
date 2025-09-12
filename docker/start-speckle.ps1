param(
    [string]$ComposeFile = "docker\speckle\docker-compose.yml"
)

Write-Host "Starting Speckle self-hosted stack..."
if (-not $env:CANONICAL_URL) { $env:CANONICAL_URL = "http://localhost:8081" }

docker compose -f $ComposeFile up -d
Write-Host "Speckle is starting. Open $env:CANONICAL_URL after containers are healthy."



