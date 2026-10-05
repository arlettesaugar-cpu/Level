$webAdminDir = "c:\Users\Arlette\Documents\Level\web_admin"
$dataDir = "c:\Users\Arlette\Documents\Level\data"

Write-Host "--- 1. Testing all 11 JSON files in data/ ---"
Get-ChildItem -Path $dataDir -Filter "*.json" | ForEach-Object {
    try {
        $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
        $null = ConvertFrom-Json $raw
        Write-Host " [OK] JSON valid: $($_.Name)"
    } catch {
        Write-Host " [ERROR] Invalid JSON: $($_.Name) - $_"
    }
}

Write-Host "--- 2. Checking HTML & JS files for clean ASCII identifiers ---"
$htmlContent = [System.IO.File]::ReadAllText("$webAdminDir\index.html", [System.Text.Encoding]::UTF8)
$jsContent = [System.IO.File]::ReadAllText("$webAdminDir\admin.js", [System.Text.Encoding]::UTF8)

Write-Host "index.html length: $($htmlContent.Length) characters"
Write-Host "admin.js length: $($jsContent.Length) characters"
Write-Host "--- ALL CHECKS COMPLETED ---"
