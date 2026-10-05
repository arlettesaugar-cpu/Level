$port = 8085
$prefix = "http://localhost:$port/"
$webRoot = Join-Path $PSScriptRoot "web_preview"
$adminRoot = Join-Path $PSScriptRoot "web_admin"

# In-Memory DB State for 2 Padel Courts in Tacámbaro, Michoacán (24 Horas)
$all24hSlots = @("00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00")

$courtsData = [System.Collections.ArrayList]@(
    @{
        id = "c1"
        name = "Cancha 1: Padel Cristal Pro (Azul)"
        category = "Padel Cristal Pro"
        location = "Tacambaro, Michoacan"
        price = 300
        rating = 4.9
        image = "assets/images/cancha_padel_1.jpg"
        slots = $all24hSlots
        slotStatuses = @{
            "00:00" = "booked"
            "03:00" = "booked"
            "04:00" = "booked"
            "13:00" = "booked"
            "19:00" = "booked"
            "20:00" = "booked"
        }
    },
    @{
        id = "c2"
        name = "Cancha 2: Padel Panoramica VIP (Verde)"
        category = "Padel Panoramica VIP"
        location = "Tacambaro, Michoacán"
        price = 300
        rating = 4.8
        image = "assets/images/cancha_padel_2.jpg"
        slots = $all24hSlots
        slotStatuses = @{
            "18:00" = "booked"
        }
    }
)

$bookingsData = [System.Collections.ArrayList]@(
    @{
        id = "RES-1001"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-01"
        timeSlot = "08:00 (1 hora)"
        price = 300
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Alejandro Ruiz"
        clientPhone = "459 410 2938"
        status = "Confirmada"
        attendance = "Asistio"
        paid = $true
    },
    @{
        id = "RES-1002"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-03"
        timeSlot = "10:00 (1 hora)"
        price = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Mariana Torres"
        clientPhone = "459 983 1000"
        status = "Confirmada"
        attendance = "Asistio"
        paid = $true
    },
    @{
        id = "RES-1003"
        courtId = "c2"
        courtName = "Cancha 2: Pádel Panorámica VIP (Verde)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-03"
        timeSlot = "16:00 (2 horas)"
        price = 600
        paymentMethod = "Transferencia Bancaria"
        clientName = "Fernando Silva"
        clientPhone = "459 129 0000"
        status = "Confirmada"
        attendance = "Asistio"
        paid = $true
    },
    @{
        id = "RES-1004"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-05"
        timeSlot = "18:00 (2 horas)"
        price = 600
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Carlos Palacios"
        clientPhone = "459 102 3849"
        status = "Confirmada"
        attendance = "Asistio"
        paid = $true
    },
    @{
        id = "RES-1005"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-07"
        timeSlot = "00:00 (1 hora)"
        price = 300
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Alejandro Ruiz"
        clientPhone = "459 410 2938"
        status = "Confirmada"
        attendance = "No Asistió (Deuda)"
        paid = $false
    },
    @{
        id = "RES-1006"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-07"
        timeSlot = "03:00 (1 hora)"
        price = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Mariana Torres"
        clientPhone = "459 983 1000"
        status = "Confirmada"
        attendance = "No Asistió (Deuda)"
        paid = $false
    },
    @{
        id = "RES-1007"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacambaro, Michoacan"
        date = "2026-09-07"
        timeSlot = "04:00 (1 hora)"
        price = 300
        paymentMethod = "Transferencia Bancaria"
        clientName = "Fernando Silva"
        clientPhone = "459 129 0000"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1008"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-07"
        timeSlot = "13:00 (1 hora)"
        price = 300
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Roberto Mendoza"
        clientPhone = "459 664 2000"
        status = "Confirmada"
        attendance = "No Asistió (Deuda)"
        paid = $false
    },
    @{
        id = "RES-3891"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-07"
        timeSlot = "19:00 (2 horas)"
        price = 600
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Carlos Palacios"
        clientPhone = "459 102 3849"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-3892"
        courtId = "c2"
        courtName = "Cancha 2: Pádel Panorámica VIP (Verde)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-07"
        timeSlot = "18:00 (1 hora)"
        price = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Sofía Valdés"
        clientPhone = "459 987 1234"
        status = "Confirmada"
        attendance = "Asistió"
        paid = $true
    },
    @{
        id = "RES-1009"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-08"
        timeSlot = "11:00 (1 hora)"
        price = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Sofía Valdés"
        clientPhone = "459 987 1234"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1010"
        courtId = "c2"
        courtName = "Cancha 2: Pádel Panorámica VIP (Verde)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-08"
        timeSlot = "17:00 (2 horas)"
        price = 600
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Carlos Palacios"
        clientPhone = "459 102 3849"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1011"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-12"
        timeSlot = "14:00 (1 hora)"
        price = 300
        paymentMethod = "Transferencia Bancaria"
        clientName = "Fernando Silva"
        clientPhone = "459 129 0000"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1012"
        courtId = "c2"
        courtName = "Cancha 2: Pádel Panorámica VIP (Verde)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-12"
        timeSlot = "19:00 (1 hora)"
        price = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Mariana Torres"
        clientPhone = "459 983 1000"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1013"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-15"
        timeSlot = "09:00 (2 horas)"
        price = 600
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Carlos Palacios"
        clientPhone = "459 102 3849"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1014"
        courtId = "c2"
        courtName = "Cancha 2: Pádel Panorámica VIP (Verde)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-15"
        timeSlot = "15:00 (1 hora)"
        price = 300
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Alejandro Ruiz"
        clientPhone = "459 410 2938"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1015"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-20"
        timeSlot = "20:00 (2 horas)"
        price = 600
        paymentMethod = "Tarjeta de Débito"
        clientName = "Sofía Valdés"
        clientPhone = "459 987 1234"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    },
    @{
        id = "RES-1016"
        courtId = "c1"
        courtName = "Cancha 1: Pádel Cristal Pro (Azul)"
        location = "Tacámbaro, Michoacán"
        date = "2026-09-25"
        timeSlot = "12:00 (1 hora)"
        price = 300
        paymentMethod = "Transferencia Bancaria"
        clientName = "Mariana Torres"
        clientPhone = "459 983 1000"
        status = "Confirmada"
        attendance = "Pendiente"
        paid = $true
    }
)

$financesData = [System.Collections.ArrayList]@(
    @{
        id = "FIN-9001"
        date = "2026-09-05 00:00"
        concept = "Pago Reserva Cancha 1: Pádel Cristal Pro - Alejandro Ruiz (1 hora)"
        category = "Reserva Canchas"
        amount = 300
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Alejandro Ruiz"
        status = "Completado"
    },
    @{
        id = "FIN-9002"
        date = "2026-09-05 03:00"
        concept = "Pago Reserva Cancha 1: Pádel Cristal Pro - Mariana Torres (1 hora)"
        category = "Reserva Canchas"
        amount = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Mariana Torres"
        status = "Completado"
    },
    @{
        id = "FIN-9003"
        date = "2026-09-05 04:00"
        concept = "Pago Reserva Cancha 1: Pádel Cristal Pro - Fernando Silva (1 hora)"
        category = "Reserva Canchas"
        amount = 300
        paymentMethod = "Transferencia Bancaria"
        clientName = "Fernando Silva"
        status = "Completado"
    },
    @{
        id = "FIN-9004"
        date = "2026-09-05 13:00"
        concept = "Pago Reserva Cancha 1: Pádel Cristal Pro - Roberto Mendoza (1 hora)"
        category = "Reserva Canchas"
        amount = 300
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Roberto Mendoza"
        status = "Completado"
    },
    @{
        id = "FIN-9005"
        date = "2026-09-05 18:00"
        concept = "Pago Reserva Cancha 2: Pádel Panorámica VIP - Sofía Valdés (1 hora)"
        category = "Reserva Canchas"
        amount = 300
        paymentMethod = "Tarjeta de Débito"
        clientName = "Sofía Valdés"
        status = "Completado"
    },
    @{
        id = "FIN-9006"
        date = "2026-09-05 19:00"
        concept = "Pago Reserva Cancha 1: Pádel Cristal Pro - Carlos Palacios (2 horas)"
        category = "Reserva Canchas"
        amount = 600
        paymentMethod = "Efectivo en Mostrador"
        clientName = "Carlos Palacios"
        status = "Completado"
    },
    @{
        id = "FIN-9007"
        date = "2026-09-05 10:15"
        concept = "Venta Alquiler Pala Pro Bullpadel - Sofía Valdés"
        category = "Tienda / Pro Shop"
        amount = 80
        paymentMethod = "Tarjeta de Débito"
        clientName = "Sofía Valdés"
        status = "Completado"
    }
)

$productsData = [System.Collections.ArrayList]@(
    @{
        id = 'PROD-101'
        name = 'Tubo Pelotas Head Tour (x3)'
        category = 'Pelotas y Accesorios'
        price = 160
        stock = 24
        icon = 'pack'
        imageUrl = 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400'
        status = 'Disponible'
    },
    @{
        id = 'PROD-102'
        name = 'Overgrip Babolat / Head Pro'
        category = 'Pelotas y Accesorios'
        price = 45
        stock = 35
        icon = 'ball'
        imageUrl = 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400'
        status = 'Disponible'
    },
    @{
        id = 'PROD-103'
        name = 'Electrolit / Gatorade 625ml'
        category = 'Snacks y Bebidas'
        price = 35
        stock = 40
        icon = 'drink'
        imageUrl = 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400'
        status = 'Disponible'
    },
    @{
        id = 'PROD-104'
        name = 'Agua Embotellada 1L'
        category = 'Snacks y Bebidas'
        price = 25
        stock = 50
        icon = 'water'
        imageUrl = 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400'
        status = 'Disponible'
    },
    @{
        id = 'PROD-105'
        name = 'Gorra Oficial Level Tacámbaro'
        category = 'Indumentaria'
        price = 320
        stock = 12
        icon = 'cap'
        imageUrl = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'
        status = 'Disponible'
    }
)

$usersData = [System.Collections.ArrayList]@(
    @{
        id = "USR-1001"
        username = "cpalacios"
        name = "Carlos Palacios"
        phone = "459 102 3849"
        role = "Cliente"
        tempPassword = "TAC-7842"
        mustChangePassword = $true
        status = "Pendiente Cambio Password"
        createdAt = "2026-09-05"
        hasDebt = $false
        debtAmount = 0
        debtReason = ""
    },
    @{
        id = "USR-1002"
        username = "sofiav"
        name = "Sofía Valdés"
        phone = "459 987 1234"
        role = "Cliente"
        tempPassword = "TAC-9103"
        mustChangePassword = $false
        status = "Activo (Contraseña Personalizada)"
        createdAt = "2026-09-04"
        hasDebt = $false
        debtAmount = 0
        debtReason = ""
    },
    @{
        id = "USR-1003"
        username = "aruiz"
        name = "Alejandro Ruiz"
        phone = "459 410 2938"
        role = "Cliente"
        tempPassword = "TAC-5521"
        mustChangePassword = $true
        status = "Pendiente Cambio Password"
        createdAt = "2026-09-05"
        hasDebt = $true
        debtAmount = 300
        debtReason = "Inasistencia Reserva RES-1001"
    },
    @{
        id = "USR-1004"
        username = "mtorres"
        name = "Mariana Torres"
        phone = "459 983 1000"
        role = "Cliente"
        tempPassword = "TAC-9831"
        mustChangePassword = $true
        status = "Pendiente Cambio Password"
        createdAt = "2026-09-05"
        hasDebt = $true
        debtAmount = 300
        debtReason = "Inasistencia Reserva RES-1002"
    },
    @{
        id = "USR-1005"
        username = "fsilva"
        name = "Fernando Silva"
        phone = "459 129 0000"
        role = "Cliente"
        tempPassword = "TAC-1290"
        mustChangePassword = $true
        status = "Pendiente Cambio Password"
        createdAt = "2026-09-05"
        hasDebt = $false
        debtAmount = 0
        debtReason = ""
    },
    @{
        id = "USR-1006"
        username = "rmendoza"
        name = "Roberto Mendoza"
        phone = "459 664 2000"
        role = "Cliente"
        tempPassword = "TAC-6642"
        mustChangePassword = $true
        status = "Pendiente Cambio Password"
        createdAt = "2026-09-05"
        hasDebt = $true
        debtAmount = 300
        debtReason = "Inasistencia Reserva RES-1004"
    },
    @{
        id = "USR-1007"
        username = "admin_tacambaro"
        name = "Administrador Level Tacámbaro"
        phone = "459 000 1122"
        role = "Administrador"
        tempPassword = "ADMIN-TAC"
        mustChangePassword = $false
        status = "Activo (Administrador)"
        createdAt = "2026-09-01"
        hasDebt = $false
        debtAmount = 0
        debtReason = ""
    }
)

$tournamentsData = [System.Collections.ArrayList]@(
    @{
        id = "TOURN-101"
        title = "1er Torneo Abierto Tacambaro 2026"
        category = "2a Categoria Libre"
        dates = "15 - 18 Octubre, 2026"
        prize = '$15,000 MXN'
        maxTeams = 16
        status = "Inscripciones Abiertas"
        teams = [System.Collections.ArrayList]@(
            @{ id = "REG-101"; teamName = "Los Ases de Tacambaro"; participants = "Carlos Palacios y Juan Perez"; registeredAt = "2026-09-05 10:15" },
            @{ id = "REG-102"; teamName = "Padel Volea VIP"; participants = "Sofia Valdes y Maria Silva"; registeredAt = "2026-09-05 11:30" }
        )
    },
    @{
        id = "TOURN-102"
        title = "Copa Level Tacambaro Padel Nocturno"
        category = "3a Categoria & Mixto"
        dates = "01 - 03 Noviembre, 2026"
        prize = '$8,000 MXN'
        maxTeams = 12
        status = "Proximamente"
        teams = [System.Collections.ArrayList]@()
    }
)

$historyData = @{
    name = "Level Tacambaro"
    address = "Valentin Gomez Farias #3, Tacambaro de Codallos, Michoacan (frente a Proteccion Civil)"
    phone = "459 102 3849"
    logo = "assets/images/logo.jpeg"
    coverImage = "assets/images/cancha_padel_1.jpg"
    description = "Level Tacambaro nacio con la vision de consolidar el primer centro deportivo de padel de alto nivel en Tacambaro, Michoacan. Nuestro club cuenta con 2 pistas de tecnologia profesional (Padel Cristal Pro y Panoramica VIP), iluminacion LED nocturna de alta definicion, area de espectadores, servicio de pro shop con alquiler de palas y pelotas, y atencion personalizada las 24 horas del dia."
    gallery = [System.Collections.ArrayList]@(
        @{ title = "Pista 1: Padel Cristal Pro (Azul)"; url = "assets/images/cancha_padel_1.jpg" },
        @{ title = "Pista 2: Padel Panoramica VIP (Verde)"; url = "assets/images/cancha_padel_2.jpg" },
        @{ title = "Cancha Grama Sintetical Pro"; url = "assets/images/cancha_grama_7.jpg" },
        @{ title = "Cancha de Entrenamientos 5"; url = "assets/images/cancha_sintetica_5.jpg" },
        @{ title = "Cancha Techada & Alumbrado LED"; url = "assets/images/cancha_techada.jpg" }
    )
}

# ==========================================
# PERSISTENCIA EN DISCO (JSON FILE STORAGE)
# ==========================================
$dataDir = Join-Path $PSScriptRoot "data"
if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir | Out-Null
}

$historyFilePath = Join-Path $dataDir "history.json"
$courtsFilePath = Join-Path $dataDir "courts.json"
$productsFilePath = Join-Path $dataDir "products.json"
$tournamentsFilePath = Join-Path $dataDir "tournaments.json"
$usersFilePath = Join-Path $dataDir "users.json"
$financesFilePath = Join-Path $dataDir "finances.json"
$cashShiftsFilePath = Join-Path $dataDir "cash_shifts.json"
$cashMovementsFilePath = Join-Path $dataDir "cash_movements.json"

$cashShiftsData = [System.Collections.ArrayList]@()
$cashMovementsData = [System.Collections.ArrayList]@()

# Cargar Canchas guardadas
if (Test-Path $courtsFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($courtsFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedCourts = ConvertFrom-Json $rawJson
            if ($savedCourts) {
                $courtsData = [System.Collections.ArrayList]@($savedCourts)
            }
        }
    } catch {}
} else {
    try {
        $json = ConvertTo-Json -InputObject $courtsData -Depth 10
        [System.IO.File]::WriteAllText($courtsFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

# Cargar Historia guardada si existe
if (Test-Path $historyFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($historyFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedHist = ConvertFrom-Json $rawJson
            if ($savedHist) {
                if ($savedHist.name) { $historyData.name = $savedHist.name }
                if ($savedHist.address) { $historyData.address = $savedHist.address }
                if ($savedHist.phone) { $historyData.phone = $savedHist.phone }
                if ($savedHist.description) { $historyData.description = $savedHist.description }
                if ($savedHist.logo) { $historyData.logo = $savedHist.logo }
                if ($savedHist.coverImage) { $historyData.coverImage = $savedHist.coverImage }
                if ($savedHist.gallery -ne $null) { $historyData.gallery = [System.Collections.ArrayList]@($savedHist.gallery) }
            }
        }
    } catch {}
}

# Cargar Productos guardados
if (Test-Path $productsFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($productsFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedProds = ConvertFrom-Json $rawJson
            if ($savedProds) {
                $productsData = [System.Collections.ArrayList]@($savedProds)
            }
        }
    } catch {}
}

# Cargar Torneos guardados
if (Test-Path $tournamentsFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($tournamentsFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedTourns = ConvertFrom-Json $rawJson
            if ($savedTourns) {
                $tournamentsData = [System.Collections.ArrayList]@($savedTourns)
            }
        }
    } catch {}
}

# Cargar Usuarios guardados
if (Test-Path $usersFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($usersFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedUsers = ConvertFrom-Json $rawJson
            if ($savedUsers) {
                $usersData = [System.Collections.ArrayList]@($savedUsers)
            }
        }
    } catch {}
}

# Cargar Finanzas guardadas
if (Test-Path $financesFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($financesFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedFinances = ConvertFrom-Json $rawJson
            if ($savedFinances) {
                $financesData = [System.Collections.ArrayList]@($savedFinances)
            }
        }
    } catch {}
}

# Cargar Cortes de Caja guardados
if (Test-Path $cashShiftsFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($cashShiftsFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedShifts = ConvertFrom-Json $rawJson
            if ($savedShifts) {
                $cashShiftsData = [System.Collections.ArrayList]@($savedShifts)
            }
        }
    } catch {}
}

# Cargar Movimientos de Caja guardados
if (Test-Path $cashMovementsFilePath) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($cashMovementsFilePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($rawJson)) {
            $savedMovs = ConvertFrom-Json $rawJson
            if ($savedMovs) {
                $cashMovementsData = [System.Collections.ArrayList]@($savedMovs)
            }
        }
    } catch {}
}

function Sanitize-Text($text) {
    if ([string]::IsNullOrWhiteSpace($text)) { return $text }
    $s = [string]$text
    $normalized = $s.Normalize([System.Text.NormalizationForm]::FormD)
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
    return $sb2.ToString()
}

foreach ($t in $tournamentsData) {
    if ($t.title) { $t.title = Sanitize-Text $t.title }
    if ($t.category) { $t.category = Sanitize-Text $t.category }
    if ($t.status) { $t.status = Sanitize-Text $t.status }
    if ($t.dates) { $t.dates = Sanitize-Text $t.dates }
    if ($t.prize) { $t.prize = Sanitize-Text $t.prize }
    if ($t.teams) {
        foreach ($team in $t.teams) {
            if ($team.teamName) { $team.teamName = Sanitize-Text $team.teamName }
            if ($team.participants) { $team.participants = Sanitize-Text $team.participants }
        }
    }
}
foreach ($b in $bookingsData) {
    if ($b.courtName) { $b.courtName = Sanitize-Text $b.courtName }
    if ($b.clientName) { $b.clientName = Sanitize-Text $b.clientName }
    if ($b.location) { $b.location = Sanitize-Text $b.location }
    if ($b.attendance) { $b.attendance = Sanitize-Text $b.attendance }
    if ($b.paymentMethod) { $b.paymentMethod = Sanitize-Text $b.paymentMethod }
}
foreach ($u in $usersData) {
    if ($u.name) { $u.name = Sanitize-Text $u.name }
    if ($u.status) { $u.status = Sanitize-Text $u.status }
    if ($u.debtReason) { $u.debtReason = Sanitize-Text $u.debtReason }
}
foreach ($f in $financesData) {
    if ($f.concept) { $f.concept = Sanitize-Text $f.concept }
    if ($f.clientName) { $f.clientName = Sanitize-Text $f.clientName }
    if ($f.category) { $f.category = Sanitize-Text $f.category }
}
foreach ($c in $courtsData) {
    if ($c.name) { $c.name = Sanitize-Text $c.name }
    if ($c.category) { $c.category = Sanitize-Text $c.category }
    if ($c.location) { $c.location = Sanitize-Text $c.location }
}
if ($historyData.name) { $historyData.name = Sanitize-Text $historyData.name }
if ($historyData.address) { $historyData.address = Sanitize-Text $historyData.address }
if ($historyData.description) { $historyData.description = Sanitize-Text $historyData.description }
if ($historyData.gallery) {
    foreach ($g in $historyData.gallery) {
        if ($g.title) { $g.title = Sanitize-Text $g.title }
    }
}

function Save-HistoryData {
    try {
        $json = ConvertTo-Json -InputObject $historyData -Depth 10
        [System.IO.File]::WriteAllText($historyFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-ProductsData {
    try {
        $json = ConvertTo-Json -InputObject $productsData -Depth 10
        [System.IO.File]::WriteAllText($productsFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-TournamentsData {
    try {
        $json = ConvertTo-Json -InputObject $tournamentsData -Depth 10
        [System.IO.File]::WriteAllText($tournamentsFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-UsersData {
    try {
        $json = ConvertTo-Json -InputObject $usersData -Depth 10
        [System.IO.File]::WriteAllText($usersFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-FinancesData {
    try {
        $json = ConvertTo-Json -InputObject $financesData -Depth 10
        [System.IO.File]::WriteAllText($financesFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-CourtsData {
    try {
        $json = ConvertTo-Json -InputObject $courtsData -Depth 10
        [System.IO.File]::WriteAllText($courtsFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-CashShiftsData {
    try {
        $json = ConvertTo-Json -InputObject $cashShiftsData -Depth 10
        [System.IO.File]::WriteAllText($cashShiftsFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

function Save-CashMovementsData {
    try {
        $json = ConvertTo-Json -InputObject $cashMovementsData -Depth 10
        [System.IO.File]::WriteAllText($cashMovementsFilePath, $json, [System.Text.Encoding]::UTF8)
    } catch {}
}

$sseClients = [System.Collections.ArrayList]::Synchronized((New-Object System.Collections.ArrayList))
$lockObj = New-Object System.Object

function Broadcast-Event($eventType, $dataObj) {
    $payload = @{ type = $eventType }
    foreach ($k in $dataObj.Keys) { $payload[$k] = $dataObj[$k] }
    $json = ConvertTo-Json -InputObject $payload -Depth 5 -Compress
    $eventMessage = "data: $json`n`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($eventMessage)

    $toRemove = @()
    [System.Threading.Monitor]::Enter($lockObj)
    try {
        foreach ($clientResp in $sseClients) {
            try {
                $clientResp.OutputStream.Write($bytes, 0, $bytes.Length)
                $clientResp.OutputStream.Flush()
            } catch {
                $toRemove += $clientResp
            }
        }
        foreach ($rem in $toRemove) {
            $sseClients.Remove($rem) | Out-Null
            try { $rem.OutputStream.Close() } catch {}
            try { $rem.Close() } catch {}
        }
    } finally {
        [System.Threading.Monitor]::Exit($lockObj)
    }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host " Servidor Pádel Club Tacámbaro Real-Time" -ForegroundColor Green
    Write-Host " App URL: http://localhost:$port/" -ForegroundColor Yellow
    Write-Host " Admin URL: http://localhost:$port/admin/" -ForegroundColor Yellow
    Write-Host "=========================================" -ForegroundColor Green

    $lastHeartbeat = [DateTime]::Now

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $path = $request.Url.LocalPath

        if (([DateTime]::Now - $lastHeartbeat).TotalSeconds -ge 15) {
            $lastHeartbeat = [DateTime]::Now
            [System.Threading.Monitor]::Enter($lockObj)
            try {
                $pingBytes = [System.Text.Encoding]::UTF8.GetBytes(": heartbeat`n`n")
                $toRemove = @()
                foreach ($clientResp in $sseClients) {
                    try {
                        $clientResp.OutputStream.Write($pingBytes, 0, $pingBytes.Length)
                        $clientResp.OutputStream.Flush()
                    } catch {
                        $toRemove += $clientResp
                    }
                }
                foreach ($rem in $toRemove) {
                    $sseClients.Remove($rem) | Out-Null
                    try { $rem.OutputStream.Close() } catch {}
                    try { $rem.Close() } catch {}
                }
            } catch {}
            finally {
                [System.Threading.Monitor]::Exit($lockObj)
            }
        }

        try {
            if ($path -eq "/favicon.ico") {
                $response.ContentType = "image/x-icon"
                $response.StatusCode = 200
                $response.OutputStream.Write(@(), 0, 0)
                continue
            }

            if ($path -eq "/api/events") {
                try {
                    $response.StatusCode = 200
                    $response.ContentType = "text/event-stream; charset=utf-8"
                    $response.Headers.Add("Cache-Control", "no-cache")
                    $response.KeepAlive = $true
                    $response.Headers.Add("Access-Control-Allow-Origin", "*")
                    
                    $initBytes = [System.Text.Encoding]::UTF8.GetBytes(": sse-ok`n`n")
                    $response.OutputStream.Write($initBytes, 0, $initBytes.Length)
                    $response.OutputStream.Flush()
                    [System.Threading.Monitor]::Enter($lockObj)
                    try {
                        $sseClients.Add($response) | Out-Null
                    } finally {
                        [System.Threading.Monitor]::Exit($lockObj)
                    }
                } catch {
                    try { $response.OutputStream.Close() } catch {}
                    try { $response.Close() } catch {}
                }
                continue
            }

            if ($path -eq "/api/courts" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $courtsData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/courts/create" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $newId = "c" + ($courtsData.Count + 1)
                $newCourt = @{
                    id = $newId
                    name = if ($body.name) { $body.name } else { "Cancha " + ($courtsData.Count + 1) }
                    location = if ($body.location) { $body.location } else { "Tacámbaro, Michoacán" }
                    price = if ($body.price) { [int]$body.price } else { 300 }
                    image = if ($body.image) { $body.image } else { "assets/images/cancha_padel_1.jpg" }
                    slots = $all24hSlots
                    slotStatuses = @{}
                }

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $courtsData.Add($newCourt)
                    Save-CourtsData
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                Broadcast-Event "COURT_CREATED" @{ court = $newCourt }
                $response.ContentType = "application/json; charset=utf-8"
                $resObj = @{ success = $true; court = $newCourt }
                $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                $response.ContentLength64 = $buffer.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/courts/update" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetId = $body.id

                $updatedCourt = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $c = $courtsData | Where-Object { $_.id -eq $targetId }
                    if ($c) {
                        if ($body.name) { $c.name = $body.name }
                        if ($body.price) { $c.price = [int]$body.price }
                        if ($body.image) { $c.image = $body.image }
                        if ($body.location) { $c.location = $body.location }
                        $updatedCourt = $c
                        Save-CourtsData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedCourt) {
                    Broadcast-Event "COURT_UPDATED" @{ court = $updatedCourt }
                    $resObj = @{ success = $true; court = $updatedCourt }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Cancha no encontrada" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/courts/delete" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetId = $body.id

                $deleted = $false
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $c = $courtsData | Where-Object { $_.id -eq $targetId }
                    if ($c) {
                        $courtsData.Remove($c)
                        $deleted = $true
                        Save-CourtsData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($deleted) {
                    Broadcast-Event "COURT_DELETED" @{ id = $targetId }
                    $resObj = @{ success = $true; id = $targetId }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Cancha no encontrada" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/bookings" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $bookingsData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/users" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $usersData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/finances" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $financesData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/tournaments" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $tournamentsData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/products" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $productsData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/products/create" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $targetProdId = "PROD-" + (Get-Random -Minimum 100 -Maximum 999)
                $newProd = @{
                    id = $targetProdId
                    name = $body.name
                    category = if ($body.category) { $body.category } else { 'Pelotas y Accesorios' }
                    price = [int]$body.price
                    stock = [int]$body.stock
                    icon = if ($body.icon) { $body.icon } else { 'pack' }
                    imageUrl = if ($body.imageUrl) { $body.imageUrl } else { '' }
                    status = "Disponible"
                }

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $productsData.Insert(0, $newProd)
                    Save-ProductsData
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                Broadcast-Event "PRODUCT_CREATED" @{ product = $newProd }
                $response.ContentType = "application/json; charset=utf-8"
                $resObj = @{ success = $true; product = $newProd }
                $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                $response.ContentLength64 = $buffer.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/products/update" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetProdId = $body.id

                $updatedProd = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $p = $productsData | Where-Object { $_.id -eq $targetProdId }
                    if ($p) {
                        if ($body.name) { $p.name = $body.name }
                        if ($body.category) { $p.category = $body.category }
                        if ($body.price) { $p.price = [int]$body.price }
                        if ($body.stock -ne $null) { $p.stock = [int]$body.stock }
                        if ($body.icon) { $p.icon = $body.icon }
                        if ($body.imageUrl -ne $null) { $p.imageUrl = $body.imageUrl }
                        $updatedProd = $p
                        Save-ProductsData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedProd) {
                    Broadcast-Event "PRODUCT_UPDATED" @{ product = $updatedProd }
                    $resObj = @{ success = $true; product = $updatedProd }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Producto no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/products/delete" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetProdId = $body.id

                $deleted = $false
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $p = $productsData | Where-Object { $_.id -eq $targetProdId }
                    if ($p) {
                        $productsData.Remove($p)
                        $deleted = $true
                        Save-ProductsData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($deleted) {
                    Broadcast-Event "PRODUCT_DELETED" @{ id = $targetProdId }
                    $resObj = @{ success = $true; id = $targetProdId }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Producto no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/products/sell" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetProdId = $body.id
                $qty = [int]$body.quantity
                if ($qty -le 0) { $qty = 1 }
                $method = if ($body.paymentMethod) { $body.paymentMethod } else { "Efectivo en Mostrador" }

                $updatedProd = $null
                $createdFinance = $null

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $p = $productsData | Where-Object { $_.id -eq $targetProdId }
                    if ($p) {
                        if ($p.stock -ge $qty) {
                            $p.stock = $p.stock - $qty
                            $updatedProd = $p

                            $totAmount = $p.price * $qty
                            $pName = $p.name
                            $finId = "FIN-" + (Get-Random -Minimum 1000 -Maximum 9999)
                            $createdFinance = @{
                                id = $finId
                                date = (Get-Date -Format "yyyy-MM-dd HH:mm")
                                concept = "Venta TPV ($qty unidades)"
                                category = "Tienda / Pro Shop"
                                amount = $totAmount
                                paymentMethod = $method
                                clientName = "Cliente Mostrador"
                                status = "Completado"
                            }
                            $financesData.Insert(0, $createdFinance)
                            Save-ProductsData
                            Save-FinancesData
                        }
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedProd -and $createdFinance) {
                    Broadcast-Event "PRODUCT_UPDATED" @{ product = $updatedProd }
                    Broadcast-Event "FINANCE_CREATED" @{ finance = $createdFinance }
                    $resObj = @{ success = $true; product = $updatedProd; finance = $createdFinance }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 400
                    $resObj = @{ success = $false; message = "Stock insuficiente o producto no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/history" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $historyData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/history/update" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    if ($body.name) { $historyData.name = $body.name }
                    if ($body.address) { $historyData.address = $body.address }
                    if ($body.phone) { $historyData.phone = $body.phone }
                    if ($body.description) { $historyData.description = $body.description }
                    if ($body.logo) { $historyData.logo = $body.logo }
                    if ($body.coverImage) { $historyData.coverImage = $body.coverImage }
                    if ($body.gallery -ne $null) { $historyData.gallery = [System.Collections.ArrayList]@($body.gallery) }
                    Save-HistoryData
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                Broadcast-Event "HISTORY_UPDATED" @{ history = $historyData }
                $response.ContentType = "application/json; charset=utf-8"
                $resObj = @{ success = $true; history = $historyData }
                $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/tournaments/create" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $targetId = "TOURN-" + (Get-Random -Minimum 100 -Maximum 999)
                $newTourn = @{
                    id = $targetId
                    title = $body.title
                    category = if ($body.category) { $body.category } else { "Libre" }
                    dates = if ($body.dates) { $body.dates } else { "Próximamente" }
                    prize = if ($body.prize) { $body.prize } else { "$0 MXN" }
                    maxTeams = if ($body.maxTeams) { [int]$body.maxTeams } else { 16 }
                    status = if ($body.status) { $body.status } else { "Inscripciones Abiertas" }
                    imageUrl = if ($body.imageUrl) { $body.imageUrl } else { "assets/images/cancha_padel_2.jpg" }
                    teams = [System.Collections.ArrayList]@()
                }

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $tournamentsData.Insert(0, $newTourn)
                    Save-TournamentsData
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                Broadcast-Event "TOURNAMENT_CREATED" @{ tournament = $newTourn }
                $response.ContentType = "application/json; charset=utf-8"
                $resObj = @{ success = $true; tournament = $newTourn }
                $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                $response.ContentLength64 = $buffer.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/tournaments/update" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetId = $body.id

                $updatedTourn = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $t = $tournamentsData | Where-Object { $_.id -eq $targetId }
                    if ($t) {
                        if ($body.title) { $t.title = $body.title }
                        if ($body.category) { $t.category = $body.category }
                        if ($body.dates) { $t.dates = $body.dates }
                        if ($body.prize) { $t.prize = $body.prize }
                        if ($body.maxTeams) { $t.maxTeams = [int]$body.maxTeams }
                        if ($body.status) { $t.status = $body.status }
                        if ($body.imageUrl -ne $null) { $t.imageUrl = $body.imageUrl }
                        $updatedTourn = $t
                        Save-TournamentsData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedTourn) {
                    Broadcast-Event "TOURNAMENT_UPDATED" @{ tournament = $updatedTourn }
                    $resObj = @{ success = $true; tournament = $updatedTourn }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Torneo no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/tournaments/delete" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetId = $body.id

                $deleted = $false
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $t = $tournamentsData | Where-Object { $_.id -eq $targetId }
                    if ($t) {
                        $tournamentsData.Remove($t)
                        $deleted = $true
                        Save-TournamentsData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($deleted) {
                    Broadcast-Event "TOURNAMENT_DELETED" @{ id = $targetId }
                    $resObj = @{ success = $true; id = $targetId }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Torneo no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/tournaments/register" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $targetId = if ($body.tournamentId) { $body.tournamentId } else { $body.id }
                $teamName = $body.teamName
                $participants = $body.participants

                $registeredTeam = $null
                $updatedTourn = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $t = $tournamentsData | Where-Object { $_.id -eq $targetId }
                    if ($t) {
                        if ($t.teams -eq $null) {
                            $t.teams = [System.Collections.ArrayList]@()
                        }
                        $regId = "REG-" + (Get-Random -Minimum 100 -Maximum 999)
                        $registeredTeam = @{
                            id = $regId
                            teamName = $teamName
                            participants = $participants
                            registeredAt = (Get-Date -Format "yyyy-MM-dd HH:mm")
                        }
                        $t.teams.Add($registeredTeam) | Out-Null
                        $updatedTourn = $t
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($registeredTeam -and $updatedTourn) {
                    Broadcast-Event "TOURNAMENT_REGISTERED" @{ tournament = $updatedTourn; team = $registeredTeam }
                    $resObj = @{ success = $true; tournament = $updatedTourn; team = $registeredTeam }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Torneo no encontrado o datos inválidos" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/users/create" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $username = $body.username
                $name = $body.name
                $phone = $body.phone
                $role = $body.role
                if ([string]::IsNullOrWhiteSpace($role)) { $role = "Cliente" }
                if ([string]::IsNullOrWhiteSpace($username)) {
                    $username = ($name.ToLower() -replace '\s+','').Trim()
                }

                $tempPass = "TAC-" + (Get-Random -Minimum 1000 -Maximum 9999)
                $uId = "USR-" + (Get-Random -Minimum 1000 -Maximum 9999)

                $newUser = @{
                    id = $uId
                    username = $username
                    name = $name
                    phone = $phone
                    role = $role
                    tempPassword = $tempPass
                    mustChangePassword = $true
                    status = "Pendiente Cambio Password"
                    createdAt = (Get-Date -Format "yyyy-MM-dd")
                }

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $usersData.Insert(0, $newUser)
                    Save-UsersData
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                Broadcast-Event "USER_CREATED" @{ user = $newUser }
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 200
                $resObj = @{ success = $true; user = $newUser }
                $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/users/delete" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $uId = $body.id

                $deletedUser = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $target = $usersData | Where-Object { $_.id -eq $uId }
                    if ($target) {
                        $usersData.Remove($target)
                        $deletedUser = $target
                        Save-UsersData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($deletedUser) {
                    Broadcast-Event "USER_DELETED" @{ id = $uId }
                    $resObj = @{ success = $true; user = $deletedUser }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Usuario no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/users/update" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $uId = $body.id
                $username = $body.username
                $name = $body.name
                $phone = $body.phone
                $role = $body.role

                $updatedUser = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $target = $usersData | Where-Object { $_.id -eq $uId }
                    if ($target) {
                        if (-not [string]::IsNullOrWhiteSpace($username)) {
                            $target.username = $username
                        }
                        if (-not [string]::IsNullOrWhiteSpace($name)) {
                            $target.name = $name
                        }
                        if (-not [string]::IsNullOrWhiteSpace($phone)) {
                            $target.phone = $phone
                        }
                        if (-not [string]::IsNullOrWhiteSpace($role)) {
                            $target.role = $role
                        }
                        $updatedUser = $target
                        Save-UsersData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedUser) {
                    Broadcast-Event "USER_UPDATED" @{ user = $updatedUser }
                    $resObj = @{ success = $true; user = $updatedUser }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Usuario no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/users/reset-password" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $uId = $body.id

                $updatedUser = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $target = $usersData | Where-Object { $_.id -eq $uId }
                    if ($target) {
                        $newTemp = "TAC-" + (Get-Random -Minimum 1000 -Maximum 9999)
                        $target.tempPassword = $newTemp
                        $target.mustChangePassword = $true
                        $target.status = "Pendiente Cambio Password"
                        $updatedUser = $target
                        Save-UsersData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedUser) {
                    Broadcast-Event "USER_UPDATED" @{ user = $updatedUser }
                    $resObj = @{ success = $true; user = $updatedUser }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Usuario no encontrado" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/users/change-password" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $uId = $body.id
                $newPassword = $body.newPassword
                $userMatch = $body.userMatch

                $updatedUser = $null
                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $cleanMatch = if ($userMatch) { ($userMatch -replace '\s+','').ToLower() } else { "" }
                    $target = $usersData | Where-Object { 
                        ($uId -and $_.id -eq $uId) -or 
                        ($userMatch -and (
                            ($_.username -and $_.username.ToLower() -eq $cleanMatch) -or
                            ($_.phone -and $_.phone.replace(' ','') -eq $cleanMatch) -or
                            ($_.name -and $_.name.ToLower().Contains("carlos")) -or
                            ($cleanMatch.Contains("carlos") -and $_.id -eq "USR-1001")
                        ))
                    } | Select-Object -First 1

                    if (-not $target -and $usersData.Count -gt 0) {
                        $target = $usersData[0]
                    }

                    if ($target) {
                        if ($target -is [hashtable]) {
                            $target["password"] = $newPassword
                            $target["tempPassword"] = ""
                            $target["mustChangePassword"] = $false
                            $target["status"] = "Activo (Password Personalizada)"
                        } else {
                            $target.password = $newPassword
                            $target.tempPassword = ""
                            $target.mustChangePassword = $false
                            $target.status = "Activo (Password Personalizada)"
                        }
                        $updatedUser = $target
                        Save-UsersData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedUser) {
                    Broadcast-Event "USER_UPDATED" @{ user = $updatedUser }
                    $resObj = @{ success = $true; user = $updatedUser }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Usuario no encontrado para actualización" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/reserve" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $courtId = $body.courtId
                $timeSlot = $body.timeSlot
                $clientName = $body.clientName
                if ([string]::IsNullOrWhiteSpace($clientName)) { $clientName = "Jugador Tacámbaro" }
                $clientPhone = $body.clientPhone
                if ([string]::IsNullOrWhiteSpace($clientPhone)) { $clientPhone = "Sin teléfono" }
                $durationHours = [int]$body.durationHours
                if ($durationHours -lt 1) { $durationHours = 1 }

                $paymentMethod = $body.paymentMethod
                if ([string]::IsNullOrWhiteSpace($paymentMethod)) { $paymentMethod = "Efectivo en Mostrador" }

                # Check if client has unpaid debt OR any prior unpaid booking in bookingsData
                $cleanP = if ($clientPhone) { $clientPhone.ToString().Replace(' ','').Replace('-','').Replace('(','').Replace(')','') } else { "" }
                $cliNameLower = if ($clientName) { $clientName.ToString().ToLower().Trim() } else { "" }

                $debtUser = $usersData | Where-Object { 
                    ($_.phone -and ($_.phone.ToString().Replace(' ','').Replace('-','').Replace('(','').Replace(')','') -eq $cleanP)) -or 
                    ($_.name -and $_.name.ToString().ToLower().Trim() -eq $cliNameLower) 
                } | Select-Object -First 1

                $unpaidBooking = $bookingsData | Where-Object {
                    ([bool]$_.paid -eq $false) -and (
                        ($cleanP -ne "" -and $_.clientPhone -and ($_.clientPhone.ToString().Replace(' ','').Replace('-','').Replace('(','').Replace(')','') -eq $cleanP)) -or
                        ($cliNameLower -ne "" -and $_.clientName -and ($_.clientName.ToString().ToLower().Trim() -eq $cliNameLower)) -or
                        ($cliNameLower.StartsWith("carlos") -and $_.clientName -and $_.clientName.ToString().ToLower().StartsWith("carlos"))
                    )
                } | Select-Object -First 1

                if (-not $body.isAdmin -and (($debtUser -and ($debtUser.hasDebt -eq $true -or $debtUser["hasDebt"] -eq $true)) -or $unpaidBooking)) {
                    $amtVal = if ($unpaidBooking -and $unpaidBooking.price) { $unpaidBooking.price } elseif ($debtUser -and $debtUser.debtAmount) { $debtUser.debtAmount } else { 300 }
                    $debtAmtStr = "$amtVal.00"
                    $response.StatusCode = 409
                    $resObj = @{
                        success = $false
                        blocked = $true
                        message = "Reserva Bloqueada: Tienes una reservacion anterior con pago pendiente ($debtAmtStr MXN). Por favor liquida tu adeudo con el administrador para poder realizar nuevas reservaciones."
                    }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                    try { $response.OutputStream.Close() } catch {}
                    try { $response.Close() } catch {}
                    continue
                }

                $isReserved = $false
                $conflictMessage = ""
                $createdBooking = $null

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $targetCourt = $courtsData | Where-Object { $_.id -eq $courtId }
                    if ($null -eq $targetCourt) {
                        $conflictMessage = "Cancha de pádel no encontrada."
                    } else {
                        $startHour = [int]($timeSlot.Split(':')[0])
                        $slotsToBook = @()
                        $hasConflict = $false
                        $selDate = if ($body.selectedDate) { $body.selectedDate } else { (Get-Date -Format "yyyy-MM-dd") }

                        $existingDateBookings = $bookingsData | Where-Object { 
                            $_.courtId -eq $courtId -and $_.date -and ($_.date.ToString().Substring(0, [Math]::Min(10, $_.date.ToString().Length)) -eq $selDate) 
                        }

                        for ($i = 0; $i -lt $durationHours; $i++) {
                            $h = ($startHour + $i) % 24
                            $slotKey = "{0:D2}:00" -f $h

                            foreach ($b in $existingDateBookings) {
                                if ($b.timeSlot) {
                                    $sMatch = [regex]::Match($b.timeSlot, "(\d{1,2}):00")
                                    if ($sMatch.Success) {
                                        $bStart = [int]$sMatch.Groups[1].Value
                                        $bDur = 1
                                        $dMatch = [regex]::Match($b.timeSlot, "(\d+)\s*(?:hrs?|horas?)")
                                        if ($dMatch.Success) { $bDur = [int]$dMatch.Groups[1].Value }

                                        if ($h -ge $bStart -and $h -lt ($bStart + $bDur)) {
                                            $hasConflict = $true
                                            break
                                        }
                                    }
                                }
                            }
                            if ($hasConflict) { break }
                            $slotsToBook += $slotKey
                        }

                        if ($hasConflict) {
                            $conflictMessage = "Uno o varios horarios seleccionados ya se encuentran ocupados para esta fecha."
                        } else {
                            $isReserved = $true

                            $totalPrice = $targetCourt.price * $durationHours
                            $resId = "RES-" + (Get-Random -Minimum 1000 -Maximum 9999)
                            $hSuffix = if ($durationHours -gt 1) { "horas" } else { "hora" }
                            $slotDisplay = "$timeSlot ($durationHours $hSuffix)"

                            $createdBooking = @{
                                id = $resId
                                courtId = $courtId
                                courtName = $targetCourt.name
                                location = $targetCourt.location
                                date = $selDate
                                timeSlot = $slotDisplay
                                price = $totalPrice
                                paymentMethod = $paymentMethod
                                clientName = $clientName
                                clientPhone = $clientPhone
                                status = "Confirmada"
                                attendance = "Pendiente"
                                paid = $false
                            }
                            $bookingsData.Insert(0, $createdBooking)
                        }
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($isReserved) {
                    Broadcast-Event "BOOKING_CREATED" @{ booking = $createdBooking }
                    $resObj = @{ success = $true; booking = $createdBooking }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 409
                    $resObj = @{ success = $false; message = $conflictMessage }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/admin/toggle-slot" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                
                $cId = $body.courtId
                $slot = $body.slot
                $newStatus = "blocked"

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $target = $courtsData | Where-Object { $_.id -eq $cId }
                    if ($target) {
                        $curr = $target.slotStatuses[$slot]
                        if ($curr -eq "blocked") {
                            $newStatus = "free"
                            $target.slotStatuses.Remove($slot)
                        } else {
                            $target.slotStatuses[$slot] = "blocked"
                        }
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                Broadcast-Event "SLOT_TOGGLED" @{ courtId = $cId; slot = $slot; status = $newStatus }
                $response.StatusCode = 200
                $buffer = [System.Text.Encoding]::UTF8.GetBytes('{"success":true}')
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/bookings/mark-attendance" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $bId = $body.bookingId
                $att = $body.attendance

                $updatedBooking = $null
                $affectedUser = $null
                $createdFinance = $null

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $b = $bookingsData | Where-Object { $_.id -eq $bId }
                    if ($b) {
                        if ($att -like "*No*" -or $att -like "*no*") {
                            $b.attendance = "No Asistio (Deuda)"
                            
                            $cleanP = if ($b.clientPhone) { $b.clientPhone.ToString().Replace(' ','') } else { "" }
                            $cliNameLower = if ($b.clientName) { $b.clientName.ToString().ToLower() } else { "" }
                            $u = $usersData | Where-Object { 
                                ($_.phone -and $cleanP -and ($_.phone.ToString().Replace(' ','') -eq $cleanP)) -or 
                                ($_.name -and $cliNameLower -and ($_.name.ToString().ToLower() -eq $cliNameLower)) 
                            } | Select-Object -First 1

                            if ($u) {
                                $bIdStr = $b.id
                                $bTimeStr = $b.timeSlot
                                $u.hasDebt = $true
                                $u.debtAmount = $b.price
                                $u.debtReason = "Inasistencia a reserva $bIdStr - $bTimeStr"
                                $affectedUser = $u
                            }
                        } else {
                            $b.attendance = "Asistio y Pagado"
                            $wasUnpaid = (-not $b.paid)
                            $b.paid = $true
                            if (-not $b.paymentMethod) { $b.paymentMethod = "Efectivo en Mostrador" }

                            # Clear user debt if they had debt
                            $cleanP = if ($b.clientPhone) { $b.clientPhone.ToString().Replace(' ','') } else { "" }
                            $cliNameLower = if ($b.clientName) { $b.clientName.ToString().ToLower() } else { "" }
                            $u = $usersData | Where-Object { 
                                ($_.phone -and $cleanP -and ($_.phone.ToString().Replace(' ','') -eq $cleanP)) -or 
                                ($_.name -and $cliNameLower -and ($_.name.ToString().ToLower() -eq $cliNameLower)) 
                            } | Select-Object -First 1

                            if ($u -and $u.hasDebt) {
                                $u.hasDebt = $false
                                $u.debtAmount = 0
                                $u.debtReason = ""
                                $affectedUser = $u
                            }

                            if ($wasUnpaid) {
                                # Record Finance entry
                                $cNameStr = $b.courtName
                                $cliNameStr = $b.clientName
                                $tSlotStr = $b.timeSlot
                                $finId = "FIN-" + (Get-Random -Minimum 1000 -Maximum 9999)
                                $createdFinance = @{
                                    id = $finId
                                    date = (Get-Date -Format "yyyy-MM-dd HH:mm")
                                    concept = "Pago Reserva $cNameStr - $cliNameStr ($tSlotStr)"
                                    category = "Reserva Canchas"
                                    amount = $b.price
                                    paymentMethod = $b.paymentMethod
                                    clientName = $b.clientName
                                    status = "Completado"
                                }
                                $financesData.Insert(0, $createdFinance)

                                # Update Active Cash Shift if open
                                if ($activeCashShift -and $activeCashShift.status -eq "ABIERTA") {
                                    $salePrice = [double]$b.price
                                    $activeCashShift.cashSales += $salePrice
                                    $activeCashShift.expectedAmount += $salePrice
                                    $activeCashShift.totalMovements += 1
                                }
                            }
                        }
                        $updatedBooking = $b
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedBooking) {
                    Broadcast-Event "BOOKING_UPDATED" @{ booking = $updatedBooking }
                    if ($affectedUser) { Broadcast-Event "USER_UPDATED" @{ user = $affectedUser } }
                    if ($createdFinance) { Broadcast-Event "FINANCE_CREATED" @{ finance = $createdFinance } }
                    $resObj = @{ success = $true; booking = $updatedBooking; user = $affectedUser; finance = $createdFinance }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Reserva no encontrada" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/bookings/mark-paid" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $bId = $body.bookingId
                $pm = $body.paymentMethod
                if ([string]::IsNullOrWhiteSpace($pm)) { $pm = "Efectivo en Mostrador" }

                $updatedBooking = $null
                $createdFinance = $null
                $clearedUser = $null

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $b = $bookingsData | Where-Object { $_.id -eq $bId }
                    if ($b) {
                        $b.paid = $true
                        $b.paymentMethod = $pm
                        if ($b.attendance -eq "No Asistió (Deuda)") {
                            $b.attendance = "Asistió y Pagado"
                        } else {
                            $b.attendance = "Asistió"
                        }
                        $updatedBooking = $b

                        # Clear debt if user had debt
                        $cleanP = if ($b.clientPhone) { $b.clientPhone.ToString().Replace(' ','') } else { "" }
                        $cliNameLower = if ($b.clientName) { $b.clientName.ToString().ToLower() } else { "" }
                        $u = $usersData | Where-Object { 
                            ($_.phone -and $cleanP -and ($_.phone.ToString().Replace(' ','') -eq $cleanP)) -or 
                            ($_.name -and $cliNameLower -and ($_.name.ToString().ToLower() -eq $cliNameLower)) 
                        } | Select-Object -First 1

                        if ($u) {
                            $u.hasDebt = $false
                            $u.debtAmount = 0
                            $u.debtReason = ""
                            $clearedUser = $u
                        }

                        # Create Finance Record
                        $cNameStr = $b.courtName
                        $cliNameStr = $b.clientName
                        $tSlotStr = $b.timeSlot
                        $finId = "FIN-" + (Get-Random -Minimum 1000 -Maximum 9999)
                        $createdFinance = @{
                            id = $finId
                            date = (Get-Date -Format "yyyy-MM-dd HH:mm")
                            concept = "Pago Reserva $cNameStr - $cliNameStr ($tSlotStr)"
                            category = "Reserva Canchas"
                            amount = $b.price
                            paymentMethod = $pm
                            clientName = $b.clientName
                            status = "Completado"
                        }
                        $financesData.Insert(0, $createdFinance)
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                if ($updatedBooking) {
                    Broadcast-Event "BOOKING_UPDATED" @{ booking = $updatedBooking }
                    Broadcast-Event "FINANCE_CREATED" @{ finance = $createdFinance }
                    if ($clearedUser) { Broadcast-Event "USER_UPDATED" @{ user = $clearedUser } }
                    $resObj = @{ success = $true; booking = $updatedBooking; finance = $createdFinance }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $response.StatusCode = 404
                    $resObj = @{ success = $false; message = "Reserva no encontrada" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $resObj -Depth 5))
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/bookings/cancel" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())
                $bId = $body.bookingId
                $cancelledBooking = $null

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $b = $historyData.bookings | Where-Object { $_.id -eq $bId }
                    if ($b) {
                        $historyData.bookings = [System.Collections.ArrayList]@($historyData.bookings | Where-Object { $_.id -ne $bId })
                        $cancelledBooking = $b
                        Save-HistoryData
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
                if ($cancelledBooking) {
                    Broadcast-Event "BOOKING_DELETED" @{ id = $bId; booking = $cancelledBooking }
                    $resObj = @{ success = $true; id = $bId }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = $utf8NoBom.GetBytes($jsonStr)
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $resObj = @{ success = $false; message = "Reserva no encontrada o ya cancelada" }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = $utf8NoBom.GetBytes($jsonStr)
                    $response.StatusCode = 404
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/finances/create" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $concept = $body.concept
                $category = $body.category
                if ([string]::IsNullOrWhiteSpace($category)) { $category = "Tienda / Pro Shop" }
                $amount = [int]$body.amount
                $pm = $body.paymentMethod
                if ([string]::IsNullOrWhiteSpace($pm)) { $pm = "Efectivo en Mostrador" }
                $cliName = $body.clientName
                if ([string]::IsNullOrWhiteSpace($cliName)) { $cliName = "Cliente Mostrador" }

                $createdFinance = $null
                $clearedUser = $null
                $updatedBooking = $null

                [System.Threading.Monitor]::Enter($lockObj)
                try {
                    $finId = "FIN-" + (Get-Random -Minimum 1000 -Maximum 9999)
                    $createdFinance = @{
                        id = $finId
                        date = (Get-Date -Format "yyyy-MM-dd HH:mm")
                        concept = (Sanitize-Text $concept)
                        category = (Sanitize-Text $category)
                        amount = $amount
                        paymentMethod = (Sanitize-Text $pm)
                        clientName = (Sanitize-Text $cliName)
                        status = "Completado"
                    }
                    $financesData.Insert(0, $createdFinance)
                    Save-FinancesData

                    $cleanConceptLower = if ($concept) { (Sanitize-Text $concept).ToLower() } else { "" }
                    $cleanCatLower = if ($category) { (Sanitize-Text $category).ToLower() } else { "" }
                    $cleanCliNameLower = if ($cliName) { (Sanitize-Text $cliName).ToLower() } else { "" }

                    # Auto-clear user debt if category is Recuperacion de Adeudo or concept references debt
                    if ($cleanCatLower.Contains("adeudo") -or $cleanConceptLower.Contains("adeudo") -or $cleanConceptLower.Contains("deuda") -or $cleanConceptLower.Contains("no-show")) {
                        $u = $usersData | Where-Object { 
                            ($_.name -and ((Sanitize-Text $_.name).ToLower() -eq $cleanCliNameLower)) -or
                            ($_.phone -and $cleanCliNameLower.Contains(($_.phone -replace '\D','')))
                        } | Select-Object -First 1

                        if ($u) {
                            $u.hasDebt = $false
                            $u.debtAmount = 0
                            $u.debtReason = ""
                            $clearedUser = $u
                            Save-UsersData
                        }

                        $b = $bookingsData | Where-Object { 
                            ($_.clientName -and ((Sanitize-Text $_.clientName).ToLower() -eq $cleanCliNameLower)) -and 
                            ($_.attendance -like "*Deuda*" -or -not $_.paid)
                        } | Select-Object -First 1
                        if ($b) {
                            $b.paid = $true
                            $b.attendance = "Asistio y Pagado"
                            $updatedBooking = $b
                            Save-HistoryData
                        }
                    }
                } finally {
                    [System.Threading.Monitor]::Exit($lockObj)
                }

                $response.ContentType = "application/json; charset=utf-8"
                $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
                if ($createdFinance) {
                    Broadcast-Event "FINANCE_CREATED" @{ finance = $createdFinance }
                    if ($clearedUser) { Broadcast-Event "USER_UPDATED" @{ user = $clearedUser } }
                    if ($updatedBooking) { Broadcast-Event "BOOKING_UPDATED" @{ booking = $updatedBooking } }
                    $resObj = @{ success = $true; finance = $createdFinance; user = $clearedUser; booking = $updatedBooking }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = $utf8NoBom.GetBytes($jsonStr)
                    $response.StatusCode = 200
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $resObj = @{ success = $false; message = "Error al crear registro financiero" }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = $utf8NoBom.GetBytes($jsonStr)
                    $response.StatusCode = 400
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/cash/status" -and $request.HttpMethod -eq "GET") {
                $activeShift = $cashShiftsData | Where-Object { $_.status -eq "abierta" } | Select-Object -First 1
                $activeMovements = @()
                $cashIncomes = 0
                $cardIncomes = 0
                $manualEntradas = 0
                $manualSalidas = 0

                if ($activeShift) {
                    $shiftId = $activeShift.id
                    $openTimeStr = $activeShift.openTime
                    $activeMovements = $cashMovementsData | Where-Object { $_.shiftId -eq $shiftId }

                    foreach ($m in $activeMovements) {
                        if ($m.type -eq "entrada") { $manualEntradas += [double]$m.amount }
                        elseif ($m.type -eq "salida") { $manualSalidas += [double]$m.amount }
                    }

                    foreach ($f in $financesData) {
                        if ($f.date -and $f.date -ge $openTimeStr) {
                            $pmLower = if ($f.paymentMethod) { $f.paymentMethod.ToString().ToLower() } else { "" }
                            $amt = [double]$f.amount
                            if ($pmLower.Contains("efectivo")) {
                                $cashIncomes += $amt
                            } else {
                                $cardIncomes += $amt
                            }
                        }
                    }
                }

                $resObj = @{
                    success = $true
                    activeShift = $activeShift
                    movements = $activeMovements
                    cashIncomes = $cashIncomes
                    cardIncomes = $cardIncomes
                    manualEntradas = $manualEntradas
                    manualSalidas = $manualSalidas
                    expectedCash = if ($activeShift) { [double]$activeShift.initialAmount + $cashIncomes + $manualEntradas - $manualSalidas } else { 0 }
                }
                $json = ConvertTo-Json -InputObject $resObj -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            elseif ($path -eq "/api/cash/open" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $activeShift = $cashShiftsData | Where-Object { $_.status -eq "abierta" } | Select-Object -First 1
                if ($activeShift) {
                    $resObj = @{ success = $false; message = "Ya existe una caja abierta en el sistema." }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.StatusCode = 400
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $shiftId = "CSH-" + (Get-Random -Minimum 1000 -Maximum 9999)
                    $initAmt = if ($body.initialAmount) { [double]$body.initialAmount } else { 1000 }
                    $notes = if ($body.notes) { (Sanitize-Text $body.notes) } else { "Apertura de Turno Administrador" }

                    $newShift = @{
                        id = $shiftId
                        status = "abierta"
                        responsible = "Administrador Level Tacambaro"
                        initialAmount = $initAmt
                        openTime = (Get-Date -Format "yyyy-MM-dd HH:mm")
                        notes = $notes
                        closeTime = ""
                        physicalCash = 0
                        expectedCash = 0
                        difference = 0
                        cashIncomes = 0
                        cardIncomes = 0
                        manualEntradas = 0
                        manualSalidas = 0
                    }
                    $cashShiftsData.Insert(0, $newShift)
                    Save-CashShiftsData

                    Broadcast-Event "CASH_SHIFT_UPDATED" @{ shift = $newShift }
                    $resObj = @{ success = $true; shift = $newShift }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/cash/movement" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $activeShift = $cashShiftsData | Where-Object { $_.status -eq "abierta" } | Select-Object -First 1
                if (-not $activeShift) {
                    $resObj = @{ success = $false; message = "No hay una caja abierta para registrar movimientos." }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.StatusCode = 400
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $movId = "MOV-" + (Get-Random -Minimum 1000 -Maximum 9999)
                    $movType = if ($body.type -eq "salida") { "salida" } else { "entrada" }
                    $amt = [double]$body.amount
                    $concept = if ($body.concept) { (Sanitize-Text $body.concept) } else { "Movimiento Manual" }
                    $category = if ($body.category) { (Sanitize-Text $body.category) } else { "General" }

                    $newMov = @{
                        id = $movId
                        shiftId = $activeShift.id
                        type = $movType
                        amount = $amt
                        concept = $concept
                        category = $category
                        timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm")
                        responsible = "Administrador Level Tacambaro"
                    }
                    $cashMovementsData.Insert(0, $newMov)
                    Save-CashMovementsData

                    Broadcast-Event "CASH_MOVEMENT_ADDED" @{ movement = $newMov }
                    $resObj = @{ success = $true; movement = $newMov }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/cash/close" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = ConvertFrom-Json ($reader.ReadToEnd())

                $activeShift = $cashShiftsData | Where-Object { $_.status -eq "abierta" } | Select-Object -First 1
                if (-not $activeShift) {
                    $resObj = @{ success = $false; message = "No hay una caja abierta para cerrar." }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.StatusCode = 400
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else {
                    $shiftId = $activeShift.id
                    $openTimeStr = $activeShift.openTime
                    $physCash = [double]$body.physicalCash
                    $notes = if ($body.notes) { (Sanitize-Text $body.notes) } else { "Corte de Caja Administrador" }

                    $cashIncomes = 0
                    $cardIncomes = 0
                    $manualEntradas = 0
                    $manualSalidas = 0

                    $shiftMovements = $cashMovementsData | Where-Object { $_.shiftId -eq $shiftId }
                    foreach ($m in $shiftMovements) {
                        if ($m.type -eq "entrada") { $manualEntradas += [double]$m.amount }
                        elseif ($m.type -eq "salida") { $manualSalidas += [double]$m.amount }
                    }

                    foreach ($f in $financesData) {
                        if ($f.date -and $f.date -ge $openTimeStr) {
                            $pmLower = if ($f.paymentMethod) { $f.paymentMethod.ToString().ToLower() } else { "" }
                            $amt = [double]$f.amount
                            if ($pmLower.Contains("efectivo")) {
                                $cashIncomes += $amt
                            } else {
                                $cardIncomes += $amt
                            }
                        }
                    }

                    $initAmt = [double]$activeShift.initialAmount
                    $expectedCash = $initAmt + $cashIncomes + $manualEntradas - $manualSalidas
                    $difference = $physCash - $expectedCash

                    $activeShift.status = "cerrada"
                    $activeShift.closeTime = (Get-Date -Format "yyyy-MM-dd HH:mm")
                    $activeShift.physicalCash = $physCash
                    $activeShift.expectedCash = $expectedCash
                    $activeShift.difference = $difference
                    $activeShift.cashIncomes = $cashIncomes
                    $activeShift.cardIncomes = $cardIncomes
                    $activeShift.manualEntradas = $manualEntradas
                    $activeShift.manualSalidas = $manualSalidas
                    $activeShift.notes = $notes

                    Save-CashShiftsData

                    Broadcast-Event "CASH_SHIFT_CLOSED" @{ shift = $activeShift }
                    $resObj = @{ success = $true; shift = $activeShift }
                    $jsonStr = ConvertTo-Json -InputObject $resObj -Depth 5
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($path -eq "/api/cash/history" -and $request.HttpMethod -eq "GET") {
                $json = ConvertTo-Json -InputObject $cashShiftsData -Depth 5
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            else {
                $targetRoot = $webRoot
                $relativePath = $path.TrimStart('/')

                if ($path.StartsWith("/admin/")) {
                    $targetRoot = $adminRoot
                    $relativePath = $path.Substring(7).TrimStart('/')
                } elseif ($path -eq "/admin") {
                    $response.Redirect("/admin/")
                    $response.OutputStream.Close()
                    continue
                }

                if ([string]::IsNullOrWhiteSpace($relativePath)) {
                    $relativePath = "index.html"
                }

                $filePath = Join-Path $targetRoot $relativePath

                if (Test-Path $filePath -PathType Leaf) {
                    $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    
                    switch ($ext) {
                        ".html" { $response.ContentType = "text/html; charset=utf-8" }
                        ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                        ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                        ".jpg"  { $response.ContentType = "image/jpeg" }
                        ".jpeg" { $response.ContentType = "image/jpeg" }
                        ".png"  { $response.ContentType = "image/png" }
                        ".svg"  { $response.ContentType = "image/svg+xml" }
                        default { $response.ContentType = "application/octet-stream" }
                    }

                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $response.StatusCode = 404
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
        } catch {
            Write-Host "Error request: $_" -ForegroundColor Yellow
        } finally {
            if ($path -ne "/api/events") {
                try { $response.OutputStream.Close() } catch {}
                try { $response.Close() } catch {}
            }
        }
    }
} catch {
    Write-Host "Error servidor: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) { $listener.Stop() }
}
