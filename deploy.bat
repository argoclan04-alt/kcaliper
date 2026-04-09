@echo off
setlocal
cls
echo 🚀 Starting ARGO SaaS Local Deploy...

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files\nodejs"
        echo ✅ Node.js found in standard path.
    ) else (
        echo ❌ Error: Node.js not found.
        echo 👉 Please install it from: https://nodejs.org/
        pause
        exit /b
    )
)

:: 2. Check for node_modules
if not exist "node_modules" (
    echo 📦 Installing dependencies (npm install)...
    call npm install
)

:: 3. Start the dev server
echo 🔥 Launching Vite Dev Server...
echo 🌍 The app will open at http://localhost:8112
start "" "http://localhost:8112"
call npm run dev -- --host 0.0.0.0 --port 8112

pause
