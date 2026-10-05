$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8089/")
$listener.Start()
Write-Host "Sync Server listening on 8089..."

$lastHeartbeat = [DateTime]::Now
$lockObj = New-Object System.Object
$sseClients = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))

try {
    for ($i = 0; $i -lt 5; $i++) {
        $context = $listener.GetContext()
        
        # Check heartbeat sweep
        if (([DateTime]::Now - $lastHeartbeat).TotalSeconds -ge 5) {
            $lastHeartbeat = [DateTime]::Now
            Write-Host "Heartbeat sweep triggered on request $i"
        }

        $context.Response.StatusCode = 200
        $buf = [System.Text.Encoding]::UTF8.GetBytes("OK")
        $context.Response.OutputStream.Write($buf, 0, $buf.Length)
        $context.Response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Sync Server stopped"
}
