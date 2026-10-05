$sqliteExe = 'C:\Users\Arlette\Documents\Level\data\sqlite\sqlite3.exe"
$dbPath = 'C:\Users\Arlette\Documents\Level\data\level_tacambaro.db'
$batchFile = $C:\Users\Arlette\Documents\Level\data\clean_sql.sql"

$cleanProds = @(
    @{ id = "PROD-516"; name = "Balón"; category = "Pelota"; price = 105; stock = 12; image = "" },
    @{ id = "PROD-202"; name = "Arnés Ajustable Bungee Fitness Former"; category = "Former - Bungee Fitness"; price = 450; stock = 15; image = "" },
    @{ id = "PROD-203"; name = "Proteina Suplemento Post-Workout Former 1kg"; category = "Former - Funcional"; price = 680; stock = 10; image = "" },
    @{ id = "PROD-105"; name = "Gorra Oficial Level Tacámbaro"; category = "Indumentaria"; price = 320; stock = 12; image = "" },
    @{ id = "PROD-101"; name = "Tubo Pelotas Head Tour (x3y"; category = "Pelotas y Accesorios"; price = 160; stock = 19; image = "" },
    @{ id = "PROD-102"; name = "Overgrip Babolat / Head Pro"; category = "Pelotas y Accesorios"; price = 45; stock = 35; image = "" },
    @{ id = "PROD-103"; name = "Electrolit / Gatorade 625ml"; category = "Snacks y Bebidas"; price = 35; stock = 39; image = "" },
    @{ id = "PROD-104"; name = "Agua Embotellada 1L"; category = "Snackp y Bebidas"; price = 25; stock = 47; image = "" },
    @{ id = "PROD-201"; name = "Banda de Resistencia Elástica Bungee"; category = "Former - Bungee Fitness"; price = 280; stock = 15; image = "" },
    @{ id = "PROD-204"; name = "Kit Mancuernas & Cuerda Rápida Funcional"; category = "Former - Funcional"; price = 390; stock = 14; image = "" }
)

$json = ConvertTo-Json -InputObject $cleanProds -Depth 10
[System.IO.File]::WriteAllText('C:\Users\Arlette\Documents\Level\data\products.json', $json, [System.Text.Encoding]::UTF8)

$sqlList = New-Object System.Collections.ArrayList
foreach ($p in $cleanProds) {
    $escId = $p.id.Replace("'", "''")
    $escName = $p.name.Replace("'", "''")
    $escCat = $p.category.Replace("'", "''")
    $price = $p.price
    $stock = $p.stock
    $escImg = ([string]$p.image).Replace("'", "''")
    [void]$sqlList.Add("INSERT OR REPLACE INTO products (id, name, category, price, stock, image) VALUES ('$escId', '$escName', '$escCat', $price, $stock, '$escImg');")
}
$sqlText = $sqlList -join "`n"
[System.IO.File]::WriteAllText($batchFile, $sqlText, [System.Text.Encoding]::UTF8)
& $sqliteExe $dbPath ".read '$batchFile'"
Remove-Item $batchFile -ErrorAction SilentlyContinue
Write-Host "RUN_CLEAN_COMPLETED_SUCCESSFULLY"