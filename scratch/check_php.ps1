$text = [System.IO.File]::ReadAllText('c:\Users\Arlette\Documents\Level\index.php')
$o = ($text.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$c = ($text.ToCharArray() | Where-Object { $_ -eq '}' }).Count
Write-Host "Open Braces: $o"
Write-Host "Close Braces: $c"
if ($o -eq $c) {
    Write-Host "BRACES MATURE & BALANCED PERFECTLY!"
} else {
    Write-Host "BRACE MISMATCH DETECTED!"
}
