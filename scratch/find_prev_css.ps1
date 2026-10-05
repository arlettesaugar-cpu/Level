$logFile = "C:\Users\Arlette\.gemini\antigravity-ide\brain\28cd4a4f-9013-42f1-b888-887f00caa769\.system_generated\logs\transcript_full.jsonl"
if (Test-Path $logFile) {
    $lines = Get-Content -Path $logFile -Encoding UTF8
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
        if ($lines[$i] -like "*styles.css*" -and $lines[$i] -like "*CodeContent*") {
            Write-Host "Found match in prev conversation at line $i"
            $json = $lines[$i] | ConvertFrom-Json
            if ($json.tool_calls) {
                foreach ($call in $json.tool_calls) {
                    if ($call.args.TargetFile -like "*styles.css*") {
                        $code = $call.args.CodeContent
                        if ($code -and $code.Length -gt 5000) {
                            Set-Content -Path "c:\Users\Arlette\Documents\Canchas\web_admin\styles.css" -Value $code -Encoding UTF8
                            Write-Host "Successfully restored original 23KB styles.css! Length: $($code.Length)"
                            exit
                        }
                    }
                }
            }
        }
    }
} else {
    Write-Host "File not found"
}
