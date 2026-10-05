$path = 'C:\Users\Arlette\Documents\Level\web_admin\admin.js'
$js = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$js = $js -replace "\.replace\(/\[^\x00-\x7F]+Kg, '' \);", "// .replace(/[^\x00-\x7F]+/g, '');"
$js = $js -replace "'Tacambaro'", "'Tacambaro'"
$js = $js -replace "'Padel'", "'Padel'"
$js = $js -replace ''Michoacan'", "'Michoacan'"
$js = $js -replace "'Panoramica'", "'Panoramica'"
$js = $js -replace "'Categoria'", "'Categoria'"

[System.IO.File]::WriteAllText($path, $js, [System.Text.Encoding]::UTF8)
Write-Host "MOD_ADMIN_JS_SUCCESS"