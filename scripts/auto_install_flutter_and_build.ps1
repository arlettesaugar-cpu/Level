# Auto Install Flutter & Build LevelPadel.apk
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$userDir = $env:USERPROFILE
$flutterBaseDir = Join-Path $userDir "flutter"
$flutterBin = Join-Path $flutterBaseDir "bin\flutter.bat"
$flutterZip = Join-Path $env:TEMP "flutter_windows.zip"
$androidSdk = Join-Path $userDir "AppData\Local\Android\Sdk"
$apkOutput = Join-Path $PSScriptRoot "..\LevelPadel.apk"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " COMPILADOR AUTOMATICO DE APK - LEVEL TACAMBARO" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path $flutterBin)) {
    Write-Host "[1/3] Descargando Flutter SDK (paquete oficial de Google)..." -ForegroundColor Cyan
    $url = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.3-stable.zip"
    
    if (-not (Test-Path $flutterZip)) {
        try {
            curl.exe -L --progress-bar -o $flutterZip $url
            Write-Host "Descarga de Flutter SDK completada." -ForegroundColor Green
        } catch {
            Write-Host "Error descargando Flutter SDK: $_" -ForegroundColor Red
            pause
            exit
        }
    }

    Write-Host "[2/3] Descomprimiendo Flutter SDK en $userDir..." -ForegroundColor Cyan
    try {
        Expand-Archive -Path $flutterZip -DestinationPath $userDir -Force
        Write-Host "Descompresion completada con exito." -ForegroundColor Green
        if (Test-Path $flutterZip) { Remove-Item $flutterZip -Force -ErrorAction SilentlyContinue }
    } catch {
        Write-Host "Error al descomprimir Flutter: $_" -ForegroundColor Red
        pause
        exit
    }
}

$env:PATH = (Join-Path $flutterBaseDir "bin") + ";" + $env:PATH
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk

# Clean stale lockfiles or leftover dart processes
Get-Process -Name "dart","flutter" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
$lockFile = Join-Path $flutterBaseDir "bin\cache\lockfile"
if (Test-Path $lockFile) {
    Remove-Item -Path $lockFile -Force -ErrorAction SilentlyContinue
}

Write-Host "[3/3] Configurando Android SDK y compilando LevelPadel.apk..." -ForegroundColor Cyan
& $flutterBin config --android-sdk $androidSdk

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Push-Location $projectRoot

try {
    Write-Host "Ejecutando 'flutter pub get'..." -ForegroundColor Yellow
    & $flutterBin pub get

    $gradleSetupScript = Join-Path $PSScriptRoot "setup_gradle.ps1"
    $gradleOk = "C:\Users\Arlette\.gradle\wrapper\dists\gradle-8.3-bin\55r23eum044l4794s66m1yr26\gradle-8.3-bin.zip.ok"
    if (-not (Test-Path $gradleOk) -and (Test-Path $gradleSetupScript)) {
        Write-Host "Preparando motor Gradle por primera vez (descarga automatica)..." -ForegroundColor Cyan
        & $gradleSetupScript
    }

    Write-Host "Compilando archivo APK para Android ('flutter build apk --release')..." -ForegroundColor Yellow
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
        Write-Host "No se encontro el archivo APK generado en $generatedApk" -ForegroundColor Red
    }
} catch {
    Write-Host "Error durante la compilacion del APK: $_" -ForegroundColor Red
} finally {
    Pop-Location
}
