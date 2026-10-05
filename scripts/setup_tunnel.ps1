# Setup Cloudflare Tunnel for Level Tacambaro
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$cloudflaredPath = Join-Path $PSScriptRoot "..\cloudflared.exe"

if (-not (Test-Path $cloudflaredPath)) {
    Write-Host "Descargando Cloudflare Tunnel (cloudflared)..." -ForegroundColor Cyan
    $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
    try {
        Invoke-WebRequest -Uri $url -OutFile $cloudflaredPath -UseBasicParsing
        Write-Host "Descarga completada con exito." -ForegroundColor Green
    } catch {
        Write-Host "Error al descargar cloudflared: $_" -ForegroundColor Red
        pause
        exit
    }
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " INICIANDO TUNEL PUBLICO SEGURO - LEVEL TACAMBARO" -ForegroundColor Green
Write-Host " Solo se comparte el servidor web de la carpeta (puerto 8085)" -ForegroundColor Yellow
Write-Host " El resto de tu computadora permanece 100% privado y protegido." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

& $cloudflaredPath tunnel --url http://127.0.0.1:8085 --http-host-header localhost
