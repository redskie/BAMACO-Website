# Script to centralize Tailwind config across all HTML files

$rootFiles = @(
    "index.html", "players.html", "guilds.html", "articles.html",
    "player-profile.html", "guild-profile.html", "article.html",
    "create-profile.html", "edit-profile.html", "calculator.html",
    "queue.html", "queue-history.html", "queue-admin.html"
)

$playerFiles = @(
    "players\hayate.html", "players\bmcmarx_godarx.html", "players\kuriyama.html",
    "players\joo.html", "players\k.html", "players\sette.html",
    "players\jetlagg.html", "players\playerprofiletemplate.html"
)

$guildFiles = @(
    "guilds\godarx.html", "guilds\guildtemplate.html"
)

$articleFiles = @(
    "articles\A001.html", "articles\A002.html", "articles\articletemplate.html"
)

$newRootConfig = @"
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="tailwind-config.js"></script>
    <script>tailwind.config = window.BAMACO_TAILWIND_CONFIG;</script>
"@

$newSubdirConfig = @"
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="../tailwind-config.js"></script>
    <script>tailwind.config = window.BAMACO_TAILWIND_CONFIG;</script>
"@

function Update-TailwindConfig {
    param(
        [string]$FilePath,
        [string]$NewConfig
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        
        # Pattern to match the entire Tailwind config block
        $pattern = '(?s)<!-- Tailwind CSS CDN -->\s*<script src="https://cdn\.tailwindcss\.com"></script>\s*<script>\s*tailwind\.config = \{.*?\};\s*</script>'
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $NewConfig
            Set-Content -Path $FilePath -Value $content -NoNewline
            Write-Host "Updated: $FilePath" -ForegroundColor Green
        } else {
            Write-Host "Pattern not found in: $FilePath" -ForegroundColor Yellow
        }
    } else {
        Write-Host "File not found: $FilePath" -ForegroundColor Red
    }
}

Write-Host "Starting Tailwind config centralization..." -ForegroundColor Cyan

# Update root files
Write-Host "`nUpdating root directory files..." -ForegroundColor Cyan
foreach ($file in $rootFiles) {
    Update-TailwindConfig -FilePath $file -NewConfig $newRootConfig
}

# Update subdirectory files
Write-Host "`nUpdating players/ directory files..." -ForegroundColor Cyan
foreach ($file in $playerFiles) {
    Update-TailwindConfig -FilePath $file -NewConfig $newSubdirConfig
}

Write-Host "`nUpdating guilds/ directory files..." -ForegroundColor Cyan
foreach ($file in $guildFiles) {
    Update-TailwindConfig -FilePath $file -NewConfig $newSubdirConfig
}

Write-Host "`nUpdating articles/ directory files..." -ForegroundColor Cyan
foreach ($file in $articleFiles) {
    Update-TailwindConfig -FilePath $file -NewConfig $newSubdirConfig
}

Write-Host "`n✅ Tailwind config centralization complete!" -ForegroundColor Green
Write-Host "All files now reference tailwind-config.js" -ForegroundColor Green
