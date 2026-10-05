$path = ".\data\tournaments.json"
if (Test-Path $path) {
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $tourns = ConvertFrom-Json $content
    if ($tourns.Count -gt 0) {
        $tourns[0].imageUrl = "assets/images/cancha_padel_1.jpg"
    }
    if ($tourns.Count -gt 1) {
        $tourns[1].imageUrl = "assets/images/cancha_padel_2.jpg"
    }
    $json = ConvertTo-Json -InputObject $tourns -Depth 10
    [System.IO.File]::WriteAllText($path, $json, [System.Text.Encoding]::UTF8)
    Write-Host "Tournaments image URLs cleaned."
}
