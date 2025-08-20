@echo off
echo ========================================
echo Inksnap Image Update Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Running image update script...
echo.

REM Run the JavaScript script
node update-images.js

echo.
echo ========================================
echo Script execution completed!
echo ========================================
echo.
echo Next steps:
echo 1. Replace placeholder files with actual images
echo 2. Test the updated pages in your browser
echo 3. Optimize images for web use
echo 4. Update alt text for better accessibility
echo.
pause 