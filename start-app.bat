@echo off
title STEP2 FITNESS - Diet Plan Brain
echo.
echo  ====================================
echo    STEP2 FITNESS - Diet Plan Brain
echo    Starting Local Server...
echo  ====================================
echo.
cd /d "%~dp0"
start "" "http://localhost:5173"
npm run dev
pause
