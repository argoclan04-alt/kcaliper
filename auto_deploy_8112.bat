@echo off
setlocal
cls
echo 🚀 kCaliper AI - Local Deployment 🚀
echo 🌍 Port: 8112
echo 📍 Host: 0.0.0.0
echo ---------------------------------------

:: Use CMD for npm to avoid PS policy issues
echo 📦 Verifying dependencies...
cmd /c "npm install"

echo 🔥 Starting Application...
echo 🔗 Local: http://localhost:8112
echo 🔗 Network: http://0.0.0.0:8112
start "" "http://localhost:8112"

cmd /c "npm run dev -- --host 0.0.0.0 --port 8112"
pause
