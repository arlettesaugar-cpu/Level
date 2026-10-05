# Setup Gradle 8.3 Bin Pre-installation
Get-Process -Name "java","gradle","curl" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

$distDir = "C:\Users\Arlette\.gradle\wrapper\dists\gradle-8.3-bin\55r23eum044l4794s66m1yr26"
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Force -Path $distDir | Out-Null
}

$zipFile = Join-Path $distDir "gradle-8.3-bin.zip"
$url = "https://services.gradle.org/distributions/gradle-8.3-bin.zip"

if (-not (Test-Path $zipFile) -or (Get-Item $zipFile).Length -lt 50000000) {
    Write-Host "Descargando Gradle 8.3 (paquete binario compacto)..." -ForegroundColor Cyan
    try {
        curl.exe -L -C - --retry 5 --retry-delay 2 --progress-bar -o $zipFile $url
    } catch {
        Write-Host "Error descargando Gradle: $_" -ForegroundColor Red
        exit 1
    }
}

if (Test-Path $zipFile) {
    Write-Host "Descomprimiendo Gradle 8.3..." -ForegroundColor Cyan
    try {
        Expand-Archive -Path $zipFile -DestinationPath $distDir -Force
        New-Item -ItemType File -Force -Path (Join-Path $distDir "gradle-8.3-bin.zip.ok") | Out-Null
        Get-ChildItem -Path $distDir -Filter "*.lck" | Remove-Item -Force -ErrorAction SilentlyContinue
        Write-Host "¡Gradle 8.3 preparado con exito!" -ForegroundColor Green
    } catch {
        Write-Host "Error al descomprimir Gradle 8.3: $_" -ForegroundColor Red
    }
}
