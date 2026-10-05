$files = Get-ChildItem -Path ".\data\*.json"
foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    $content = $content -replace 'PÃ;del|PÃ¡del|PÃdel|Pádel', 'Padel'
    $content = $content -replace 'TacÃ;mbaro|TacÃ¡mbaro|TacÃmbaro|Tacámbaro', 'Tacambaro'
    $content = $content -replace 'MichoacÃ;n|MichoacÃ¡n|MichoacÃn|Michoacán', 'Michoacan'
    $content = $content -replace 'PanorÃ;mica|PanorÃ¡mica|Panorámica', 'Panoramica'
    $content = $content -replace 'CategorÃ;a|CategorÃa|Categoría', 'Categoria'
    $content = $content -replace 'PrÃ;ximamente|PrÃ³ximamente|PrÃximamente|Próximamente', 'Proximamente'
    $content = $content -replace 'ContraseÃ±a|Contraseña', 'Contrasena'
    $content = $content -replace 'PÃ©rez|PÃ@rez|Pérez', 'Perez'
    $content = $content -replace 'SofÃa|Sofía', 'Sofia'
    $content = $content -replace 'ValdÃ©s|Valdes', 'Valdes'
    $content = $content -replace 'Asistió', 'Asistio'
    
    $normalized = $content.Normalize([System.Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    for ($i = 0; $i -lt $normalized.Length; $i++) {
        $uc = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($normalized[$i])
        if ($uc -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($normalized[$i])
        }
    }
    $clean = $sb.ToString()
    $clean = $clean -replace '[ÃÂ©¡ªº]', ''
    
    [System.IO.File]::WriteAllBytes($f.FullName, [System.Text.Encoding]::UTF8.GetBytes($clean))
    Write-Host "Sanitized: $($f.Name)"
}
