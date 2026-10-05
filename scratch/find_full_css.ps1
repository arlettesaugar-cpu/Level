$logFile = "C:\Users\Arlette\.gemini\antigravity-ide\brain\04c54b26-bf7c-4833-8286-3f3f67092800\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content -Path $logFile -Encoding UTF8

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -like "*styles.css*" -and $lines[$i] -like "*TargetFile*") {
        Write-Host "Match at line $i"
        $json = $lines[$i] | ConvertFrom-Json
        # Check tool calls or replacement content
        if ($json.tool_calls) {
            foreach ($call in $json.tool_calls) {
                if ($call.args.TargetFile -like "*styles.css*" -or $call.args.target_file -like "*styles.css*") {
                    $code = $call.args.CodeContent
                    if (-not $code) { $code = $call.args.code_content }
                    if (-not $code) { $code = $call.args.ReplacementContent }
                    if ($code -and $code.Length -gt 1000) {
                        Set-Content -Path "c:\Users\Arlette\Documents\Canchas\web_admin\styles.css" -Value $code -Encoding UTF8
                        Write-Host "Successfully restored full styles.css! Length: $($code.Length)"
                        exit
                    }
                }
            }
        }
    }
}
