$logFile = "C:\Users\Arlette\.gemini\antigravity-ide\brain\04c54b26-bf7c-4833-8286-3f3f67092800\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content -Path $logFile -Encoding UTF8

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -like "*Total Lines: 1445*" -and $lines[$i] -like "*index.html*") {
        Write-Host "Found view of index.html at line $i"
    }
}
