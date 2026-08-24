param(
    [ValidateSet('Plugin', 'Ffmpeg', 'GoogleFlowMcp', 'AssetBackendFlag', 'CloudflareEnv', 'All')]
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
    if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
        Write-Host "[FAIL] Ffmpeg: 'ffmpeg' nao encontrado no PATH"
        return $false
    }
    $v = & ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Ffmpeg: $($v | Select-Object -First 1)"
        return $true
    }
    Write-Host "[FAIL] Ffmpeg: 'ffmpeg -version' falhou ou nao esta no PATH"
    return $false
}

function Test-GoogleFlowMcp {
    $configPath = "$env:USERPROFILE\mcp-servers\Google-Flow_MCP\config\flow.config.json"
    if (-not (Test-Path $configPath)) {
        Write-Host "[FAIL] GoogleFlowMcp: config nao encontrado em $configPath"
        return $false
    }
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if (-not $config.expectedAccount -or $config.expectedAccount -eq 'your-email@gmail.com') {
        Write-Host "[FAIL] GoogleFlowMcp: expectedAccount nao preenchido em flow.config.json"
        return $false
    }
    if ([string]::IsNullOrWhiteSpace($config.chromeProfile)) {
        Write-Host "[FAIL] GoogleFlowMcp: chromeProfile nao preenchido em flow.config.json"
        return $false
    }
    $mcpList = claude mcp list 2>&1 | Out-String
    if ($mcpList -notmatch 'google-flow') {
        Write-Host "[FAIL] GoogleFlowMcp: 'google-flow' nao aparece em 'claude mcp list'"
        return $false
    }
    Write-Host "[OK] GoogleFlowMcp: config preenchido e servidor registrado (conta $($config.expectedAccount))"
    return $true
}

function Test-AssetBackendFlag {
    # NOTA: nao existe uma flag ASSET_BACKEND=flow real neste projeto. O veredito registrado em
    # docs/plugin-conventions.md (secao ASSET_BACKEND) e "divergente": o build real do plugin
    # scroll-3d instalado nao le AGENTS.md nem nenhuma variavel ASSET_BACKEND (asset-generator e
    # site-planner sao hardcoded para Higgsfield). Por isso este check procura, em vez da flag, a
    # nota de contingencia gravada em AGENTS.md que documenta o mecanismo manual (briefing ao
    # site-planner instruindo o uso das tools flow_* do MCP google-flow).
    $agentsPath = "$PSScriptRoot\..\AGENTS.md"
    $content = Get-Content $agentsPath -Raw
    if ($content -match '## Configuração local deste projeto' -and $content -match 'flow_\*') {
        Write-Host "[OK] AssetBackendFlag: nota de contingencia ASSET_BACKEND (divergente) presente em AGENTS.md"
        return $true
    }
    Write-Host "[FAIL] AssetBackendFlag: nota de contingencia ASSET_BACKEND ausente em AGENTS.md"
    return $false
}

function Test-CloudflareEnv {
    $token = [Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'User')
    $account = [Environment]::GetEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID', 'User')
    if ($token -and $account) {
        Write-Host "[OK] CloudflareEnv: CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID setados (usuario)"
        return $true
    }
    Write-Host "[FAIL] CloudflareEnv: falta CLOUDFLARE_API_TOKEN e/ou CLOUDFLARE_ACCOUNT_ID (variavel de ambiente do usuario)"
    return $false
}

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }
if ($Check -eq 'All' -or $Check -eq 'Ffmpeg') { $results += Test-Ffmpeg }
if ($Check -eq 'All' -or $Check -eq 'GoogleFlowMcp') { $results += Test-GoogleFlowMcp }
if ($Check -eq 'All' -or $Check -eq 'AssetBackendFlag') { $results += Test-AssetBackendFlag }
if ($Check -eq 'All' -or $Check -eq 'CloudflareEnv') { $results += Test-CloudflareEnv }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
