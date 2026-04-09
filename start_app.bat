@echo off
setlocal
cls
echo 🚀 Starting Weight Tracker System...
echo 🌍 Application will be available at http://0.0.0.0:8112 (Local: http://localhost:8112)

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js not found.
    pause
    exit /b
)

:: Check for node_modules
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

:: Launch the browser (optional, but requested by 'autostart' context)
start "" "http://localhost:8112"

:: Run Vite with specific host and port
echo 🔥 Launching Vite...
call npm run dev -- --host 0.0.0.0 --port 8112

pause
