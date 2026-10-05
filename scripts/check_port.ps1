param (
    [int]$Port = 8085
)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " INSPECTOR DE PUERTOS Y PROGRAMAS - LEVEL TACAMBARO" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verificando estado del puerto $Port..." -ForegroundColor Cyan

$conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($conn) {
    $pids = $conn.OwningProcess | Select-Object -Unique
    Write-Host ""
    Write-Host "[!] ATENCION: El puerto $Port esta OCUPADO." -ForegroundColor Red
    Write-Host ""
    
    foreach ($pidNum in $pids) {
        $proc = Get-Process -Id $pidNum -ErrorAction SilentlyContinue
        Write-Host " ----------------------------------------------------" -ForegroundColor Yellow
        Write-Host "  Nombre del Programa : $($proc.ProcessName)" -ForegroundColor White
        Write-Host "  ID de Proceso (PID) : $pidNum" -ForegroundColor White
        Write-Host "  Ruta del Archivo    : $($proc.Path)" -ForegroundColor White
        
        if ($proc.ProcessName -eq "powershell" -or $proc.ProcessName -eq "pwsh") {
            Write-Host "  DIAGNOSTICO         : Es una instancia previa del servidor Level." -ForegroundColor Green
        } else {
            Write-Host "  DIAGNOSTICO         : Programa externo ($($proc.ProcessName))." -ForegroundColor Red
        }
        Write-Host " ----------------------------------------------------" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "[OK] ¡El puerto $Port esta completamente LIBRE!" -ForegroundColor Green
    Write-Host "Puedes iniciar tu servidor sin ningun problema." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Read-Host "Presiona Enter para cerrar esta ventana..."
