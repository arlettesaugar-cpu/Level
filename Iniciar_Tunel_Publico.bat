@echo off
title Tunel Publico Seguro - Level Tacambaro
color 0B
echo =========================================================
echo   Iniciando Tunel Publico Seguro (Level Tacambaro)...
echo   Solo la carpeta de la app (puerto 8085) se compartira.
echo =========================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\setup_tunnel.ps1"
pause
