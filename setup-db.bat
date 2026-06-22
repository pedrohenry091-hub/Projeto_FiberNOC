@echo off
setlocal enabledelayedexpansion

REM Definir o caminho do Node
set "NODE_PATH=C:\Users\Usuario\AppData\Local\Temp\node-v20.11.1-win-x64"
set "PATH=!NODE_PATH!;!PATH!"

echo.
echo ====================================
echo FiberNOC - Setup Database
echo ====================================
echo.

REM Verificar se Node existe
if not exist "!NODE_PATH!\node.exe" (
    echo [ERRO] Node.js nao encontrado em !NODE_PATH!
    echo Por favor, instale Node.js primeiro.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
"!NODE_PATH!\node.exe" --version

echo.
echo [1] Gerando cliente Prisma...
call "!NODE_PATH!\npm.cmd" run db:generate
if errorlevel 1 goto error

echo.
echo [2] Executando migrações...
call "!NODE_PATH!\npm.cmd" run db:migrate
if errorlevel 1 goto error

echo.
echo [3] Alimentando banco de dados...
call "!NODE_PATH!\npm.cmd" run db:seed
if errorlevel 1 goto error

echo.
echo [4] Iniciando servidor...
call "!NODE_PATH!\npm.cmd" run dev

goto end

:error
echo.
echo [ERRO] Algo deu errado!
pause
exit /b 1

:end
pause
