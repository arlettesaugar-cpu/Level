$req = [System.Net.HttpWebRequest]::Create('http://localhost:8085/api/events')
$res = $req.GetResponse()
$stream = $res.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream)
$line = $reader.ReadLine()
Write-Host "SSE Header Line: '$line'"
$res.Close()
