# PowerShell script to initialize SQLite DB and migrate existing JSON files cleanly

$dataDir = Join-Path $PSScriptRoot "..\data"
$sqliteExe = Join-Path $dataDir "sqlite\sqlite3.exe"
$dbPath = Join-Path $dataDir "level_tacambaro.db"

Write-Host "Starting SQLite DB migration: $dbPath"

# Ensure clean directory
if (-not (Test-Path $sqliteExe)) {
    Write-Error "sqlite3.exe not found at $sqliteExe"
    exit 1
}

# Define Schema
$schemaSql = @"
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT,
    status TEXT,
    tempPassword TEXT,
    mustChangePassword INTEGER DEFAULT 0,
    hasDebt INTEGER DEFAULT 0,
    debtAmount REAL DEFAULT 0,
    debtReason TEXT,
    createdAt TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    courtId TEXT,
    courtName TEXT,
    location TEXT,
    date TEXT,
    timeSlot TEXT,
    price REAL,
    paymentMethod TEXT,
    clientName TEXT,
    clientPhone TEXT,
    status TEXT,
    attendance TEXT,
    paid INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS finances (
    id TEXT PRIMARY KEY,
    type TEXT,
    amount REAL,
    concept TEXT,
    category TEXT,
    date TEXT,
    clientName TEXT,
    referenceId TEXT
);

CREATE TABLE IF NOT EXISTS cash_shifts (
    id TEXT PRIMARY KEY,
    initialAmount REAL,
    cashIncomes REAL,
    cardIncomes REAL,
    manualEntradas REAL,
    manualSalidas REAL,
    expectedCash REAL,
    physicalCash REAL,
    difference REAL,
    status TEXT,
    responsible TEXT,
    openTime TEXT,
    closeTime TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS cash_movements (
    id TEXT PRIMARY KEY,
    shiftId TEXT,
    type TEXT,
    amount REAL,
    concept TEXT,
    date TEXT,
    responsible TEXT
);

CREATE TABLE IF NOT EXISTS bank_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    bankName TEXT,
    accountHolder TEXT,
    clabe TEXT,
    cardNumber TEXT,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    price REAL,
    stock INTEGER,
    image TEXT
);

CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT,
    dates TEXT,
    price REAL,
    maxTeams INTEGER,
    registeredTeams INTEGER,
    status TEXT,
    prize TEXT,
    teamsJson TEXT
);

CREATE TABLE IF NOT EXISTS courts (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    location TEXT,
    price REAL,
    rating REAL,
    image TEXT,
    slotsJson TEXT,
    slotStatusesJson TEXT
);

CREATE TABLE IF NOT EXISTS club_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    dataJson TEXT
);
"@

$sqlStatements = [System.Collections.ArrayList]@()
[void]$sqlStatements.Add($schemaSql)

function Escape-Sql($str) {
    if ([string]::IsNullOrEmpty($str)) { return "" }
    return [string]$str.Replace("'", "''")
}

# Migrate USERS
$usersFile = Join-Path $dataDir "users.json"
if (Test-Path $usersFile) {
    $users = Get-Content $usersFile -Raw | ConvertFrom-Json
    foreach ($u in $users) {
        $mustChange = if ($u.mustChangePassword) { 1 } else { 0 }
        $hasDebt = if ($u.hasDebt) { 1 } else { 0 }
        $debtAmt = if ($u.debtAmount) { [double]$u.debtAmount } else { 0 }
        $sql = "INSERT OR REPLACE INTO users (id, username, password, name, email, phone, role, status, tempPassword, mustChangePassword, hasDebt, debtAmount, debtReason, createdAt) VALUES ('$(Escape-Sql $u.id)', '$(Escape-Sql $u.username)', '$(Escape-Sql $u.password)', '$(Escape-Sql $u.name)', '$(Escape-Sql $u.email)', '$(Escape-Sql $u.phone)', '$(Escape-Sql $u.role)', '$(Escape-Sql $u.status)', '$(Escape-Sql $u.tempPassword)', $mustChange, $hasDebt, $debtAmt, '$(Escape-Sql $u.debtReason)', '$(Escape-Sql $u.createdAt)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate BANK INFO
$bankFile = Join-Path $dataDir "bank_info.json"
if (Test-Path $bankFile) {
    $b = Get-Content $bankFile -Raw | ConvertFrom-Json
    $sql = "INSERT OR REPLACE INTO bank_info (id, bankName, accountHolder, clabe, cardNumber, instructions) VALUES (1, '$(Escape-Sql $b.bankName)', '$(Escape-Sql $b.accountHolder)', '$(Escape-Sql $b.clabe)', '$(Escape-Sql $b.cardNumber)', '$(Escape-Sql $b.instructions)');"
    [void]$sqlStatements.Add($sql)
}

# Migrate CASH SHIFTS
$cashShiftsFile = Join-Path $dataDir "cash_shifts.json"
if (Test-Path $cashShiftsFile) {
    $shifts = Get-Content $cashShiftsFile -Raw | ConvertFrom-Json
    foreach ($s in $shifts) {
        $initAmt = if ($s.initialAmount) { [double]$s.initialAmount } else { 0 }
        $cashInc = if ($s.cashIncomes) { [double]$s.cashIncomes } else { 0 }
        $cardInc = if ($s.cardIncomes) { [double]$s.cardIncomes } else { 0 }
        $manEnt = if ($s.manualEntradas) { [double]$s.manualEntradas } else { 0 }
        $manSal = if ($s.manualSalidas) { [double]$s.manualSalidas } else { 0 }
        $expCash = if ($s.expectedCash) { [double]$s.expectedCash } else { 0 }
        $physCash = if ($s.physicalCash) { [double]$s.physicalCash } else { 0 }
        $diff = if ($s.difference) { [double]$s.difference } else { 0 }
        $sql = "INSERT OR REPLACE INTO cash_shifts (id, initialAmount, cashIncomes, cardIncomes, manualEntradas, manualSalidas, expectedCash, physicalCash, difference, status, responsible, openTime, closeTime, notes) VALUES ('$(Escape-Sql $s.id)', $initAmt, $cashInc, $cardInc, $manEnt, $manSal, $expCash, $physCash, $diff, '$(Escape-Sql $s.status)', '$(Escape-Sql $s.responsible)', '$(Escape-Sql $s.openTime)', '$(Escape-Sql $s.closeTime)', '$(Escape-Sql $s.notes)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate CASH MOVEMENTS
$cashMovFile = Join-Path $dataDir "cash_movements.json"
if (Test-Path $cashMovFile) {
    $movs = Get-Content $cashMovFile -Raw | ConvertFrom-Json
    foreach ($m in $movs) {
        $amt = if ($m.amount) { [double]$m.amount } else { 0 }
        $sql = "INSERT OR REPLACE INTO cash_movements (id, shiftId, type, amount, concept, date, responsible) VALUES ('$(Escape-Sql $m.id)', '$(Escape-Sql $m.shiftId)', '$(Escape-Sql $m.type)', $amt, '$(Escape-Sql $m.concept)', '$(Escape-Sql $m.date)', '$(Escape-Sql $m.responsible)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate FINANCES
$finFile = Join-Path $dataDir "finances.json"
if (Test-Path $finFile) {
    $fins = Get-Content $finFile -Raw | ConvertFrom-Json
    foreach ($f in $fins) {
        $amt = if ($f.amount) { [double]$f.amount } else { 0 }
        $sql = "INSERT OR REPLACE INTO finances (id, type, amount, concept, category, date, clientName, referenceId) VALUES ('$(Escape-Sql $f.id)', '$(Escape-Sql $f.type)', $amt, '$(Escape-Sql $f.concept)', '$(Escape-Sql $f.category)', '$(Escape-Sql $f.date)', '$(Escape-Sql $f.clientName)', '$(Escape-Sql $f.referenceId)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate PRODUCTS
$prodFile = Join-Path $dataDir "products.json"
if (Test-Path $prodFile) {
    $prods = Get-Content $prodFile -Raw | ConvertFrom-Json
    foreach ($p in $prods) {
        $price = if ($p.price) { [double]$p.price } else { 0 }
        $stock = if ($p.stock) { [int]$p.stock } else { 0 }
        $sql = "INSERT OR REPLACE INTO products (id, name, category, price, stock, image) VALUES ('$(Escape-Sql $p.id)', '$(Escape-Sql $p.name)', '$(Escape-Sql $p.category)', $price, $stock, '$(Escape-Sql $p.image)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate TOURNAMENTS
$tournFile = Join-Path $dataDir "tournaments.json"
if (Test-Path $tournFile) {
    $tourns = Get-Content $tournFile -Raw | ConvertFrom-Json
    foreach ($t in $tourns) {
        $price = if ($t.price) { [double]$t.price } else { 0 }
        $maxTeams = if ($t.maxTeams) { [int]$t.maxTeams } else { 0 }
        $regTeams = if ($t.teams) { [int]$t.teams.Count } else { 0 }
        $teamsJson = if ($t.teams) { ($t.teams | ConvertTo-Json -Compress) } else { "[]" }
        $sql = "INSERT OR REPLACE INTO tournaments (id, title, category, dates, price, maxTeams, registeredTeams, status, prize, teamsJson) VALUES ('$(Escape-Sql $t.id)', '$(Escape-Sql $t.title)', '$(Escape-Sql $t.category)', '$(Escape-Sql $t.dates)', $price, $maxTeams, $regTeams, '$(Escape-Sql $t.status)', '$(Escape-Sql $t.prize)', '$(Escape-Sql $teamsJson)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate COURTS
$courtsFile = Join-Path $dataDir "courts.json"
if (Test-Path $courtsFile) {
    $courts = Get-Content $courtsFile -Raw | ConvertFrom-Json
    foreach ($c in $courts) {
        $price = if ($c.price) { [double]$c.price } else { 0 }
        $rating = if ($c.rating) { [double]$c.rating } else { 0 }
        $slotsJson = if ($c.slots) { ($c.slots | ConvertTo-Json -Compress) } else { "[]" }
        $statusesJson = if ($c.slotStatuses) { ($c.slotStatuses | ConvertTo-Json -Compress) } else { "{}" }
        $sql = "INSERT OR REPLACE INTO courts (id, name, category, location, price, rating, image, slotsJson, slotStatusesJson) VALUES ('$(Escape-Sql $c.id)', '$(Escape-Sql $c.name)', '$(Escape-Sql $c.category)', '$(Escape-Sql $c.location)', $price, $rating, '$(Escape-Sql $c.image)', '$(Escape-Sql $slotsJson)', '$(Escape-Sql $statusesJson)');"
        [void]$sqlStatements.Add($sql)
    }
}

# Migrate CLUB INFO
$histFile = Join-Path $dataDir "history.json"
if (Test-Path $histFile) {
    $histJson = Get-Content $histFile -Raw
    $sql = "INSERT OR REPLACE INTO club_info (id, dataJson) VALUES (1, '$(Escape-Sql $histJson)');"
    [void]$sqlStatements.Add($sql)
}

# Write full batch to SQL file and execute atomically
$batchSqlFile = Join-Path $dataDir "migration_batch.sql"
[System.IO.File]::WriteAllText($batchSqlFile, ($sqlStatements -join "`n"), [System.Text.Encoding]::UTF8)

Write-Host "Executing SQL batch import..."
& $sqliteExe $dbPath ".read '$batchSqlFile'"
Remove-Item $batchSqlFile -ErrorAction SilentlyContinue

Write-Host "=== Migration completed successfully! ==="
