$content = Get-Content -Path "c:\Users\Arlette\Documents\Canchas\web_admin\styles.css" -Encoding UTF8
$cleanLines = @()
foreach ($line in $content) {
    # Remove leading line numbers like "2: " or "1226: "
    $cleaned = $line -replace '^\d+:\s?', ''
    # Also clean JSON string escaping if any
    $cleanLines += $cleaned
}
$finalText = $cleanLines -join "`n"
# Remove trailing JSON noise if present
$idx = $finalText.LastIndexOf("}")
if ($idx -gt 0) {
    $finalText = $finalText.Substring(0, $idx + 1)
}
Set-Content -Path "c:\Users\Arlette\Documents\Canchas\web_admin\styles.css" -Value $finalText -Encoding UTF8
Write-Host "Cleaned line numbers from styles.css"
