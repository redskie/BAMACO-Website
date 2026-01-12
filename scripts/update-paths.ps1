# Update all file paths after reorganization

$rootHtmlFiles = Get-ChildItem -Path . -Filter "*.html" -File | Where-Object { $_.Name -notlike "*profile*" }
$playerHtmlFiles = Get-ChildItem -Path "players\" -Filter "*.html" -File
$guildHtmlFiles = Get-ChildItem -Path "guilds\" -Filter "*.html" -File
$articleHtmlFiles = Get-ChildItem -Path "articles\" -Filter "*.html" -File

Write-Host "Updating root HTML files..." -ForegroundColor Cyan

# Update root HTML files
foreach ($file in $rootHtmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Update asset paths
    $content = $content -replace 'src="tailwind-config\.js"', 'src="assets/tailwind-config.js"'
    $content = $content -replace 'href="styles\.css"', 'href="assets/styles.css"'
    $content = $content -replace 'src="script\.js"', 'src="assets/script.js"'
    $content = $content -replace 'src="navbar\.js"', 'src="assets/navbar.js"'
    $content = $content -replace 'src="page-transitions\.js"', 'src="assets/page-transitions.js"'
    $content = $content -replace 'src="design-system\.js"', 'src="assets/design-system.js"'
    
    # Update config paths
    $content = $content -replace 'src="firebase-config\.js"', 'src="config/firebase-config.js"'
    $content = $content -replace '"data\.json"', '"config/data.json"'
    $content = $content -replace "'data\.json'", "'config/data.json'"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
}

Write-Host "`nUpdating players/ HTML files..." -ForegroundColor Cyan

# Update player HTML files (need ../ for subdirectory)
foreach ($file in $playerHtmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Update asset paths with ../
    $content = $content -replace 'src="\.\./tailwind-config\.js"', 'src="../assets/tailwind-config.js"'
    $content = $content -replace 'href="\.\./styles\.css"', 'href="../assets/styles.css"'
    $content = $content -replace 'src="\.\./script\.js"', 'src="../assets/script.js"'
    $content = $content -replace 'src="\.\./navbar\.js"', 'src="../assets/navbar.js"'
    $content = $content -replace 'src="\.\./page-transitions\.js"', 'src="../assets/page-transitions.js"'
    
    # Update config paths
    $content = $content -replace 'src="\.\./firebase-config\.js"', 'src="../config/firebase-config.js"'
    $content = $content -replace '"\.\./data\.json"', '"../config/data.json"'
    $content = $content -replace "'\.\./data\.json'", "'../config/data.json'"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  Updated: players/$($file.Name)" -ForegroundColor Green
}

Write-Host "`nUpdating guilds/ HTML files..." -ForegroundColor Cyan

# Update guild HTML files
foreach ($file in $guildHtmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Update asset paths with ../
    $content = $content -replace 'src="\.\./tailwind-config\.js"', 'src="../assets/tailwind-config.js"'
    $content = $content -replace 'href="\.\./styles\.css"', 'href="../assets/styles.css"'
    $content = $content -replace 'src="\.\./script\.js"', 'src="../assets/script.js"'
    $content = $content -replace 'src="\.\./navbar\.js"', 'src="../assets/navbar.js"'
    $content = $content -replace 'src="\.\./page-transitions\.js"', 'src="../assets/page-transitions.js"'
    
    # Update config paths
    $content = $content -replace 'src="\.\./firebase-config\.js"', 'src="../config/firebase-config.js"'
    $content = $content -replace '"\.\./data\.json"', '"../config/data.json"'
    $content = $content -replace "'\.\./data\.json'", "'../config/data.json'"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  Updated: guilds/$($file.Name)" -ForegroundColor Green
}

Write-Host "`nUpdating articles/ HTML files..." -ForegroundColor Cyan

# Update article HTML files
foreach ($file in $articleHtmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Update asset paths with ../
    $content = $content -replace 'src="\.\./tailwind-config\.js"', 'src="../assets/tailwind-config.js"'
    $content = $content -replace 'href="\.\./styles\.css"', 'href="../assets/styles.css"'
    $content = $content -replace 'src="\.\./script\.js"', 'src="../assets/script.js"'
    $content = $content -replace 'src="\.\./navbar\.js"', 'src="../assets/navbar.js"'
    $content = $content -replace 'src="\.\./page-transitions\.js"', 'src="../assets/page-transitions.js"'
    
    # Update config paths
    $content = $content -replace 'src="\.\./firebase-config\.js"', 'src="../config/firebase-config.js"'
    $content = $content -replace '"\.\./data\.json"', '"../config/data.json"'
    $content = $content -replace "'\.\./data\.json'", "'../config/data.json'"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  Updated: articles/$($file.Name)" -ForegroundColor Green
}

Write-Host "`n✅ All HTML files updated with new paths!" -ForegroundColor Green
