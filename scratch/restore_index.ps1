$logFile = "C:\Users\Arlette\.gemini\antigravity-ide\brain\28cd4a4f-9013-42f1-b888-887f00caa769\.system_generated\logs\transcript_full.jsonl"
if (Test-Path $logFile) {
    $lines = Get-Content -Path $logFile -Encoding UTF8
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
        if ($lines[$i] -like "*web_admin/index.html*" -and $lines[$i] -like "*CodeContent*") {
            Write-Host "Found match for index.html at line $i"
            $json = $lines[$i] | ConvertFrom-Json
            if ($json.tool_calls) {
                foreach ($call in $json.tool_calls) {
                    if ($call.args.TargetFile -like "*web_admin/index.html*") {
                        $code = $call.args.CodeContent
                        if ($code -and $code.Length -gt 10000) {
                            Set-Content -Path "c:\Users\Arlette\Documents\Canchas\web_admin\index.html" -Value $code -Encoding UTF8
                            Write-Host "Successfully restored original index.html! Length: $($code.Length)"
                            exit
                        }
                    }
                }
            }
        }
    }
}
