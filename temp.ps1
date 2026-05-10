$job = Start-Job {
    Set-Location "C:\Users\usuario\Downloads\taskflow"
    & "C:\Program Files\nodejs\npm.cmd" run dev
}
Start-Sleep -Seconds 15
node scripts\screenshot.js
Remove-Job $job -Force