@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

set "NODE_PATH=C:\Users\Usuario\AppData\Local\Temp\node-v22.12.0-win-x64"
set "PATH=!NODE_PATH!;!PATH!"

cd /d "c:\Users\Usuario\Documents\GitHub\Projeto_FiberNOC\back-end"

echo.
echo ╔════════════════════════════════════════╗
echo ║     FiberNOC - API Server Start        ║
echo ╚════════════════════════════════════════╝
echo.

echo [1] Instalando dependências...
call "!NODE_PATH!\npm.cmd" install

echo.
echo [2] Iniciando servidor...
echo.
echo Servidor rodará em: http://localhost:3000
echo.

call "!NODE_PATH!\node.exe" server.js
