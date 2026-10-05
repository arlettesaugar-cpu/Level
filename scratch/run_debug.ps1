try {
    .\start_server.ps1
} catch {
    Write-Host "SERVER EXCEPTION: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
}
