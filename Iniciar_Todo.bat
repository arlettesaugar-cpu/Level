@echo off
title Servidor y Tunel Publico - Level Tacambaro
color 0A
echo =========================================================
echo   INICIANDO SERVIDOR Y TUNEL PUBLICO SEGURO
echo   Padel Club Tacambaro Real-Time
echo =========================================================
echo.
echo [1/2] Iniciando Servidor Local (Puerto 8085)...
start /b powershell -ExecutionPolicy Bypass -File "%~dp0start_server.ps1" >nul 2>&1

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Tunel Publico Seguro...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\setup_tunnel.ps1"
pause
