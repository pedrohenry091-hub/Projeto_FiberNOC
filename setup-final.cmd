@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\Usuario\Documents\GitHub\Projeto_FiberNOC"

set "NODE_PATH=C:\Users\Usuario\AppData\Local\Temp\node-v22.12.0-win-x64"
set "PATH=!NODE_PATH!;!PATH!"

echo.
echo ====================================
echo FiberNOC - Setup Database
echo ====================================
echo.

echo [1/4] Gerando cliente Prisma...
call npx prisma generate
if errorlevel 1 (
    echo [ERRO] Falha ao gerar Prisma
    exit /b 1
)

echo.
echo [2/4] Executando migrações...
call npx prisma migrate deploy
if errorlevel 1 (
    echo [ERRO] Falha nas migrações
    exit /b 1
)

echo.
echo [3/4] Alimentando banco de dados...
call npx prisma db seed
if errorlevel 1 (
    echo [ERRO] Falha ao fazer seed
    exit /b 1
)

echo.
echo [4/4] Iniciando servidor...
echo Servidor rodará em: http://localhost:3000
echo.
call npm run dev
