$app = (Invoke-WebRequest -Uri 'http://localhost:8085/' -UseBasicParsing).StatusCode
$admin = (Invoke-WebRequest -Uri 'http://localhost:8085/admin/' -UseBasicParsing).StatusCode
$courts = (Invoke-WebRequest -Uri 'http://localhost:8085/api/courts' -UseBasicParsing).StatusCode
Write-Host "App Status: $app"
Write-Host "Admin Status: $admin"
Write-Host "Courts API Status: $courts"
