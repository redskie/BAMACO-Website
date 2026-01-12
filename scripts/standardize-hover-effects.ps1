# Script to standardize hover effects across all HTML files

Write-Host "Standardizing hover effects across all HTML files..." -ForegroundColor Cyan

$files = Get-ChildItem -Path . -Include *.html -Recurse | Where-Object { $_.FullName -notlike "*\node_modules\*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Pattern 1: Card hover effects - standardize to hover-card class
    $cardPattern = 'transition-all duration-300 hover:-translate-y-\d+ hover:border-\S+ hover:shadow-\[[^\]]+\]'
    if ($content -match $cardPattern) {
        $content = $content -replace $cardPattern, 'hover-card hover-gradient-line'
        $modified = $true
    }
    
    # Pattern 2: Inconsistent card hover with varying translate values
    $content = $content -replace 'hover:-translate-y-2 hover:border-text-secondary hover:shadow-\[[^\]]+\]', 'hover-card'
    $content = $content -replace 'hover:-translate-y-1 hover:border-text-secondary hover:shadow-\[[^\]]+\]', 'hover-card'
    $content = $content -replace 'hover:-translate-y-0\.5 hover:border-text-secondary', 'hover-card'
    
    # Pattern 3: Primary button hover (bg-text-primary buttons)
    $content = $content -replace 'hover:-translate-y-1 hover:shadow-\[0_8px_20px_rgba\(255,107,157,0\.\d+\)\]', 'hover-btn-primary'
    $content = $content -replace 'hover:-translate-y-1 hover:shadow-\[0_12px_32px_rgba\(255,107,157,0\.\d+\)\]', 'hover-btn-primary'
    $content = $content -replace 'hover:-translate-y-0\.5 hover:shadow-lg', 'hover-btn-primary'
    
    # Pattern 4: Secondary button hover (bordered buttons)
    $content = $content -replace 'hover:border-text-secondary hover:-translate-y-1', 'hover-btn-secondary'
    $content = $content -replace 'hover:border-text-secondary hover:-translate-y-0\.5', 'hover-btn-secondary'
    
    # Pattern 5: Subtle hover effects (stats boxes, info cards)
    $content = $content -replace 'hover:scale-105 hover:border-text-secondary', 'hover-subtle'
    $content = $content -replace 'hover:scale-102 hover:border-text-secondary', 'hover-subtle'
    
    # Pattern 6: Remove duplicate transition classes
    $content = $content -replace 'transition-all duration-300\s+transition-all duration-300', 'transition-all duration-300'
    
    # Pattern 7: Standardize border hover only
    $content = $content -replace 'hover:border-text-secondary transition-all duration-300(?! hover:-translate)', 'hover-btn-secondary'
    
    if ($content -ne (Get-Content $file.FullName -Raw)) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✅ Hover effects standardization complete!" -ForegroundColor Green
Write-Host "All hover effects now use unified classes from tailwind-config.js" -ForegroundColor Green
