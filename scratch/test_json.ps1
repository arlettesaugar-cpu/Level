$dataDir = "c:\Users\Arlette\Documents\Level\data"
Get-ChildItem -Path $dataDir -Filter "*.json" | ForEach-Object {
    try {
        $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
        $null = ConvertFrom-Json $raw
        Write-Host "$($_.Name) -> VALID JSON OK"
    } catch {
        Write-Host "$($_.Name) -> INVALID: $_"
    }
}
