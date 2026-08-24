param(
    [ValidateSet('Plugin', 'All')]
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

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
