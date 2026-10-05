$logFile = "C:\Users\Arlette\.gemini\antigravity-ide\brain\04c54b26-bf7c-4833-8286-3f3f67092800\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content -Path $logFile -Encoding UTF8

foreach ($line in $lines) {
    if ($line -like "*--bg-app: #F8FAFC*" -and $line -like "*1226*") {
        Write-Host "Found matching log line!"
        # Parse JSON
        $json = $line | ConvertFrom-Json
        # Find tool call response or content
        $raw = $line
        $idx = $raw.IndexOf(":root {")
        if ($idx -gt 0) {
            $endIdx = $raw.LastIndexOf("}")
            $cssContent = $raw.Substring($idx)
            # Clean up escape sequences if any
            $cssContent = $cssContent -replace '\\n', "`n" -replace '\\t', "`t" -replace '\\"', '"'
            Set-Content -Path "c:\Users\Arlette\Documents\Canchas\web_admin\styles.css" -Value $cssContent -Encoding UTF8
            Write-Host "Extracted and restored styles.css!"
            break
        }
    }
}
