#!/usr/bin/env pwsh

# FiberNOC - Setup Script
Write-Host "`n====================================`nFiberNOC - Setup Database`n====================================" -ForegroundColor Cyan

$NODE_PATH = "C:\Users\Usuario\AppData\Local\Temp\node-v20.11.1-win-x64"
$PROJECT_ROOT = Get-Location

# Adicionar Node ao PATH
$env:PATH = "$NODE_PATH;$env:PATH"

# Verificar Node
if (-not (Test-Path "$NODE_PATH\node.exe")) {
    Write-Host "[ERRO] Node.js nao encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Node.js encontrado" -ForegroundColor Green
& "$NODE_PATH\node.exe" --version

# Gerar Prisma
Write-Host "`n[1] Gerando cliente Prisma..." -ForegroundColor Yellow
& "$NODE_PATH\npm.cmd" run db:generate
if ($LASTEXITCODE -ne 0) { exit 1 }

# Executar migrações
Write-Host "`n[2] Executando migrações..." -ForegroundColor Yellow
& "$NODE_PATH\npm.cmd" run db:migrate
if ($LASTEXITCODE -ne 0) { exit 1 }

# Seed do banco
Write-Host "`n[3] Alimentando banco de dados..." -ForegroundColor Yellow
& "$NODE_PATH\npm.cmd" run db:seed
if ($LASTEXITCODE -ne 0) { exit 1 }

# Iniciar servidor
Write-Host "`n[4] Iniciando servidor..." -ForegroundColor Yellow
& "$NODE_PATH\npm.cmd" run dev
