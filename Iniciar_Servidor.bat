@echo off
title Servidor Level Tacambaro - Real Time
color 0A
echo ===================================================
echo   Iniciando Servidor Padel Club Tacambaro...
echo   App URL:   http://localhost:8085/
echo   Admin URL: http://localhost:8085/admin/
echo ===================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause
