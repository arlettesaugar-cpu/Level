$files = Get-ChildItem -Path ".\data\*.json"
foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    $normalized = $content.Normalize([System.Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    for ($i = 0; $i -lt $normalized.Length; $i++) {
        $uc = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($normalized[$i])
        if ($uc -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($normalized[$i])
        }
    }
    $clean = $sb.ToString()
    
    $sb2 = New-Object System.Text.StringBuilder
    for ($j = 0; $j -lt $clean.Length; $j++) {
        $c = [int]$clean[$j]
        if ($c -lt 128 -or $c -eq 10 -or $c -eq 13 -or $c -eq 9) {
            [void]$sb2.Append($clean[$j])
        }
    }
    $finalText = $sb2.ToString()
    [System.IO.File]::WriteAllBytes($f.FullName, [System.Text.Encoding]::UTF8.GetBytes($finalText))
    Write-Host "Sanitized: $($f.Name)"
}
