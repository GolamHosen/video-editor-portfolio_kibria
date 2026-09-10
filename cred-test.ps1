$ProgressPreference = 'SilentlyContinue'
$base = 'http://localhost:3000'
$log = @()

function TryLogin($label, $email, $password) {
  try {
    $r = Invoke-WebRequest -Uri ($base + '/api/auth/login') -Method POST -ContentType 'application/json' -Body (ConvertTo-Json @{ email = $email; password = $password }) -UseBasicParsing -TimeoutSec 30
    $log += "$label -> $($r.StatusCode)"
  } catch {
    $sc = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 'ERR' }
    $log += "$label -> $sc (expected)"
  }
}

function ChangeCreds($label, $currentPassword, $email, $name, $newPassword) {
  $payload = @{ currentPassword = $currentPassword }
  if ($email) { $payload.email = $email }
  if ($name) { $payload.name = $name }
  if ($newPassword) { $payload.newPassword = $newPassword }
  try {
    $r = Invoke-WebRequest -Uri ($base + '/api/admin/credentials') -Method POST -ContentType 'application/json' -Body (ConvertTo-Json $payload) -WebSession $script:sess -UseBasicParsing -TimeoutSec 30
    $log += "$label -> $($r.StatusCode) : $($r.Content)"
  } catch {
    $sc = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 'ERR' }
    $detail = ''
    try {
      if ($_.Exception.Response -and $_.Exception.Response.Content) { $detail = $_.Exception.Response.Content.ToString() }
    } catch { $detail = $_.Exception.Message }
    $log += "$label -> $sc : $detail"
  }
}

# 0) Login with original DB creds to get a session
try {
  $l = Invoke-WebRequest -Uri ($base + '/api/auth/login') -Method POST -ContentType 'application/json' -Body '{"email":"kibria1625@gmail.com","password":"kibria1625"}' -SessionVariable sess -UseBasicParsing -TimeoutSec 30
  $log += "STEP0 login(original) -> $($l.StatusCode)"
} catch {
  $log += "STEP0 login(original) -> FAIL: $($_.Exception.Message)"
}

# 1) Wrong password should fail
TryLogin 'STEP1 login(wrong password)' 'kibria1625@gmail.com' 'WrongPass123'

# 2) Change credentials in MongoDB (email + password + name)
ChangeCreds 'STEP2 change creds' 'kibria1625' 'admin@mongodb.test' 'Mongo Admin' 'KibriaDbPass123!'

# 3) Old credentials must now FAIL
TryLogin 'STEP3 login(OLD email+pwd)' 'kibria1625@gmail.com' 'kibria1625'

# 4) New DB credentials must SUCCEED
TryLogin 'STEP4 login(NEW email+pwd)' 'admin@mongodb.test' 'KibriaDbPass123!'

# 5) Env email should no longer exist in DB (DB is source of truth)
TryLogin 'STEP5 login(env email, new pwd)' 'kibria1625@gmail.com' 'KibriaDbPass123!'

# 6) Wrong current password must be rejected by the change API
ChangeCreds 'STEP6 change with WRONG current password' 'TotallyWrongPass' 'another@x.com' '' ''

# 7) Restore original credentials
ChangeCreds 'STEP7 restore original creds' 'KibriaDbPass123!' 'kibria1625@gmail.com' 'Golam Kibria' 'kibria1625'

# 8) Original credentials must work again
TryLogin 'STEP8 login(restored)' 'kibria1625@gmail.com' 'kibria1625'

Set-Content -Path 'D:\Kibria Protfolio\cred-test.log' -Value ($log -join "`n")