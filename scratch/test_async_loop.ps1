$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8089/")
$listener.Start()
Write-Host "Server listening on 8089..."

$lastHeartbeat = [DateTime]::Now
$count = 0

try {
    while ($count -lt 5) {
        $count++
        if (([DateTime]::Now - $lastHeartbeat).TotalSeconds -ge 2) {
            $lastHeartbeat = [DateTime]::Now
            Write-Host "Heartbeat check executed successfully"
        }

        $asyncTask = $listener.GetContextAsync()
        if (-not $asyncTask.Wait(1000)) {
            Write-Host "Loop tick (no request)"
            continue
        }
        $context = $asyncTask.Result
        $context.Response.StatusCode = 200
        $context.Response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped clean"
}
