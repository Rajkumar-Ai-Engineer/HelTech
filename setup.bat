@echo off
echo HealthAI Setup Script
echo =====================

echo.
echo Checking Backend Dependencies...
cd Backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Checking Frontend Dependencies...
cd ..\Frontend
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
) else (
    echo Node modules already installed.
)

echo.
echo Setup complete!
echo Run start_dev.bat to start the development servers.
pause