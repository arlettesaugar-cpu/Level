# Clean build script for LevelPadel.apk
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " COMPILADOR AUTOMATICO DE APK - LEVEL TACAMBARO" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Kill any locked processes
Get-Process -Name "java","gradle","dart" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

$userDir = $env:USERPROFILE
$flutterBin = Join-Path $userDir "flutter\bin\flutter.bat"
$androidSdk = Join-Path $userDir "AppData\Local\Android\Sdk"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$apkOutput = Join-Path $projectRoot "LevelPadel.apk"

$env:PATH = (Join-Path $userDir "flutter\bin") + ";" + $env:PATH
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk

# Clean any lock files inside .gradle
Remove-Item -Path "$env:USERPROFILE\.gradle\wrapper\dists\*\*\*.lck" -Force -ErrorAction SilentlyContinue

Push-Location $projectRoot

try {
    Write-Host "[1/2] Verificando dependencias..." -ForegroundColor Cyan
    & $flutterBin pub get

    Write-Host "[2/2] Compilando LevelPadel.apk (por favor espera unos momentos)..." -ForegroundColor Cyan
    & $flutterBin build apk --release

    $generatedApk = Join-Path $projectRoot "build\app\outputs\flutter-apk\app-release.apk"
    if (Test-Path $generatedApk) {
        Copy-Item -Path $generatedApk -Destination $apkOutput -Force
        Write-Host ""
        Write-Host "==========================================================" -ForegroundColor Green
        Write-Host " [EXITO TOTAL] ¡Tu archivo LevelPadel.apk ha sido creado!" -ForegroundColor Green
        Write-Host " Ubicacion: $apkOutput" -ForegroundColor Yellow
        Write-Host "==========================================================" -ForegroundColor Green
    } else {
        Write-Host "No se encontro el archivo APK en $generatedApk" -ForegroundColor Red
    }
} catch {
    Write-Host "Error durante la compilacion: $_" -ForegroundColor Red
} finally {
    Pop-Location
}
