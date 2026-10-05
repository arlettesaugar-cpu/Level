$files = @(".\web_admin\admin.js", ".\web_preview\app.js")
foreach ($path in $files) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        # Remove console.error and console.warn calls
        $clean = $content -replace "console\.error\([^)]*\);?", "/* silent error */"
        $clean = $clean -replace "console\.warn\([^)]*\);?", "/* silent warn */"
        [System.IO.File]::WriteAllText($path, $clean, [System.Text.Encoding]::UTF8)
        Write-Host "Removed console errors from: $path"
    }
}
