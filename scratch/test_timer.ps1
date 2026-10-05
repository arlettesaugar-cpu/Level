$lockObj = New-Object System.Object
$sseClients = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))

$heartbeatCode = {
    param($state)
    [System.Threading.Monitor]::Enter($state.lockObj)
    try {
        $toRemove = @()
        foreach ($clientResp in $state.sseClients) {
            try {
                $pingBytes = [System.Text.Encoding]::UTF8.GetBytes(": ping`n`n")
                $clientResp.OutputStream.Write($pingBytes, 0, $pingBytes.Length)
                $clientResp.OutputStream.Flush()
            } catch {
                $toRemove += $clientResp
            }
        }
        foreach ($rem in $toRemove) {
            $state.sseClients.Remove($rem) | Out-Null
            try { $rem.OutputStream.Close() } catch {}
            try { $rem.Close() } catch {}
        }
    } catch {}
    finally {
        [System.Threading.Monitor]::Exit($state.lockObj)
    }
}

$stateObj = [PSCustomObject]@{
    lockObj = $lockObj
    sseClients = $sseClients
}

# Check if timer scriptblock executes without errors in PS
$timer = New-Object System.Threading.Timer($heartbeatCode, $stateObj, 1000, 5000)
Start-Sleep -Seconds 2
$timer.Dispose()
Write-Host "Timer test finished successfully"
