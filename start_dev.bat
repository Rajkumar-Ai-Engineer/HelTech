@echo off
echo Starting HealthAI Development Environment...

echo.
echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd Backend && python main.py"

echo.
echo Servers are starting...
echo Frontend: http://localhost:5173 (loads first)
echo Backend: http://localhost:8000 (AI loads on first use)
echo.
pause