$files = Get-ChildItem -Path ".\data\*.json"
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $clean = $content `
        -replace 'PÃ;del|PÃ¡del|PÃdel|Pádel', 'Padel' `
        -replace 'TacÃ;mbaro|TacÃ¡mbaro|TacÃmbaro|Tacámbaro', 'Tacambaro' `
        -replace 'MichoacÃ;n|MichoacÃ¡n|MichoacÃn|Michoacán', 'Michoacan' `
        -replace 'PanorÃ;mica|PanorÃ¡mica|Panorámica', 'Panoramica' `
        -replace 'CategorÃ;a|CategorÃa|Categoría', 'Categoria' `
        -replace 'PrÃ;ximamente|PrÃ³ximamente|PrÃximamente|Próximamente', 'Proximamente' `
        -replace 'ContraseÃ±a|Contraseña', 'Contrasena' `
        -replace 'PÃ©rez|PÃ@rez|Pérez', 'Perez' `
        -replace 'SofÃa|Sofía', 'Sofia' `
        -replace 'ValdÃ©s|Valdes', 'Valdes' `
        -replace 'Asistió', 'Asistio' `
        -replace 'Reseña', 'Resena' `
        -replace 'Histórica', 'Historica' `
        -replace 'Galería', 'Galeria' `
        -replace 'Ubicación', 'Ubicacion' `
        -replace '[áäàâ]', 'a' `
        -replace '[éëèê]', 'e' `
        -replace '[íïìî]', 'i' `
        -replace '[óöòô]', 'o' `
        -replace '[úüùû]', 'u' `
        -replace 'ñ', 'n' `
        -replace '[ÁÄÀÂ]', 'A' `
        -replace '[ÉËÈÊ]', 'E' `
        -replace '[ÍÏÌÎ]', 'I' `
        -replace '[ÓÖÒÔ]', 'O' `
        -replace '[ÚÜÙÛ]', 'U' `
        -replace 'Ñ', 'N' `
        -replace 'Ã;', 'a' `
        -replace 'Ã¡', 'a' `
        -replace 'Ã©', 'e' `
        -replace 'Ã­', 'i' `
        -replace 'Ã³', 'o' `
        -replace 'Ãº', 'u' `
        -replace 'Ã±', 'n' `
        -replace 'Ã', 'A' `
        -replace 'Âª|Ãª|ª', 'a' `
        -replace 'Âº|º', 'o' `
        -replace 'Â©|Ã©|©', 'e' `
        -replace 'Â', ''
    [System.IO.File]::WriteAllText($f.FullName, $clean, [System.Text.Encoding]::UTF8)
    Write-Host "Sanitized: $($f.Name)"
}
