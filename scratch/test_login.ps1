$body = @{
    username = "cpalacios"
    password = "123456"
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "http://localhost:8085/api/users/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "Success:" $res.success
Write-Host "User:" $res.user.name "Role:" $res.user.role

$bodyBad = @{
    username = "cpalacios"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8085/api/users/login" -Method POST -Body $bodyBad -ContentType "application/json"
} catch {
    Write-Host "Bad Password expected error status:" $_.Exception.Response.StatusCode.value__
}
