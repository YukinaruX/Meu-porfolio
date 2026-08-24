param(
    [ValidateSet('Plugin', 'Ffmpeg', 'All')]
    [string]$Check = 'All'
)

function Test-Plugin {
    $installed = claude plugin list --json 2>$null | ConvertFrom-Json
    $found = $installed | Where-Object { $_.id -like 'scroll-3d@*' }
    if ($found) {
        Write-Host "[OK] Plugin: $($found.id) instalado (scope $($found.scope))"
        return $true
    }
    Write-Host "[FAIL] Plugin: nenhum id 'scroll-3d@*' em 'claude plugin list --json'"
    return $false
}

function Test-Ffmpeg {
    $v = & ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Ffmpeg: $($v | Select-Object -First 1)"
        return $true
    }
    Write-Host "[FAIL] Ffmpeg: 'ffmpeg -version' falhou ou nao esta no PATH"
    return $false
}

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }
if ($Check -eq 'All' -or $Check -eq 'Ffmpeg') { $results += Test-Ffmpeg }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
