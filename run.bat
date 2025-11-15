@echo off
title Discord Auto Join Bot
color 0a

echo ================================
echo   Starting Discord Join Bot...
echo ================================
echo.

:: Check Node.js
node -v >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: Install dependencies if missing
IF NOT EXIST "node_modules" (
    echo Installing dependencies for the first time...
    npm install
)

:: Build TypeScript
echo Building project...
npm run build

:: Run bot
echo Starting bot...
npm run start

echo.
pause
