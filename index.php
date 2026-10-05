<?php
// Hostinger 100% Bidirectional Router & API Handler for Level App & Web Admin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$path = substr($requestUri, strlen($scriptName));
$path = '/' . ltrim($path, '/');

$dataDir = __DIR__ . '/data';
if ($path === '/favicon.ico' || parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) === '/favicon.ico') {
    $fav = __DIR__ . '/favicon.ico';
    if (!file_exists($fav)) { $fav = __DIR__ . '/web_admin/favicon.ico'; }
    if (file_exists($fav)) {
        header("Content-Type: image/x-icon");
        readfile($fav);
        exit();
    }
}

function saveJsonFile($file, $data) {
    global $dataDir;
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    $filePath = $dataDir . '/' . $file;
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getJsonFile($file) {
    global $dataDir;
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    $filePath = $dataDir . '/' . $file;
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content);
        $decoded = json_decode($content, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    // Default Auto-Initialization Data
    if ($file === 'cancelled_bookings.json') {
        $default = [];
        saveJsonFile($file, $default);
        return $default;
    }
    if ($file === 'cash_shifts.json') {
        $default = [
            [
                "id" => "CSH-" . rand(1000, 9999),
                "status" => "abierta",
                "openTime" => date('Y-m-d 08:00:00'),
                "responsible" => "Administrador Level Tacambaro",
                "initialAmount" => 500,
                "notes" => "Turno Activo"
            ]
        ];
        saveJsonFile($file, $default);
        return $default;
    }
    if ($file === 'cash_movements.json') {
        $default = [];
        saveJsonFile($file, $default);
        return $default;
    }
    if ($file === 'users.json') {
        $default = [
            ["id"=>"USR-3511","username"=>"admin2","password"=>"123456","tempPassword"=>"TAC-1866","name"=>"Administrador 2","phone"=>"4591161880","role"=>"Cliente","status"=>"Activo (Password Personalizada)","mustChangePassword"=>false],
            ["id"=>"USR-6229","username"=>"arlette","password"=>"123456","tempPassword"=>"","name"=>"Arlette Saucedo","phone"=>"4591161880","role"=>"Administrador","status"=>"Activo (Password Personalizada)","mustChangePassword"=>false],
            ["id"=>"USR-1001","username"=>"cpalacios","password"=>"123456","tempPassword"=>"","name"=>"Carlos Palacios","phone"=>"45911161880","role"=>"Cliente","status"=>"Activo (Password Personalizada)","mustChangePassword"=>false],
            ["id"=>"USR-1007","username"=>"admin","password"=>"123456","tempPassword"=>"ADMIN-TAC","name"=>"Administrador Level Tacambaro","phone"=>"4590001122","role"=>"Administrador","status"=>"Activo (Administrador)","mustChangePassword"=>false]
        ];
        saveJsonFile($file, $default);
        return $default;
    }
    if ($file === 'courts.json') {
        $default = [
            ["id"=>"c1","name"=>"Cancha 1: Padel Cristal Pro (Azul)","category"=>"Padel Cristal Pro","location"=>"Tacambaro, Michoacan","price"=>300,"rating"=>4.9,"image"=>"assets/images/cancha_padel_1.jpg","slots"=>["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],"slotStatuses"=>["13:00"=>"booked","19:00"=>"booked","20:00"=>"booked"]],
            ["id"=>"c2","name"=>"Cancha 2: Padel Panoramica VIP (Verde)","category"=>"Padel Panoramica VIP","location"=>"Tacambaro, Michoacan","price"=>300,"rating"=>4.8,"image"=>"assets/images/cancha_padel_2.jpg","slots"=>["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],"slotStatuses"=>["18:00"=>"booked","21:00"=>"booked"]]
        ];
        saveJsonFile($file, $default);
        return $default;
    }
    if ($file === 'bookings.json') {
        $default = [
            ["id"=>"BKG-101","courtId"=>"c1","courtName"=>"Cancha 1: Padel Cristal Pro (Azul)","date"=>"2026-09-24","timeSlot"=>"19:00","totalPrice"=>300,"clientName"=>"Carlos Palacios","clientPhone"=>"45911161880","paymentMethod"=>"Efectivo","statusRaw"=>"Confirmada","paid"=>true]
        ];
        saveJsonFile($file, $default);
        return $default;
    }
    if ($file === 'history.json') {
        $default = [
            "name" => "Level",
            "address" => "Tacambaro, Michoacan Mexico",
            "phone" => "459 123 45 67",
            "description" => "Level Tacambaro nacio con la vision de consolidar el primer centro deportivo de padel de alto nivel en Tacambaro, Michoacan.",
            "logoUrl" => "assets/images/logo.jpeg",
            "coverUrl" => "assets/images/cancha_padel_1.jpg",
            "gallery" => ["assets/images/cancha_padel_1.jpg", "assets/images/cancha_padel_2.jpg"]
        ];
        saveJsonFile($file, $default);
        return $default;
    }

    return [];
}

function findCaseInsensitiveFile($dir, $relativePath) {
    $target = rtrim($dir, '/') . '/' . ltrim($relativePath, '/');
    if (file_exists($target) && !is_dir($target)) return $target;

    $dirPath = dirname($target);
    $baseName = strtolower(basename($target));
    if (is_dir($dirPath)) {
        $files = scandir($dirPath);
        if ($files !== false) {
            foreach ($files as $f) {
                if (strtolower($f) === $baseName) {
                    $candidate = $dirPath . '/' . $f;
                    if (file_exists($candidate) && !is_dir($candidate)) {
                        return $candidate;
                    }
                }
            }
        }
    }
    return null;
}

function recordBookingFinanceAndCash($b, $paymentMethod = null) {
    if (!$b) return;
    $bId = $b['id'] ?? '';
    $pm = $paymentMethod ?: ($b['paymentMethod'] ?? 'Efectivo en Mostrador');
    $amt = floatval($b['price'] ?? 300);
    $cli = $b['clientName'] ?? 'Cliente Mostrador';
    $timeSlot = $b['timeSlot'] ?? '';

    $finances = getJsonFile('finances.json');
    $exists = false;
    foreach ($finances as $f) {
        if (!empty($bId) && strpos($f['concept'] ?? '', $bId) !== false) {
            $exists = true;
            break;
        }
    }

    if (!$exists) {
        $finId = "FIN-" . rand(1000, 9999);
        $newFin = [
            "id" => $finId,
            "concept" => "Pago Reserva $bId ($timeSlot)",
            "amount" => $amt,
            "category" => "Cancha",
            "paymentMethod" => $pm,
            "clientName" => $cli,
            "date" => date('Y-m-d H:i:s'),
            "status" => "Completado"
        ];
        array_unshift($finances, $newFin);
        saveJsonFile('finances.json', $finances);

        $shifts = getJsonFile('cash_shifts.json');
        $activeShift = null;
        foreach ($shifts as &$s) {
            if (($s['status'] ?? '') === 'abierta') {
                $activeShift = &$s;
                break;
            }
        }
        if ($activeShift) {
            $pmLower = strtolower($pm);
            if (strpos($pmLower, 'tarjeta') !== false || strpos($pmLower, 'spei') !== false || strpos($pmLower, 'transferencia') !== false) {
                $activeShift['cardIncomes'] = (float)($activeShift['cardIncomes'] ?? 0) + $amt;
            } else {
                $activeShift['cashIncomes'] = (float)($activeShift['cashIncomes'] ?? 0) + $amt;
                $activeShift['expectedCash'] = (float)($activeShift['expectedCash'] ?? 0) + $amt;
            }
            $activeShift['totalSales'] = (float)($activeShift['totalSales'] ?? 0) + $amt;
            saveJsonFile('cash_shifts.json', $shifts);
        }
    }
}

// 1. Route API Calls
if (strpos($path, '/api') !== false) {
    header('Content-Type: application/json; charset=utf-8');
    $apiPos = strpos($path, '/api');
    $subPath = substr($path, $apiPos + 4);
    if ($subPath === '' || $subPath === '/') {
        echo json_encode(["status" => "online", "message" => "Level API 100% Operational"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    header("Content-Type: application/json; charset=utf-8");
    $subPath = substr($path, 4);

    // COURTS
    if ($subPath === '/courts' || $subPath === '/courts/') {
        echo json_encode(getJsonFile('courts.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/courts/create' || $subPath === '/courts/create/' || $subPath === '/courts/update' || $subPath === '/courts/update/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $courts = getJsonFile('courts.json');
        if (!empty($body['id'])) {
            foreach ($courts as &$c) {
                if ($c['id'] === $body['id']) {
                    $c = array_merge($c, $body);
                    break;
                }
            }
        } else {
            $body['id'] = 'c' . (count($courts) + 1);
            $courts[] = $body;
        }
        saveJsonFile('courts.json', $courts);
        echo json_encode(["success" => true, "court" => $body], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/courts/delete' || $subPath === '/courts/delete/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $courts = getJsonFile('courts.json');
        $courts = array_values(array_filter($courts, function($c) use ($body) { return $c['id'] !== ($body['id'] ?? ''); }));
        saveJsonFile('courts.json', $courts);
        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        exit();
    }

    elseif ($subPath === '/bookings/cancelled' || $subPath === '/bookings/cancelled/') {
        $cancelledList = getJsonFile('cancelled_bookings.json');
        $allBookings = getJsonFile('bookings.json');
        $ids = array();
        foreach ($cancelledList as $c) { if (!empty($c['id'])) $ids[$c['id']] = true; }
        foreach ($allBookings as $b) {
            $st = strtolower($b['status'] ?? ($b['statusRaw'] ?? ''));
            if (($st === 'cancelada' || $st === 'cancelled') && empty($ids[$b['id']])) {
                $isBPaid = !empty($b['paid']) || strtolower($b['statusRaw'] ?? '') === 'pagado';
                $refStatus = $isBPaid ? 'Pendiente de Devolución' : 'Sin Pago Previo (No Aplica)';
                $cancelRecord = array_merge($b, [
                    'status' => 'Cancelada',
                    'cancelReason' => $b['cancelReason'] ?? 'Cancelación de reserva',
                    'cancelledAt' => $b['cancelledAt'] ?? date('Y-m-d H:i:s'),
                    'refundStatus' => $b['refundStatus'] ?? $refStatus,
                    'paid' => $isBPaid
                ]);
                $cancelledList[] = $cancelRecord;
                $ids[$b['id']] = true;
            }
        }
        echo json_encode($cancelledList, JSON_UNESCAPED_UNICODE);
        exit();
    }

    // BOOKINGS & RESERVATIONS (App & Web Sync)
    elseif ($subPath === '/bookings' || $subPath === '/bookings/') {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true);
            $bookings = getJsonFile('bookings.json');
            $newId = "BKG-" . time();
            $body['id'] = $newId;
            $body['createdAt'] = date('Y-m-d H:i:s');
            array_unshift($bookings, $body);
            saveJsonFile('bookings.json', $bookings);
            echo json_encode(["success" => true, "booking" => $body], JSON_UNESCAPED_UNICODE);
            exit();
        }
        echo json_encode(getJsonFile('bookings.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/reserve' || $subPath === '/reserve/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $courtId = $body['courtId'] ?? '';
        $timeSlot = $body['timeSlot'] ?? '';
        $clientName = $body['clientName'] ?? 'Jugador Tacambaro';
        $clientPhone = $body['clientPhone'] ?? 'Sin teléfono';
        $paymentMethod = $body['paymentMethod'] ?? 'Efectivo en Mostrador';
        $selDate = $body['selectedDate'] ?? date('Y-m-d');
        $durationHours = max(1, (int)($body['durationHours'] ?? 1));

        $cleanP = preg_replace('/\D/', '', $clientPhone);
        $cliNameLower = strtolower(trim($clientName));

        // Check user debt or unpaid booking
        $users = getJsonFile('users.json');
        $debtUser = null;
        foreach ($users as $u) {
            $uP = preg_replace('/\D/', '', $u['phone'] ?? '');
            $uN = strtolower(trim($u['name'] ?? ''));
            if (($uP && $cleanP && $uP === $cleanP) || ($uN && $cliNameLower && $uN === $cliNameLower)) {
                if (!empty($u['hasDebt'])) { $debtUser = $u; break; }
            }
        }

        $bookings = getJsonFile('bookings.json');
        $unpaidBooking = null;
        foreach ($bookings as $b) {
            $isPaid = !empty($b['paid']) || ($b['status'] ?? '') === 'Pagado';
            $isNoShow = strpos(strtolower($b['attendance'] ?? ''), 'no') !== false || strpos(strtolower($b['attendance'] ?? ''), 'deuda') !== false;
            $bP = preg_replace('/\D/', '', $b['clientPhone'] ?? '');
            $bN = strtolower(trim($b['clientName'] ?? ''));
            if (($isNoShow || !$isPaid) && (($cleanP && $bP === $cleanP) || ($cliNameLower && $bN === $cliNameLower))) {
                $unpaidBooking = $b;
                break;
            }
        }

        if (empty($body['isAdmin']) && ($debtUser || $unpaidBooking)) {
            $amtVal = $debtUser['debtAmount'] ?? ($unpaidBooking['price'] ?? 300);
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "blocked" => true,
                "message" => "Reserva Bloqueada: Tienes un adeudo pendiente o inasistencia no liquidada ($amtVal.00 MXN). Por favor liquida tu adeudo con el administrador para poder realizar nuevas reservaciones."
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // Duplicate slot check
        foreach ($bookings as $b) {
            if (($b['courtId'] ?? '') === $courtId && substr($b['date'] ?? '', 0, 10) === $selDate && ($b['status'] ?? '') !== 'Cancelada') {
                if (!empty($b['timeSlot']) && strpos($b['timeSlot'], $timeSlot) !== false) {
                    http_response_code(409);
                    echo json_encode([
                        "success" => false,
                        "message" => "Uno o varios horarios seleccionados ya se encuentran ocupados para esta fecha."
                    ], JSON_UNESCAPED_UNICODE);
                    exit();
                }
            }
        }

        $pmLower = strtolower($paymentMethod);
        $initStatus = 'Confirmada';
        $isPaid = !empty($body['paid']);

        if (strpos($pmLower, 'tarjeta') !== false || strpos($pmLower, 'transferencia') !== false || strpos($pmLower, 'deposito') !== false || !empty($body['receiptImage'])) {
            $initStatus = 'Pendiente de Verificación';
            $isPaid = false;
        }

        $newId = "RES-" . rand(1000, 9999);
        $createdBooking = [
            "id" => $newId,
            "courtId" => $courtId,
            "courtName" => $body['courtName'] ?? "Cancha",
            "location" => "Tacambaro, Michoacan",
            "date" => $selDate,
            "timeSlot" => "$timeSlot ($durationHours hrs)",
            "price" => 300 * $durationHours,
            "paymentMethod" => $paymentMethod,
            "clientName" => $clientName,
            "clientPhone" => $clientPhone,
            "status" => $initStatus,
            "attendance" => "Pendiente",
            "paid" => $isPaid,
            "receiptImage" => $body['receiptImage'] ?? "",
            "referenceCode" => $body['referenceCode'] ?? "",
            "bookingType" => $body['bookingType'] ?? "renta"
        ];

        array_unshift($bookings, $createdBooking);
        saveJsonFile('bookings.json', $bookings);
        echo json_encode(["success" => true, "id" => $newId, "booking" => $createdBooking], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/bookings/cancel' || $subPath === '/bookings/cancel/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $bId = $body['bookingId'] ?? ($body['id'] ?? '');

        $bookings = getJsonFile('bookings.json');
        $cancelledBookings = getJsonFile('cancelled_bookings.json');
        $targetBooking = null;

        foreach ($bookings as &$b) {
            if ($b['id'] === $bId) {
                $b['status'] = 'Cancelada';
                $targetBooking = $b;
                break;
            }
        }

        if ($targetBooking) {
            saveJsonFile('bookings.json', $bookings);
            $isBPaid = !empty($targetBooking['paid']) || strtolower($targetBooking['statusRaw'] ?? '') === 'pagado';
            $refStatus = $isBPaid ? 'Pendiente de Devolución' : 'Sin Pago Previo (No Aplica)';

            $cancelRecord = array_merge($targetBooking, [
                'status' => 'Cancelada',
                'cancelReason' => $body['cancelReason'] ?? 'Cancelación solicitada desde App',
                'cancelledAt' => date('Y-m-d H:i:s'),
                'refundStatus' => $refStatus,
                'paid' => $isBPaid
            ]);

            $existsInCancel = false;
            foreach ($cancelledBookings as &$cb) {
                if (($cb['id'] ?? '') === $bId) {
                    $cb = array_merge($cb, $cancelRecord);
                    $existsInCancel = true;
                    break;
                }
            }
            if (!$existsInCancel) {
                array_unshift($cancelledBookings, $cancelRecord);
            }
            saveJsonFile('cancelled_bookings.json', $cancelledBookings);

            echo json_encode(["success" => true, "id" => $bId, "message" => "Reserva cancelada exitosamente.", "booking" => $targetBooking], JSON_UNESCAPED_UNICODE);
            exit();
        }

        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Reserva no encontrada."], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/approve-payment' || $subPath === '/approve-payment/' || $subPath === '/bookings/approve-payment' || $subPath === '/bookings/approve-payment/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $bId = $body['bookingId'] ?? '';

        $bookings = getJsonFile('bookings.json');
        $updatedBooking = null;

        foreach ($bookings as &$b) {
            if ($b['id'] === $bId) {
                $b['status'] = 'Confirmada';
                $b['paid'] = true;
                $b['rejectionReason'] = '';
                $updatedBooking = $b;
                recordBookingFinanceAndCash($b, 'Transferencia Bancaria');
                break;
            }
        }

        saveJsonFile('bookings.json', $bookings);
        echo json_encode(["success" => true, "booking" => $updatedBooking], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/reject-payment' || $subPath === '/reject-payment/' || $subPath === '/bookings/reject-payment' || $subPath === '/bookings/reject-payment/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $bId = $body['bookingId'] ?? '';
        $reason = $body['reason'] ?? 'El comprobante adjunto no es válido o no coincide con la transferencia esperada.';

        $bookings = getJsonFile('bookings.json');
        $updatedBooking = null;

        foreach ($bookings as &$b) {
            if ($b['id'] === $bId) {
                $b['status'] = 'Pago Rechazado';
                $b['paid'] = false;
                $b['rejectionReason'] = $reason;
                $updatedBooking = $b;
                break;
            }
        }

        saveJsonFile('bookings.json', $bookings);
        echo json_encode(["success" => true, "booking" => $updatedBooking], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/bookings/refund' || $subPath === '/bookings/refund/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $bId = $body['bookingId'] ?? '';
        $method = strtolower($body['method'] ?? 'efectivo');

        $cancelledBookings = getJsonFile('cancelled_bookings.json');
        $target = null;

        foreach ($cancelledBookings as &$c) {
            if ($c['id'] === $bId) {
                $c['refundStatus'] = "Devuelto ($method)";
                $target = $c;
                break;
            }
        }

        if ($target) {
            saveJsonFile('cancelled_bookings.json', $cancelledBookings);
            $price = (float)($target['price'] ?? 300);
            $clientName = $target['clientName'] ?? 'Cliente App';

            $shifts = getJsonFile('cash_shifts.json');
            $activeShift = null;
            foreach ($shifts as &$s) {
                if (($s['status'] ?? '') === 'abierta') { $activeShift = &$s; break; }
            }

            $movements = getJsonFile('cash_movements.json');
            $finances = getJsonFile('finances.json');

            $pmText = ($method === 'efectivo' || strpos($method, 'efectivo') !== false) ? 'Efectivo' : 'Transferencia';
            $conceptText = "Devolución Reserva " . $bId . " (" . $clientName . ")";

            $fin = [
                "id" => "FIN-" . rand(1000, 9999),
                "type" => "egreso",
                "concept" => $conceptText,
                "amount" => $price,
                "category" => "Devolución Cancelación",
                "clientName" => $clientName,
                "date" => date('Y-m-d H:i:s'),
                "paymentMethod" => $pmText,
                "status" => "Completado"
            ];
            array_unshift($finances, $fin);
            saveJsonFile('finances.json', $finances);

            if ($pmText === 'Efectivo') {
                $mov = [
                    "id" => "MOV-" . rand(1000, 9999),
                    "shiftId" => $activeShift ? $activeShift['id'] : "CSH-MANUAL",
                    "timestamp" => date('Y-m-d H:i:s'),
                    "type" => "salida",
                    "category" => "Devolución Cancelación",
                    "concept" => $conceptText,
                    "amount" => $price,
                    "method" => "Efectivo",
                    "responsible" => "Administrador Level Tacambaro",
                    "origin" => "finance"
                ];
                array_unshift($movements, $mov);
                saveJsonFile('cash_movements.json', $movements);

                if ($activeShift) {
                    $activeShift['totalWithdrawals'] = (float)($activeShift['totalWithdrawals'] ?? 0) + $price;
                    $activeShift['expectedCash'] = (float)($activeShift['expectedCash'] ?? 0) - $price;
                    saveJsonFile('cash_shifts.json', $shifts);
                }
            }

            echo json_encode(["success" => true, "message" => "Devolución procesada correctamente.", "booking" => $target], JSON_UNESCAPED_UNICODE);
            exit();
        }

        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Reserva cancelada no encontrada."], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/bookings/mark-attendance' || $subPath === '/bookings/mark-attendance/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $bId = $body['bookingId'] ?? '';
        $att = $body['attendance'] ?? '';

        $bookings = getJsonFile('bookings.json');
        $users = getJsonFile('users.json');
        $updatedBooking = null;
        $affectedUser = null;

        foreach ($bookings as &$b) {
            if ($b['id'] === $bId) {
                $cleanP = preg_replace('/\D/', '', $b['clientPhone'] ?? '');
                $cliNameLower = strtolower(trim($b['clientName'] ?? ''));

                if (strpos(strtolower($att), 'no') !== false) {
                    $b['attendance'] = "No Asistio (Deuda)";
                    $b['paid'] = false;

                    foreach ($users as &$u) {
                        $uP = preg_replace('/\D/', '', $u['phone'] ?? '');
                        $uN = strtolower(trim($u['name'] ?? ''));
                        if (($uP && $cleanP && $uP === $cleanP) || ($uN && $cliNameLower && $uN === $cliNameLower)) {
                            $u['hasDebt'] = true;
                            $u['debtAmount'] = $b['price'] ?? 300;
                            $u['debtReason'] = "Inasistencia a reserva " . $b['id'];
                            $affectedUser = $u;
                            break;
                        }
                    }
                    saveJsonFile('users.json', $users);
                } else {
                    $b['attendance'] = "Asistio y Pagado";
                    $b['paid'] = true;

                    foreach ($users as &$u) {
                        $uP = preg_replace('/\D/', '', $u['phone'] ?? '');
                        $uN = strtolower(trim($u['name'] ?? ''));
                        if (($uP && $cleanP && $uP === $cleanP) || ($uN && $cliNameLower && $uN === $cliNameLower)) {
                            if (!empty($u['hasDebt'])) {
                                $u['hasDebt'] = false;
                                $u['debtAmount'] = 0;
                                $u['debtReason'] = "";
                                $affectedUser = $u;
                                break;
                            }
                        }
                    }
                    saveJsonFile('users.json', $users);
                    recordBookingFinanceAndCash($b, $b['paymentMethod'] ?? 'Efectivo');
                }
                $updatedBooking = $b;
                break;
            }
        }

        saveJsonFile('bookings.json', $bookings);
        echo json_encode(["success" => true, "booking" => $updatedBooking, "user" => $affectedUser], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/bookings/mark-paid' || $subPath === '/bookings/mark-paid/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $bId = $body['bookingId'] ?? '';
        $pm = $body['paymentMethod'] ?? 'Efectivo en Mostrador';

        $bookings = getJsonFile('bookings.json');
        $users = getJsonFile('users.json');
        $updatedBooking = null;
        $clearedUser = null;

        foreach ($bookings as &$b) {
            if ($b['id'] === $bId) {
                $b['paid'] = true;
                $b['paymentMethod'] = $pm;
                if (strpos(strtolower($b['attendance'] ?? ''), 'no') !== false) {
                    $b['attendance'] = "Asistio y Pagado";
                } else {
                    $b['attendance'] = "Asistio";
                }
                $updatedBooking = $b;

                $cleanP = preg_replace('/\D/', '', $b['clientPhone'] ?? '');
                $cliNameLower = strtolower(trim($b['clientName'] ?? ''));
                foreach ($users as &$u) {
                    $uP = preg_replace('/\D/', '', $u['phone'] ?? '');
                    $uN = strtolower(trim($u['name'] ?? ''));
                    if (($uP && $cleanP && $uP === $cleanP) || ($uN && $cliNameLower && $uN === $cliNameLower)) {
                        $u['hasDebt'] = false;
                        $u['debtAmount'] = 0;
                        $u['debtReason'] = "";
                        $clearedUser = $u;
                        break;
                    }
                }
                saveJsonFile('users.json', $users);

                recordBookingFinanceAndCash($b, $pm);
                break;
            }
        }

        saveJsonFile('bookings.json', $bookings);
        echo json_encode(["success" => true, "booking" => $updatedBooking, "user" => $clearedUser], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // PRODUCTS
    elseif ($subPath === '/products' || $subPath === '/products/') {
        echo json_encode(getJsonFile('products.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/products/create' || $subPath === '/products/create/' || $subPath === '/products/update' || $subPath === '/products/update/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $products = getJsonFile('products.json');
        $updated = false;
        if (!empty($body['id'])) {
            foreach ($products as &$p) {
                if ($p['id'] === $body['id']) {
                    $p = array_merge($p, $body);
                    $updated = true;
                    break;
                }
            }
        }
        if (!$updated) {
            $body['id'] = 'PRD-' . time();
            array_unshift($products, $body);
        }
        saveJsonFile('products.json', $products);
        echo json_encode(["success" => true, "product" => $body], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/products/sell' || $subPath === '/products/sell/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $pId = $body['id'] ?? ($body['productId'] ?? '');
        $qty = intval($body['quantity'] ?? ($body['qty'] ?? 1));
        if ($qty <= 0) $qty = 1;
        $pm = $body['paymentMethod'] ?? 'Efectivo';

        $products = getJsonFile('products.json');
        $soldProduct = null;
        foreach ($products as &$p) {
            if (($p['id'] ?? '') === $pId) {
                $currentStock = intval($p['stock'] ?? 100);
                $p['stock'] = max(0, $currentStock - $qty);
                $soldProduct = $p;
                break;
            }
        }
        saveJsonFile('products.json', $products);

        $unitPrice = floatval($soldProduct['price'] ?? 0);
        $totalAmt = $unitPrice * $qty;
        $prodName = $soldProduct['name'] ?? 'Producto TPV';

        $finances = getJsonFile('finances.json');
        $newFinance = [
            "id" => "FIN-" . rand(1000, 9999),
            "date" => date('Y-m-d H:i:s'),
            "clientName" => "Cliente Mostrador",
            "concept" => "Venta TPV: " . $prodName . " (" . $qty . "x)",
            "category" => "Tienda",
            "paymentMethod" => $pm,
            "amount" => $totalAmt,
            "status" => "Completado"
        ];
        array_unshift($finances, $newFinance);
        saveJsonFile('finances.json', $finances);

        if (strtolower($pm) === 'efectivo' || strpos(strtolower($pm), 'efectivo') !== false) {
            $cashMovements = getJsonFile('cash_movements.json');
            $cashShifts = getJsonFile('cash_shifts.json');
            $activeShiftId = null;
            foreach ($cashShifts as $cs) {
                if (($cs['status'] ?? '') === 'abierta') {
                    $activeShiftId = $cs['id'];
                    break;
                }
            }
            if ($activeShiftId) {
                $mov = [
                    "id" => "MOV-" . rand(1000, 9999),
                    "shiftId" => $activeShiftId,
                    "type" => "entrada",
                    "category" => "Tienda",
                    "concept" => "Venta TPV: " . $prodName,
                    "amount" => $totalAmt,
                    "responsible" => "Administrador Level Tacambaro",
                    "timestamp" => date('Y-m-d H:i:s'),
                    "origin" => "finance"
                ];
                array_unshift($cashMovements, $mov);
                saveJsonFile('cash_movements.json', $cashMovements);
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "Venta realizada exitosamente.",
            "product" => $soldProduct,
            "finance" => $newFinance
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    elseif ($subPath === '/products/delete' || $subPath === '/products/delete/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $products = getJsonFile('products.json');
        $products = array_values(array_filter($products, function($p) use ($body) { return $p['id'] !== ($body['id'] ?? ''); }));
        saveJsonFile('products.json', $products);
        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // TOURNAMENTS & REGISTRATION
    elseif ($subPath === '/tournaments' || $subPath === '/tournaments/') {
        echo json_encode(getJsonFile('tournaments.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/tournaments/register' || $subPath === '/tournaments/register/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $tId = $body['tournamentId'] ?? ($body['id'] ?? '');
        $tournaments = getJsonFile('tournaments.json');
        $updatedTournament = null;
        foreach ($tournaments as &$t) {
            $matchId = $t['id'] ?? '';
            if (empty($tId) || $matchId === $tId || str_replace('TOURN-', '', $matchId) === str_replace('TOURN-', '', $tId)) {
                if (!isset($t['teams'])) $t['teams'] = [];
                $teamName = $body['teamName'] ?? $body['name'] ?? 'Pareja Registrada';
                $t['teams'][] = [
                    "teamName" => $teamName,
                    "players" => $body['players'] ?? $body['participants'] ?? '',
                    "registeredAt" => date('Y-m-d H:i:s')
                ];
                $t['registeredTeams'] = count($t['teams']);
                $updatedTournament = $t;
                break;
            }
        }
        saveJsonFile('tournaments.json', $tournaments);
        echo json_encode(["success" => true, "message" => "Registro al torneo exitoso.", "tournament" => $updatedTournament], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/tournaments/create' || $subPath === '/tournaments/create/' || $subPath === '/tournaments/update' || $subPath === '/tournaments/update/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $tournaments = getJsonFile('tournaments.json');
        $updated = false;
        if (!empty($body['id'])) {
            foreach ($tournaments as &$t) {
                if ($t['id'] === $body['id']) {
                    $t = array_merge($t, $body);
                    $updated = true;
                    break;
                }
            }
        }
        if (!$updated) {
            $body['id'] = 'TRN-' . time();
            array_unshift($tournaments, $body);
        }
        saveJsonFile('tournaments.json', $tournaments);
        echo json_encode(["success" => true, "tournament" => $body], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // HISTORY & CLUB INFO (QUIENES SOMOS)
    elseif ($subPath === '/history' || $subPath === '/history/') {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true);
            $history = getJsonFile('history.json');
            $updatedHistory = array_merge($history, $body);
            saveJsonFile('history.json', $updatedHistory);
            echo json_encode(["success" => true, "history" => $updatedHistory], JSON_UNESCAPED_UNICODE);
            exit();
        }
        echo json_encode(getJsonFile('history.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/history/update' || $subPath === '/history/update/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $history = getJsonFile('history.json');
        $updatedHistory = array_merge($history, $body);
        saveJsonFile('history.json', $updatedHistory);
        echo json_encode(["success" => true, "history" => $updatedHistory], JSON_UNESCAPED_UNICODE);
        exit();
    }

        // CASH SHIFTS & MOVEMENTS API
    elseif ($subPath === '/cash/status' || $subPath === '/cash/status/') {
        $cashShifts = getJsonFile('cash_shifts.json');
        $cashMovements = getJsonFile('cash_movements.json');
        $finances = getJsonFile('finances.json');

        $activeShift = null;
        foreach ($cashShifts as $s) {
            if (($s['status'] ?? '') === 'abierta') {
                $activeShift = $s;
                break;
            }
        }

        $activeMovements = [];
        $cashIncomes = 0;
        $cardIncomes = 0;
        $manualEntradas = 0;
        $manualSalidas = 0;

        if ($activeShift) {
            $shiftId = $activeShift['id'];
            $openTime = $activeShift['openTime'] ?? '';

            foreach ($cashMovements as $m) {
                if (($m['shiftId'] ?? '') === $shiftId) {
                    $activeMovements[] = $m;
                    $mConcept = strtolower($m['concept'] ?? '');
                    if (empty($m['origin']) || $m['origin'] !== 'finance') {
                        if (strpos($mConcept, 'venta tpv') === false && strpos($mConcept, 'pago reserva') === false) {
                            $amt = floatval($m['amount'] ?? 0);
                            if (($m['type'] ?? '') === 'entrada') { $manualEntradas += $amt; }
                            elseif (($m['type'] ?? '') === 'salida') { $manualSalidas += $amt; }
                        }
                    }
                }
            }

            foreach ($finances as $f) {
                $fDate = $f['date'] ?? '';
                if ($fDate && $fDate >= $openTime) {
                    $pm = strtolower($f['paymentMethod'] ?? 'efectivo');
                    $amt = floatval($f['amount'] ?? 0);
                    if (strpos($pm, 'tarjeta') !== false || strpos($pm, 'spei') !== false || strpos($pm, 'transferencia') !== false) {
                        $cardIncomes += $amt;
                    } else {
                        $cashIncomes += $amt;
                    }
                }
            }
        }

        $initAmt = floatval($activeShift['initialAmount'] ?? 0);
        $expectedCash = $initAmt + $cashIncomes + $manualEntradas - $manualSalidas;

        echo json_encode([
            "success" => true,
            "activeShift" => $activeShift,
            "movements" => $activeMovements,
            "cashIncomes" => $cashIncomes,
            "cardIncomes" => $cardIncomes,
            "manualEntradas" => $manualEntradas,
            "manualSalidas" => $manualSalidas,
            "expectedCash" => $expectedCash
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/cash/open' || $subPath === '/cash/open/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $cashShifts = getJsonFile('cash_shifts.json');

        foreach ($cashShifts as $s) {
            if (($s['status'] ?? '') === 'abierta') {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Ya existe una caja abierta en el sistema."], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }

        $newShift = [
            "id" => "CSH-" . rand(1000, 9999),
            "status" => "abierta",
            "openTime" => date('Y-m-d H:i:s'),
            "responsible" => $body['responsible'] ?? 'Administrador',
            "initialAmount" => floatval($body['initialAmount'] ?? 0),
            "notes" => $body['notes'] ?? ''
        ];
        array_unshift($cashShifts, $newShift);
        saveJsonFile('cash_shifts.json', $cashShifts);

        echo json_encode(["success" => true, "activeShift" => $newShift], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/cash/movement' || $subPath === '/cash/movement/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $cashShifts = getJsonFile('cash_shifts.json');
        $cashMovements = getJsonFile('cash_movements.json');

        $activeShift = null;
        foreach ($cashShifts as $s) {
            if (($s['status'] ?? '') === 'abierta') {
                $activeShift = $s;
                break;
            }
        }

        if (!$activeShift) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No hay una caja abierta para registrar movimientos."], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $newMov = [
            "id" => "MOV-" . rand(1000, 9999),
            "shiftId" => $activeShift['id'],
            "type" => strtolower($body['type'] ?? 'entrada'),
            "category" => $body['category'] ?? 'Manual',
            "concept" => $body['concept'] ?? 'Movimiento de Caja',
            "amount" => floatval($body['amount'] ?? 0),
            "responsible" => $body['responsible'] ?? $activeShift['responsible'],
            "timestamp" => date('Y-m-d H:i:s')
        ];
        array_unshift($cashMovements, $newMov);
        saveJsonFile('cash_movements.json', $cashMovements);

        echo json_encode(["success" => true, "movement" => $newMov], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/cash/close' || $subPath === '/cash/close/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $cashShifts = getJsonFile('cash_shifts.json');
        $cashMovements = getJsonFile('cash_movements.json');
        $finances = getJsonFile('finances.json');

        $foundIndex = -1;
        for ($i = 0; $i < count($cashShifts); $i++) {
            if (($cashShifts[$i]['status'] ?? '') === 'abierta') {
                $foundIndex = $i;
                break;
            }
        }

        if ($foundIndex === -1) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No hay una caja abierta para cerrar."], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $shift = &$cashShifts[$foundIndex];
        $shiftId = $shift['id'];
        $openTime = $shift['openTime'] ?? '';

        $cashIncomes = 0;
        $cardIncomes = 0;
        $manualEntradas = 0;
        $manualSalidas = 0;

        foreach ($cashMovements as $m) {
            if (($m['shiftId'] ?? '') === $shiftId) {
                $amt = floatval($m['amount'] ?? 0);
                if (($m['type'] ?? '') === 'entrada') { $manualEntradas += $amt; }
                elseif (($m['type'] ?? '') === 'salida') { $manualSalidas += $amt; }
            }
        }

        foreach ($finances as $f) {
            $fDate = $f['date'] ?? '';
            if ($fDate && $fDate >= $openTime) {
                $pm = strtolower($f['paymentMethod'] ?? 'efectivo');
                $amt = floatval($f['amount'] ?? 0);
                if (strpos($pm, 'tarjeta') !== false || strpos($pm, 'spei') !== false || strpos($pm, 'transferencia') !== false) {
                    $cardIncomes += $amt;
                } else {
                    $cashIncomes += $amt;
                }
            }
        }

        $initAmt = floatval($shift['initialAmount'] ?? 0);
        $expectedCash = $initAmt + $cashIncomes + $manualEntradas - $manualSalidas;
        $physCash = floatval($body['physicalCash'] ?? $expectedCash);
        $difference = $physCash - $expectedCash;

        $shift['status'] = 'cerrada';
        $shift['closeTime'] = date('Y-m-d H:i:s');
        $shift['physicalCash'] = $physCash;
        $shift['expectedCash'] = $expectedCash;
        $shift['difference'] = $difference;
        $shift['cashIncomes'] = $cashIncomes;
        $shift['cardIncomes'] = $cardIncomes;
        $shift['manualEntradas'] = $manualEntradas;
        $shift['manualSalidas'] = $manualSalidas;
        $shift['notes'] = $body['notes'] ?? '';

        saveJsonFile('cash_shifts.json', $cashShifts);

        echo json_encode(["success" => true, "shift" => $shift], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/cash/history' || $subPath === '/cash/history/') {
        echo json_encode(getJsonFile('cash_shifts.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif (strpos($subPath, '/cash/shift-details') === 0) {
        $shiftId = $_GET['shiftId'] ?? $_GET['id'] ?? '';
        $cashShifts = getJsonFile('cash_shifts.json');
        $cashMovements = getJsonFile('cash_movements.json');
        $finances = getJsonFile('finances.json');

        $shift = null;
        foreach ($cashShifts as $s) {
            if (($s['id'] ?? '') === $shiftId) {
                $shift = $s;
                break;
            }
        }

        $movList = [];
        if ($shift) {
            $openTime = $shift['openTime'] ?? '';
            $closeTime = $shift['closeTime'] ?? '9999-12-31 23:59:59';

            foreach ($cashMovements as $m) {
                if (($m['shiftId'] ?? '') === $shiftId) {
                    $movList[] = [
                        "date" => $m['timestamp'] ?? $m['date'] ?? '',
                        "concept" => $m['concept'] ?? '',
                        "category" => $m['category'] ?? '',
                        "paymentMethod" => "Efectivo",
                        "amount" => floatval($m['amount'] ?? 0),
                        "type" => $m['type'] ?? 'entrada'
                    ];
                }
            }

            foreach ($finances as $f) {
                $fDate = $f['date'] ?? '';
                if ($fDate && $fDate >= $openTime && $fDate <= $closeTime) {
                    $movList[] = [
                        "date" => $fDate,
                        "concept" => ($f['concept'] ?? 'Venta') . " (" . ($f['clientName'] ?? 'Cliente') . ")",
                        "category" => $f['category'] ?? 'Ingreso',
                        "paymentMethod" => $f['paymentMethod'] ?? 'Efectivo',
                        "amount" => floatval($f['amount'] ?? 0),
                        "type" => "entrada"
                    ];
                }
            }
        }

        echo json_encode(["success" => true, "movements" => $movList], JSON_UNESCAPED_UNICODE);
        exit();
    }
    // BANK & FINANCES
    elseif ($subPath === '/bank' || $subPath === '/bank/' || $subPath === '/bank-info' || $subPath === '/bank-info/') {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true);
            $current = getJsonFile('bank_info.json');
            if (is_array($body)) {
                $newBankInfo = array_merge($current, $body);
                saveJsonFile('bank_info.json', $newBankInfo);
                echo json_encode(["success" => true, "message" => "Datos bancarios guardados correctamente.", "bankInfo" => $newBankInfo], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }
        echo json_encode(getJsonFile('bank_info.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/finances' || $subPath === '/finances/') {
        echo json_encode(getJsonFile('finances.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/finances/create' || $subPath === '/finances/create/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $concept = $body['concept'] ?? 'Venta POS';
        $category = $body['category'] ?? 'Tienda / Pro Shop';
        $amount = (float)($body['amount'] ?? 0);
        $pm = $body['paymentMethod'] ?? 'Efectivo en Mostrador';
        $cliName = $body['clientName'] ?? 'Cliente Mostrador';

        $finances = getJsonFile('finances.json');
        $finId = "FIN-" . rand(1000, 9999);
        $createdFinance = [
            "id" => $finId,
            "date" => date('Y-m-d H:i:s'),
            "concept" => $concept,
            "category" => $category,
            "amount" => $amount,
            "paymentMethod" => $pm,
            "clientName" => $cliName,
            "status" => "Completado"
        ];

        array_unshift($finances, $createdFinance);
        saveJsonFile('finances.json', $finances);

        if (strpos(strtolower($pm), 'efectivo') !== false) {
            $shifts = getJsonFile('cash_shifts.json');
            foreach ($shifts as &$s) {
                if (($s['status'] ?? '') === 'abierta') {
                    $s['totalSales'] = (float)($s['totalSales'] ?? 0) + $amount;
                    $s['expectedCash'] = (float)($s['expectedCash'] ?? 0) + $amount;
                    break;
                }
            }
            saveJsonFile('cash_shifts.json', $shifts);

            $movements = getJsonFile('cash_movements.json');
            $mov = [
                "id" => "MOV-" . rand(1000, 9999),
                "shiftId" => $shifts[0]['id'] ?? "CSH-MANUAL",
                "timestamp" => date('Y-m-d H:i:s'),
                "type" => "entrada",
                "amount" => $amount,
                "reason" => "$concept ($cliName)",
                "method" => "Efectivo",
                "user" => "Administrador"
            ];
            array_unshift($movements, $mov);
            saveJsonFile('cash_movements.json', $movements);
        }

        // Auto-clear user debt if category is Recuperacion de Adeudo or concept references debt
        $users = getJsonFile('users.json');
        $clearedUser = null;
        if (strpos(strtolower($category), 'adeudo') !== false || strpos(strtolower($concept), 'adeudo') !== false || strpos(strtolower($concept), 'deuda') !== false) {
            $cleanCliName = preg_replace('/\D/', '', $cliName);
            $cliLower = strtolower(trim($cliName));
            foreach ($users as &$u) {
                $uP = preg_replace('/\D/', '', $u['phone'] ?? '');
                $uN = strtolower(trim($u['name'] ?? ''));
                if (($uP && $cleanCliName && $uP === $cleanCliName) || ($uN && $cliLower && strpos($cliLower, $uN) !== false)) {
                    $u['hasDebt'] = false;
                    $u['debtAmount'] = 0;
                    $u['debtReason'] = "";
                    $clearedUser = $u;
                    break;
                }
            }
            saveJsonFile('users.json', $users);
        }

        echo json_encode(["success" => true, "finance" => $createdFinance, "user" => $clearedUser], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/events' || $subPath === '/events/') {
        header("Content-Type: text/event-stream; charset=utf-8");
        header("Cache-Control: no-cache");
        header("Connection: keep-alive");
        header("X-Accel-Buffering: no");
        echo "retry: 3000\n";
        echo "data: " . json_encode(["type" => "ping", "time" => date("c")], JSON_UNESCAPED_UNICODE) . "\n\n";
        flush();
        exit();
    }

    // USERS
    elseif ($subPath === '/users' || $subPath === '/users/') {
        echo json_encode(getJsonFile('users.json'), JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/users/login' || $subPath === '/users/login/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $uInput = strtolower(trim($body['username'] ?? ''));
        $uInputClean = ltrim($uInput, '@');
        $pInput = trim($body['password'] ?? '');

        $users = getJsonFile('users.json');
        $foundUser = null;

        foreach ($users as $u) {
            $uName = strtolower(ltrim(trim($u['username'] ?? ''), '@'));
            $uPhone = preg_replace('/\D/', '', $u['phone'] ?? '');
            if (($uName && $uName === $uInputClean) || ($uInputClean && strlen($uInputClean) >= 7 && $uPhone && $uPhone === $uInputClean)) {
                $foundUser = $u;
                break;
            }
        }

        if ($foundUser) {
            $uPass = trim($foundUser['password'] ?? '');
            $tPass = trim($foundUser['tempPassword'] ?? '');
            $passMatch = ($uPass && strtolower($uPass) === strtolower($pInput)) || ($tPass && strtolower($tPass) === strtolower($pInput));

            if ($passMatch) {
                $mustChange = (!empty($foundUser['mustChangePassword'])) || (strpos($foundUser['status'] ?? '', 'Pendiente') !== false);
                echo json_encode([
                    "success" => true,
                    "user" => $foundUser,
                    "requirePasswordChange" => $mustChange
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }

        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Usuario o contraseÃ±a incorrectos."], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/users/change-password' || $subPath === '/users/change-password/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $uInput = strtolower(ltrim(trim($body['username'] ?? ''), '@'));
        $newPass = trim($body['newPassword'] ?? '');

        $uId = $body['id'] ?? '';
        $users = getJsonFile('users.json');
        $updated = false;
        foreach ($users as &$u) {
            $uName = strtolower(ltrim(trim($u['username'] ?? ''), '@'));
            $isMatch = ($uInput !== '' && $uName === $uInput) ||
                       ($uId !== '' && isset($u['id']) && $u['id'] === $uId) ||
                       (isset($u['id']) && $u['id'] === ($body['username'] ?? '')) ||
                       (($u['role'] ?? '') === 'Administrador');

            if ($isMatch) {
                $u['password'] = $newPass;
                $u['tempPassword'] = '';
                $u['mustChangePassword'] = false;
                $u['status'] = 'Activo (Password Personalizada)';
                $updated = true;
                break;
            }
        }

        if ($updated) {
            saveJsonFile('users.json', $users);
            echo json_encode(["success" => true, "message" => "Contraseña actualizada correctamente."], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Usuario no encontrado."], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }
    elseif ($subPath === '/users/create' || $subPath === '/users/create/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $users = getJsonFile('users.json');

        $name = trim($body['name'] ?? 'Usuario Level');
        $username = strtolower(ltrim(trim($body['username'] ?? ''), '@'));
        if (empty($username)) {
            $username = strtolower(preg_replace('/\s+/', '', $name));
        }
        $phone = trim($body['phone'] ?? '');
        $role = $body['role'] ?? 'Cliente';
        $tempPass = "TAC-" . rand(1000, 9999);
        $newId = "USR-" . rand(1000, 9999);

        $newUser = [
            "id" => $newId,
            "username" => $username,
            "name" => $name,
            "phone" => $phone,
            "role" => $role,
            "password" => "123456",
            "tempPassword" => $tempPass,
            "status" => "Activo (Password Temporal)",
            "mustChangePassword" => true,
            "hasDebt" => false,
            "debtAmount" => 0,
            "debtReason" => ""
        ];

        array_unshift($users, $newUser);
        saveJsonFile('users.json', $users);

        echo json_encode(["success" => true, "user" => $newUser], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/users/update' || $subPath === '/users/update/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $uId = $body['id'] ?? '';

        $users = getJsonFile('users.json');
        $updatedUser = null;

        foreach ($users as &$u) {
            if (($u['id'] ?? '') === $uId || (strtolower(ltrim($u['username'] ?? '', '@')) === strtolower(ltrim($body['username'] ?? '', '@')))) {
                if (!empty($body['name'])) $u['name'] = trim($body['name']);
                if (!empty($body['username'])) $u['username'] = strtolower(ltrim(trim($body['username']), '@'));
                if (!empty($body['phone'])) $u['phone'] = trim($body['phone']);
                if (!empty($body['role'])) $u['role'] = $body['role'];
                $updatedUser = $u;
                break;
            }
        }

        saveJsonFile('users.json', $users);
        echo json_encode(["success" => true, "user" => $updatedUser], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/users/delete' || $subPath === '/users/delete/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $uId = $body['id'] ?? '';

        $users = getJsonFile('users.json');
        $users = array_values(array_filter($users, function($u) use ($uId) {
            return ($u['id'] ?? '') !== $uId;
        }));

        saveJsonFile('users.json', $users);
        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        exit();
    }
    elseif ($subPath === '/users/reset-password' || $subPath === '/users/reset-password/') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];
        $uId = $body['id'] ?? '';

        $users = getJsonFile('users.json');
        $updatedUser = null;
        $tempPass = "TAC-" . rand(1000, 9999);

        foreach ($users as &$u) {
            if (($u['id'] ?? '') === $uId) {
                $u['tempPassword'] = $tempPass;
                $u['mustChangePassword'] = true;
                $u['status'] = 'Activo (Password Temporal)';
                $updatedUser = $u;
                break;
            }
        }

        saveJsonFile('users.json', $users);
        echo json_encode(["success" => true, "user" => $updatedUser], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// 2. Serve Static Assets (JS, CSS, Images, Icons)
$cleanPath = $path;
if (strpos($cleanPath, '/admin/') === 0) {
    $cleanPath = substr($cleanPath, 7);
} elseif ($cleanPath === '/admin') {
    $cleanPath = '/index.html';
} elseif (strpos($cleanPath, '/preview/') === 0) {
    $cleanPath = substr($cleanPath, 9);
} elseif ($cleanPath === '/preview') {
    $cleanPath = '/index.html';
}

if ($cleanPath === '' || $cleanPath === '/') {
    $cleanPath = '/index.html';
}

$foundFile = findCaseInsensitiveFile(__DIR__ . '/web_admin', $cleanPath);
if (!$foundFile) {
    $foundFile = findCaseInsensitiveFile(__DIR__ . '/web_preview', $cleanPath);
}
if (!$foundFile) {
    $foundFile = findCaseInsensitiveFile(__DIR__, $cleanPath);
}

if ($foundFile && file_exists($foundFile) && !is_dir($foundFile)) {
    $ext = strtolower(pathinfo($foundFile, PATHINFO_EXTENSION));
    $mimes = [
        'html' => 'text/html; charset=utf-8',
        'js'   => 'application/javascript; charset=utf-8',
        'css'  => 'text/css; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon'
    ];
    header("Content-Type: " . ($mimes[$ext] ?? 'application/octet-stream'));
    readfile($foundFile);
    exit();
}

// Return 404 for missing static assets instead of serving HTML
$ext = strtolower(pathinfo($cleanPath, PATHINFO_EXTENSION));
if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'ico', 'svg', 'css', 'js', 'json', 'map'])) {
    http_response_code(404);
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'ico'])) {
        header("Content-Type: image/png");
        echo base64_decode('iVBORw0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoAAAANSU0KGgoA');
    } else {
        header("Content-Type: text/plain; charset=utf-8");
        echo "File not found";
    }
    exit();
}

// Default fallback to Admin Panel index.html
header("Content-Type: text/html; charset=utf-8");
include __DIR__ . '/web_admin/index.html';