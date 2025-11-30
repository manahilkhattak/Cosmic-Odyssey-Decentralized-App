@echo off
echo Starting Cosmic Odyssey DApp...
echo.

REM Switch to correct Node version
call nvm use 22.21.0

REM Navigate to project directory
cd /d C:\Users\dell\Downloads\cosmic-odyssey-dapp

REM Start development server
echo Opening DApp at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
npm run dev